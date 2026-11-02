"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Thermometer, Wind, Users, ShieldAlert } from "lucide-react";

export default function SimulationControl() {
  const { setSimulationMode, runFullDemo, isDemoRunning, sensorData } = useSimulation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulation Control</h1>
        <p className="text-slate-400">Manually control simulated sensor conditions for testing.</p>
      </div>

      <Card className="border-blue-900/50 bg-blue-900/10">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Play className="w-5 h-5" />
            Full Demonstration Mode
          </CardTitle>
          <CardDescription className="text-blue-300/70">
            Run a complete automated classroom scenario demonstrating occupancy, automation, environmental changes, and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runFullDemo} 
            disabled={isDemoRunning}
            className="w-full md:w-auto"
          >
            {isDemoRunning ? "Demo Running..." : "RUN FULL CLASSROOM DEMO"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Thermometer className="w-5 h-5 text-slate-400" />
              Temperature Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Value:</span>
              <span className="font-bold">{sensorData.temperature.toFixed(1)} °C</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('NORMAL')} className="flex-1">Normal</Button>
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('HIGH_TEMP')} className="flex-1 text-amber-500 border-amber-900 hover:bg-amber-950">High</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wind className="w-5 h-5 text-slate-400" />
              CO₂ Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Value:</span>
              <span className="font-bold">{Math.round(sensorData.co2)} ppm</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('NORMAL')} className="flex-1">Normal</Button>
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('HIGH_CO2')} className="flex-1 text-amber-500 border-amber-900 hover:bg-amber-950">Warning</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-slate-400" />
              Motion / Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <Badge variant={sensorData.motion ? "success" : "secondary"}>
                {sensorData.motion ? "Occupied" : "Empty"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('NORMAL')} className="flex-1">Occupied</Button>
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('EMPTY')} className="flex-1">Empty</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert className="w-5 h-5 text-slate-400" />
              Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <Badge variant={sensorData.fire ? "destructive" : sensorData.smoke ? "warning" : "success"}>
                {sensorData.fire ? "Fire Detected" : sensorData.smoke ? "Smoke Detected" : "Safe"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('NORMAL')} className="flex-1">Normal</Button>
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('SMOKE')} className="flex-1 text-amber-500 border-amber-900 hover:bg-amber-950">Smoke</Button>
              <Button variant="outline" size="sm" onClick={() => setSimulationMode('FIRE')} className="flex-1 text-rose-500 border-rose-900 hover:bg-rose-950">Fire</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
