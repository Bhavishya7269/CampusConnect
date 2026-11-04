import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  QrCode, 
  Download, 
  Share2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { getMyRegistrations } from '../services/api';

export default function MyRegistrationsView({ 
  onExploreEvents, 
  onViewEventDetails 
}) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await getMyRegistrations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load my registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();

    const handleUpdate = () => fetchRegistrations();
    window.addEventListener('campusconnect:data-reset', handleUpdate);
    return () => window.removeEventListener('campusconnect:data-reset', handleUpdate);
  }, []);

  const handleDownloadTicket = (regId) => {
    setDownloadSuccessId(regId);
    setTimeout(() => setDownloadSuccessId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
              GET /api/me/registrations
            </span>
            <span className="text-xs text-slate-400">&bull; Current Student Passes</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            My Registered Passes ({registrations.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Present your QR ticket barcode at the venue gates for instant student check-in.
          </p>
        </div>

        <button
          onClick={fetchRegistrations}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Passes</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-slate-500">Calling GET /api/me/registrations...</p>
        </div>
      ) : registrations.length === 0 ? (
        /* Empty State */
        <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">No Passes Registered Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            You haven't reserved admission to any campus events yet. Explore upcoming hackathons, masterclasses, and sports matches.
          </p>
          <button
            onClick={onExploreEvents}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all"
          >
            <span>Browse Event Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Passes Grid */
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div 
              key={reg.registrationId}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Ticket Top Half */}
              <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 backdrop-blur-md text-brand-200 uppercase tracking-wider mb-2">
                      {reg.category || 'Campus Pass'}
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white line-clamp-1">
                      {reg.eventTitle}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-7 h-7 text-brand-200" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-300 flex-shrink-0" />
                    <span className="text-slate-200">{reg.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-brand-300 flex-shrink-0" />
                    <span className="text-slate-200 truncate">{reg.eventVenue}</span>
                  </div>
                </div>
              </div>

              {/* Perforated Stub Connector */}
              <div className="relative h-4 bg-slate-100 flex items-center justify-between px-4">
                <div className="w-4 h-4 rounded-full bg-slate-50 -ml-6 border border-slate-200" />
                <div className="border-b border-dashed border-slate-300 w-full mx-2" />
                <div className="w-4 h-4 rounded-full bg-slate-50 -mr-6 border border-slate-200" />
              </div>

              {/* Ticket Bottom Stub */}
              <div className="p-5 bg-white space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Attendee</span>
                    <span className="font-bold text-slate-800">{reg.userName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Ticket Code</span>
                    <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {reg.ticketCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {reg.status || 'Active'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => onViewEventDetails(reg.eventId)}
                    className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1 transition-colors"
                  >
                    <span>View Event Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleDownloadTicket(reg.registrationId)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>{downloadSuccessId === reg.registrationId ? 'Pass Saved!' : 'Save Pass'}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

