import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminHotels, useDeleteHotel } from '../hooks/useAdmin';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [flaggedFilter, setFlaggedFilter] = useState(false);
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const { data: registeredHotels = [], isLoading: hotelsLoading } = useAdminHotels();
  const deleteHotel = useDeleteHotel();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const stats = useMemo(() => {
    const totalHotels = registeredHotels.length;
    const totalBookings = registeredHotels.reduce((sum, h) => sum + (h.total_bookings || 0), 0);
    const revenue = 0;
    const flagged = registeredHotels.filter(h => (h.rating || 0) < 3).length;
    return { totalHotels, ownerRegistered: registeredHotels.length, totalBookings, revenue, totalReviews: 0, flagged };
  }, [registeredHotels]);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleViewHotel = (h) => setSelectedHotel(h);
  const handleCloseHotel = () => setSelectedHotel(null);

  const handleRemoveHotel = async (hotelId) => {
    try {
      await deleteHotel.mutateAsync(hotelId);
      setSelectedHotel(null);
    } catch {
      setSelectedHotel(null);
    }
  };

  const filteredHotels = useMemo(() => {
    let list = registeredHotels;
    if (flaggedFilter) {
      list = list.filter(h => (h.starRating || h.rating || 0) < 3);
    }
    if (!hotelSearchQuery.trim()) return list;
    const q = hotelSearchQuery.toLowerCase();
    return list.filter(h =>
      (h.hotelName || h.name || '')?.toLowerCase().includes(q) ||
      (h.city || h.location || '')?.toLowerCase().includes(q) ||
      (h.country || '')?.toLowerCase().includes(q) ||
      (h.owner_email || h.email || '')?.toLowerCase().includes(q)
    );
  }, [registeredHotels, hotelSearchQuery, flaggedFilter]);

  const getAmenitiesList = (h) => {
    if (Array.isArray(h.amenities)) return h.amenities;
    if (typeof h.amenities === 'string') return h.amenities.split(',').map(a => a.trim()).filter(Boolean);
    return [];
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="ad-page">

      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-header">
          <div className="ad-logo-wrap">
            <div className="ad-logo-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3.33" y="1.67" width="13.33" height="16.67" rx="1.67" stroke="#020618" strokeWidth="1.67"/>
              </svg>
            </div>
            <div>
              <div className="ad-logo-text">StayEasy</div>
              <div className="ad-logo-badge">Admin Console</div>
            </div>
          </div>
        </div>

        <nav className="ad-nav">
          <div
            className={`ad-nav-item ${activeTab === 'overview' ? 'ad-nav-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="4.67" height="6" rx="0.67" stroke={activeTab === 'overview' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
              <rect x="9.33" y="2" width="4.67" height="3.33" rx="0.67" stroke={activeTab === 'overview' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
              <rect x="9.33" y="8" width="4.67" height="6" rx="0.67" stroke={activeTab === 'overview' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
              <rect x="2" y="10.67" width="4.67" height="3.33" rx="0.67" stroke={activeTab === 'overview' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
            </svg>
            <span>Overview</span>
            <svg className="ad-nav-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="5.25" y="3.50" width="7" height="3.50" rx="0.58" stroke="#020618" strokeWidth="1.17"/>
            </svg>
          </div>
          <div
            className={`ad-nav-item ${activeTab === 'hotels' ? 'ad-nav-active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="1.33" width="8" height="13.33" rx="1.33" stroke={activeTab === 'hotels' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
              <rect x="1.33" y="8" width="2.67" height="6.67" rx="1.33" stroke={activeTab === 'hotels' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
              <rect x="12" y="6" width="2.67" height="8.67" rx="1.33" stroke={activeTab === 'hotels' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
            </svg>
            <span>Hotels</span>
          </div>
          <div
            className={`ad-nav-item ${activeTab === 'reviews' ? 'ad-nav-active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.33" y="1.33" width="13.33" height="12.71" rx="1.33" stroke={activeTab === 'reviews' ? '#020618' : '#90A1B9'} strokeWidth="1.33"/>
            </svg>
            <span>Reviews</span>
            {activeTab === 'reviews' && (
              <svg className="ad-nav-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="5.25" y="3.50" width="7" height="3.50" rx="0.58" stroke="#020618" strokeWidth="1.17"/>
              </svg>
            )}
          </div>
        </nav>

        <div className="ad-sidebar-footer">
          <div className="ad-user-row">
            <div className="ad-user-avatar">A</div>
            <div>
              <div className="ad-user-name">Administrator</div>
              <div className="ad-user-email">{user?.email || 'admin@stayvora.com'}</div>
            </div>
          </div>
          <div className="ad-signout" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="4" height="12" rx="0.67" stroke="#90A1B9" strokeWidth="1.33"/>
              <rect x="10.67" y="4.67" width="3.33" height="6.67" rx="0.67" stroke="#90A1B9" strokeWidth="1.33"/>
            </svg>
            <span>Sign out</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ad-main">
        {activeTab === 'overview' && (
          <>
            <h1 className="ad-page-title">Overview</h1>
            <p className="ad-page-date">{today}</p>

            {/* STAT CARDS */}
            <div className="ad-stats">
              <div className="ad-stat-card">
                <div className="ad-stat-icon" style={{ background: 'rgba(81, 162, 255, 0.10)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="5" y="1.67" width="10" height="16.67" rx="1.67" stroke="#51A2FF" strokeWidth="1.67"/>
                    <rect x="1.67" y="10" width="3.33" height="8.33" rx="1.67" stroke="#51A2FF" strokeWidth="1.67"/>
                    <rect x="15" y="7.50" width="3.33" height="10.83" rx="1.67" stroke="#51A2FF" strokeWidth="1.67"/>
                  </svg>
                </div>
                <div className="ad-stat-number">{stats.totalHotels}</div>
                <div className="ad-stat-label">Total Hotels</div>
                <div className="ad-stat-sub">{stats.ownerRegistered} owner-registered</div>
              </div>
              <div className="ad-stat-card">
                <div className="ad-stat-icon" style={{ background: 'rgba(0, 212, 146, 0.10)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="1.67" y="5.83" width="16.67" height="8.33" rx="1.67" stroke="#00D492" strokeWidth="1.67"/>
                    <rect x="13.33" y="5.83" width="5" height="5" rx="1.67" stroke="#00D492" strokeWidth="1.67"/>
                  </svg>
                </div>
                <div className="ad-stat-number">{stats.totalBookings}</div>
                <div className="ad-stat-label">Total Bookings</div>
                <div className="ad-stat-sub">${stats.revenue} revenue</div>
              </div>
              <div className="ad-stat-card">
                <div className="ad-stat-icon" style={{ background: 'rgba(255, 185, 0, 0.10)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="1.67" y="1.67" width="16.67" height="15.89" rx="1.67" stroke="#FFB900" strokeWidth="1.67"/>
                  </svg>
                </div>
                <div className="ad-stat-number">{stats.totalReviews}</div>
                <div className="ad-stat-label">Total Reviews</div>
                <div className="ad-stat-sub">across all properties</div>
              </div>
              <div className="ad-stat-card">
                <div className="ad-stat-icon" style={{ background: 'rgba(255, 100, 103, 0.10)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3.33" y="1.67" width="13.33" height="16.67" rx="1.67" stroke="#FF6467" strokeWidth="1.67"/>
                  </svg>
                </div>
                <div className="ad-stat-number">{stats.flagged}</div>
                <div className="ad-stat-label">Flagged Hotels</div>
                <div className="ad-stat-sub">rating below 3.0</div>
              </div>
            </div>

            {/* BOTTOM PANELS */}
            <div className="ad-panels">
              {/* HOTELS NEEDING ATTENTION */}
              <div className="ad-panel">
                <div className="ad-panel-header">
                  <div className="ad-panel-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.32" y="1.99" width="13.34" height="12.01" rx="1.33" stroke="#FFB900" strokeWidth="1.33"/>
                    </svg>
                    Hotels Needing Attention
                  </div>
                  <div
                    className="ad-panel-manage"
                    onClick={() => { setFlaggedFilter(true); setActiveTab('hotels'); }}
                  >
                    <span>Manage </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="6" y="2.50" width="7" height="3.50" rx="0.50" stroke="#FFB900" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
                {(() => {
                  const flagged = registeredHotels.filter(h => (h.rating || 0) < 3);
                  return flagged.length > 0 ? (
                    <div className="ad-hotel-list">
                      {flagged.map((h, i) => (
                        <div key={h.id} className="ad-hotel-row" style={{ cursor: 'pointer' }} onClick={() => { setSelectedHotel(h); }}>
                          <div className="ad-user-avatar" style={{ width: 36, height: 36, fontSize: 12, borderRadius: 10, background: '#314158' }}>
                            {(h.name || 'H')[0]}
                          </div>
                          <div className="ad-hotel-info">
                            <div className="ad-hotel-name">{h.name}</div>
                            <div className="ad-hotel-location">{h.city || h.location || 'N/A'}</div>
                          </div>
                          <div className="ad-rating-badge" style={{ color: '#FF6467', background: 'rgba(255, 100, 103, 0.10)' }}>
                            {h.rating || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ad-empty-state">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.20">
                        <rect x="2.66" y="2.67" width="26.67" height="25.43" rx="2.67" stroke="#62748E" strokeWidth="2.67"/>
                      </svg>
                      <p className="ad-empty-title">All hotels have good ratings</p>
                      <p className="ad-empty-sub">No hotels need attention right now</p>
                    </div>
                  );
                })()}
              </div>

              {/* RECENT BOOKINGS */}
              <div className="ad-panel">
                <div className="ad-panel-header">
                  <div className="ad-panel-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.33" y="1.33" width="13.33" height="12.71" rx="1.33" stroke="#FFB900" strokeWidth="1.33"/>
                    </svg>
                    Recent Bookings
                  </div>
                </div>
                <div className="ad-empty-state">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.20">
                    <rect x="2.66" y="2.67" width="26.67" height="25.43" rx="2.67" stroke="#62748E" strokeWidth="2.67"/>
                  </svg>
                  <p className="ad-empty-title">No bookings yet</p>
                  <p className="ad-empty-sub">Bookings will appear here once guests make reservations</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'hotels' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="ad-page-title">Hotels</h1>
                <p className="ad-page-date">
                  {flaggedFilter
                    ? `${filteredHotels.length} flagged ${filteredHotels.length === 1 ? 'hotel' : 'hotels'} (rating below 3.0)`
                    : `${registeredHotels.length} registered ${registeredHotels.length === 1 ? 'hotel' : 'hotels'}`}
                </p>
              </div>
              {flaggedFilter && (
                <div
                  className="ad-panel-manage"
                  onClick={() => { setFlaggedFilter(false); setHotelSearchQuery(''); }}
                  style={{ paddingTop: 8, cursor: 'pointer' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2.33" y="2.33" width="11.67" height="1.17" rx="0.58" fill="#FFB900" transform="rotate(45 2.33 2.33)"/>
                    <rect x="2.33" y="11.67" width="11.67" height="1.17" rx="0.58" fill="#FFB900" transform="rotate(-45 2.33 11.67)"/>
                  </svg>
                  <span>Show all hotels</span>
                </div>
              )}
            </div>

            <div className="ad-rev-toolbar">
              <div className="ad-rev-search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="10.67" height="10.67" rx="1.33" stroke="#62748E" strokeWidth="1.33"/>
                  <rect x="11.13" y="11.13" width="2.87" height="2.87" rx="1.33" stroke="#62748E" strokeWidth="1.33"/>
                </svg>
                <input
                  className="ad-rev-search-input"
                  placeholder="Search hotels, location, email..."
                  value={hotelSearchQuery}
                  onChange={e => setHotelSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="ad-hotel-grid" style={{ paddingTop: 24 }}>
              {hotelsLoading ? (
                <p className="ad-empty-title" style={{ paddingTop: 48, textAlign: 'center', width: '100%' }}>Loading hotels...</p>
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((h) => (
                  <div
                    key={h.id}
                    className="ad-stat-card ad-hotel-card"
                    onClick={() => handleViewHotel(h)}
                  >
                    <div className="ad-hotel-card-img">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="2" width="12" height="20" rx="2" stroke="#45556C" strokeWidth="2"/>
                        <rect x="2" y="12" width="4" height="10" rx="2" stroke="#45556C" strokeWidth="2"/>
                        <rect x="18" y="9" width="4" height="13" rx="2" stroke="#45556C" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div style={{ paddingTop: 16 }}>
                      <div className="ad-hotel-name" style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
                        {h.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect x="2.33" y="1.17" width="7" height="8.75" rx="1.17" stroke="#62748E" strokeWidth="1.17"/>
                          <rect x="4.25" y="3.08" width="3.50" height="3.50" rx="1.17" stroke="#62748E" strokeWidth="1.17"/>
                        </svg>
                        <span className="ad-hotel-location" style={{ fontSize: 13 }}>
                          {h.city || h.location || 'N/A'}{h.country ? `, ${h.country}` : ''}
                        </span>
                      </div>
                      <div className="ad-hotel-location" style={{ paddingTop: 4 }}>
                        {h.owner_email || ''}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12 }}>
                        <div className="ad-rating-badge">{h.rating || 'N/A'}</div>
                        {getAmenitiesList(h).length > 0 && (
                          <span className="ad-hotel-location" style={{ fontSize: 11 }}>
                            {getAmenitiesList(h).length} amenities
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="ad-empty-title" style={{ paddingTop: 48, textAlign: 'center', width: '100%' }}>
                  {registeredHotels.length === 0
                    ? 'No hotels registered yet. Hotels registered by owners will appear here.'
                    : 'No hotels match your search.'}
                </p>
              )}
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            <h1 className="ad-page-title">Reviews</h1>
            <p className="ad-page-date">No reviews yet</p>
            <p className="ad-empty-title" style={{ paddingTop: 48 }}>
              Guest reviews from the database will be shown here in a future update.
            </p>
          </>
        )}

        {/* HOTEL DETAIL MODAL */}
        {selectedHotel && (
          <div className="ad-modal-overlay" onClick={handleCloseHotel}>
            <div className="ad-modal ad-modal-hotel" onClick={e => e.stopPropagation()}>
              {/* IMAGE HEADER */}
              <div className="ad-hotel-modal-img-wrap">
                <div className="ad-hotel-modal-img ad-hotel-modal-img-placeholder" />
                <div className="ad-hotel-modal-gradient" />
                <div className="ad-hotel-modal-close" onClick={handleCloseHotel}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="4" y="4" width="12.80" height="1.60" rx="0.80" fill="white" transform="rotate(45 4 4)"/>
                    <rect x="4" y="12.80" width="12.80" height="1.60" rx="0.80" fill="white" transform="rotate(-45 4 12.80)"/>
                  </svg>
                </div>
                <div className="ad-hotel-modal-title-wrap">
                  <div className="ad-hotel-modal-title">
                    {selectedHotel.name}
                  </div>
                  <div className="ad-hotel-modal-location">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2.33" y="1.17" width="9.33" height="11.67" rx="1.17" stroke="#CAD5E2" strokeWidth="1.17"/>
                      <rect x="5.25" y="4.08" width="3.50" height="3.50" rx="1.17" stroke="#CAD5E2" strokeWidth="1.17"/>
                    </svg>
                    <span>{selectedHotel.city || selectedHotel.location || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div className="ad-hotel-modal-body">
                {/* RATING */}
                <div className="ad-hotel-modal-rating-row">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1.17" y="1.17" width="11.67" height="11.13" rx="1.17"
                        fill={s <= Math.round(Number(selectedHotel.rating || 0)) ? '#FFB900' : 'none'}
                        stroke={'#FFB900'}
                        strokeWidth="1.17"
                      />
                    </svg>
                  ))}
                  <span className="ad-hotel-modal-rating-text">
                    {selectedHotel.rating || 'N/A'}
                  </span>
                  <span className="ad-hotel-modal-review-count">
                    {selectedHotel.confirmed_bookings || 0} bookings
                  </span>
                </div>

                {/* ABOUT */}
                <div className="ad-hotel-modal-section">
                  <div className="ad-hotel-modal-section-label">About</div>
                  <div className="ad-hotel-modal-section-text">
                    {selectedHotel.description || 'No description available.'}
                  </div>
                </div>

                {/* AMENITIES */}
                {getAmenitiesList(selectedHotel).length > 0 && (
                  <div className="ad-hotel-modal-section">
                    <div className="ad-hotel-modal-section-label">Amenities</div>
                    <div className="ad-hotel-modal-amenities">
                      {getAmenitiesList(selectedHotel).map((a, i) => (
                        <div key={i} className="ad-hotel-modal-amenity-pill">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="1" width="10" height="10" rx="1" stroke="#00D492" strokeWidth="1"/>
                            <rect x="4.50" y="2" width="6.50" height="5" rx="1" stroke="#00D492" strokeWidth="1"/>
                          </svg>
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OWNER INFO */}
                <div className="ad-hotel-modal-section">
                  <div className="ad-hotel-modal-section-label">Owner</div>
                  <div className="ad-hotel-modal-section-text">
                    {selectedHotel.owner_name || 'N/A'} ({selectedHotel.owner_email || 'N/A'})
                  </div>
                </div>

                <div className="ad-hotel-modal-section">
                  <div className="ad-hotel-modal-section-label">Status</div>
                  <div className="ad-hotel-modal-section-text" style={{ textTransform: 'capitalize' }}>
                    {selectedHotel.status || 'active'}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="ad-modal-actions">
                  <button className="ad-modal-btn ad-modal-btn-close" onClick={handleCloseHotel}>
                    Close
                  </button>
                  <button
                    className="ad-modal-btn ad-modal-btn-delete"
                    onClick={() => handleRemoveHotel(selectedHotel.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3.33" y="4" width="9.33" height="10.67" rx="1.33" stroke="#FF6467" strokeWidth="1.33"/>
                      <rect x="5.33" y="1.33" width="5.33" height="2.67" rx="1.33" stroke="#FF6467" strokeWidth="1.33"/>
                    </svg>
                    Remove Hotel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
