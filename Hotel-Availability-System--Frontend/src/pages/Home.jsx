import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useHotels } from '../hooks/useHotels';
import { Link, useNavigate } from 'react-router-dom';
import CalendarPicker, { toDateInput, formatDisplay } from '../components/CalendarPicker/CalendarPicker';
import { EVENT_TYPES } from '../lib/eventTypes';
import { AMENITIES } from '../lib/amenities';
import { TRAVEL_PURPOSES } from '../lib/travelPurposes';
import './Home.css';

const ratings = [1, 2, 3, 4, 5];

const destinations = [
  { name: 'Mirissa', count: '23 Hotels', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=262&h=440&fit=crop' },
  { name: 'Colombo', count: '156 Hotels', image: 'https://images.unsplash.com/photo-1586269648864-47a8b810f2a8?w=262&h=440&fit=crop' },
  { name: 'Ella', count: '198 Hotels', image: 'https://images.unsplash.com/photo-1596397042349-2c0d9a9d4e9a?w=262&h=440&fit=crop' },
  { name: 'Mirissa', count: '142 Hotels', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=262&h=440&fit=crop' },
];

const testimonials = [
  { name: 'Sarah Johnson', location: 'London, UK', text: 'The booking experience was seamless and the hotel recommendations were perfect for our honeymoon. Absolutely loved every moment!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop' },
  { name: 'Michael Chen', location: 'Singapore', text: 'Found the perfect business hotel with all the amenities I needed. The smart filters made it so easy to narrow down exactly what I was looking for.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' },
  { name: 'Emma Rodriguez', location: 'Barcelona, Spain', text: 'Incredible luxury stays at competitive prices. The platform is intuitive and the hotel quality exceeded all my expectations!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop' },
];

function StarRating() {
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#F5A623">
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <div className="hotel-card-image">
        <img src={hotel.image} alt={hotel.name} />
        <div className="hotel-card-rating">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
          </svg>
          <span>{hotel.rating}</span>
        </div>
        <div className="hotel-card-location">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.33">
            <path d="M8 1.33c-2.21 0-4 1.79-4 4 0 3 4 7.34 4 7.34s4-4.34 4-7.34c0-2.21-1.79-4-4-4z" />
            <circle cx="8" cy="5.33" r="1.33" fill="white" />
          </svg>
          <span>{hotel.location}</span>
        </div>
      </div>
      <div className="hotel-card-body">
        <h3 className="hotel-card-name">{hotel.name}</h3>
        <p className="hotel-card-desc">{hotel.desc}</p>
        <div className="hotel-card-tags">
          {hotel.tags.map(tag => (
            <span key={tag} className="hotel-tag">{tag}</span>
          ))}
          <span className="hotel-tag hotel-tag-more">+2 more</span>
        </div>
        <div className="hotel-card-footer">
          <span className="hotel-reviews">{hotel.reviews} reviews</span>
          <div className="hotel-price">
            <span className="hotel-price-from">From</span>
            <span className="hotel-price-amount">${hotel.price}<span className="hotel-price-night">/night</span></span>
          </div>
        </div>
        <Link to={`/hotel/${hotel.id}`} className="hotel-card-btn">View Details</Link>
      </div>
    </div>
  );
}

function DestinationCard({ dest }) {
  return (
    <div className="dest-card">
      <div className="dest-card-image" style={{ backgroundImage: `url(${dest.image})` }} />
      <div className="dest-card-overlay" />
      <div className="dest-card-content">
        <h3 className="dest-card-name">{dest.name}</h3>
        <span className="dest-card-count">{dest.count}</span>
      </div>
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="testimonial-card">
      <StarRating />
      <p className="testimonial-text">{t.text}</p>
      <div className="testimonial-author">
        <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
        <div>
          <h4 className="testimonial-name">{t.name}</h4>
          <span className="testimonial-location">{t.location}</span>
        </div>
      </div>
    </div>
  );
}

const purposes = TRAVEL_PURPOSES;

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: hotels = [] } = useHotels();
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings', 'user-home'],
    queryFn: () => bookingsAPI.listUser().then(r => r.data.bookings || []),
    enabled: !!user,
  });

  // Search bar state
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  // Overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const [ovLocation, setOvLocation] = useState('');
  const [ovCheckIn, setOvCheckIn] = useState('');
  const [ovCheckOut, setOvCheckOut] = useState('');
  const [ovGuests, setOvGuests] = useState(2);
  const [ovRooms, setOvRooms] = useState(1);
  const [ovRating, setOvRating] = useState(null);
  const [ovPurpose, setOvPurpose] = useState(null);
  const [ovEvent, setOvEvent] = useState(null);
  const [ovAmenity, setOvAmenity] = useState(null);
  const [ovMinPrice, setOvMinPrice] = useState('');
  const [ovMaxPrice, setOvMaxPrice] = useState('');

  const activeFilterCount = [
    ovLocation, ovCheckIn, ovCheckOut, ovMinPrice, ovMaxPrice, ovRating, ovPurpose, ovEvent, ovAmenity,
  ].filter(Boolean).length;

  const minPriceVal = ovMinPrice ? Math.min(Number(ovMinPrice), PRICE_MAX) : PRICE_MIN;
  const maxPriceVal = ovMaxPrice ? Math.max(Number(ovMaxPrice), PRICE_MIN) : PRICE_MAX;

  const handleReset = () => {
    setOvLocation('');
    setOvCheckIn('');
    setOvCheckOut('');
    setOvGuests(2);
    setOvRooms(1);
    setOvMinPrice('');
    setOvMaxPrice('');
    setOvRating(null);
    setOvPurpose(null);
    setOvEvent(null);
    setOvAmenity(null);
    setCalOpen(null);
  };

  const handleMinSlider = (e) => {
    const v = Number(e.target.value);
    setOvMinPrice(String(v));
    if (ovMaxPrice && v > Number(ovMaxPrice)) setOvMaxPrice(String(v));
  };

  const handleMaxSlider = (e) => {
    const v = Number(e.target.value);
    setOvMaxPrice(String(v));
    if (ovMinPrice && v < Number(ovMinPrice)) setOvMinPrice(String(v));
  };

  const handleMinPriceInput = (e) => {
    const v = e.target.value;
    setOvMinPrice(v);
    if (ovMaxPrice && v && Number(v) > Number(ovMaxPrice)) setOvMaxPrice(v);
  };

  const handleMaxPriceInput = (e) => {
    const v = e.target.value;
    setOvMaxPrice(v);
    if (ovMinPrice && v && Number(v) < Number(ovMinPrice)) setOvMinPrice(v);
  };

  // Calendar popup state
  const [calOpen, setCalOpen] = useState(null); // 'in' | 'out' | null
  const inFieldRef = useRef(null);
  const outFieldRef = useRef(null);

  useEffect(() => {
    if (!calOpen) return;
    const handleMouseDown = (e) => {
      const field = calOpen === 'in' ? inFieldRef.current : outFieldRef.current;
      if (field && !field.contains(e.target)) setCalOpen(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [calOpen]);

  // Escape closes overlay + body scroll lock while open
  useEffect(() => {
    if (!showOverlay) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowOverlay(false);
        setCalOpen(null);
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showOverlay]);

  const displayHotels = (hotels || []).map(h => ({
    id: h.id,
    name: h.name,
    location: h.location || h.city || '',
    desc: h.description || '',
    price: h.min_room_price || 0,
    rating: h.rating || 0,
    reviews: h.total_reviews || 0,
    image: h.image || '',
    tags: h.amenities ? h.amenities.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3) : [],
  }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('check_in', checkIn);
    if (checkOut) params.set('check_out', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  const openOverlay = () => {
    setOvLocation(location);
    setOvCheckIn(checkIn);
    setOvCheckOut(checkOut);
    setOvGuests(guests);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setCalOpen(null);
  };

  const handleOverlaySearch = () => {
    setLocation(ovLocation);
    setCheckIn(ovCheckIn);
    setCheckOut(ovCheckOut);
    setGuests(ovGuests);
    setShowOverlay(false);

    const params = new URLSearchParams();
    if (ovLocation) params.set('location', ovLocation);
    if (ovCheckIn) params.set('check_in', ovCheckIn);
    if (ovCheckOut) params.set('check_out', ovCheckOut);
    if (ovGuests) params.set('guests', ovGuests);
    if (ovRooms) params.set('rooms', ovRooms);
    if (ovMinPrice) params.set('min_price', ovMinPrice);
    if (ovMaxPrice) params.set('max_price', ovMaxPrice);
    if (ovRating) params.set('rating', ovRating);
    if (ovPurpose) params.set('travel_purpose', ovPurpose);
    if (ovEvent) params.set('event', ovEvent);
    if (ovAmenity) params.set('amenity', ovAmenity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home-page">

      {/* ===== HERO ===== */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <h1 className="home-hero-title">Discover Luxury Stays Designed<br />Around Your Journey</h1>
          <p className="home-hero-subtitle">Smart hotel discovery platform for travelers, families, business trips,<br />honeymoon stays, and unforgettable experiences.</p>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="home-search-bar">
          <div className="search-field">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M19 19l-4.35-4.35" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="search-field-text">
              <span className="search-label">Where to?</span>
              <input
                type="text"
                className="search-input search-input-location"
                placeholder="Search destinations, hotels..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2.25" y="3.75" width="19.5" height="18" rx="2" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M2.25 9.75h19.5" stroke="#2563EB" strokeWidth="1.5" />
            </svg>
            <div className="search-field-text">
              <span className="search-label">Check in</span>
              <input
                type="date"
                className="search-input search-input-date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2.25" y="3.75" width="19.5" height="18" rx="2" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M2.25 9.75h19.5" stroke="#2563EB" strokeWidth="1.5" />
            </svg>
            <div className="search-field-text">
              <span className="search-label">Check out</span>
              <input
                type="date"
                className="search-input search-input-date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="search-field-text">
              <span className="search-label">Guests</span>
              <select
                className="search-input search-input-select"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="search-btn" onClick={handleSearch}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="7.5" stroke="#1A2B49" strokeWidth="1.5" />
              <path d="M16.5 16.5L21 21" stroke="#1A2B49" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Search
          </button>
        </div>

        
        <div className="home-additional-filter" onClick={openOverlay}>
          Additional filter
          {activeFilterCount > 0 && <span className="home-additional-filter-badge">{activeFilterCount}</span>}
        </div>
      </section>

      {/* ===== MY BOOKINGS ===== */}
      <section className="home-dashboard-section">
        <div className="home-section-container">
          <div className="dashboard-header-row">
            <div>
              <h2 className="dashboard-title">My Bookings</h2>
              <p className="dashboard-subtitle">Welcome back, {user?.name || 'Traveler'}</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No bookings yet</h3>
              <p>Start exploring hotels and book your first stay!</p>
            </div>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="dashboard-row-link"
                      onClick={() => navigate(`/my-booking/${b.booking_code}`)}
                    >
                      <td data-label="Hotel">{b.hotel_name || b.hotel}</td>
                      <td data-label="Room">{b.room_type || b.room}</td>
                      <td data-label="Check-in">{b.check_in || b.checkIn}</td>
                      <td data-label="Check-out">{b.check_out || b.checkOut}</td>
                      <td data-label="Total">${b.total_price || b.total}</td>
                      <td data-label="Status">
                        <span className={`db-badge db-badge-${b.status === 'cancelled' ? 'error' : b.status === 'pending' ? 'warning' : 'success'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td data-label="Booked On">{b.created_at || b.bookedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ===== HOTELS ===== */}
      <section className="home-hotels-section">
        <div className="home-section-container">
          <div className="hotels-header">
            <div>
              <h2 className="hotels-title">Curated Luxury Hotels</h2>
              <p className="hotels-subtitle">{displayHotels.length} premium {displayHotels.length === 1 ? 'property' : 'properties'} match your preferences</p>
            </div>
            <div className="sort-dropdown">
              <span>Sort by: Recommended</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#1A2B49" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="hotels-grid">
            {displayHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING DESTINATIONS ===== */}
      <section className="home-destinations-section">
        <div className="home-section-container">
          <h2 className="dest-title">Explore Trending Destinations</h2>
          <p className="dest-subtitle">Handpicked locations for your next adventure</p>
          <div className="dest-grid">
            {destinations.map((d, i) => (
              <DestinationCard key={i} dest={d} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="home-testimonials-section">
        <div className="home-section-container">
          <h2 className="testimonials-title">Loved by Travelers Islandwide</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== OVERLAY FILTER MODAL ===== */}
      <div className={`ov-overlay ${showOverlay ? 'ov-active' : ''}`} onClick={closeOverlay}>
        <div className={`ov-modal ${showOverlay ? 'ov-modal-open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="ov-header">
            <div className="ov-header-left">
              <h3 className="ov-title">Additional Filters</h3>
              <p className="ov-subtitle">Refine your stay with smart filters</p>
            </div>
            <div className="ov-header-actions">
              {activeFilterCount > 0 && <span className="ov-count">{activeFilterCount} active</span>}
              <button className="ov-reset" onClick={handleReset}>Reset</button>
              <button className="ov-close" onClick={closeOverlay}>✕</button>
            </div>
          </div>
          <div className="ov-body">
            {/* Location */}
            <div className="ov-field-group">
              <label className="ov-label">Location</label>
              <div className="ov-field">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.25 3.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke="#D4AF37" strokeWidth="1.25" />
                  <path d="M14 14l-3.63-3.63" stroke="#D4AF37" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={ovLocation}
                  onChange={(e) => setOvLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Check-in / Check-out */}
            <div className="ov-field-group">
              <label className="ov-label">Stay Dates</label>
              <div className="ov-row">
                <div className="ov-field ov-half ov-date-field" ref={inFieldRef}>
                  <button
                    type="button"
                    className="ov-cal-trigger"
                    onClick={() => setCalOpen(calOpen === 'in' ? null : 'in')}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="#D4AF37" strokeWidth="1.25" />
                      <path d="M4 1v3M12 1v3M1.5 6h13" stroke="#D4AF37" strokeWidth="1.25" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    readOnly
                    placeholder="Check-in"
                    value={ovCheckIn ? formatDisplay(ovCheckIn) : ''}
                    onClick={() => setCalOpen(calOpen === 'in' ? null : 'in')}
                  />
                  {calOpen === 'in' && (
                    <CalendarPicker
                      value={ovCheckIn}
                      minDate={toDateInput(new Date())}
                      onSelect={(d) => {
                        setOvCheckIn(d);
                        if (ovCheckOut && ovCheckOut < d) setOvCheckOut('');
                      }}
                      onClose={() => setCalOpen(null)}
                    />
                  )}
                </div>
                <div className="ov-field ov-half ov-date-field" ref={outFieldRef}>
                  <button
                    type="button"
                    className="ov-cal-trigger"
                    onClick={() => setCalOpen(calOpen === 'out' ? null : 'out')}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="#D4AF37" strokeWidth="1.25" />
                      <path d="M4 1v3M12 1v3M1.5 6h13" stroke="#D4AF37" strokeWidth="1.25" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    readOnly
                    placeholder="Check-out"
                    value={ovCheckOut ? formatDisplay(ovCheckOut) : ''}
                    onClick={() => setCalOpen(calOpen === 'out' ? null : 'out')}
                  />
                  {calOpen === 'out' && (
                    <CalendarPicker
                      value={ovCheckOut}
                      minDate={ovCheckIn || toDateInput(new Date())}
                      onSelect={(d) => setOvCheckOut(d)}
                      onClose={() => setCalOpen(null)}
                      alignRight
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Guests & Rooms */}
            <div className="ov-field-group">
              <label className="ov-label">Guests & Rooms</label>
              <div className="ov-field">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5.5 5a2 2 0 100-4 2 2 0 000 4z" stroke="#D4AF37" strokeWidth="1.25" />
                  <path d="M1 14v-1.5a3 3 0 013-3h3a3 3 0 013 3V14" stroke="#D4AF37" strokeWidth="1.25" />
                </svg>
                <span className="ov-select-wrap">
                  <select value={ovGuests} onChange={(e) => setOvGuests(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <svg className="ov-select-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="ov-sep">·</span>
                <span className="ov-select-wrap">
                  <select value={ovRooms} onChange={(e) => setOvRooms(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <svg className="ov-select-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Price Range */}
            <div className="ov-section">
              <div className="ov-section-header">
                <span>Price Range</span>
                <span className="ov-price-value">${minPriceVal} - {maxPriceVal >= PRICE_MAX ? `${PRICE_MAX}+` : `$${maxPriceVal}`}</span>
              </div>
              <div className="ov-range-wrap">
                <div className="ov-range-track" />
                <div
                  className="ov-range-fill"
                  style={{
                    left: `${(minPriceVal / PRICE_MAX) * 100}%`,
                    width: `${((maxPriceVal - minPriceVal) / PRICE_MAX) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  className="ov-range ov-range-min"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10}
                  value={minPriceVal}
                  onChange={handleMinSlider}
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  className="ov-range ov-range-max"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10}
                  value={maxPriceVal}
                  onChange={handleMaxSlider}
                  aria-label="Maximum price"
                />
              </div>
              <div className="ov-row">
                <div className="ov-price-input">
                  <label className="ov-label">Min Price</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={ovMinPrice}
                    onChange={handleMinPriceInput}
                  />
                </div>
                <div className="ov-price-input">
                  <label className="ov-label">Max Price</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={ovMaxPrice}
                    onChange={handleMaxPriceInput}
                  />
                </div>
              </div>
            </div>

            {/* Hotel Rating */}
            <div className="ov-section">
              <div className="ov-section-header"><span>Hotel Rating</span></div>
              <div className="ov-chips">
                {ratings.map(r => (
                  <button
                    key={r}
                    className={`ov-chip ${ovRating === r ? 'ov-chip-active' : ''}`}
                    onClick={() => setOvRating(ovRating === r ? null : r)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#D4AF37">
                      <path d="M8 1l1.91 3.87 4.27.62-3.09 3.01.73 4.25L8 11.42l-3.82 2.01.73-4.25-3.09-3.01 4.27-.62L8 1z" />
                    </svg>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Purpose */}
            <div className="ov-section">
              <div className="ov-section-header"><span>Travel Purpose</span></div>
              <div className="ov-chips ov-chips-pill">
                {purposes.map(p => (
                  <button
                    key={p}
                    className={`ov-pill ${ovPurpose === p ? 'ov-pill-active' : ''}`}
                    onClick={() => setOvPurpose(ovPurpose === p ? null : p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Event */}
            <div className="ov-field-group">
              <label className="ov-label">Event</label>
              <div className="ov-field">
                <span className="ov-select-wrap">
                  <select
                    value={ovEvent || ''}
                    onChange={(e) => setOvEvent(e.target.value || null)}
                  >
                    <option value="">Any event</option>
                    {EVENT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg className="ov-select-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Amenity */}
            <div className="ov-field-group">
              <label className="ov-label">Amenity</label>
              <div className="ov-field">
                <span className="ov-select-wrap">
                  <select
                    value={ovAmenity || ''}
                    onChange={(e) => setOvAmenity(e.target.value || null)}
                  >
                    <option value="">Any amenity</option>
                    {AMENITIES.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <svg className="ov-select-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="ov-footer">
            <button className="ov-reset-btn" onClick={handleReset}>Reset Filters</button>
            <button className="ov-search-btn" onClick={handleOverlaySearch}>
              Search Luxury Stays
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
