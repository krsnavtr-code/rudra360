import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronRight,
  BarChart3,
  Layers,
  Globe,
  Search,
  Zap,
} from "lucide-react";

const CaseStudies = () => {
  const [filter, setFilter] = useState("All");

  const projects = [
    {
      id: 1,
      category: "FinTech",
      title: "Global Ledger Sync",
      client: "Aurelius Capital",
      desc: "Implementing a sub-second latency synchronization protocol for cross-border asset management.",
      metrics: { growth: "+42%", speed: "0.4ms" },
      image:
        "https://images.unsplash.com/photo-1551288049-bbda38a594a0?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 2,
      category: "Infrastructure",
      title: "Neural Network Hub",
      client: "Titan Systems",
      desc: "Architecting a decentralized infrastructure to support high-density AI model training environments.",
      metrics: { uptime: "99.99%", load: "-30%" },
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 3,
      category: "E-Commerce",
      title: "Omni-Channel Flow",
      client: "Vogue Global",
      desc: "Redesigning the executive checkout protocol to reduce abandonment rates in luxury markets.",
      metrics: { conversion: "+18%", retention: "85%" },
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    },
  ];

  const categories = ["All", "FinTech", "Infrastructure", "E-Commerce"];
  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 lg:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* HEADER & FILTERS */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">
                Portfolio
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">
              Proven{" "}
              <span className="text-amber-500 text-outline">Deployments.</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  filter === cat
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 transition-colors"
              >
                {/* Image Section */}
                <div className="lg:w-1/2 h-80 lg:h-auto overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {project.client}
                      </span>
                      <ExternalLink
                        size={18}
                        className="text-slate-300 group-hover:text-amber-500 transition-colors"
                      />
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-amber-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
                      {project.desc}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex flex-wrap gap-8 py-8 border-t border-slate-200 dark:border-slate-800">
                    {Object.entries(project.metrics).map(([key, val]) => (
                      <div key={key}>
                        <div className="text-2xl font-black text-slate-900 dark:text-white uppercase">
                          {val}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {key}
                        </div>
                      </div>
                    ))}
                    <button className="ml-auto w-14 h-14 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* BOTTOM CTA */}
        <section className="mt-24 text-center py-20 border-t-2 border-dashed border-slate-100 dark:border-slate-900">
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-8">
            Ready to deploy your vision?
          </h2>
          <button className="px-12 py-5 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all">
            Initiate Consultation
          </button>
        </section>
      </div>
    </div>
  );
};

export default CaseStudies;
