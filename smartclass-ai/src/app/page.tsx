import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Thermometer, Eye, Settings, Shield, Cpu, Activity, PlaySquare, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
      <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="font-bold text-white text-xl">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-100">SmartClass AI</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#simulation" className="hover:text-white transition-colors">Phase 1</a>
        </nav>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="hidden md:flex">Teacher Login</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="flex gap-2">
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-900 mb-8 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Phase 1 Simulation Now Live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Transform Your Classroom Into an Intelligent Learning Environment
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered attendance, real-time classroom monitoring, smart automation and intelligent safety management using IoT and Edge AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-base">Launch Dashboard</Button>
            </Link>
            <Link href="/simulation">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base flex gap-2">
                <PlaySquare className="w-5 h-5" /> Try Simulation
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-slate-900 py-24 border-y border-slate-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
              <p className="text-slate-400">Everything you need to monitor and manage smart classrooms.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Activity, title: "Real-Time Monitoring", desc: "Track temperature, humidity, CO₂, and lighting with continuous IoT sensor streams." },
                { icon: Eye, title: "AI Vision", desc: "Automated attendance and student engagement tracking using facial recognition." },
                { icon: Settings, title: "Smart Automation", desc: "Intelligent control of lighting and HVAC systems based on occupancy and environmental thresholds." },
                { icon: Shield, title: "Safety Monitoring", desc: "Immediate hazard detection including smoke and fire with automated alerts." },
                { icon: Cpu, title: "Edge Processing", desc: "Privacy-first computer vision processing on local Jetson Nano/Raspberry Pi hardware." },
                { icon: Thermometer, title: "Environmental Health", desc: "Dynamic classroom health scoring to ensure optimal learning conditions." },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-start text-left">
                  <div className="w-12 h-12 rounded-xl bg-blue-900/20 text-blue-500 flex items-center justify-center mb-6 border border-blue-900/50">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="py-24">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <h2 className="text-3xl font-bold mb-12">System Architecture</h2>
            
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto text-left whitespace-pre-wrap">
              <div className="text-emerald-400 mb-4"># Phase 2 Hardware Integration Pathway</div>
              <div className="text-slate-300">
                [Sensors (Temp, CO₂, PIR)] ---&gt; [ESP32 Node] ---&gt; [MQTT Broker / Cloud] ---&gt; [SmartClass Dashboard]<br/><br/>
                [Classroom Camera] ---&gt; [Raspberry Pi / Jetson] ---&gt; [Edge AI Models] ---&gt; [Backend API] ---&gt; [SmartClass Dashboard]
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 SmartClass AI Project. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
