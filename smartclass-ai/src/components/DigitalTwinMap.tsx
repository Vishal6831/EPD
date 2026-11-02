"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, MonitorPlay } from "lucide-react";

// The shape of data coming from our Python Edge Node
interface ClassroomState {
  grid: Array<{ position: string; status: string; is_talking: boolean }>;
  total_present: number;
  talking_count: number;
  distracted_count: number;
}

const ROWS = ["Front", "Middle", "Back"];
const COLS = ["Left", "Center", "Right"];

export function DigitalTwinMap({ isLiveMode }: { isLiveMode: boolean }) {
  const [state, setState] = useState<ClassroomState>({
    grid: [], total_present: 0, talking_count: 0, distracted_count: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveMode) {
      // In simulation mode, just show an empty/fake state
      setState({ grid: [], total_present: 0, talking_count: 0, distracted_count: 0 });
      return;
    }

    const fetchState = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/classroom-state");
        if (!res.ok) throw new Error("Server not responding");
        const data = await res.json();
        setState(data);
        setError(null);
      } catch {
        setError("Cannot connect to Edge AI Python script. Make sure vision_ai.py is running!");
      }
    };

    // Poll 2 times a second
    const interval = setInterval(fetchState, 500);
    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Helper to get status of a specific desk
  const getDeskStatus = (row: string, col: string) => {
    const posStr = `${row}-${col}`;
    // Find all people detected in this zone
    const occupants = state.grid.filter(s => s.position === posStr);
    if (occupants.length === 0) return { status: "Empty", is_talking: false };
    
    // If multiple in zone, prioritize showing Talking or Distracted
    const isTalking = occupants.some(o => o.is_talking);
    const isDistracted = occupants.some(o => o.status === "Distracted");
    
    if (isTalking) return { status: "Talking", is_talking: true };
    if (isDistracted) return { status: "Distracted", is_talking: false };
    return { status: "Engaged", is_talking: false };
  };

  if (!isLiveMode) return null;

  return (
    <Card className="border-emerald-900/50 bg-emerald-900/10 col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-emerald-400">
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 animate-pulse" />
            Live 2D Spatial Map (Edge AI Connected)
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-800">
            {state.total_present} Present
          </Badge>
        </CardTitle>
        <CardDescription className="text-emerald-300/70">
          Real-time mapping from laptop webcam using Head Pose & MAR analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center justify-center py-8 text-rose-400 border border-rose-900/50 rounded-lg bg-rose-950/20">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-2 opacity-80">Run: <code className="bg-rose-900/50 px-2 py-1 rounded">python vision_ai.py</code></p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Whiteboard / Teacher Desk */}
            <div className="w-2/3 mx-auto h-8 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 shadow-inner">
              Whiteboard / Teacher
            </div>

            {/* The 2D Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {ROWS.map((row) => (
                COLS.map((col) => {
                  const desk = getDeskStatus(row, col);
                  return (
                    <div 
                      key={`${row}-${col}`} 
                      className={`
                        h-24 rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-300 border-2
                        ${desk.status === "Empty" ? "bg-slate-900/50 border-slate-800" : ""}
                        ${desk.status === "Engaged" ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : ""}
                        ${desk.status === "Distracted" ? "bg-amber-950/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : ""}
                        ${desk.status === "Talking" ? "bg-rose-950/40 border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.2)] animate-pulse" : ""}
                      `}
                    >
                      <Users className={`w-6 h-6 mb-2 ${desk.status === "Empty" ? "text-slate-700" : "text-white"}`} />
                      <span className={`text-xs font-bold ${desk.status === "Empty" ? "text-slate-600" : "text-white"}`}>
                        {row} {col}
                      </span>
                      <span className={`text-[10px] mt-1 px-2 rounded-full font-medium
                        ${desk.status === "Empty" ? "hidden" : ""}
                        ${desk.status === "Engaged" ? "bg-emerald-500/20 text-emerald-300" : ""}
                        ${desk.status === "Distracted" ? "bg-amber-500/20 text-amber-300" : ""}
                        ${desk.status === "Talking" ? "bg-rose-500/20 text-rose-300" : ""}
                      `}>
                        {desk.status}
                      </span>
                    </div>
                  )
                })
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div> Empty</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500"></div> Engaged</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500"></div> Distracted</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500/50 border border-rose-500"></div> Talking</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
