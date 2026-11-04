import {
  INITIAL_EVENTS,
  INITIAL_MY_REGISTRATIONS,
  INITIAL_EVENT_REGISTRATIONS
} from '../data/mockEvents';

// Local storage keys
const STORAGE_EVENTS_KEY = 'campusconnect_events_v1';
const STORAGE_MY_REGS_KEY = 'campusconnect_my_regs_v1';
const STORAGE_EVENT_REGS_KEY = 'campusconnect_event_regs_v1';
const STORAGE_CONFIG_KEY = 'campusconnect_api_config_v1';

const PROD_API_URL = 'https://campusconnect-z88h.onrender.com';
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Default configuration
const DEFAULT_CONFIG = {
  baseUrl: isLocalhost ? 'http://localhost:5001' : PROD_API_URL,
  useMock: false, // Default to Live Supabase API mode
  token: 'mock-bearer-token-student-alex',
  currentUserId: '4038c9b0-7160-4c45-a3cf-b595ed69cb42',
  currentUserName: 'Hemant Sharma',
  currentUserEmail: 'hemant.sharma@intellipaat.com',
  isOrganizer: true
};

// Retrieve config with auto-migration
export function getApiConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (!saved) return DEFAULT_CONFIG;
    const parsed = JSON.parse(saved);
    if (!isLocalhost && (parsed.baseUrl?.includes('localhost') || parsed.baseUrl?.includes('127.0.0.1'))) {
      parsed.baseUrl = PROD_API_URL;
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(parsed));
    } else if (parsed.baseUrl === 'http://localhost:5000') {
      parsed.baseUrl = 'http://localhost:5001';
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(parsed));
    }
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

// Save config
export function saveApiConfig(newConfig) {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(newConfig));
  window.dispatchEvent(new CustomEvent('campusconnect:config-updated', { detail: newConfig }));
}

// Initialize mock storage if not present
function initializeMockStorage() {
  if (!localStorage.getItem(STORAGE_EVENTS_KEY)) {
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_MY_REGS_KEY)) {
    localStorage.setItem(STORAGE_MY_REGS_KEY, JSON.stringify(INITIAL_MY_REGISTRATIONS));
  }
  if (!localStorage.getItem(STORAGE_EVENT_REGS_KEY)) {
    localStorage.setItem(STORAGE_EVENT_REGS_KEY, JSON.stringify(INITIAL_EVENT_REGISTRATIONS));
  }
}

initializeMockStorage();

// Helper for logging requests to UI listener
function logApiTransaction(method, endpoint, status, data, error = null) {
  const transaction = {
    id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toLocaleTimeString(),
    method,
    endpoint,
    status,
    data,
    error: error ? (error.message || String(error)) : null
  };
  window.dispatchEvent(new CustomEvent('campusconnect:api-log', { detail: transaction }));
  return transaction;
}

/**
 * 1. GET /api/events
 * Browse events with optional search, category, and date filtering
 */
export async function getEvents(filters = {}) {
  const config = getApiConfig();
  const endpoint = '/api/events';

  if (!config.useMock) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.set('category', filters.category);
      
      const url = `${config.baseUrl}${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch events`);
      }
      const data = await res.json();
      logApiTransaction('GET', endpoint, res.status, data);
      return data;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Real API failed, falling back to mock data:', err);
      // Fallback to mock on error so user UI never breaks
    }
  }

  // --- MOCK IMPLEMENTATION ---
  await new Promise((r) => setTimeout(r, 220)); // Realistic network latency
  const events = JSON.parse(localStorage.getItem(STORAGE_EVENTS_KEY) || '[]');
  
  let filtered = [...events];
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(e => e.category.toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.tagline.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  logApiTransaction('GET', endpoint, 200, filtered);
  return filtered;
}

/**
 * 2. GET /api/events/{id}
 * Fetch single event details by ID
 */
export async function getEventById(eventId) {
  const config = getApiConfig();
  const endpoint = `/api/events/${eventId}`;

  if (!config.useMock) {
    try {
      const url = `${config.baseUrl}${endpoint}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Event not found`);
      }
      const data = await res.json();
      logApiTransaction('GET', endpoint, res.status, data);
      return data;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Real API failed, falling back to mock data:', err);
    }
  }

  // --- MOCK IMPLEMENTATION ---
  await new Promise((r) => setTimeout(r, 180));
  const events = JSON.parse(localStorage.getItem(STORAGE_EVENTS_KEY) || '[]');
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    logApiTransaction('GET', endpoint, 404, null, new Error('Event not found'));
    throw new Error('Event not found');
  }

  logApiTransaction('GET', endpoint, 200, event);
  return event;
}

/**
 * 3. POST /api/registrations
 * Register current user for an event
 * Returns HTTP 201 Created on success
 * Returns HTTP 409 Conflict if already registered
 */
