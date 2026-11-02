"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Wind, Lightbulb, Users, Flame, Info, FlaskConical, WifiOff, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { DigitalTwinMap } from "@/components/DigitalTwinMap";

export default function Dashboard() {
  const { sensorData, attendance } = useSimulation();
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isOffline, setIsOffline] = useState(true); // Default to true until we get data
  const [lastUpdateText, setLastUpdateText] = useState("Waiting for hardware...");

  useEffect(() => {
    const checkOffline = setInterval(() => {
      if (!sensorData.timestamp) return;
      const lastUpdate = new Date(sensorData.timestamp).getTime();
      const now = Date.now();
      const diff = now - lastUpdate;
      
      // If data is older than 8 seconds, consider it offline
      if (diff > 8000) {
        setIsOffline(true);
        setLastUpdateText(`Connection lost (${Math.floor(diff / 1000)}s ago)`);
      } else {
        setIsOffline(false);
        setLastUpdateText("Live connection");
      }
    }, 1000);
    return () => clearInterval(checkOffline);
  }, [sensorData.timestamp]);

  const calculateHealthScore = () => {
    let score = 100;
    if (sensorData.temperature > 28) score -= 10;
    if (sensorData.temperature > 32) score -= 20;
    if (sensorData.co2 > 800) score -= 10;
    if (sensorData.co2 > 1200) score -= 20;
    if (sensorData.smoke || sensorData.fire) score = 0;
    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            {isOffline ? (
              <Badge variant="destructive" className="animate-pulse flex gap-1 items-center bg-rose-600">
                <WifiOff className="w-3 h-3" /> {lastUpdateText}
              </Badge>
            ) : (
              <Badge variant="success" className="flex gap-1 items-center">
                <Wifi className="w-3 h-3" /> {lastUpdateText}
              </Badge>
            )}
          </div>
          <p className="text-slate-400 mt-1">Real-time monitoring for ETC Smart Classroom 01</p>
        </div>
        <button 
          onClick={() => setIsLiveMode(!isLiveMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            isLiveMode 
              ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
              : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          {isLiveMode ? "Pro Mode (Live AI active)" : "Enable Pro Mode"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DigitalTwinMap isLiveMode={isLiveMode} />
        <Card className={isLiveMode ? "hidden" : "block"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData.temperature.toFixed(1)} °C</div>
            <div className="flex items-center mt-1">
              <Badge variant={sensorData.temperature > 30 ? "destructive" : sensorData.temperature > 28 ? "warning" : "success"}>
                {sensorData.temperature > 30 ? "CRITICAL" : sensorData.temperature > 28 ? "WARNING" : "NORMAL"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(sensorData.humidity)} %</div>
            <div className="flex items-center mt-1">
              <Badge variant="success">NORMAL</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">CO₂ Levels</CardTitle>
            <Wind className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(sensorData.co2)} ppm</div>
            <div className="flex items-center mt-1">
              <Badge variant={sensorData.co2 > 1000 ? "destructive" : sensorData.co2 > 800 ? "warning" : "success"}>
                {sensorData.co2 > 1000 ? "CRITICAL" : sensorData.co2 > 800 ? "WARNING" : "GOOD"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Ambient Light</CardTitle>
            <Lightbulb className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(sensorData.light)} lux</div>
            <div className="flex items-center mt-1">
              <Badge variant="success">OPTIMAL</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Present</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance.length} <span className="text-sm font-normal text-slate-400">/ 57</span></div>
            <div className="flex items-center mt-1">
              <Badge variant="success">LIVE REGISTER</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Safety Status</CardTitle>
            <Flame className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData.fire ? "FIRE DETECTED" : sensorData.smoke ? "SMOKE DETECTED" : "SAFE"}
            </div>
            <div className="flex items-center mt-1">
               <Badge variant={sensorData.fire ? "destructive" : sensorData.smoke ? "warning" : "success"}>
                {sensorData.fire ? "CRITICAL" : sensorData.smoke ? "WARNING" : "NORMAL"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classroom Health Score</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-4xl font-bold text-white">{healthScore} <span className="text-xl text-slate-500 font-medium">/ 100</span></div>
              <p className="text-sm text-slate-400 mt-1">Based on environmental & safety metrics</p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 flex items-center justify-center font-bold text-lg"
                 style={{
                   borderColor: healthScore > 80 ? '#10b981' : healthScore > 50 ? '#f59e0b' : '#ef4444',
                   color: healthScore > 80 ? '#10b981' : healthScore > 50 ? '#f59e0b' : '#ef4444'
                 }}>
              {healthScore > 80 ? 'EXC' : healthScore > 50 ? 'WARN' : 'CRIT'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Subject</span>
                <span className="font-medium text-slate-100">Communication Systems</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Teacher</span>
                <span className="font-medium text-slate-100">Demo Faculty</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Session</span>
                <span className="font-medium text-slate-100">10:00 AM – 11:00 AM</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Status</span>
                <Badge variant="success">ONLINE</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-blue-900/20 border border-blue-900/50 p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-100">Simulation Mode Active</h4>
                <p className="text-xs text-blue-300/80 mt-1">
                  Sensor values are generated for testing. 
                  Hardware connection is bypassed. Phase 1 features fully accessible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
