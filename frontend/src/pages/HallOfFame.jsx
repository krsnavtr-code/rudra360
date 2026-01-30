import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Crown,
  Sparkles,
  History,
  Zap,
  Quote,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const HallOfFame = () => {
  const inductees = [
    {
      id: 1,
      name: "The Genesis Protocol",
      era: "2023 Inductee",
      role: "Architectural Foundation",
      desc: "The original encrypted framework that set the standard for all subsequent executive deployments.",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      stats: { influence: "98%", stability: "100%" },
    },
    {
      id: 2,
      name: "Elena Vance",
      era: "2024 Inductee",
      role: "Lead Systems Designer",
      desc: "Visionary behind the 'Fluid Intelligence' UI that bridged the gap between human intuition and machine logic.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
      stats: { efficiency: "+45%", adoption: "12k" },
    },
    {
      id: 3,
      name: "Aurelius Core V4",
      era: "2025 Inductee",
      role: "AI Integration Module",
      desc: "The first self-healing neural node to operate with zero-latency in high-density corporate environments.",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
      stats: { uptime: "99.99%", speed: "0.2ms" },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30 overflow-hidden">
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[70vh] flex items-center justify-center">
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-amber-500/50 via-transparent to-transparent opacity-30" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center space-y-6 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 text-amber-500 mb-4"
          >
            <Crown size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">
              Permanent Collection
            </span>
          </motion.div>
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter leading-none">
            Hall of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">
              Fame.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-400 font-medium text-lg italic">
            "Celebrating the milestones and minds that redefined the boundaries
            of digital excellence."
          </p>
        </div>
      </section>

      {/* 2. LEGACY TIMELINE */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="space-y-32">
          {inductees.map((item, index) => (
            <InducteeSection key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* 3. SUBMISSION CTA */}
      <section className="py-24 border-t border-slate-900 bg-slate-900/20 text-center">
        <History className="mx-auto mb-6 text-slate-700" size={48} />
        <h2 className="text-3xl font-black mb-4">Want to make history?</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">
          We are constantly scouting for projects and partners that demonstrate
          unparalleled architectural vision.
        </p>
        <button className="px-10 py-4 bg-white text-slate-950 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all active:scale-95">
          Submit Nomination
        </button>
      </section>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const InducteeSection = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}
    >
      {/* Portrait Block */}
      <div className="w-full lg:w-1/2 relative group">
        <div className="absolute -inset-4 bg-amber-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-slate-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8">
            <span className="px-4 py-2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-lg">
              {item.era}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Block */}
      <div className="w-full lg:w-1/2 space-y-8">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2">
            <Sparkles size={14} /> {item.role}
          </h3>
          <h2 className="text-5xl lg:text-6xl font-black tracking-tighter">
            {item.name}
          </h2>
        </div>

        <div className="relative">
          <Quote className="absolute -top-4 -left-8 text-slate-800" size={40} />
          <p className="text-xl text-slate-400 font-medium leading-relaxed italic">
            {item.desc}
          </p>
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-900">
          {Object.entries(item.stats).map(([key, val]) => (
            <div key={key}>
              <div className="text-3xl font-black text-white uppercase">
                {val}
              </div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {key}
              </div>
            </div>
          ))}
        </div>

        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 hover:gap-4 transition-all">
          View Case Study <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default HallOfFame;
