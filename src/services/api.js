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

// Target workshop backend
export const WORKSHOP_API_URL = 'https://hello-world-workshop.onrender.com';
export const CAMPUSCONNECT_PROD_URL = 'https://campusconnect-z88h.onrender.com';

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

// Default configuration connected to workshop backend
export const DEFAULT_CONFIG = {
  // On localhost, use relative empty string so Vite dev server proxies /api to avoid CORS
  baseUrl: isLocalhost ? '' : WORKSHOP_API_URL,
  useMock: false,
  token: 'mock-bearer-token-student-alex',
  currentUserId: 'afe3e3e8-1da8-4994-ad64-204224881b51', // Hemant Sharma on hello-world-workshop
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
    
    // Auto-update legacy ports/URLs
    if (isLocalhost) {
      parsed.baseUrl = '';
    } else if (!parsed.baseUrl || parsed.baseUrl.includes('localhost') || parsed.baseUrl.includes('5000') || parsed.baseUrl.includes('5001')) {
      parsed.baseUrl = WORKSHOP_API_URL;
    }
    
    // Always enforce useMock: false and target current workshop backend
    parsed.useMock = false;
    if (!parsed.currentUserId || parsed.currentUserId === '4038c9b0-7160-4c45-a3cf-b595ed69cb42') {
      parsed.currentUserId = 'afe3e3e8-1da8-4994-ad64-204224881b51';
      parsed.currentUserName = 'Hemant Sharma';
      parsed.currentUserEmail = 'hemant.sharma@intellipaat.com';
    }

    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(parsed));
    return { ...DEFAULT_CONFIG, ...parsed, useMock: false };
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

// Save config
export function saveApiConfig(newConfig) {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(newConfig));
  window.dispatchEvent(new CustomEvent('campusconnect:config-updated', { detail: newConfig }));
}

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

// Normalizer to format raw backend events into rich UI event objects
export function normalizeEvent(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  const id = String(raw.id || '');
  const title = String(raw.title || 'Campus Event');
  const titleLower = title.toLowerCase();

  // Parse ISO timestamp into human-readable date & time
  let dateStr = raw.date;
  let timeStr = raw.startTime;
  if (!dateStr && raw.timestamp) {
    try {
      const d = new Date(raw.timestamp);
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    } catch (e) {
      // fallback
    }
  }
  if (!dateStr) dateStr = 'Nov 15, 2026';
  if (!timeStr) timeStr = '10:00 AM';

  // Determine category
  let category = raw.category;
  if (!category) {
    if (titleLower.includes('hack')) category = 'Hackathon';
    else if (titleLower.includes('seminar')) category = 'Seminar';
    else if (titleLower.includes('summit')) category = 'Summit';
    else if (titleLower.includes('meetup')) category = 'Meetup';
    else if (titleLower.includes('night') || titleLower.includes('social') || titleLower.includes('frequencies')) category = 'Social & Tech';
    else if (titleLower.includes('robot') || titleLower.includes('line follower')) category = 'Robotics';
    else if (titleLower.includes('design') || titleLower.includes('studio') || titleLower.includes('creative') || titleLower.includes('retrospective')) category = 'Design & Arts';
    else if (titleLower.includes('api') || titleLower.includes('python') || titleLower.includes('flask') || titleLower.includes('code')) category = 'Coding';
    else if (titleLower.includes('ai') || titleLower.includes('agent') || titleLower.includes('machine')) category = 'Tech & AI';
    else category = 'Workshop';
  }

  // Curated banner photos based on category
  const categoryBanners = {
    'Tech & AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
    'Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    'Robotics': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    'Design & Arts': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    'Coding': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    'Seminar': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
    'Summit': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    'Social & Tech': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    'Workshop': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80'
  };

  const bannerUrl = raw.bannerUrl || categoryBanners[category] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';

  return {
    id,
    title,
    tagline: raw.tagline || `Join fellow students for ${title}. Hands-on session with industry leads.`,
    category,
    date: dateStr,
    startTime: timeStr,
    endTime: raw.endTime || '04:30 PM',
    venue: raw.venue || 'Main Innovation Hub & Computing Lab',
    isOnline: Boolean(raw.isOnline),
    bannerUrl,
    description: raw.description || `Immerse yourself in ${title}. Collaborate on practical applications, network with student engineers, and build real portfolio-ready artifacts.`,
    highlights: Array.isArray(raw.highlights) && raw.highlights.length ? raw.highlights : [
      'Official Certificate of Participation',
      'Hands-on interactive guided workshop exercises',
      'Direct networking with mentors and alumni',
      'Free snacks, energy drinks, and official swag kit'
    ],
    schedule: Array.isArray(raw.schedule) && raw.schedule.length ? raw.schedule : [
      { time: timeStr, title: 'Check-in & Welcome Keynote' },
      { time: '01:00 PM', title: 'Hands-on Main Workshop Session' },
      { time: '03:30 PM', title: 'Live Demonstrations & Q&A' },
      { time: '04:30 PM', title: 'Certificates & Wrap-up' }
    ],
    capacity: Number(raw.capacity) || 100,
    registeredCount: Number(raw.registeredCount) || 0,
    price: raw.price || 'Free',
    status: raw.status || 'active',
    tags: Array.isArray(raw.tags) && raw.tags.length ? raw.tags : [category, 'Campus', 'Technology', 'Community'],
    organizer: raw.organizer && typeof raw.organizer === 'object' ? raw.organizer : {
      id: raw.organiser_id || 'afe3e3e8-1da8-4994-ad64-204224881b51',
      name: 'Hemant Sharma',
      department: 'Lead Organizer · Campus Council',
      email: 'hemant.sharma@intellipaat.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      isOwner: true
    },
    organiser_id: raw.organiser_id,
    organizer_id: raw.organiser_id
  };
}

