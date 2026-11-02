"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, Settings } from "lucide-react";

export default function AutomationPage() {
  const { automations } = useSimulation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation Logs</h1>
        <p className="text-slate-400">Automated classroom control events based on sensor triggers.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Automation Events</CardTitle>
          </CardHeader>
          <CardContent>
             {automations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No recent automation events.
                </div>
              ) : (
                <div className="space-y-4">
                  {automations.map((event, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Power className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-slate-200">{event.action}</span>
                        </div>
                        <p className="text-sm text-slate-400">{event.reason}</p>
                      </div>
                      <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                         <span className="text-sm text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                         <Badge variant="outline" className="mt-1 text-slate-400">{event.mode}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                Active Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <div className="font-medium">Lighting Control</div>
                  <div className="text-slate-400 mt-1">Motion + Low Light → Lights ON</div>
                  <div className="text-slate-400">Classroom Empty → Lights OFF</div>
                </div>
                <Badge variant="success">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <div className="font-medium">AC Control</div>
                  <div className="text-slate-400 mt-1">Temp &gt; 28°C → AC ON</div>
                </div>
                <Badge variant="success">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Ventilation Alert</div>
                  <div className="text-slate-400 mt-1">CO₂ &gt; 800 ppm → Alert</div>
                </div>
                <Badge variant="success">ACTIVE</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
