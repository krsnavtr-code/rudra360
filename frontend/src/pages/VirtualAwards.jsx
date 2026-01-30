import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  Medal, 
  Star, 
  ShieldCheck, 
  ExternalLink,
  Milestone
} from 'lucide-react';

const VirtualAwards = () => {
  const honors = [
    {
      year: "2025",
      title: "Excellence in Digital Architecture",
      issuer: "Global Tech Forum",
      category: "Gold Tier",
      icon: <Trophy className="text-amber-500" />,
      desc: "Recognized for pioneering decentralized infrastructure protocols that redefined cross-border data security."
    },
    {
      year: "2024",
      title: "Security Vanguard Award",
      issuer: "CyberSafe Institute",
      category: "Elite Merit",
      icon: <ShieldCheck className="text-blue-500" />,
      desc: "Awarded for maintaining 100% data integrity across 500+ corporate deployments over a 3-year period."
    },
    {
      year: "2024",
      title: "UX Innovation of the Year",
      issuer: "Design Masters League",
      category: "Innovation",
      icon: <Star className="text-purple-500" />,
      desc: "Honored for the 'Executive Dashboard' interface which reduced operational friction by 40%."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 lg:p-12 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Award className="text-amber-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Hall of Excellence</span>
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">Accolades.</span>
          </h1>
          <p className="max-w-2xl text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            A testament to our commitment to precision, security, and the relentless pursuit of architectural perfection.
          </p>
        </header>

        {/* Awards Timeline/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {honors.map((award, index) => (
            <AwardCard key={index} award={award} index={index} />
          ))}
        </div>

        {/* Certifications / Badges Bar */}
        <section className="mt-24 p-12 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Global Compliance</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Verified architectural standards and security protocols.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Mock Badge Items */}
                <BadgeItem icon={<ShieldCheck />} label="ISO 27001" />
                <BadgeItem icon={<Milestone />} label="GDPR Compliant" />
                <BadgeItem icon={<Medal />} label="SOC2 Type II" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const AwardCard = ({ award, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 shadow-xl shadow-transparent hover:shadow-amber-500/5 transition-all duration-500 relative overflow-hidden"
  >
    {/* Year Badge */}
    <div className="absolute top-8 right-8 text-4xl font-black text-slate-100 dark:text-slate-800 transition-colors group-hover:text-amber-500/10">
      {award.year}
    </div>

    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
      {React.cloneElement(award.icon, { size: 28 })}
    </div>

    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{award.category}</span>
        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{award.title}</h3>
      </div>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {award.desc}
      </p>

      <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{award.issuer}</span>
        <ExternalLink size={14} className="text-slate-300 group-hover:text-amber-500" />
      </div>
    </div>
  </motion.div>
);

const BadgeItem = ({ icon, label }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </div>
);

export default VirtualAwards;