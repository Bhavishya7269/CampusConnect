import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { getEvents, getEventAttendees, getApiConfig, saveApiConfig } from '../services/api';

export default function OrganizerDashboard({ onSelectEventId }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('evt-101');
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [config, setConfig] = useState(getApiConfig());

  // Load events
  useEffect(() => {
    getEvents().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
        if (!selectedEventId) {
          setSelectedEventId(data[0].id);
        }
      }
    });
  }, []);

  // Fetch attendees for selected event
  const fetchAttendees = async (evtId) => {
    if (!evtId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEventAttendees(evtId);
      setAttendees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load attendees');
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees(selectedEventId);
  }, [selectedEventId]);

  const toggleOrganizerPermission = () => {
    const updated = { ...config, isOrganizer: !config.isOrganizer };
    saveApiConfig(updated);
    setConfig(updated);
    fetchAttendees(selectedEventId);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Filter attendees
  const filteredAttendees = attendees.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      a.userName?.toLowerCase().includes(q) ||
      a.userEmail?.toLowerCase().includes(q) ||
      a.studentId?.toLowerCase().includes(q) ||
      a.ticketCode?.toLowerCase().includes(q) ||
      a.department?.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'All' || a.checkInStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Registration ID', 'Student Name', 'Email', 'Student ID', 'Department', 'Ticket Code', 'Check-In Status', 'Registered At'];
    const rows = filteredAttendees.map(a => [
      a.registrationId,
      a.userName,
      a.userEmail,
      a.studentId,
      a.department,
      a.ticketCode,
      a.checkInStatus,
      a.registeredAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendees_${selectedEventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
              GET /api/events/&#123;id&#125;/registrations
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Attendee list &bull; Owning organizer only
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Organizer Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time attendee rosters, gate check-in verification, and student credentials.
          </p>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleOrganizerPermission}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              config.isOrganizer 
                ? 'bg-purple-50 text-purple-700 border-purple-200' 
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title="Toggle between authorized owning organizer and standard student to test HTTP 403 Forbidden"
          >
            {config.isOrganizer ? (
              <>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Organizer Verified</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Simulate Forbidden (403)</span>
              </>
            )}
          </button>

          <button
            onClick={() => fetchAttendees(selectedEventId)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
            title="Refresh Attendee List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Event Selector Ribbon */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
          Select Event:
        </span>
        {events.map((evt) => (
          <button
            key={evt.id}
            onClick={() => setSelectedEventId(evt.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold transition-all border ${
              selectedEventId === evt.id
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {evt.title}
          </button>
        ))}
      </div>

      {/* 403 Forbidden Alert State */}
      {error && error.includes('403') ? (
        <div className="mt-8 p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-200 text-rose-800">
            HTTP 403 Forbidden
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900 mt-2">
            Organizer Credentials Required
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            `GET /api/events/{selectedEventId}/registrations` is restricted to the verified owning organizer of this event.
          </p>
          <button
            onClick={toggleOrganizerPermission}
            className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-all"
          >
            Switch to Owning Organizer Role
          </button>
        </div>
      ) : (
        <>
          {/* Selected Event Metrics Card */}
          {selectedEvent && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Registrations
                </span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {attendees.length}
                </span>
                <span className="text-xs text-brand-600 font-medium">
                  {Math.round((attendees.length / (selectedEvent.capacity || 100)) * 100)}% capacity filled
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Confirmed Attending
                </span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  {attendees.filter(a => a.checkInStatus === 'Attending').length}
                </span>
                <span className="text-xs text-slate-500">Student verified</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Max Capacity
                </span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {selectedEvent.capacity}
                </span>
                <span className="text-xs text-slate-500">{selectedEvent.venue}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Host Department
                  </span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                    {selectedEvent.organizer?.name}
                  </span>
                </div>
                <button
                  onClick={exportCSV}
                  disabled={filteredAttendees.length === 0}
                  className="mt-2 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* Attendee Roster Controls */}
          <div className="mt-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Attendee */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, ID, ticket code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Attending">Attending</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Student Attendee</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Ticket Pass Code</th>
                    <th className="py-3 px-4">Registered Time</th>
                    <th className="py-3 px-4">Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading attendee list...
                      </td>
                    </tr>
                  ) : filteredAttendees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No attendees found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendees.map((att) => (
                      <tr key={att.registrationId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{att.userName}</div>
                          <div className="text-[11px] text-slate-400">{att.userEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                          {att.studentId}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {att.department}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-brand-600">
                          <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-200">
                            {att.ticketCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(att.registeredAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            att.checkInStatus === 'Attending'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <CheckCircle className="w-3 h-3" />
                            {att.checkInStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Showing {filteredAttendees.length} verified attendees</span>
              <span className="text-purple-700 font-semibold">GET /api/events/{selectedEventId}/registrations</span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

