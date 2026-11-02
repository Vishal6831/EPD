"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-slate-400">Configure data sources, hardware endpoints, and privacy.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-900/50 bg-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Data Source Configuration
            </CardTitle>
            <CardDescription>Select where the dashboard receives data from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-emerald-900/20 border border-emerald-800">
              <div>
                <div className="font-medium text-slate-200">Live Hardware API (ESP32)</div>
                <div className="text-xs text-slate-400 mt-1">Listening on http://localhost:3000/api/sensors</div>
              </div>
              <Badge variant="success">ACTIVE</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-md bg-slate-900 border border-slate-800 opacity-50">
              <div>
                <div className="font-medium text-slate-500">Software Simulation</div>
                <div className="text-xs text-slate-600 mt-1">Fake data generation removed by user request</div>
              </div>
              <Badge variant="outline" className="text-slate-600">DISABLED</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-slate-400" />
              MQTT Configuration (Phase 2 Prep)
            </CardTitle>
            <CardDescription>Prepare for ESP32 hardware integration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs font-medium text-slate-400">MQTT Broker URL</label>
               <input type="text" disabled value="mqtt://[PENDING-HARDWARE-SETUP]" className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-500" />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-medium text-slate-400">Classroom Base Topic</label>
               <input type="text" disabled value="smartclass/classroom01" className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-500" />
             </div>
             <Button disabled variant="secondary" className="w-full">Save Configuration</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
             <p>This system utilizes computer vision for attendance and engagement monitoring. All data must comply with institutional privacy policies.</p>
             <ul className="list-disc pl-5 space-y-2">
               <li><strong className="text-slate-200">Phase 1:</strong> All face recognition and biometric data is completely simulated. No actual images or video streams are stored or processed.</li>
               <li><strong className="text-slate-200">Data Retention:</strong> Simulated records are retained only for the duration of the browser session.</li>
               <li><strong className="text-slate-200">Role-Based Access:</strong> Currently running in Demo Admin mode. Real deployment will require Firebase Authentication.</li>
             </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
