import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Briefcase,
  BarChart,
  Zap,
  Globe,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const CorporateAwards = () => {
  const categories = [
    {
      tier: "Platinum",
      title: "Global Enterprise Partner",
      year: "2025-2026",
      issuer: "World Commerce Group",
      icon: <Globe className="text-cyan-500" />,
      highlight:
        "Highest distinction for cross-border infrastructure excellence.",
    },
    {
      tier: "Gold",
      title: "FinTech Security Leader",
      year: "2025",
      issuer: "Cyber Fin-Institute",
      icon: <Shield className="text-amber-500" />,
      highlight: "Top-tier ranking for zero-breach architectural deployment.",
    },
    {
      tier: "Gold",
      title: "Operational Velocity Award",
      year: "2024",
      issuer: "Executive Logistics Union",
      icon: <Zap className="text-amber-400" />,
      highlight: "Recognized for optimizing executive workflows by 60%.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* 1. ARCHITECTURAL HERO */}
      <section className="pt-24 pb-20 px-6 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 dark:bg-white"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-950">
                Official Credentials
              </span>
            </motion.div>
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              Corporate <br />
              <span className="text-amber-500">Milestones.</span>
            </h1>
          </div>
          <div className="lg:w-1/3">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg border-l-4 border-amber-500 pl-6">
              Our accolades are more than just trophies; they are verified
              benchmarks of our operational integrity and industrial impact.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE TROPHY GRID */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((award, index) => (
            <AwardPlate key={index} award={award} index={index} />
          ))}
        </div>
      </section>

      {/* 3. VERIFICATION SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center gap-12 opacity-40 grayscale contrast-125">
            <Briefcase size={40} className="text-slate-900 dark:text-white" />
            <BarChart size={40} className="text-slate-900 dark:text-white" />
            <Award size={40} className="text-slate-900 dark:text-white" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
            Authenticated by Global Compliance Standards
          </p>
        </div>
      </section>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const AwardPlate = ({ award, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative"
  >
    {/* The Glass "Plate" */}
    <div className="relative z-10 p-10 h-full rounded-tr-[4rem] rounded-bl-[4rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 group-hover:border-amber-500/50 group-hover:-translate-y-2">
      <div className="flex justify-between items-start mb-12">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white group-hover:bg-amber-500 group-hover:text-white transition-all">
          {award.icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
          {award.tier}
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
          {award.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {award.highlight}
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
            {award.issuer}
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {award.year}
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ExternalLink size={16} className="text-slate-400" />
        </button>
      </div>
    </div>

    {/* Decorative Shadow Accent */}
    <div className="absolute -bottom-2 -right-2 w-full h-full bg-amber-500/10 rounded-tr-[4rem] rounded-bl-[4rem] -z-0 group-hover:bg-amber-500/20 transition-all" />
  </motion.div>
);

export default CorporateAwards;
