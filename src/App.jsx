import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import EventCard from './components/EventCard';
import EventDetailModal from './components/EventDetailModal';
import RegistrationModal from './components/RegistrationModal';
import MyRegistrationsView from './components/MyRegistrationsView';
import OrganizerDashboard from './components/OrganizerDashboard';
import ApiInspectorModal from './components/ApiInspectorModal';
import { getEvents, getMyRegistrations } from './services/api';
import { 
  Sparkles, 
  Calendar, 
  Filter, 
  Search, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('events'); // 'events' | 'my-registrations' | 'organizer'
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [detailEventId, setDetailEventId] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch events based on current filter & search
  const loadEventsData = async () => {
    setLoading(true);
    try {
      const data = await getEvents({
        category: selectedCategory,
        search: searchQuery
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user registrations for badges
  const loadMyRegistrationsData = async () => {
    try {
      const regs = await getMyRegistrations();
      setMyRegistrations(Array.isArray(regs) ? regs : []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  };

  useEffect(() => {
    loadEventsData();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadMyRegistrationsData();

    const handleDataReset = () => {
      loadEventsData();
      loadMyRegistrationsData();
      showToast('Data reset to default mock state', 'info');
    };

    window.addEventListener('campusconnect:data-reset', handleDataReset);
    return () => window.removeEventListener('campusconnect:data-reset', handleDataReset);
  }, []);

  // Quick lookup of registered event IDs
  const registeredEventIds = new Set(myRegistrations.map((r) => r.eventId));

  const handleRegistrationSuccess = (newPass) => {
    loadMyRegistrationsData();
    loadEventsData();
    showToast(`Pass issued for ${newPass.eventTitle}! (HTTP 201 Created)`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        myRegistrationsCount={myRegistrations.length}
        onOpenApiInspector={() => setIsApiInspectorOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'events' && (
          <div>
            {/* Hero Banner with Filters */}
            <HeroBanner
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalEvents={events.length}
            />

            {/* Event Catalog Feed */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                    {selectedCategory === 'All' ? 'Upcoming Campus Events' : `${selectedCategory} Events`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Showing {events.length} verified university listings
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">GET /api/events</span>
                </div>
              </div>

              {/* Event Cards Grid */}
              {loading ? (
                <div className="py-24 text-center">
                  <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-mono text-slate-500">Executing GET /api/events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="py-20 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800">No events found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your search query or switching categories.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isRegistered={registeredEventIds.has(event.id)}
                      onViewDetails={(id) => setDetailEventId(id)}
                      onRegisterClick={(evt) => setRegisteringEvent(evt)}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {currentTab === 'my-registrations' && (
          <MyRegistrationsView
            onExploreEvents={() => setCurrentTab('events')}
            onViewEventDetails={(id) => setDetailEventId(id)}
          />
        )}

        {currentTab === 'organizer' && (
          <OrganizerDashboard
            onSelectEventId={(id) => setDetailEventId(id)}
          />
        )}
      </main>

      {/* Floating API Endpoint Pill Shortcut */}
      <aside 
        aria-label="API Specification"
        className="fixed bottom-5 right-5 z-40 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all text-xs"
        onClick={() => setIsApiInspectorOpen(true)}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] font-semibold text-brand-300">
          5 Endpoints Active
        </span>
        <span className="text-slate-400 text-[10px] hidden sm:inline">&bull; Inspect</span>
      </aside>

      {/* Toast Notification */}
      {toast && (
        <aside 
          aria-label="Notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium border border-slate-700 animate-fade-in"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0" />}
          <span>{toast.message}</span>
        </aside>
      )}

      {/* Event Details Modal (GET /api/events/{id}) */}
      <EventDetailModal
        eventId={detailEventId}
        onClose={() => setDetailEventId(null)}
        isRegistered={detailEventId ? registeredEventIds.has(detailEventId) : false}
        onRegisterClick={(evt) => setRegisteringEvent(evt)}
        onOpenAttendees={(evtId) => {
          setCurrentTab('organizer');
        }}
      />

      {/* Event Registration Modal (POST /api/registrations, 201 or 409) */}
      <RegistrationModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={handleRegistrationSuccess}
        onNavigateToMyPasses={() => setCurrentTab('my-registrations')}
      />

      {/* API Endpoints & Live Activity Inspector Drawer */}
      <ApiInspectorModal
        isOpen={isApiInspectorOpen}
        onClose={() => setIsApiInspectorOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CampusConnect</span>
            <span>&bull; Event UI & API Frontend</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>/api/events</span>
            <span>/api/events/&#123;id&#125;</span>
            <span>/api/registrations</span>
            <span>/api/me/registrations</span>
            <span>/api/events/&#123;id&#125;/registrations</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

