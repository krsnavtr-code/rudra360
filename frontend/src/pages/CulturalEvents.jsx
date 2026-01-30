import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Users, 
  Music, 
  Camera,
  ArrowRight
} from 'lucide-react';

const CulturalEvents = () => {
  const events = [
    {
      id: 1,
      title: "Neon Nexus: Tech & Art Gala",
      date: "MAR 15",
      location: "Tokyo, JP",
      type: "Art Exhibition",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000",
      attendees: "1.2k+"
    },
    {
      id: 2,
      title: "Executive Strategy Retreat",
      date: "APR 02",
      location: "Zermatt, CH",
      type: "Summit",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
      attendees: "150"
    },
    {
      id: 3,
      title: "The Midnight Symphony",
      date: "MAY 20",
      location: "London, UK",
      type: "Concert",
      image: "https://images.unsplash.com/photo-1514525253344-af636bb7dfff?auto=format&fit=crop&q=80&w=1000",
      attendees: "3.5k+"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* 1. IMMERSIVE HERO */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Event Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-md mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Live Global Circuit</span>
          </motion.div>
          <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-4">
            Cultural <span className="text-amber-500">Pulse.</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto font-medium">
            Where elite networking meets cultural immersion. Experience the events defining the executive lifestyle.
          </p>
        </div>
      </section>

      {/* 2. EVENT GRID */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Upcoming Calendar</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Reserve your seat in the inner circle.</p>
          </div>
          <div className="flex gap-4">
            <FilterTab label="All" active />
            <FilterTab label="Summits" />
            <FilterTab label="Arts" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 3. COMMUNITY METRICS */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto p-1 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500 rounded-[2.5rem]">
          <div className="bg-white dark:bg-slate-950 rounded-[2.4rem] py-10 px-8 flex flex-wrap justify-around items-center gap-8">
            <Metric icon={<Users size={20}/>} value="12k+" label="Community" />
            <div className="hidden lg:block w-[1px] h-12 bg-slate-200 dark:bg-slate-800" />
            <Metric icon={<MapPin size={20}/>} value="24" label="Countries" />
            <div className="hidden lg:block w-[1px] h-12 bg-slate-200 dark:bg-slate-800" />
            <Metric icon={<Camera size={20}/>} value="100+" label="Partners" />
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const EventCard = ({ event }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group relative flex flex-col bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800"
  >
    <div className="h-64 relative overflow-hidden">
      <img 
        src={event.image} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        alt={event.title}
      />
      <div className="absolute top-6 left-6 flex flex-col items-center justify-center w-14 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl">
        <span className="text-[10px] font-black text-amber-500 uppercase">{event.date.split(' ')[0]}</span>
        <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{event.date.split(' ')[1]}</span>
      </div>
    </div>

    <div className="p-8 space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <MapPin size={12} className="text-amber-500" />
        {event.location}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
        {event.title}
      </h3>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                </div>
            ))}
            <span className="pl-4 text-[10px] font-bold text-slate-400">{event.attendees} Attending</span>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
          <Ticket size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

const Metric = ({ icon, value, label }) => (
  <div className="flex items-center gap-4">
    <div className="text-amber-500">{icon}</div>
    <div>
      <div className="text-xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
    </div>
  </div>
);

const FilterTab = ({ label, active }) => (
  <button className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
    active ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
  }`}>
    {label}
  </button>
);

export default CulturalEvents;