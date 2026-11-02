"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AttendancePage() {
  const { attendance, clearAttendance } = useSimulation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-slate-400">Computer Vision based automated attendance monitoring.</p>
        </div>
        <Button variant="destructive" onClick={clearAttendance} className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear Register
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Live Attendance Register
              <Badge variant="outline" className="text-emerald-400 border-emerald-900/50 bg-emerald-900/10">
                <Camera className="w-3 h-3 mr-1" /> LIVE FACIAL RECOGNITION
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ID / Roll No.</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3 rounded-tr-lg text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No students recognized yet. Please ensure vision_ai.py is running and faces are visible.
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record, index) => (
                      <tr key={index} className="hover:bg-slate-800/20">
                        <td className="px-4 py-3 font-bold text-white">
                          {record.studentId.match(/\d+/) ? record.studentId.match(/\d+/)?.[0] : '--'}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-300 capitalize">
                          {record.studentId.replace(/\d+/g, '').replace(/[^a-zA-Z]/g, ' ').trim() || '--'}
                        </td>
                      <td className="px-4 py-3">
                        <Badge variant={record.status === 'Present' ? "success" : "destructive"}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{record.time || '--'}</td>
                      <td className="px-4 py-3 text-right">
                        {record.confidence ? (
                           <span className="text-emerald-400">{record.confidence}%</span>
                        ) : (
                           <span className="text-slate-500">--</span>
                        )}
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Vision Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><Camera className="w-4 h-4"/> Camera</span>
                <Badge variant="outline" className="text-blue-400">SIMULATED</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Face Detection</span>
                <Badge variant="outline" className="text-blue-400">SIMULATED</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Face Recognition</span>
                <Badge variant="outline" className="text-blue-400">SIMULATED</Badge>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400">Engagement</span>
                <Badge variant="outline" className="text-blue-400">SIMULATED</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Occupancy Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Present</span>
                  <span className="text-3xl font-bold text-white">
                    {attendance.filter(a => a.status === 'Present').length}
                  </span>
                </div>
                <div className="h-12 w-px bg-slate-700 mx-4"></div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Total</span>
                  <span className="text-3xl font-bold text-white">{attendance.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