export async function createRegistration({ eventId, studentInfo = {} }) {
  const config = getApiConfig();
  const endpoint = '/api/registrations';

  if (!config.useMock) {
    try {
      const url = `${config.baseUrl}${endpoint}`;
      const payload = {
        eventId,
        studentId: studentInfo.studentId || 'CS2023-0491',
        name: studentInfo.name || config.currentUserName,
        email: studentInfo.email || config.currentUserEmail,
        department: studentInfo.department || 'Computer Science'
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json().catch(() => null);

      if (res.status === 409) {
        logApiTransaction('POST', endpoint, 409, responseData, new Error('Already registered for this event (HTTP 409)'));
        const err = new Error('Already registered for this event');
        err.status = 409;
        throw err;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${responseData?.message || 'Registration failed'}`);
      }

      logApiTransaction('POST', endpoint, 201, responseData);
      return { status: 201, data: responseData };
    } catch (err) {
      if (err.status === 409) throw err;
      logApiTransaction('POST', endpoint, 'ERR', null, err);
      console.warn('Real API failed, fallback to mock registration logic:', err);
    }
  }

  // --- MOCK IMPLEMENTATION ---
  await new Promise((r) => setTimeout(r, 300));
  const myRegistrations = JSON.parse(localStorage.getItem(STORAGE_MY_REGS_KEY) || '[]');

  // Check 409 Conflict: Already registered?
  const alreadyRegistered = myRegistrations.some(r => r.eventId === eventId);
  if (alreadyRegistered) {
    const conflictErr = new Error('Already registered for this event (409 Conflict)');
    conflictErr.status = 409;
    logApiTransaction('POST', endpoint, 409, { error: 'Conflict', message: conflictErr.message }, conflictErr);
    throw conflictErr;
  }

  // Find event
  const events = JSON.parse(localStorage.getItem(STORAGE_EVENTS_KEY) || '[]');
  const event = events.find(e => e.id === eventId);
  if (!event) {
    throw new Error('Target event does not exist');
  }

  const newTicketCode = 'CC-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
  const newRegistration = {
    registrationId: 'reg-' + Date.now(),
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventVenue: event.venue,
    registeredAt: new Date().toISOString(),
    userName: studentInfo.name || config.currentUserName,
    userEmail: studentInfo.email || config.currentUserEmail,
    studentId: studentInfo.studentId || 'CS2023-0491',
    ticketCode: newTicketCode,
    status: 'CONFIRMED',
    category: event.category
  };

  // 1. Update user's registrations
  myRegistrations.unshift(newRegistration);
  localStorage.setItem(STORAGE_MY_REGS_KEY, JSON.stringify(myRegistrations));

  // 2. Update event attendee count
  event.registeredCount = (event.registeredCount || 0) + 1;
  localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));

  // 3. Update organizer attendee list for this event
  const allEventRegs = JSON.parse(localStorage.getItem(STORAGE_EVENT_REGS_KEY) || '{}');
  if (!allEventRegs[eventId]) {
    allEventRegs[eventId] = [];
  }
  allEventRegs[eventId].unshift({
    registrationId: newRegistration.registrationId,
    userName: newRegistration.userName,
    userEmail: newRegistration.userEmail,
    studentId: newRegistration.studentId,
    ticketCode: newTicketCode,
    department: studentInfo.department || 'Computer Science',
    registeredAt: newRegistration.registeredAt,
    checkInStatus: 'Attending'
  });
  localStorage.setItem(STORAGE_EVENT_REGS_KEY, JSON.stringify(allEventRegs));

  logApiTransaction('POST', endpoint, 201, newRegistration);
  return { status: 201, data: newRegistration };
}

/**
 * 4. GET /api/me/registrations
 * Retrieve all event registrations for the logged in student
 */
export async function getMyRegistrations() {
  const config = getApiConfig();
  const endpoint = '/api/me/registrations';

  if (!config.useMock) {
    try {
      const url = `${config.baseUrl}${endpoint}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch user registrations`);
      }
      const data = await res.json();
      logApiTransaction('GET', endpoint, res.status, data);
      return data;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Real API failed, falling back to mock data:', err);
    }
  }

  // --- MOCK IMPLEMENTATION ---
  await new Promise((r) => setTimeout(r, 200));
  const myRegistrations = JSON.parse(localStorage.getItem(STORAGE_MY_REGS_KEY) || '[]');
  logApiTransaction('GET', endpoint, 200, myRegistrations);
  return myRegistrations;
}

/**
 * 5. GET /api/events/{id}/registrations
 * Attendee list for owning organizer only
 */
export async function getEventAttendees(eventId) {
  const config = getApiConfig();
  const endpoint = `/api/events/${eventId}/registrations`;

  if (!config.useMock) {
    try {
      const url = `${config.baseUrl}${endpoint}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.token}`
        }
      });

      if (res.status === 403) {
        const forbiddenErr = new Error('Forbidden: Owning organizer only (HTTP 403)');
        logApiTransaction('GET', endpoint, 403, null, forbiddenErr);
        throw forbiddenErr;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch attendee list`);
      }
      const data = await res.json();
      logApiTransaction('GET', endpoint, res.status, data);
      return data;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Real API failed, fallback to mock data:', err);
    }
  }

  // --- MOCK IMPLEMENTATION ---
  await new Promise((r) => setTimeout(r, 240));
  const events = JSON.parse(localStorage.getItem(STORAGE_EVENTS_KEY) || '[]');
  const event = events.find(e => e.id === eventId);

  // Check if current user is owner or organizer
  if (!config.isOrganizer && (!event || !event.organizer?.isOwner)) {
    const forbiddenErr = new Error('403 Forbidden: Attendee list is accessible to owning organizer only.');
    forbiddenErr.status = 403;
    logApiTransaction('GET', endpoint, 403, null, forbiddenErr);
    throw forbiddenErr;
  }

  const allEventRegs = JSON.parse(localStorage.getItem(STORAGE_EVENT_REGS_KEY) || '{}');
  const attendees = allEventRegs[eventId] || [];
  logApiTransaction('GET', endpoint, 200, attendees);
  return attendees;
}

/**
 * Reset mock data to original default
 */
export function resetMockData() {
  localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_MY_REGS_KEY, JSON.stringify(INITIAL_MY_REGISTRATIONS));
  localStorage.setItem(STORAGE_EVENT_REGS_KEY, JSON.stringify(INITIAL_EVENT_REGISTRATIONS));
  window.dispatchEvent(new CustomEvent('campusconnect:data-reset'));
}

