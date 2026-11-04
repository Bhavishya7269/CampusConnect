import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Share2, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { getEventById, getApiConfig } from '../services/api';

export default function EventDetailModal({ 
  eventId, 
  onClose, 
  onRegisterClick, 
  isRegistered, 
  onOpenAttendees 
}) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  useEffect(() => {
    if (!eventId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    getEventById(eventId)
      .then((data) => {
        if (mounted) {
          setEvent(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to fetch event details');
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [eventId]);

  if (!eventId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 my-8 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500 font-mono">
              GET /api/events/{eventId}...
            </p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Unable to Load Event</h3>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            {/* Header Banner */}
            <div className="relative h-60 sm:h-72 w-full bg-slate-900 flex-shrink-0">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-brand-600 text-white uppercase tracking-wider">
                    {event.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/20 backdrop-blur-md text-white">
                    {event.status || 'Active'}
                  </span>
                  <span className="font-mono text-[11px] text-slate-300">
                    ID: {event.id}
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-xl sm:text-3xl leading-snug drop-shadow-md">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Quick Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Date</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{event.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Time</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{event.startTime} - {event.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Venue</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block max-w-[170px]" title={event.venue}>
                      {event.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">About the Event</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              {event.highlights && (
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-2.5">Key Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/80 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Timeline */}
              {event.schedule && (
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-3">Event Schedule</h3>
                  <div className="space-y-2 border-l-2 border-brand-200 pl-4 ml-2">
                    {event.schedule.map((item, i) => (
                      <div key={i} className="relative group">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white" />
                        <span className="text-[11px] font-bold text-brand-600 block">{item.time}</span>
                        <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={event?.organizer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"}
                    alt={event?.organizer?.name || "Organizer"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">{event?.organizer?.name || "Campus Organizer"}</span>
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-xs text-slate-500">{event?.organizer?.department || "Student Activities"}</p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {event?.organizer?.email || "council@campus.edu"}
                    </span>
                  </div>
                </div>

                {/* Organizer Attendee Shortcut */}
                {(config.isOrganizer || event?.organizer?.isOwner) && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAttendees(event.id);
                    }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Attendee</span> List
                  </button>
                )}
              </div>

            </div>

            {/* Modal Bottom Sticky Action Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Registration Status</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {event.registeredCount} of {event.capacity} registered
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Close
                </button>

                {isRegistered ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You're Registered!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onRegisterClick(event);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                  >
                    <span>Register (POST /api/registrations)</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

