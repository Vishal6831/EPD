import sys
# Fix Windows console emoji printing error caused by DeepFace logger
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

import cv2
import math
import json
import threading
import os
import urllib.request
import datetime
import numpy as np
from flask import Flask, jsonify
from flask_cors import CORS
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
VIDEO_SOURCE = 0 

# Global state for the classroom grid and attendance
classroom_state = {
    "grid": [],
    "total_present": 0,
    "talking_count": 0,
    "distracted_count": 0,
    "recognized_students": {} # Maps name -> time detected
}

# Ensure dataset directory exists
os.makedirs("dataset", exist_ok=True)

# --- DOWNLOAD MODEL IF MISSING ---
MODEL_PATH = "face_landmarker.task"
if not os.path.exists(MODEL_PATH):
    print("Downloading MediaPipe Face Landmarker model...")
    urllib.request.urlretrieve(
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        MODEL_PATH
    )
    print("Download complete.")

# --- SETUP MEDIAPIPE TASKS ---
base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False,
    num_faces=10,
    min_tracking_confidence=0.4
)
detector = vision.FaceLandmarker.create_from_options(options)

import face_recognition

# --- PRE-LOAD DATASET FOR FACE_RECOGNITION ---
print("Loading known faces...")
known_face_encodings = []
known_face_names = []

dataset_dir = "dataset"
for file in os.listdir(dataset_dir):
    if file.endswith((".jpg", ".jpeg", ".png")):
        path = os.path.join(dataset_dir, file)
        try:
            image = face_recognition.load_image_file(path)
            encoding = face_recognition.face_encodings(image)[0]
            known_face_encodings.append(encoding)
            known_face_names.append(os.path.splitext(file)[0])
        except IndexError:
            print(f"Warning: No face found in {file}")

print(f"Loaded {len(known_face_names)} faces: {known_face_names}")

# --- RECOGNITION THREAD ---
is_recognizing = False

def recognize_faces_worker(img_rgb):
    global is_recognizing, classroom_state
    try:
        # Find all faces in the live frame
        face_locations = face_recognition.face_locations(img_rgb)
        face_encodings = face_recognition.face_encodings(img_rgb, face_locations)
        
        now = datetime.datetime.now().strftime("%I:%M %p")
        
        for face_encoding in face_encodings:
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            
            if len(face_distances) > 0:
                best_match_index = int(np.argmin(face_distances))
                best_distance = face_distances[best_match_index]
                
                if best_distance <= 0.6:
                    name = known_face_names[best_match_index]
                    
                    # Convert distance (0.0 to 0.6) to a realistic percentage (100% to 80%)
                    confidence = round(100.0 - ((best_distance / 0.6) * 20.0), 1)
                    
                    classroom_state["recognized_students"][name] = {
                        "time": now,
                        "confidence": confidence
                    }
                    print(f"Recognized: {name} at {now} with {confidence}% confidence")
    except Exception as e:
        print(f"Face recognition error: {e}")
    finally:
        is_recognizing = False

def calculate_mar(face_landmarks):
    top_lip = face_landmarks[13]
    bottom_lip = face_landmarks[14]
    left_lip = face_landmarks[78]
    right_lip = face_landmarks[308]
    vertical_dist = math.hypot(top_lip.x - bottom_lip.x, top_lip.y - bottom_lip.y)
    horizontal_dist = math.hypot(left_lip.x - right_lip.x, left_lip.y - right_lip.y)
    if horizontal_dist == 0: return 0
    return vertical_dist / horizontal_dist

def get_head_pose(face_landmarks):
    nose = face_landmarks[1]
    left_eye = face_landmarks[33]
    right_eye = face_landmarks[263]
    dist_left = abs(nose.x - left_eye.x)
    dist_right = abs(nose.x - right_eye.x)
    ratio = dist_left / dist_right if dist_right > 0 else 0
    if ratio > 2.0 or ratio < 0.5:
        return "Distracted"
    return "Attentive"

def map_to_grid(x_center, face_width):
    col = "Center"
    if x_center < 0.33: col = "Left"
    elif x_center > 0.66: col = "Right"
    row = "Middle"
    if face_width > 0.15: row = "Front"
    elif face_width < 0.05: row = "Back"
    return f"{row}-{col}"

def vision_thread():
    global classroom_state, is_recognizing
    cap = cv2.VideoCapture(VIDEO_SOURCE)
    frame_count = 0
    
    if not cap.isOpened():
        print(f"Error: Could not open video source {VIDEO_SOURCE}")
        return

    while True:
        success, image = cap.read()
        if not success:
            break
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                
        # Trigger background facial recognition every 30 frames (approx 1 sec)
        if not is_recognizing and frame_count % 30 == 0:
            is_recognizing = True
            threading.Thread(target=recognize_faces_worker, args=(image_rgb.copy(),), daemon=True).start()
            
        frame_count += 1
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
        detection_result = detector.detect(mp_image)
        
        current_grid = []
        talking = 0
        distracted = 0
        
        if detection_result.face_landmarks:
            for face_landmarks in detection_result.face_landmarks:
                x_coords = [lm.x for lm in face_landmarks]
                x_min = min(x_coords)
                x_max = max(x_coords)
                face_width = x_max - x_min
                x_center = (x_max + x_min) / 2
                
                mar = calculate_mar(face_landmarks)
                is_talking = mar > 0.15 
                pose = get_head_pose(face_landmarks)
                grid_pos = map_to_grid(x_center, face_width)
                
                status = "Engaged"
                if is_talking:
                    status = "Talking"
                    talking += 1
                elif pose == "Distracted":
                    status = "Distracted"
                    distracted += 1
                    
                current_grid.append({
                    "position": grid_pos,
                    "status": status,
                    "is_talking": is_talking
                })
                
                h, w, _ = image.shape
                x_px_min, y_px_min = int(x_min * w), int(min([lm.y for lm in face_landmarks]) * h)
                x_px_max, y_px_max = int(x_max * w), int(max([lm.y for lm in face_landmarks]) * h)
                
                color = (0, 255, 0) if status == "Engaged" else (0, 165, 255) if status == "Distracted" else (0, 0, 255)
                cv2.rectangle(image, (x_px_min, y_px_min), (x_px_max, y_px_max), color, 2)
                cv2.putText(image, f"{status} ({grid_pos})", (x_px_min, y_px_min - 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        classroom_state["grid"] = current_grid
        classroom_state["total_present"] = len(current_grid)
        classroom_state["talking_count"] = talking
        classroom_state["distracted_count"] = distracted
        
        try:
            cv2.imshow('SmartClass AI - Edge Node (Press Q to quit)', image)
        except Exception as e:
            print(f"Display error: {e}")
            
        if cv2.waitKey(5) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()
    import os
    os._exit(0)

@app.route('/api/classroom-state', methods=['GET'])
def get_state():
    # Keep Next.js route mapping compatibility
    return jsonify(classroom_state)
    
@app.route('/state', methods=['GET'])
def get_state_legacy():
    # Keep DigitalTwinMap compatibility
    return jsonify(classroom_state)

@app.route('/api/clear-attendance', methods=['POST'])
def clear_attendance():
    classroom_state["recognized_students"] = {}
    return jsonify({"success": True, "message": "Attendance cleared"})

def run_server():
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

if __name__ == '__main__':
    print("Starting Local Flask Server for Next.js on port 5000...")
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    
    print("Starting Edge AI Vision (Main Thread)...")
    try:
        vision_thread()
    except Exception as e:
        print(f"CRITICAL ERROR in Vision AI: {e}")
        import os
        os._exit(1)
