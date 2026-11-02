export interface SensorData {
  classroomId: string;
  temperature: number;
  humidity: number;
  co2: number;
  light: number;
  motion: boolean;
  smoke: boolean;
  fire: boolean;
  timestamp: string;
  motionCount?: number;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
}

export interface AttendanceRecord {
  studentId: string;
  classroomId: string;
  status: 'Present' | 'Absent';
  time?: string;
  confidence?: number;
}

export interface EngagementRecord {
  studentId: string;
  classroomId: string;
  score: number; // 0 to 100
  category: 'Highly Engaged' | 'Engaged' | 'Distracted' | 'Needs Attention';
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  source: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'ACTIVE' | 'RESOLVED';
}

export interface AutomationEvent {
  id: string;
  action: string;
  reason: string;
  timestamp: string;
  mode: 'AUTO' | 'MANUAL';
}

export interface Classroom {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  occupancy: {
    current: number;
    capacity: number;
  };
  currentClass: string;
  teacher: string;
  sessionTime: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Teacher' | 'Admin';
}
