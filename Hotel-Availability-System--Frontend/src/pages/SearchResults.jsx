import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { hotelsAPI } from '../utils/api';
import SearchHotelCard from '../components/SearchHotelCard/SearchHotelCard';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import './SearchResults.css';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buildParams = () => {
    const p = {};
    const locationVal = searchParams.get('location');
    const checkInVal = searchParams.get('check_in');
    const checkOutVal = searchParams.get('check_out');
    const guestsVal = searchParams.get('guests');
    const roomsVal = searchParams.get('rooms');
    const minPriceVal = searchParams.get('min_price');
    const maxPriceVal = searchParams.get('max_price');
    const ratingVal = searchParams.get('rating');
    const purposeVal = searchParams.get('travel_purpose');
    const eventVal = searchParams.get('event');
    const amenityVal = searchParams.get('amenity');
    if (locationVal) p.location = locationVal;
    if (checkInVal) p.check_in = checkInVal;
    if (checkOutVal) p.check_out = checkOutVal;
    if (guestsVal) p.guests = guestsVal;
    if (roomsVal) p.rooms = roomsVal;
    if (minPriceVal) p.min_price = minPriceVal;
    if (maxPriceVal) p.max_price = maxPriceVal;
    if (ratingVal) p.rating = ratingVal;
    if (purposeVal) p.travel_purpose = purposeVal;
    if (eventVal) p.event = eventVal;
    if (amenityVal) p.amenity = amenityVal;
    return p;
  };

  const initialFilters = {
    location: searchParams.get('location') || '',
    check_in: searchParams.get('check_in') || '',
    check_out: searchParams.get('check_out') || '',
    guests: searchParams.get('guests') || '',
    rooms: searchParams.get('rooms') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    rating: searchParams.get('rating') || '',
    travel_purpose: searchParams.get('travel_purpose') || '',
    event: searchParams.get('event') || '',
    amenity: searchParams.get('amenity') || '',
  };

  const queryParams = buildParams();
  const hasParams = Object.keys(queryParams).length > 0;

  const { data: rawHotels = [], isLoading: loading } = useQuery({
    queryKey: hasParams ? ['hotels', 'search', queryParams] : ['hotels', 'list'],
    queryFn: () => (hasParams ? hotelsAPI.search(queryParams) : hotelsAPI.list()).then(r => r.data.hotels || []),
  });

  const displayHotels = rawHotels.map(h => ({
    id: h.id,
    name: h.name,
    location: h.location || h.city || '',
    city: h.city || '',
    desc: h.description || '',
    price: h.min_room_price || 0,
    rating: h.rating || 0,
    reviews: h.total_reviews || 0,
    image: h.image || '',
    tags: h.amenities ? h.amenities.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3) : [],
  }));

  const [sortBy, setSortBy] = useState('location');
  const [searchText, setSearchText] = useState('');
  const [searchApplied, setSearchApplied] = useState('');

  const sortedHotels = displayHotels
    .filter(h => {
      if (!searchApplied) return true;
      const q = searchApplied.toLowerCase();
      return (h.name || '').toLowerCase().includes(q)
        || (h.location || '').toLowerCase().includes(q)
        || (h.city || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'city':
          return (a.city || '').localeCompare(b.city || '');
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'location':
        default:
          return (a.location || '').localeCompare(b.location || '');
      }
    });

  const handleFilter = (filters) => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.check_in) params.set('check_in', filters.check_in);
    if (filters.check_out) params.set('check_out', filters.check_out);
    if (filters.guests) params.set('guests', filters.guests);
    if (filters.rooms) params.set('rooms', filters.rooms);
    if (filters.min_price) params.set('min_price', filters.min_price);
    if (filters.max_price) params.set('max_price', filters.max_price);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.travel_purpose) params.set('travel_purpose', filters.travel_purpose);
    if (filters.event) params.set('event', filters.event);
    if (filters.amenity) params.set('amenity', filters.amenity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="sr-page">
      <div className="sr-layout">
        {/* ===== FILTERS ===== */}
        <aside className="sr-sidebar">
          <FilterPanel onFilter={handleFilter} initialFilters={initialFilters} />
        </aside>

        {/* ===== RESULTS ===== */}
        <main className="sr-main">
          {loading ? (
            <div className="loading-screen">
              <div className="spinner spinner-lg" />
              <p>Searching hotels...</p>
            </div>
          ) : (
            <>
              <div className="sr-main-header">
                <div>
                  <h1 className="sr-main-title">Curated Luxury Hotels</h1>
                  <p className="sr-main-subtitle">{sortedHotels.length} premium {sortedHotels.length === 1 ? 'property' : 'properties'} match your preferences</p>
                </div>
                <div className="sr-header-controls">
                  <div className="sr-sort-btn sr-sort-wrap">
                    <select className="sr-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="location">Sort by: Location</option>
                      <option value="city">Sort by: City</option>
                      <option value="rating_desc">Rating: High to Low</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="price_asc">Price: Low to High</option>
                    </select>
                    <svg className="sr-sort-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#1A2B49" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="sr-search-input"
                    placeholder="Search hotels..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSearchApplied(searchText.trim()); }}
                  />
                  <button className="sr-search-submit" onClick={() => setSearchApplied(searchText.trim())}>Search</button>
                </div>
              </div>
              {sortedHotels.length === 0 ? (
                <div className="empty-state">
                  <h3>No hotels found</h3>
                  <p>Try adjusting your search filters or explore different destinations.</p>
                </div>
              ) : (
                <div className="sr-hotels-grid">
                  {sortedHotels.map(hotel => (
                    <SearchHotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
