import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  Fingerprint
} from 'lucide-react';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-12 h-[2px] bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">
              Legacy & Vision
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-8xl font-black tracking-tighter leading-none"
            >
              Architecting <br />
              <span className="text-amber-500">Digital Trust.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
            >
              We don't just build interfaces; we engineer executive infrastructure. 
              Our mission is to bridge the gap between complex technological capabilities 
              and seamless human interaction through elite design protocols.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES GRID */}
      <section className="py-20 px-6 lg:px-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <ValueCard 
              icon={<Fingerprint size={28} />}
              title="Identity"
              desc="Deeply personalized solutions tailored to your corporate DNA."
            />
            <ValueCard 
              icon={<ShieldCheck size={28} />}
              title="Security"
              desc="Encrypted methodologies ensuring data integrity at every layer."
            />
            <ValueCard 
              icon={<Zap size={28} />}
              title="Velocity"
              desc="Rapid deployment without compromising architectural stability."
            />
            <ValueCard 
              icon={<Users size={28} />}
              title="Synergy"
              desc="Fostering elite partnerships between users and machines."
            />
          </motion.div>
        </div>
      </section>

      {/* 3. MISSION STATEMENT */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="p-12 lg:p-20 rounded-[3rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950 relative overflow-hidden"
          >
            <Target className="absolute -top-10 -right-10 w-40 h-40 text-amber-500/10 rotate-12" />
            
            <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight">
              Our objective is simple: <br />
              <span className="text-amber-500">Excellence by Default.</span>
            </h2>
            
            <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto font-medium">
              We operate at the intersection of aesthetics and utility, ensuring that every 
              entity we touch gains a competitive advantage in the global market.
            </p>

            <button className="flex items-center gap-2 mx-auto bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform">
              Join the Network <ArrowUpRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4. METRICS / STATS */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-slate-100 dark:border-slate-800 pt-16">
          <StatBlock number="99.9%" label="Reliability Rate" />
          <StatBlock number="24/7" label="Global Support" />
          <StatBlock number="150+" label="Entities Managed" />
          <StatBlock number="0.0s" label="Latency Goal" />
        </div>
      </section>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const ValueCard = ({ icon, title, desc }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-500"
  >
    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 mb-8">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-3 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const StatBlock = ({ number, label }) => (
  <div className="text-center lg:text-left">
    <h4 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2">{number}</h4>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">{label}</p>
  </div>
);

export default AboutUs;