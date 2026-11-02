#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ================= WI-FI CONFIGURATION =================
const char* ssid = "Vishal";
const char* password = "12345678";

// Target Next.js server endpoint on your laptop
const char* serverName = "http://10.46.113.138:3000/api/sensors"; 

// ================= PIN MAPPINGS =================
#define DHT_PIN       4    // DHT11 Data Pin
#define DHTTYPE       DHT11
#define BUZZER_PIN    15   // Active Acoustic Alarm Buzzer
#define LED_PIN       26   // Visual Occupancy / Alert Indicator LED
#define PIR_PIN       27   // HC-SR501 Motion Sensor
#define LDR_PIN       34   // Ambient Light (Digital/Analog input)
#define MQ2_PIN       35   // MQ-2 Smoke / Gas Sensor (Analog ADC1)
#define MQ135_PIN     33   // MQ-135 Air Quality / CO2 Sensor (Analog ADC1)

// ================= THRESHOLDS =================
#define SMOKE_ALERT   2500 // Raw ADC threshold for Smoke/Fire
#define CO2_ALERT     1000 // ppm threshold for indoor air quality warning

DHT dht(DHT_PIN, DHTTYPE);

void setup() {
  // 115200 Baud Rate - Set Arduino Serial Monitor to 115200 baud!
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n==========================================");
  Serial.println("  SMARTCLASS AI - ESP32 SENSOR NODE      ");
  Serial.println("  (Solid-State Audio/Visual Alert System) ");
  Serial.println("==========================================");

  // Initialize output pins
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  noTone(BUZZER_PIN);

  // Initialize input sensor pins
  pinMode(PIR_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);
  pinMode(MQ135_PIN, INPUT);

  dht.begin();

  // Connect to Wi-Fi
  Serial.print("[Wi-Fi] Connecting to: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] Connected successfully!");
    Serial.print("[Wi-Fi] ESP32 Assigned IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[Wi-Fi] Warning: Initial connection timed out. Will auto-retry in loop.");
  }
}

void loop() {
  // ==========================================================
  // 1. AUTO-RECONNECT WI-FI IF LOST
  // ==========================================================
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Wi-Fi] Link lost! Attempting background reconnect...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 8) {
      delay(500);
      Serial.print(".");
      attempts++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n[Wi-Fi] Reconnected successfully!");
    } else {
      Serial.println("\n[Wi-Fi] Reconnect retry failed. Retrying next cycle...");
      delay(2000);
      return;
    }
  }

  // ==========================================================
  // 2. TRANSDUCE & SAMPLE SENSORS
  // ==========================================================
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Safe fallbacks if DHT is warming up or bus jitter occurs
  if (isnan(temperature) || isnan(humidity)) {
    temperature = 25.0;
    humidity = 50.0;
  }

  int lightValue = digitalRead(LDR_PIN);
  int smokeValue = analogRead(MQ2_PIN);
  int mq135Raw = analogRead(MQ135_PIN);
  int motion = digitalRead(PIR_PIN);

  // Calibrated conversions
  int estimatedCO2 = map(mq135Raw, 0, 4095, 400, 2000);
  int lux = (lightValue == 0) ? 800 : 150; // High ambient vs dim classroom
  bool isSmoke = (smokeValue > SMOKE_ALERT);
  bool isMotion = (motion == HIGH);

  // ==========================================================
  // 3. SOLID-STATE ALERT & INDICATOR ACTUATION
  // ==========================================================
  // Visual occupancy feedback: LED on during motion
  if (isMotion) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  // Acoustic warning: Trigger buzzer if air is hazardous or smoke is detected
  if (estimatedCO2 > CO2_ALERT || isSmoke) {
    tone(BUZZER_PIN, 2000); // 2 kHz alarm tone
    Serial.println("[ALERT] Hazardous Air Quality / Smoke Detected! Buzzer ON.");
  } else {
    noTone(BUZZER_PIN);
  }

  // Print readable telemetry to Serial Monitor (115200 baud)
  Serial.print("[DATA] Temp: ");
  Serial.print(temperature, 1);
  Serial.print(" °C | Hum: ");
  Serial.print(humidity, 0);
  Serial.print(" % | CO2: ");
  Serial.print(estimatedCO2);
  Serial.print(" ppm | Light: ");
  Serial.print(lux);
  Serial.print(" lux | Motion: ");
  Serial.print(isMotion ? "YES" : "NO");
  Serial.print(" | Smoke: ");
  Serial.println(isSmoke ? "DETECTED!" : "CLEAN");

  // ==========================================================
  // 4. DISPATCH JSON PAYLOAD TO WEB DIGITAL TWIN
  // ==========================================================
  HTTPClient http;
  http.setTimeout(3000); // 3-second network timeout prevents loop freezing
  
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(temperature, 1) + ",";
  jsonPayload += "\"humidity\":" + String(humidity, 1) + ",";
  jsonPayload += "\"co2\":" + String(estimatedCO2) + ",";
  jsonPayload += "\"light\":" + String(lux) + ",";
  jsonPayload += "\"motion\":" + String(isMotion ? "true" : "false") + ",";
  jsonPayload += "\"smoke\":" + String(isSmoke ? "true" : "false") + ",";
  jsonPayload += "\"fire\":" + String(isSmoke ? "true" : "false"); 
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    Serial.print("[HTTP] Telemetry Published -> Code: ");
    Serial.println(httpResponseCode); // 200 = Success
  } else {
    Serial.print("[HTTP] Error sending telemetry -> Error: ");
    Serial.println(httpResponseCode);
  }
  
  http.end(); // Cleanly close TCP socket

  delay(2000); // 2-second sampling interval
}
