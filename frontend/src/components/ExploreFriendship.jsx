import React from "react";

const ExploreFriendship = () => {
  const categories = [
    {
      id: 1,
      title: "Travel Buddies",
      description:
        "Find a partner for your next luxury getaway or weekend trip.",
      icon: "✈️",
      color: "from-cyan-400 to-blue-500",
    },
    {
      id: 2,
      title: "Dinner Dates",
      description:
        "Discover charming companions for fine dining and deep conversations.",
      icon: "🍷",
      color: "from-indigo-400 to-purple-500",
    },
    {
      id: 3,
      title: "Social Events",
      description:
        "Need a plus-one for a party or corporate event? Find them here.",
      icon: "🎭",
      color: "from-rose-400 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              More Than Just{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Meetings
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Explore the social side of funwithjuli.in. Connect with verified
              individuals for companionship, social gatherings, and shared
              experiences.
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm">
              Explore All Categories
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative p-8 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Icon Circle */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-lg mb-6 transform group-hover:rotate-6 transition-transform`}
              >
                {cat.icon}
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                {cat.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                {cat.description}
              </p>

              <button className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold group-hover:gap-4 transition-all">
                Browse Profiles
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>

              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="text-8xl font-black">{cat.id}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Community Invite Banner */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                Become a Partner?
              </h3>
              <p className="text-blue-100 text-lg max-w-md">
                Join our verified network and get matched with people looking
                for high-end companionship and social dates.
              </p>
            </div>
            <button className="whitespace-nowrap px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95">
              Get At Today Night
            </button>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default ExploreFriendship;
