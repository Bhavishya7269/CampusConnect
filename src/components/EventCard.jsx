import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Tag
} from 'lucide-react';

export default function EventCard({ 
  event, 
  isRegistered, 
  onViewDetails, 
  onRegisterClick 
}) {
  const registeredCount = Number(event?.registeredCount) || 0;
  const capacity = Number(event?.capacity) || 100;
  const percentFull = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isAlmostFull = percentFull >= 85;
  const banner = event?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";
  const organizerName = event?.organizer?.name || "Campus Organizer";
  const organizerAvatar = event?.organizer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 card-hover-effect flex flex-col h-full group">
      
      {/* Banner & Tags */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 flex-shrink-0">
        <img
          src={banner}
          alt={event?.title || "Campus Event"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-slate-900 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            {event?.category || "Event"}
          </span>

          {isRegistered ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registered
            </span>
          ) : isAlmostFull ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              Filling Fast
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/70 text-white backdrop-blur-md">
              {event?.price || "Free"}
            </span>
          )}
        </div>

        {/* Date in Banner Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium drop-shadow">
            <Calendar className="w-3.5 h-3.5 text-brand-300" />
            <span>{event?.date || "Upcoming"}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-200 drop-shadow">
            <Clock className="w-3 h-3 text-brand-300" />
            <span>{event?.startTime || "10:00 AM"}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Organizer info */}
          <div className="flex items-center gap-2 mb-2.5">
            <img
              src={organizerAvatar}
              alt={organizerName}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-500 truncate">
              {organizerName}
            </span>
          </div>

          {/* Event Title */}
          <h3 
            onClick={() => onViewDetails(event?.id)}
            className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {event?.title || "Campus Event"}
          </h3>

          {/* Event Tagline */}
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {event?.tagline || event?.description || "Join us for this exciting campus event!"}
          </p>

          {/* Venue */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
            <span className="truncate">{event?.venue || "Main Campus Auditorium"}</span>
          </div>

          {/* Tags */}
          {event?.tags && event.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.tags.slice(0, 3).map((tag, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Capacity Meter & Footer CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          
          {/* Capacity Progress Bar */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-slate-400" />
                Spots Filled
              </span>
              <span className="font-semibold text-slate-700">
                {registeredCount} / {capacity} ({percentFull}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFull >= 95 ? 'bg-rose-500' : percentFull >= 80 ? 'bg-amber-500' : 'bg-brand-500'
                }`}
                style={{ width: `${percentFull}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onViewDetails(event?.id)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRegistered ? (
              <button
                onClick={() => onViewDetails(event?.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pass Issued</span>
              </button>
            ) : (
              <button
                onClick={() => onRegisterClick(event)}
                className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-1.5"
              >
                <span>RSVP / Pass</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

