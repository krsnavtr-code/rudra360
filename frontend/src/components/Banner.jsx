import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOwnerInfo } from "../api/ownerInfoApi";
import { Trophy, Star, Calendar, ArrowRight } from "lucide-react";

const Banner = () => {
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const data = await getOwnerInfo();
        const primaryOwner = data.owners?.find(owner => owner.isPrimary) || data.owners?.[0];
        if (primaryOwner) setOwnerInfo(primaryOwner);
      } catch (error) {
        console.error("Error fetching owner info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerInfo();
  }, []);

  const formatWhatsAppNumber = (number) => {
    if (!number) return '';
    return number.replace(/[^\d+]/g, "");
  };

  const whatsappLink = ownerInfo?.whatsappNumber 
    ? `https://wa.me/${formatWhatsAppNumber(ownerInfo.whatsappNumber)}?text=I'm%20interested%20in%20organizing%20an%20award%20function.`
    : '#';

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Premium Background Accents */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 sm:py-24 lg:py-32 lg:flex lg:items-center lg:justify-between gap-12">
          
          {/* ================= TEXT CONTENT ================= */}
          <div className="text-center lg:text-left lg:w-3/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Star size={14} fill="currentColor" />
              Premier Event Architects
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              <span className="block">Where Excellence</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700">
                Originates & Shines
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              **rudra360** specializes in crafting world-class Award Functions. From concept origination 
              to the final trophy presentation, we transform corporate milestones into 
              unforgettable legacies.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl shadow-xl shadow-amber-900/20 hover:shadow-amber-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${
                  !ownerInfo ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Initializing..." : "Plan Your Event"}
                <ArrowRight size={20} />
              </a>
              
              <Link
                to="/portfolio"
                className="px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                View Masterpieces
              </Link>
            </div>

            {/* Industry Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">150+</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Events Originates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">25k+</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Trophies Awarded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">99%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* ================= VISUAL CONTENT ================= */}
          <div className="mt-16 lg:mt-0 lg:w-2/5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px]">
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-amber-500 rounded-[2.5rem] rotate-6 opacity-10 animate-pulse"></div>
              
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] aspect-[4/5] shadow-2xl border-8 border-white dark:border-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" 
                  alt="Award Ceremony Concept"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Float Badge */}
                <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-amber-500/50">
                   <Trophy className="text-amber-400" size={28} />
                </div>
              </div>

              {/* Real-time Booking Card */}
              <div className="absolute -left-10 bottom-12 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Next Grand Gala</p>
                    <p className="text-sm font-extrabold dark:text-white">Dec 2026 - Booking Open</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;