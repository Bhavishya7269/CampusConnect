import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Ticket, 
  LayoutDashboard, 
  Settings2, 
  Sparkles,
  Server,
  UserCheck,
  Search
} from 'lucide-react';
import { getApiConfig, saveApiConfig } from '../services/api';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  myRegistrationsCount = 0,
  onOpenApiInspector,
  searchQuery,
  setSearchQuery
}) {
  const [config, setConfig] = useState(getApiConfig());

  useEffect(() => {
    const handleConfigChange = () => setConfig(getApiConfig());
    window.addEventListener('campusconnect:config-updated', handleConfigChange);
    return () => window.removeEventListener('campusconnect:config-updated', handleConfigChange);
  }, []);

  const toggleOrganizerRole = () => {
    const updated = { ...config, isOrganizer: !config.isOrganizer };
    saveApiConfig(updated);
    setConfig(updated);
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('events')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900">
                  Campus<span className="text-brand-600">Connect</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  Event UI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">University Life & Discovery</p>
            </div>
          </div>

          {/* Quick Search in Bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, clubs, venues, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('events')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'events'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span> Events
            </button>

            <button
              onClick={() => setCurrentTab('my-registrations')}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'my-registrations'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">My</span> Passes
              {myRegistrationsCount > 0 && (
                <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                  currentTab === 'my-registrations' 
                    ? 'bg-white text-brand-700' 
                    : 'bg-brand-100 text-brand-700'
                }`}>
                  {myRegistrationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('organizer')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'organizer'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Attendee list, owning organizer only (GET /api/events/{id}/registrations)"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Organizer</span> Portal
            </button>

            {/* API Endpoints & Inspector button */}
            <button
              onClick={onOpenApiInspector}
              className="flex items-center gap-1.5 ml-1 sm:ml-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
              title="Inspect Endpoints & Configure Base URL"
            >
              <span className={`w-2 h-2 rounded-full ${config.useMock ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline font-mono text-[11px]">
                {config.useMock ? 'Mock API' : 'Live API'}
              </span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role switch toggle */}
            <button
              onClick={toggleOrganizerRole}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                config.isOrganizer 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Click to toggle between Student & Organizer role permissions"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{config.isOrganizer ? 'Role: Organizer' : 'Role: Student'}</span>
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
}

