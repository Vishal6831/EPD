"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export default function AlertsPage() {
  const { alerts } = useSimulation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
        <p className="text-slate-400">Real-time system and environmental alerts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Filtered to show active issues.</CardDescription>
        </CardHeader>
        <CardContent>
           {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No active alerts.
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert, i) => (
                  <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-950/20 border-rose-900/50' :
                    alert.severity === 'WARNING' ? 'bg-amber-950/20 border-amber-900/50' :
                    'bg-slate-800/50 border-slate-700'
                  }`}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity === 'CRITICAL' ? 'destructive' : alert.severity === 'WARNING' ? 'warning' : 'default'}>
                          {alert.severity}
                        </Badge>
                        <span className="font-semibold text-slate-200">{alert.type}</span>
                      </div>
                      <p className="text-sm text-slate-400">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">Source: {alert.source}</p>
                    </div>
                    <div className="text-sm text-slate-500 mt-2 sm:mt-0 whitespace-nowrap">
                       {new Date(alert.timestamp).toLocaleTimeString()}
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
