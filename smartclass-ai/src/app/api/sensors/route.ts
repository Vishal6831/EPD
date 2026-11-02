import { NextResponse } from 'next/server';

// Global in-memory store for the latest sensor data from ESP32
let latestSensorData = {
  classroomId: 'classroom01',
  temperature: 24.5,
  humidity: 50,
  co2: 400,
  light: 600,
  motion: false,
  smoke: false,
  fire: false,
  timestamp: new Date().toISOString(),
  motionCount: 0,
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if motion changed from false to true to increment counter
    const newMotion = data.motion ?? latestSensorData.motion;
    let newMotionCount = latestSensorData.motionCount || 0;
    
    if (newMotion === true && latestSensorData.motion === false) {
      newMotionCount += 1;
    }
    
    // Update our global state with real data from ESP32
    latestSensorData = {
      ...latestSensorData,
      temperature: data.temperature ?? latestSensorData.temperature,
      humidity: data.humidity ?? latestSensorData.humidity,
      co2: data.co2 ?? latestSensorData.co2,
      light: data.light ?? latestSensorData.light,
      motion: newMotion,
      smoke: data.smoke ?? latestSensorData.smoke,
      fire: data.fire ?? latestSensorData.fire,
      timestamp: new Date().toISOString(),
      motionCount: newMotionCount,
    };
    
    return NextResponse.json({ success: true, message: "Data received" });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestSensorData);
}
