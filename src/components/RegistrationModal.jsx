import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  MapPin, 
  QrCode,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { createRegistration, getApiConfig } from '../services/api';

export default function RegistrationModal({ 
  event, 
  onClose, 
  onSuccess, 
  onNavigateToMyPasses 
}) {
  const config = getApiConfig();

  const [studentInfo, setStudentInfo] = useState({
    name: config.currentUserName || 'Alex Morgan',
    email: config.currentUserEmail || 'alex.morgan@campus.edu',
    studentId: 'CS2023-0491',
    department: 'Computer Science & Engineering'
  });

  const [loading, setLoading] = useState(false);
  const [createdPass, setCreatedPass] = useState(null);
  const [conflictError, setConflictError] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  if (!event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setConflictError(null);
    setGeneralError(null);

    try {
      const response = await createRegistration({
        eventId: event.id,
        studentInfo
      });

      if (response && response.status === 201) {
        setCreatedPass(response.data);
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err) {
      if (err.status === 409 || err.message?.includes('409') || err.message?.toLowerCase().includes('already registered')) {
        setConflictError(err.message || 'Already registered for this event (HTTP 409 Conflict)');
      } else {
        setGeneralError(err.message || 'Registration failed. Please check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. SUCCESS STATE: 201 Created */}
        {createdPass ? (
          <div className="p-6 sm:p-8 text-center animate-fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider font-mono">
              HTTP 201 Created
            </span>

            <h2 className="font-display font-bold text-2xl text-slate-900 mt-2">
              Registration Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your digital campus pass has been generated and linked to your student ID.
            </p>

            {/* Visual Digital Ticket Pass */}
            <div className="mt-6 text-left rounded-2xl bg-gradient-to-br from-slate-900 to-brand-950 text-white p-5 shadow-lg relative overflow-hidden border border-slate-800">
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300">
                    CampusConnect Student Pass
                  </span>
                  <h4 className="font-bold text-sm text-white mt-0.5 line-clamp-1">
                    {event.title}
                  </h4>
                </div>
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md">
                  <QrCode className="w-6 h-6 text-brand-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Attendee</span>
                  <span className="font-semibold text-white">{createdPass.userName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Student ID</span>
                  <span className="font-semibold text-white font-mono">{createdPass.studentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Event Date</span>
                  <span className="text-slate-200">{event.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Ticket Code</span>
                  <span className="font-mono text-brand-300 font-bold">{createdPass.ticketCode}</span>
                </div>
              </div>

              {/* Perforation line */}
              <div className="mt-4 pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>POST /api/registrations</span>
                <span className="text-emerald-400 font-bold">STATUS: 201 OK</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMyPasses();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View in My Passes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* 2. REGISTRATION FORM STATE */
          <div className="p-6 sm:p-7">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-accent-50 text-accent-700 border border-accent-200">
                POST /api/registrations
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              Register for Event
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant registration verification. Confirms student capacity.
            </p>

            {/* Event Summary Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1 text-xs">
                <span className="font-bold text-slate-900 line-clamp-1">{event.title}</span>
                <div className="flex items-center gap-1 text-slate-500 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            </div>

            {/* 409 Conflict Error Banner */}
            {conflictError && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 animate-shake">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>Conflict: Already Registered</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200/80 text-[10px] font-mono">
                        HTTP 409
                      </span>
                    </div>
                    <p className="text-amber-800 mt-1">
                      You already hold an active registration pass for this event. Duplicate entries are prevented.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToMyPasses();
                      }}
                      className="mt-2.5 inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800 underline"
                    >
                      View your existing ticket in My Passes &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* General Error Banner */}
            {generalError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {generalError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={studentInfo.studentId}
                    onChange={(e) => setStudentInfo({ ...studentInfo, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={studentInfo.department}
                    onChange={(e) => setStudentInfo({ ...studentInfo, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Email Address
                </label>
                <input
                  type="email"
                  required
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering (POST /api/registrations)...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Confirm & Issue Pass (201 / 409)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