// Resilient fetch wrapper with CORS fallback
async function fetchBackend(endpoint, options = {}) {
  const config = getApiConfig();
  const base = config.baseUrl;
  const primaryUrl = `${base}${endpoint}`;

  const defaultHeaders = {
    'Accept': 'application/json',
    'X-User-Id': config.currentUserId,
    'Authorization': `Bearer ${config.token}`
  };

  try {
    const res = await fetch(primaryUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });
    return res;
  } catch (err) {
    // If running in browser and direct workshop backend had CORS restriction, route via campusconnect proxy
    if (!isLocalhost && base !== CAMPUSCONNECT_PROD_URL) {
      try {
        const proxyUrl = `${CAMPUSCONNECT_PROD_URL}${endpoint}`;
        return await fetch(proxyUrl, {
          ...options,
          headers: {
            ...defaultHeaders,
            ...(options.headers || {})
          }
        });
      } catch (proxyErr) {
        throw err;
      }
    }
    throw err;
  }
}

/**
 * 1. GET /api/events
 * Browse events from the connected backend
 */
export async function getEvents(filters = {}) {
  const config = getApiConfig();
  const endpoint = '/api/events';

  if (!config.useMock) {
    try {
      const res = await fetchBackend(endpoint);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch events from backend`);
      }
      const rawEvents = await res.json();
      
      let events = Array.isArray(rawEvents) ? rawEvents.map(normalizeEvent) : [];

      // Client-side filtering for category & search
      if (filters.category && filters.category !== 'All') {
        events = events.filter(e => e.category?.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        events = events.filter(e =>
          e.title?.toLowerCase().includes(q) ||
          e.tagline?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
        );
      }

      logApiTransaction('GET', endpoint, res.status, events);
      return events;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Backend fetch failed, falling back to cached events:', err);
    }
  }

  // Fallback to local storage
  const local = JSON.parse(localStorage.getItem(STORAGE_EVENTS_KEY) || '[]');
  logApiTransaction('GET', endpoint, 200, local);
  return local;
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
      const res = await fetchBackend(endpoint);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Event not found`);
      }
      const data = await res.json();
      const normalized = normalizeEvent(data);
      logApiTransaction('GET', endpoint, res.status, normalized);
      return normalized;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Real API failed for event by id, checking cached list:', err);
    }
  }

  const events = JSON.parse(localStorage.getItem(STORAGE_EVENTS_KEY) || '[]');
  const found = events.find(e => String(e.id) === String(eventId));
  if (!found) {
    throw new Error('Event not found');
  }
  return normalizeEvent(found);
}

/**
 * 3. POST /api/registrations
 * Register current student for an event
 */
