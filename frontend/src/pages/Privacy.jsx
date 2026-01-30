import React from "react";
import { motion } from "framer-motion";
import {
  Lock,
  EyeOff,
  Database,
  ShieldCheck,
  RefreshCcw,
  Key,
  Server,
  FileLock2,
} from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* 1. SECURITY HEADER */}
      <section className="pt-24 pb-16 px-6 lg:px-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-amber-500"
              >
                <Lock size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Privacy Protocol 2.0
                </span>
              </motion.div>
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                Data <span className="text-amber-500">Integrity.</span>
              </h1>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "We treat your data with the same architectural rigor we apply
                to our own infrastructure. Privacy is not a setting; it is a
                foundation."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PILLARS */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PrivacyPillar
            icon={<EyeOff />}
            title="Anonymization"
            desc="Your identity is decoupled from behavioral data using high-entropy hashing protocols."
          />
          <PrivacyPillar
            icon={<Server />}
            title="Sovereignty"
            desc="Data resides in geo-fenced regions of your choice, complying with local jurisdiction."
          />
          <PrivacyPillar
            icon={<Key />}
            title="Encryption"
            desc="End-to-end AES-256 bit encryption for all data in transit and at rest."
          />
        </div>
      </section>

      {/* 3. DATA ARCHITECTURE VISUALIZATION */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 text-center space-y-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              Information Lifecycle
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white/50">
              <LifecycleStep label="Collection" />
              <LifecycleStep label="Encryption" active />
              <LifecycleStep label="Analysis" />
              <LifecycleStep label="Erasure" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. DETAILED CLAUSES */}
      <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="space-y-12">
          <Clause
            title="Information We Collect"
            content="We collect minimal operational data necessary for service delivery, including device metadata and authenticated identity tokens. We do not sell, trade, or leak executive data to third-party brokers."
          />
          <Clause
            title="Your Rights"
            content="Under global data protection acts (GDPR, CCPA), you maintain the right to access, rectify, or purge your data from our nodes at any time via the Executive Dashboard."
          />
          <Clause
            title="Third-Party Nodes"
            content="Our infrastructure may utilize audited sub-processors (e.g., AWS, Google Cloud) that adhere to strict SOC2 Type II compliance standards."
          />
        </div>
      </section>

      {/* 5. CONTACT COMPLIANCE */}
      <footer className="py-20 text-center">
        <div className="inline-block p-1 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-200">
          <button className="px-10 py-5 bg-white dark:bg-slate-950 rounded-xl flex items-center gap-3 group transition-all">
            <FileLock2 className="text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Download Full Audit
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const PrivacyPillar = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-amber-500/5 transition-all">
    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);

const Clause = ({ title, content }) => (
  <div className="space-y-4 border-l-2 border-slate-100 dark:border-slate-800 pl-8 py-2">
    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
      <ShieldCheck className="text-amber-500" size={18} />
      {title}
    </h4>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
      {content}
    </p>
  </div>
);

const LifecycleStep = ({ label, active }) => (
  <div
    className={`py-3 px-4 rounded-xl border ${active ? "border-amber-500 text-amber-500 bg-amber-500/5" : "border-slate-800 text-slate-600"} text-[10px] font-black uppercase tracking-widest`}
  >
    {label}
  </div>
);

export default Privacy;
