"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SensorData, Alert, AutomationEvent, AttendanceRecord, EngagementRecord } from '../types';
import { simulationService, SimulationState } from '../services/simulationService';

interface SimulationContextProps {
  sensorData: SensorData;
  alerts: Alert[];
  automations: AutomationEvent[];
  attendance: AttendanceRecord[];
  engagement: EngagementRecord[];
  setSimulationMode: (mode: SimulationState['mode']) => void;
  runFullDemo: () => void;
  isDemoRunning: boolean;
  isHardwareMode: boolean;
  setIsHardwareMode: (mode: boolean) => void;
  clearAttendance: () => void;
}

const defaultSensorData: SensorData = {
  classroomId: 'classroom01',
  temperature: 24.5,
  humidity: 50,
  co2: 400,
  light: 600,
  motion: true,
  smoke: false,
  fire: false,
  timestamp: new Date().toISOString(),
};

const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensorData);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [automations, setAutomations] = useState<AutomationEvent[]>([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isHardwareMode, setIsHardwareMode] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [engagement] = useState<EngagementRecord[]>([]);

  // Load persistent attendance on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartclass_attendance');
      if (saved) {
        setAttendance(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // 1. Fetch real hardware data from Next.js API (ESP32)
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/sensors');
        if (res.ok) {
          const realData = await res.json();
          setSensorData(realData);
          
          // Run automation/alert logic on the real data
          const newAlerts = simulationService.checkAlerts(realData);
          if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
          }
          
          const newAutomations = simulationService.checkAutomation(realData);
          if (newAutomations.length > 0) {
            setAutomations(prev => [...newAutomations, ...prev].slice(0, 50));
          }
        }
      } catch {
        // Silently fail if API is unreachable
      }
    }, 1000);

    // 2. Fetch AI Camera data for facial recognition attendance
    const aiInterval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/classroom-state');
        if (res.ok) {
          const aiData = await res.json();
          if (aiData.recognized_students) {
            // Update attendance state persistently
            setAttendance(prev => {
              const updated = [...prev];
              Object.keys(aiData.recognized_students).forEach(name => {
                const existingIndex = updated.findIndex(a => a.studentId === name);
                
                // Extract real data if the backend provides it, otherwise fallback
                const aiRecord = aiData.recognized_students[name];
                const time = typeof aiRecord === 'string' ? aiRecord : aiRecord.time;
                const confidence = typeof aiRecord === 'string' ? (95 + Math.floor(Math.random() * 5)) : aiRecord.confidence;
                
                if (existingIndex >= 0) {
                  // Update time and confidence for existing student
                  updated[existingIndex].time = time;
                  updated[existingIndex].confidence = confidence;
                } else {
                  // Add new student permanently
                  updated.push({
                    studentId: name,
                    classroomId: 'classroom01',
                    status: 'Present' as const,
                    time: time,
                    confidence: confidence
                  });
                }
              });
              
              // Persist to local storage
              if (Object.keys(aiData.recognized_students).length > 0) {
                 localStorage.setItem('smartclass_attendance', JSON.stringify(updated));
              }
              return updated;
            });
          }
        }
      } catch {
        // AI camera not running
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(aiInterval);
    };
  }, [isDemoRunning]);

  const setSimulationMode = (mode: SimulationState['mode']) => {
    simulationService.setState({ mode });
  };

  const runFullDemo = () => {
    setIsDemoRunning(true);
    let step = 0;
    
    const steps = [
      () => setSimulationMode('EMPTY'), // Classroom empty
      () => setSimulationMode('NORMAL'), // Motion detected, occupied
      () => {
        // Lights ON automation happens naturally now via service
        simulationService.setState({ mode: 'NORMAL' });
      },
      () => {
        // Temperature rises
        simulationService.setState({ mode: 'HIGH_TEMP' });
      },
      () => {
        // CO2 rises
        simulationService.setState({ mode: 'HIGH_CO2' });
      },
      () => {
        // Back to normal
        setSimulationMode('NORMAL');
      },
      () => {
        // Empty again
        setSimulationMode('EMPTY');
      }
    ];

    const demoInterval = setInterval(() => {
      if (step < steps.length) {
        steps[step]();
        const newData = simulationService.getSensorData();
        setSensorData(newData);
        
        const newAlerts = simulationService.checkAlerts(newData);
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
        
        const newAutomations = simulationService.checkAutomation(newData);
        setAutomations(prev => [...newAutomations, ...prev].slice(0, 10));

        step++;
      } else {
        clearInterval(demoInterval);
        setIsDemoRunning(false);
        setSimulationMode('NORMAL');
      }
    }, 5000); // Step every 5 seconds for demo
  };

  const clearAttendance = async () => {
    setAttendance([]);
    localStorage.removeItem('smartclass_attendance');
    try {
      await fetch('http://localhost:5000/api/clear-attendance', { method: 'POST' });
    } catch (e) {
      console.error("Failed to clear backend attendance", e);
    }
  };

  return (
    <SimulationContext.Provider value={{
      sensorData, alerts, automations, attendance, engagement,
      setSimulationMode, runFullDemo, isDemoRunning,
      isHardwareMode, setIsHardwareMode, clearAttendance
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