export async function createRegistration({ eventId, studentInfo = {} }) {
  const config = getApiConfig();
  const endpoint = '/api/registrations';

  if (!config.useMock) {
    try {
      const payload = {
        event_id: eventId,
        eventId: eventId,
        studentId: studentInfo.studentId || 'CS2023-0491',
        name: studentInfo.name || config.currentUserName,
        email: studentInfo.email || config.currentUserEmail,
        department: studentInfo.department || 'Computer Science'
      };

      const res = await fetchBackend(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json().catch(() => null);

      if (res.status === 409) {
        const err = new Error('Already registered for this event');
        err.status = 409;
        logApiTransaction('POST', endpoint, 409, responseData, err);
        throw err;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${responseData?.error || responseData?.message || 'Registration failed'}`);
      }

      const pass = {
        registrationId: responseData?.id || 'reg-' + Date.now(),
        eventId,
        eventTitle: studentInfo.eventTitle || 'Campus Event',
        ticketCode: 'CC-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        registeredAt: new Date().toISOString(),
        userName: studentInfo.name || config.currentUserName,
        userEmail: studentInfo.email || config.currentUserEmail,
        status: 'CONFIRMED'
      };

      logApiTransaction('POST', endpoint, res.status, pass);
      return { status: 201, data: pass };
    } catch (err) {
      if (err.status === 409) throw err;
      logApiTransaction('POST', endpoint, 'ERR', null, err);
      console.warn('Real registration API failed, saving locally:', err);
    }
  }

  // Local fallback
  const myRegistrations = JSON.parse(localStorage.getItem(STORAGE_MY_REGS_KEY) || '[]');
  const already = myRegistrations.some(r => String(r.eventId) === String(eventId));
  if (already) {
    const conflict = new Error('Already registered for this event (409 Conflict)');
    conflict.status = 409;
    throw conflict;
  }

  const pass = {
    registrationId: 'reg-' + Date.now(),
    eventId,
    eventTitle: studentInfo.eventTitle || 'Campus Event',
    ticketCode: 'CC-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    registeredAt: new Date().toISOString(),
    userName: studentInfo.name || config.currentUserName,
    userEmail: studentInfo.email || config.currentUserEmail,
    status: 'CONFIRMED'
  };

  myRegistrations.unshift(pass);
  localStorage.setItem(STORAGE_MY_REGS_KEY, JSON.stringify(myRegistrations));
  return { status: 201, data: pass };
}

/**
 * 4. GET /api/me/registrations
 * Retrieve all registrations for current student
 */
export async function getMyRegistrations() {
  const config = getApiConfig();
  const endpoint = '/api/me/registrations';

  if (!config.useMock) {
    try {
      const res = await fetchBackend(endpoint);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch registrations`);
      }
      const rawRegs = await res.json();
      
      // If array of raw registrations, map to UI ticket format
      const formatted = Array.isArray(rawRegs) ? rawRegs.map(r => ({
        registrationId: r.id || `reg-${Math.random()}`,
        eventId: r.event_id || r.eventId,
        eventTitle: r.events?.title || r.eventTitle || 'Campus Event Pass',
        eventDate: r.events?.date || r.eventDate || 'Upcoming',
        eventVenue: r.events?.venue || r.eventVenue || 'Campus Auditorium',
        ticketCode: r.ticket_code || ('CC-' + String(r.id || '').substring(0, 6).toUpperCase()),
        registeredAt: r.createdAt || r.created_at || new Date().toISOString(),
        userName: config.currentUserName,
        userEmail: config.currentUserEmail,
        status: 'CONFIRMED',
        category: r.events?.category || 'Workshop'
      })) : [];

      logApiTransaction('GET', endpoint, res.status, formatted);
      return formatted;
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Real API failed for user registrations:', err);
    }
  }

  const myRegistrations = JSON.parse(localStorage.getItem(STORAGE_MY_REGS_KEY) || '[]');
  return myRegistrations;
}

/**
 * 5. GET /api/events/{id}/registrations
 * Attendee roster for organizer
 */
export async function getEventAttendees(eventId) {
  const config = getApiConfig();
  const endpoint = `/api/events/${eventId}/registrations`;

  if (!config.useMock) {
    try {
      const res = await fetchBackend(endpoint);
      if (res.status === 403) {
        const forbidden = new Error('Forbidden: Owning organizer only (HTTP 403)');
        forbidden.status = 403;
        logApiTransaction('GET', endpoint, 403, null, forbidden);
        throw forbidden;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch attendee list`);
      }
      const data = await res.json();
      logApiTransaction('GET', endpoint, res.status, data);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      logApiTransaction('GET', endpoint, 'ERR', null, err);
      console.warn('Failed to load attendees:', err);
    }
  }

  const allEventRegs = JSON.parse(localStorage.getItem(STORAGE_EVENT_REGS_KEY) || '{}');
  return allEventRegs[eventId] || [];
}

/**
 * Reset local storage
 */
export function resetMockData() {
  localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_MY_REGS_KEY, JSON.stringify(INITIAL_MY_REGISTRATIONS));
  localStorage.setItem(STORAGE_EVENT_REGS_KEY, JSON.stringify(INITIAL_EVENT_REGISTRATIONS));
  window.dispatchEvent(new CustomEvent('campusconnect:data-reset'));
}
