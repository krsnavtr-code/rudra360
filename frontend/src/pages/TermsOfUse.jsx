import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  ShieldAlert, 
  FileText, 
  Lock, 
  Globe, 
  Info,
  ChevronRight
} from 'lucide-react';

const TermsOfUse = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const sections = [
    { id: 'agreement', title: '1. User Agreement', icon: <FileText size={18} /> },
    { id: 'license', title: '2. Intellectual Property', icon: <Scale size={18} /> },
    { id: 'conduct', title: '3. Prohibited Conduct', icon: <ShieldAlert size={18} /> },
    { id: 'privacy', title: '4. Data Integration', icon: <Lock size={18} /> },
    { id: 'liability', title: '5. Limitation of Liability', icon: <Info size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4 text-amber-500"
          >
            <Scale size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Legal Protocol</span>
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            Terms of <span className="text-amber-500 text-outline-sm">Service.</span>
          </h1>
          <p className="mt-4 text-slate-500 font-medium italic">Last Updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* STICKY SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block sticky top-24 self-start">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeSection === section.id 
                  ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-lg" 
                  : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {section.icon}
                <span className="text-xs uppercase tracking-widest">{section.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <main className="lg:col-span-3 space-y-16">
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="prose prose-slate dark:prose-invert max-w-none"
          >
            <div id="agreement" className="scroll-mt-24 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">1. User Agreement</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                By accessing this platform, you enter into a binding contractual relationship with the Executive Entity. This service is provided for professional use, and users are expected to maintain the highest standards of digital integrity.
              </p>
              <div className="mt-6 p-4 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  Note: Unauthorized access to secure modules is strictly prohibited and subject to legal review.
                </p>
              </div>
            </div>

            <div id="license" className="mt-12 scroll-mt-24 p-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">2. Intellectual Property</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                All architectural frameworks, UI components, and proprietary algorithms displayed on this site remain the exclusive property of the owner. Users are granted a limited, non-transferable license to view and interact with the platform.
              </p>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <ChevronRight size={16} className="text-amber-500" /> No Redistribution
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <ChevronRight size={16} className="text-amber-500" /> No Reverse Engineering
                </li>
              </ul>
            </div>

            <div id="conduct" className="mt-12 scroll-mt-24 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem]">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">3. Prohibited Conduct</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                The following activities are strictly forbidden on our infrastructure:
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4">
                <ProhibitedItem text="Automated data scraping or harvesting of executive profiles." />
                <ProhibitedItem text="Bypassing architectural security layers or firewall protocols." />
                <ProhibitedItem text="Impersonation of entity officials or corporate partners." />
              </div>
            </div>
          </motion.section>

          {/* FINAL CTA/CONTACT */}
          <section className="bg-slate-950 text-white p-12 rounded-[3rem] text-center space-y-6">
            <h3 className="text-2xl font-black">Need Clarification?</h3>
            <p className="text-slate-400 max-w-lg mx-auto">
              If our terms are unclear or you require specific legal documentation for an enterprise partnership, please reach out to our compliance team.
            </p>
            <button className="px-8 py-4 bg-amber-500 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
              Contact Compliance
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

const ProhibitedItem = ({ text }) => (
  <div className="flex gap-4 items-start p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
    <div className="mt-1 w-2 h-2 rounded-full bg-red-500" />
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{text}</span>
  </div>
);

export default TermsOfUse;