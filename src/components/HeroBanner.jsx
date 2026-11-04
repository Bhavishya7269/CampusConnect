import React from 'react';
import { 
  Sparkles, 
  Flame, 
  MapPin, 
  TrendingUp, 
  Search,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Events' },
  { id: 'Robotics', label: 'Robotics' },
  { id: 'Workshop', label: 'Workshops' },
  { id: 'Hackathon', label: 'Hackathons' },
  { id: 'Tech', label: 'Tech & AI' },
  { id: 'Cultural', label: 'Cultural' },
];

export default function HeroBanner({ 
  selectedCategory, 
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  totalEvents = 4
}) {
  return (
    <div className="relative overflow-hidden pt-8 pb-10 sm:py-12 gradient-hero border-b border-slate-200/60">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-accent-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-brand-200 shadow-sm text-xs font-semibold text-brand-700 mb-4 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>CampusConnect Hub &bull; Live Fall Semester 2026</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-slate-900 leading-tight">
            Discover, Experience & Host <br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 bg-clip-text text-transparent">
              Campus Events That Matter.
            </span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            From 36-hour hackathons and design jams to sports tournaments and cultural headliners — RSVP in 1-click with student pass verification.
          </p>

          {/* Mobile Search input */}
          <div className="mt-6 md:hidden">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, clubs, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-6 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15 scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-sm'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

