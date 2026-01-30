import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Star,
  Search,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  const eventCategories = [
    "Corporate Events",
    "Weddings",
    "Conferences",
    "Product Launches",
    "Technical Galas",
    "Virtual Events",
    "Team Building",
  ];

  const statusStyles = {
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ongoing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    upcoming: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  useEffect(() => {
    fetchPortfolioItems();
    fetchPortfolioStats();
  }, [currentPage, filterCategory, searchTerm]);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
        category: filterCategory === "all" ? "" : filterCategory,
        search: searchTerm,
      });
      const response = await fetch(`/api/portfolio/public?${params}`);
      const data = await response.json();
      if (data.success) {
        setPortfolioItems(data.data);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioStats = async () => {
    try {
      const response = await fetch("/api/portfolio/public/stats");
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      /* handle error */
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-200">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Fixed: Ensuring the gradient stays behind content */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-50/50 dark:from-amber-900/10 to-transparent -z-10" />

        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-amber-500"></span>
              <span className="text-sm font-bold tracking-widest text-amber-600 uppercase">
                Archive 2024-2026
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.85]">
              EVENTS THAT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-900 dark:from-slate-100 dark:to-slate-500">
                DEFINE MOMENTS.
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-12 mt-16 border-t border-slate-200 dark:border-slate-800 pt-10">
            {stats ? (
              [
                { label: "Completed Projects", value: stats.total },
                { label: "Featured Work", value: stats.featured },
                { label: "Client Satisfaction", value: "99%" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-4xl font-light mb-1">{s.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                    {s.label}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-lg" />
            )}
          </div>
        </div>
      </section>

      {/* --- FILTER & SEARCH BAR (Sticky) --- */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-transparent border-none pl-7 focus:ring-0 text-sm placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          {/* Fixed: Custom scrollbar hiding usually requires CSS, using overflow-x-auto */}
          <div className="flex gap-2 overflow-x-auto w-full scrollbar-hide pb-1 md:pb-0">
            {["all", ...eventCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filterCategory === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- PORTFOLIO GRID --- */}
      <main className="container mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[2.5rem]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {portfolioItems.map((item) => (
              <Link
                to={`/portfolio/${item._id}`}
                key={item._id}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-200 dark:bg-slate-900 mb-6">
                  {item.featured && (
                    <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="text-[10px] font-bold uppercase text-slate-900 tracking-tight">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />

                  <div className="flex h-full w-full items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                    {/* Image rendering logic should go here, using Icon as fallback */}
                    <ImageIcon className="h-16 w-16 text-slate-400 opacity-20" />
                  </div>

                  <div className="absolute bottom-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <div className="bg-white text-black p-4 rounded-full shadow-2xl">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-widest ${statusStyles[item.status] || statusStyles.ongoing}`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-600 transition-colors tracking-tight">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center text-[11px] font-medium uppercase tracking-tighter">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {new Date(item.eventDate).getFullYear()}
                    </div>
                    <div className="flex items-center text-[11px] font-medium uppercase tracking-tighter">
                      <MapPin className="mr-1.5 h-3.5 w-3.5" />
                      {item.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
