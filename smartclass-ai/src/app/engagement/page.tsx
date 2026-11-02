"use client";
import { useSimulation } from "@/contexts/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function EngagementPage() {
  const { engagement } = useSimulation();

  const getAverageEngagement = () => {
    const presentStudents = engagement.filter(e => e.score > 0);
    if (presentStudents.length === 0) return 0;
    const total = presentStudents.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(total / presentStudents.length);
  };

  const avgEngagement = getAverageEngagement();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Engagement</h1>
        <p className="text-slate-400">Real-time computer vision analysis of student attention.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Engagement</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-5xl font-bold text-white mb-2">{avgEngagement}%</div>
            <Badge variant={avgEngagement > 80 ? "success" : avgEngagement > 60 ? "warning" : "destructive"}>
              {avgEngagement > 80 ? "HIGHLY ENGAGED" : avgEngagement > 60 ? "MODERATE" : "NEEDS ATTENTION"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
              Per-Student Breakdown
              <Badge variant="outline" className="text-blue-400 border-blue-900/50 bg-blue-900/10">
                SIMULATED AI VISION DATA
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
              {engagement.map((record, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">Student {String.fromCharCode(65 + index)}</div>
                  <div className="flex-1">
                    <Progress 
                      value={record.score} 
                      indicatorClassName={
                        record.score > 80 ? "bg-emerald-500" :
                        record.score > 60 ? "bg-amber-500" :
                        "bg-rose-500"
                      }
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-bold">{record.score}%</div>
                  <div className="w-32 text-right">
                     <Badge variant="outline" className={
                        record.score > 80 ? "text-emerald-400 border-emerald-900" :
                        record.score > 60 ? "text-amber-400 border-amber-900" :
                        "text-rose-400 border-rose-900"
                      }>
                       {record.category}
                     </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
