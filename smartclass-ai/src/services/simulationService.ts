import { SensorData, Alert, AutomationEvent } from '../types';

export type SimulationState = {
  mode: 'NORMAL' | 'HIGH_TEMP' | 'HIGH_CO2' | 'FIRE' | 'SMOKE' | 'EMPTY';
};

class SimulationService {
  private baseData: SensorData = {
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

  private state: SimulationState = { mode: 'NORMAL' };

  public setState(state: SimulationState) {
    this.state = state;
  }

  public getSensorData(): SensorData {
    const data = { ...this.baseData };
    
    // Add small random variations
    data.temperature += (Math.random() - 0.5) * 0.5;
    data.humidity += (Math.random() - 0.5) * 2;
    data.co2 += (Math.random() - 0.5) * 10;
    data.light += (Math.random() - 0.5) * 20;

    switch (this.state.mode) {
      case 'HIGH_TEMP':
        data.temperature = 32 + Math.random() * 2;
        break;
      case 'HIGH_CO2':
        data.co2 = 1200 + Math.random() * 100;
        break;
      case 'FIRE':
        data.fire = true;
        data.temperature = 45 + Math.random() * 5;
        data.smoke = true;
        break;
      case 'SMOKE':
        data.smoke = true;
        break;
      case 'EMPTY':
        data.motion = false;
        data.co2 = 380 + Math.random() * 10;
        data.light = 0; // Lights off
        break;
      case 'NORMAL':
      default:
        data.motion = true;
        data.fire = false;
        data.smoke = false;
        break;
    }

    // Ensure realistic bounds
    data.temperature = Math.max(15, Math.min(50, data.temperature));
    data.humidity = Math.max(20, Math.min(90, data.humidity));
    data.co2 = Math.max(300, Math.min(2000, data.co2));
    data.light = Math.max(0, Math.min(1000, data.light));

    data.timestamp = new Date().toISOString();
    return data;
  }

  public checkAlerts(data: SensorData): Alert[] {
    const alerts: Alert[] = [];
    
    if (data.fire) {
      alerts.push({
        id: Math.random().toString(),
        type: 'Fire Detected',
        message: 'FIRE ALERT DETECTED in Classroom',
        timestamp: new Date().toISOString(),
        source: 'Smoke/Fire Sensor',
        severity: 'CRITICAL',
        status: 'ACTIVE'
      });
    } else if (data.smoke) {
      alerts.push({
        id: Math.random().toString(),
        type: 'Smoke Detected',
        message: 'SMOKE DETECTED in Classroom',
        timestamp: new Date().toISOString(),
        source: 'Smoke/Fire Sensor',
        severity: 'WARNING',
        status: 'ACTIVE'
      });
    }

    if (data.co2 > 1000) {
      alerts.push({
        id: Math.random().toString(),
        type: 'High CO2',
        message: 'CO2 levels exceed 1000 ppm. Ventilation required.',
        timestamp: new Date().toISOString(),
        source: 'CO2 Sensor',
        severity: 'WARNING',
        status: 'ACTIVE'
      });
    }

    if (data.temperature > 30) {
      alerts.push({
        id: Math.random().toString(),
        type: 'High Temperature',
        message: 'Temperature exceeds 30°C.',
        timestamp: new Date().toISOString(),
        source: 'Temperature Sensor',
        severity: 'WARNING',
        status: 'ACTIVE'
      });
    }

    return alerts;
  }

  public checkAutomation(data: SensorData): AutomationEvent[] {
    const events: AutomationEvent[] = [];
    
    if (data.motion && data.light < 300) {
      events.push({
        id: Math.random().toString(),
        action: 'Lights ON',
        reason: 'Motion detected and low ambient light',
        timestamp: new Date().toISOString(),
        mode: 'AUTO'
      });
    }

    if (!data.motion && data.light > 0) {
      events.push({
        id: Math.random().toString(),
        action: 'Lights OFF',
        reason: 'Classroom empty',
        timestamp: new Date().toISOString(),
        mode: 'AUTO'
      });
    }

    if (data.temperature > 28) {
      events.push({
        id: Math.random().toString(),
        action: 'Cooling Advisory',
        reason: 'Temperature above 28°C threshold',
        timestamp: new Date().toISOString(),
        mode: 'AUTO'
      });
    }

    if (data.co2 > 800) {
       events.push({
        id: Math.random().toString(),
        action: 'Ventilation Alert',
        reason: 'CO2 > 800 ppm',
        timestamp: new Date().toISOString(),
        mode: 'AUTO'
      });
    }

    return events;
  }
}

export const simulationService = new SimulationService();
