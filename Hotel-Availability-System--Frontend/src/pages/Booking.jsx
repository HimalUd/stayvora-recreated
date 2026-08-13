import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHotel } from '../hooks/useHotels';
import { useRooms } from '../hooks/useRooms';
import { useCreateBooking } from '../hooks/useBookings';
import { useAuth } from '../context/AuthContext';
import { bookingSchema } from '../lib/validations';
import './Booking.css';

function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Booking() {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: hotel, isLoading: loading, error } = useHotel(hotelId);
  const { data: rooms = [] } = useRooms(hotelId);
  const createBooking = useCreateBooking();

  const room = rooms.find((r) => String(r.id) === String(roomId)) || rooms[0] || null;

  const today = new Date();
  const toDateInput = (d) => d.toISOString().split('T')[0];

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit: formSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      first_name: user?.first_name || (user?.name || '').split(' ')[0] || '',
      last_name: user?.last_name || (user?.name || '').split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      check_in: toDateInput(new Date(Date.now() + 86400000)),
      check_out: toDateInput(new Date(Date.now() + 3 * 86400000)),
      guests: 2,
      special_requests: '',
    },
  });

  const checkIn = watch('check_in');
  const checkOut = watch('check_out');
  const guests = watch('guests');

  const nights = getNights(checkIn, checkOut);
  const roomPrice = Number(room?.price) || 0;
  const subtotal = nights * roomPrice;
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      const res = await createBooking.mutateAsync({
        room_id: room.id,
        hotel_id: hotelId,
        check_in: data.check_in,
        check_out: data.check_out,
        guests: data.guests,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        special_requests: data.special_requests,
      });
      setConfirmCode(res?.booking?.booking_code || res?.confirmation_code || `BKDQ${Math.random().toString(36).toUpperCase().slice(2, 10)}`);
      setShowConfirm(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Booking failed. Please ensure you are logged in and try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <p>Loading booking information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="empty-state">
        <h3>Booking unavailable</h3>
        <p>The hotel or room you selected could not be found.</p>
        <Link to="/home" className="btn btn-primary">Browse Hotels</Link>
      </div>
    );
  }

  return (
    <div className="bk-page">
      <div className="bk-container">
        <Link to={`/hotel/${hotelId}`} className="bk-back-link">← Back to hotel</Link>
        <h1 className="bk-heading">Complete Your Booking</h1>
        <div className="bk-layout">

          {/* ===== LEFT - FORM ===== */}
          <div className="bk-main">
            <div className="bk-card">
              <div className="bk-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#101828"/>
                </svg>
                <span>Guest Information</span>
              </div>
              <form onSubmit={formSubmit(onSubmit)}>
                <div className="bk-form-grid">
                  <div className="bk-field">
                    <label>First Name</label>
                    <input type="text" {...register('first_name')} placeholder="First Name" />
                    {errors.first_name && <span className="bk-field-error">{errors.first_name.message}</span>}
                  </div>
                  <div className="bk-field">
                    <label>Last Name</label>
                    <input type="text" {...register('last_name')} placeholder="Last Name" />
                    {errors.last_name && <span className="bk-field-error">{errors.last_name.message}</span>}
                  </div>
                  <div className="bk-field">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1.33" y="2.67" width="13.33" height="10.67" rx="1.33" stroke="#364153" strokeWidth="1.33"/>
                        <path d="M1.33 4l6.67 4.67L14.67 4" stroke="#364153" strokeWidth="1.33"/>
                      </svg>
                      Email
                    </label>
                    <input type="email" {...register('email')} placeholder="Email" />
                    {errors.email && <span className="bk-field-error">{errors.email.message}</span>}
                  </div>
                  <div className="bk-field">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1.41" y="1.33" width="13.26" height="13.29" rx="2" stroke="#364153" strokeWidth="1.33"/>
                      </svg>
                      Phone
                    </label>
                    <input type="tel" {...register('phone')} placeholder="Phone" />
                  </div>
                </div>

                <div className="bk-card bk-card-sm">
                  <div className="bk-card-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#101828" strokeWidth="1.5"/>
                      <rect x="6" y="2" width="4" height="4" rx="1" stroke="#101828" strokeWidth="1.5"/>
                      <rect x="14" y="2" width="4" height="4" rx="1" stroke="#101828" strokeWidth="1.5"/>
                    </svg>
                    <span>Booking Details</span>
                  </div>
                  <div className="bk-form-grid">
                    <div className="bk-field">
                      <label>Check-in</label>
                      <input type="date" {...register('check_in')} min={toDateInput(new Date())} />
                      {errors.check_in && <span className="bk-field-error">{errors.check_in.message}</span>}
                    </div>
                    <div className="bk-field">
                      <label>Check-out</label>
                      <input type="date" {...register('check_out')} min={checkIn || toDateInput(new Date())} />
                      {errors.check_out && <span className="bk-field-error">{errors.check_out.message}</span>}
                    </div>
                    <div className="bk-field">
                      <label>Guests</label>
                      <select {...register('guests', { valueAsNumber: true })}>
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bk-card bk-card-sm">
                  <div className="bk-card-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#101828" strokeWidth="1.5"/>
                      <path d="M2 10h20" stroke="#101828" strokeWidth="1.5"/>
                    </svg>
                    <span>Special Requests</span>
                  </div>
                  <textarea className="bk-textarea" {...register('special_requests')} placeholder="Any special requests or requirements?" rows={4} />
                </div>

                {submitError && <p className="bk-error">{submitError}</p>}
                <button type="submit" className="bk-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : `Complete Booking — $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* ===== RIGHT - SUMMARY ===== */}
          <div className="bk-sidebar">
            <div className="bk-summary-card">
              <div className="bk-summary-header">Booking Summary</div>
              <div className="bk-summary-body">
                <div className="bk-summary-hotel">
                  <div className="bk-summary-hotel-name">{hotel.name}</div>
                  <div className="bk-summary-hotel-location">{hotel.location}</div>
                </div>
                <div className="bk-summary-divider" />
                <div className="bk-summary-hotel">
                  <div className="bk-summary-room-type">{room.room_type}</div>
                </div>
                <div className="bk-summary-divider" />
                <div className="bk-summary-detail">
                  <span>Check-in:</span>
                  <span>{formatDate(checkIn) || 'Select'}</span>
                </div>
                <div className="bk-summary-detail">
                  <span>Check-out:</span>
                  <span>{formatDate(checkOut) || 'Select'}</span>
                </div>
                <div className="bk-summary-detail">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="bk-summary-detail">
                  <span>Nights:</span>
                  <span>{nights}</span>
                </div>
                <div className="bk-summary-divider" />
                <div className="bk-summary-detail">
                  <span>${roomPrice.toFixed(2)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="bk-summary-detail">
                  <span>Taxes & fees</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="bk-summary-divider" />
                <div className="bk-summary-total">
                  <span>Total</span>
                  <span className="bk-total-amount">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONFIRMATION OVERLAY ===== */}
      <div className={`cf-overlay ${showConfirm ? 'cf-active' : ''}`} onClick={() => setShowConfirm(false)}>
        <div className={`cf-modal ${showConfirm ? 'cf-modal-open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="cf-modal-inner">
            <div className="cf-check-wrap">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="6.67" y="6.66" width="66.67" height="66.67" rx="33.33" stroke="#00A63E" strokeWidth="6.67"/>
                <path d="M26.67 40l10 10 16.66-16.67" stroke="#00A63E" strokeWidth="6.67" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="cf-heading">Booking Confirmed!</h2>
            <p className="cf-subtitle">Your reservation has been successfully confirmed</p>

            <div className="cf-code-box">
              <div className="cf-code-label">Confirmation Number</div>
              <div className="cf-code-value">{confirmCode}</div>
            </div>

            <div className="cf-details">
              <div className="cf-row">
                <span className="cf-row-label">Hotel</span>
                <span className="cf-row-value">{hotel.name}</span>
              </div>
              <div className="cf-row">
                <span className="cf-row-label">Room Type</span>
                <span className="cf-row-value">{room.room_type}</span>
              </div>
              <div className="cf-row">
                <span className="cf-row-label">Check-in</span>
                <span className="cf-row-value">{formatDate(checkIn)}</span>
              </div>
              <div className="cf-row">
                <span className="cf-row-label">Check-out</span>
                <span className="cf-row-value">{formatDate(checkOut)}</span>
              </div>
              <div className="cf-row">
                <span className="cf-row-label">Guests</span>
                <span className="cf-row-value">{guests}</span>
              </div>
              <div className="cf-row">
                <span className="cf-row-label">Total Amount</span>
                <span className="cf-row-value cf-total-value">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="cf-note">
              A confirmation email has been sent to your registered email address with all the booking details and check-in instructions.
            </div>

            <div className="cf-actions">
              <Link to="/home" className="cf-btn cf-btn-primary" onClick={() => setShowConfirm(false)}>Book Another Hotel</Link>
              <Link to="/home" className="cf-btn cf-btn-outline" onClick={() => setShowConfirm(false)}>Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
