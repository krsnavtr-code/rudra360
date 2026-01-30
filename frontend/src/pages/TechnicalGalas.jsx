import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Globe, 
  Microchip, 
  Code2, 
  Zap, 
  ChevronRight,
  Hexagon
} from 'lucide-react';

const TechnicalGalas = () => {
  const galas = [
    {
      id: "01",
      title: "Quantum Leap Symposium",
      tech: "Quantum Computing / Cryptography",
      venue: "The Glass Pavilion, Zurich",
      status: "Upcoming",
      gradient: "from-blue-500/20 to-amber-500/20"
    },
    {
      id: "02",
      title: "Neural Network Gala",
      tech: "LLM Architectures / Bio-Inference",
      venue: "Skyline Tech Hub, Singapore",
      status: "Archive",
      gradient: "from-amber-500/20 to-red-500/20"
    },
    {
      id: "03",
      title: "Decentralized Auto-Summit",
      tech: "Web3 Infrastructure / Edge Nodes",
      venue: "Cyber Citadel, Austin",
      status: "Upcoming",
      gradient: "from-emerald-500/20 to-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-12 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: Technical Precision */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Hexagon className="text-amber-500 fill-amber-500/10" size={32} />
                <Cpu size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">
                Technical Circuits 2026
              </span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
              The <span className="text-amber-500">Gala</span> <br />Protocol.
            </h1>
          </div>
          <div className="pb-2">
            <p className="text-slate-400 text-lg leading-relaxed font-medium border-l-2 border-slate-800 pl-8">
              Where high-level engineering meets executive prestige. Our galas are designed to 
              showcase the "Art of the Stack" through immersive, live-coded demonstrations 
              and architectural unveilings.
            </p>
          </div>
        </header>

        {/* GALA LISTING: Interactive Blueprint Cards */}
        <div className="space-y-6">
          {galas.map((gala) => (
            <motion.div
              key={gala.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 20 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 bg-slate-900/40 border border-slate-800 rounded-[2rem] hover:bg-slate-900/60 transition-all overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gala.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
                <span className="text-5xl font-black text-slate-800 group-hover:text-amber-500/20 transition-colors italic">
                  {gala.id}
                </span>
                
                <div className="flex-1 space-y-2 text-center lg:text-left">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      gala.status === 'Upcoming' ? 'border-amber-500 text-amber-500' : 'border-slate-700 text-slate-500'
                    }`}>
                      {gala.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] self-center">
                      {gala.tech}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black group-hover:tracking-wide transition-all duration-300">
                    {gala.title}
                  </h3>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-500 font-medium">
                    <Globe size={14} />
                    <span className="text-sm uppercase tracking-tighter">{gala.venue}</span>
                  </div>
                </div>

                <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-amber-500 hover:text-white transition-colors">
                  Request Invite <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FOOTER: Technical Stack Detail */}
        <footer className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <StackIcon icon={<Microchip />} label="Core Hardware" />
          <StackIcon icon={<Code2 />} label="Custom Kernel" />
          <StackIcon icon={<Zap />} label="Zero Latency" />
          <StackIcon icon={<Hexagon />} label="Encrypted" />
        </footer>

      </div>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const StackIcon = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 text-amber-500">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
  </div>
);

export default TechnicalGalas;