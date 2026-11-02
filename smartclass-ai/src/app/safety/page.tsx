"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ShieldAlert, Wind } from "lucide-react";

export default function SafetyPage() {
  const { sensorData, alerts } = useSimulation();
  
  const safetyAlerts = alerts.filter(a => a.source === 'Smoke/Fire Sensor' || a.type === 'High CO2');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Safety Monitor</h1>
        <p className="text-slate-400">Continuous environmental safety and hazard detection.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={sensorData.fire ? "border-rose-500 bg-rose-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Fire Detection</CardTitle>
            <Flame className={`w-5 h-5 ${sensorData.fire ? "text-rose-500 animate-pulse" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold mt-2">
              {sensorData.fire ? "FIRE ALERT" : "NORMAL"}
             </div>
             <Badge variant={sensorData.fire ? "destructive" : "success"} className="mt-2">
                {sensorData.fire ? "CRITICAL" : "SAFE"}
             </Badge>
          </CardContent>
        </Card>

        <Card className={sensorData.smoke ? "border-amber-500 bg-amber-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Smoke Detection</CardTitle>
            <Wind className={`w-5 h-5 ${sensorData.smoke ? "text-amber-500 animate-pulse" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold mt-2">
              {sensorData.smoke ? "SMOKE DETECTED" : "NORMAL"}
             </div>
             <Badge variant={sensorData.smoke ? "warning" : "success"} className="mt-2">
                {sensorData.smoke ? "WARNING" : "SAFE"}
             </Badge>
          </CardContent>
        </Card>

        <Card className={sensorData.co2 > 1000 ? "border-rose-500 bg-rose-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">CO₂ Levels</CardTitle>
            <ShieldAlert className={`w-5 h-5 ${sensorData.co2 > 1000 ? "text-rose-500 animate-pulse" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold mt-2">
              {Math.round(sensorData.co2)} ppm
             </div>
             <Badge variant={sensorData.co2 > 1000 ? "destructive" : sensorData.co2 > 800 ? "warning" : "success"} className="mt-2">
                {sensorData.co2 > 1000 ? "CRITICAL" : sensorData.co2 > 800 ? "WARNING" : "SAFE"}
             </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Emergency Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {safetyAlerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No recent safety alerts. System is normal.
            </div>
          ) : (
            <div className="space-y-4">
              {safetyAlerts.map((alert, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === 'CRITICAL' ? 'destructive' : 'warning'}>{alert.severity}</Badge>
                      <span className="font-semibold text-slate-200">{alert.type}</span>
                    </div>
                    <p className="text-sm text-slate-400">{alert.message}</p>
                  </div>
                  <div className="text-sm text-slate-500 mt-2 sm:mt-0 flex items-center gap-2">
                     <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                     <Badge variant="outline" className="text-slate-400">GUARDIAN NOTIFICATION: SIMULATED SENT</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
