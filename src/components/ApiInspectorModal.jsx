import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  ExternalLink, 
  Terminal, 
  Play, 
  Sparkles,
  Database
} from 'lucide-react';
import { 
  getApiConfig, 
  saveApiConfig, 
  resetMockData, 
  getEvents, 
  getEventById, 
  getMyRegistrations, 
  getEventAttendees, 
  createRegistration 
} from '../services/api';

const ENDPOINTS_SPEC = [
  {
    method: 'GET',
    endpoint: '/api/events',
    description: 'Browse events.',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    method: 'GET',
    endpoint: '/api/events/{id}',
    description: 'Event details.',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    method: 'POST',
    endpoint: '/api/registrations',
    description: 'Create registration, 201 or 409.',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    method: 'GET',
    endpoint: '/api/me/registrations',
    description: "Current user's registrations.",
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    method: 'GET',
    endpoint: '/api/events/{id}/registrations',
    description: 'Attendee list, owning organizer only.',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  }
];

export default function ApiInspectorModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getApiConfig());
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [testingEndpoint, setTestingEndpoint] = useState(null);

  useEffect(() => {
    const handleLog = (e) => {
      setLogs((prev) => [e.detail, ...prev.slice(0, 30)]);
    };
    window.addEventListener('campusconnect:api-log', handleLog);
    return () => window.removeEventListener('campusconnect:api-log', handleLog);
  }, []);

  if (!isOpen) return null;

  const handleToggleMock = () => {
    const updated = { ...config, useMock: !config.useMock };
    saveApiConfig(updated);
    setConfig(updated);
  };

  const handleBaseUrlChange = (e) => {
    const updated = { ...config, baseUrl: e.target.value };
    saveApiConfig(updated);
    setConfig(updated);
  };

  const handleResetData = () => {
    resetMockData();
    alert('Mock data has been successfully reset to initial states.');
  };

  const executeEndpointTest = async (spec) => {
    setTestingEndpoint(spec.endpoint);
    setTestResult(null);

    try {
      let res;
      if (spec.endpoint === '/api/events') {
        res = await getEvents();
      } else if (spec.endpoint === '/api/events/{id}') {
        res = await getEventById('evt-101');
      } else if (spec.endpoint === '/api/registrations') {
        res = await createRegistration({ eventId: 'evt-104', studentInfo: { name: 'Test Runner' } });
      } else if (spec.endpoint === '/api/me/registrations') {
        res = await getMyRegistrations();
      } else if (spec.endpoint === '/api/events/{id}/registrations') {
        res = await getEventAttendees('evt-101');
      }
      setTestResult({
        endpoint: spec.endpoint,
        success: true,
        data: res
      });
    } catch (err) {
      setTestResult({
        endpoint: spec.endpoint,
        success: false,
        error: err.message,
        status: err.status
      });
    } finally {
      setTestingEndpoint(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                API Endpoints & Integration Inspector
              </h2>
              <p className="text-xs text-slate-500">
                Directly matches the specified CampusConnect backend specification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Mode Switch & Base URL config */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                API Operating Mode: {config.useMock ? 'Interactive Mock Engine' : 'Live Backend Server'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {config.useMock 
                  ? 'Currently simulating realistic campus events with full state persistence, 201/409 codes, and organizer logic.' 
                  : `Connecting real HTTP requests to ${config.baseUrl}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMock}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                  config.useMock 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {config.useMock ? 'Switch to Live Backend' : 'Switch to Mock Data'}
              </button>

              <button
                onClick={handleResetData}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                title="Reset mock storage"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Backend URL Input if live mode */}
          {!config.useMock && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <label className="block font-bold text-slate-800 mb-1">
                Backend Base URL (CORS enabled)
              </label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={handleBaseUrlChange}
                placeholder="http://localhost:5001"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Endpoints will call: {config.baseUrl}/api/...
              </span>
            </div>
          )}

          {/* Table from User Prompt Specification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-600" />
                Required API Endpoints Specification
              </h3>
              <span className="text-xs text-slate-400">Click &ldquo;Test&rdquo; to simulate live invocation</span>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/80 text-purple-900 font-bold border-b border-purple-100">
                  <tr>
                    <th className="py-3 px-4 w-24">Method</th>
                    <th className="py-3 px-4 font-mono">Endpoint</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Quick Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {ENDPOINTS_SPEC.map((spec, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${spec.color}`}>
                          {spec.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-accent-600 text-xs sm:text-sm">
                        {spec.endpoint}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {spec.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => executeEndpointTest(spec)}
                          disabled={testingEndpoint === spec.endpoint}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5" />
                          <span>{testingEndpoint === spec.endpoint ? 'Calling...' : 'Test'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Execution Output Box */}
          {testResult && (
            <div className={`p-4 rounded-2xl border text-xs font-mono ${
              testResult.success 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center justify-between font-bold pb-2 border-b border-current/20 mb-2">
                <span>Result for: {testResult.endpoint}</span>
                <span>{testResult.success ? 'HTTP 200 / 201 OK' : `ERROR (${testResult.status || 'Failed'})`}</span>
              </div>
              <pre className="text-[11px] overflow-x-auto max-h-40 bg-white/70 p-2.5 rounded-xl border border-current/10">
                {JSON.stringify(testResult.success ? testResult.data : testResult.error, null, 2)}
              </pre>
            </div>
          )}

          {/* Live Activity Log */}
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-600" />
              Live Network Activity Log
            </h3>
            <div className="rounded-2xl bg-slate-950 text-slate-300 p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 shadow-inner">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-2">No API calls recorded yet. Interact with the application to see live logs.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      <span className={`font-bold ${log.method === 'POST' ? 'text-purple-400' : 'text-indigo-400'}`}>
                        {log.method}
                      </span>
                      <span className="text-amber-300 truncate">{log.endpoint}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                      log.status === 200 || log.status === 201
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : log.status === 409
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Current User: <strong className="text-slate-800">{config.currentUserName}</strong> ({config.currentUserEmail})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

