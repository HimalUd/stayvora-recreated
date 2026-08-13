import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { hotelsAPI } from '../utils/api';
import { TRAVEL_PURPOSES } from '../lib/travelPurposes';
import './HotelOwnerRegister.css';

const STAR_SVG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L12 13.27l-4.77 2.51.91-5.32L2.27 7.62l5.34-.78L12 2z" stroke="#99A1AF" strokeWidth="1.33"/>
  </svg>
);

const STAR_SVG_FILLED = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FDC700">
    <path d="M12 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L12 13.27l-4.77 2.51.91-5.32L2.27 7.62l5.34-.78L12 2z"/>
  </svg>
);

const hotelAddSchema = z.object({
  hotelName: z.string().min(2, 'Hotel name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  travelPurposes: z.array(z.string()).min(1, 'Select at least one travel purpose'),
});

export default function HotelRegistration() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [travelPurposes, setTravelPurposes] = useState([]);
  const travelPurposesRef = useRef([]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(hotelAddSchema),
    defaultValues: { travelPurposes: [] },
  });

  const togglePurpose = (p) => {
    const prev = travelPurposesRef.current;
    const next = prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p];
    travelPurposesRef.current = next;
    setTravelPurposes(next);
    setValue('travelPurposes', next, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setError('');
    try {
      await hotelsAPI.create({
        name: data.hotelName,
        description: data.description,
        location: data.city,
        address: data.address,
        city: data.city,
        country: data.country,
        rating,
        travel_purpose: travelPurposes.join(', '),
      });
      navigate('/hotel-owner-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add hotel');
    }
  };

  return (
    <div className="hor-page">
      <div className="hor-bg">
        <div className="hor-center">
          <div className="hor-content">
            <h1 className="hor-title">Add Your Hotel</h1>
            <p className="hor-subtitle">Register your hotel to start receiving bookings</p>

            <div className="hor-card">
              <div className="hor-card-header">
                <div className="hor-card-title">Hotel Details</div>
                <div className="hor-card-desc">You can manage events, destinations, rooms, and images later from your dashboard.</div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="hor-form-body">
                <div className="hor-row">
                  <div className="hor-field">
                    <label className="hor-label">Hotel Name *</label>
                    <input className="hor-input" placeholder="Grand Plaza Hotel" {...register('hotelName')} />
                    {errors.hotelName && <span className="hor-error">{errors.hotelName.message}</span>}
                  </div>
                  <div className="hor-field">
                    <label className="hor-label">Star Rating</label>
                    <div className="hor-stars">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="hor-star" onClick={() => setRating(i)}>
                          {i <= rating ? STAR_SVG_FILLED : STAR_SVG}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Description *</label>
                  <textarea className="hor-textarea" placeholder="Describe your hotel, its unique features, and what makes it special..." {...register('description')} />
                  {errors.description && <span className="hor-error">{errors.description.message}</span>}
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Address *</label>
                  <input className="hor-input" placeholder="123 Main Street" {...register('address')} />
                  {errors.address && <span className="hor-error">{errors.address.message}</span>}
                </div>
                <div className="hor-row">
                  <div className="hor-field">
                    <label className="hor-label">City *</label>
                    <input className="hor-input" placeholder="Mirissa" {...register('city')} />
                    {errors.city && <span className="hor-error">{errors.city.message}</span>}
                  </div>
                  <div className="hor-field">
                    <label className="hor-label">Country *</label>
                    <input className="hor-input" placeholder="Sri Lanka" {...register('country')} />
                    {errors.country && <span className="hor-error">{errors.country.message}</span>}
                  </div>
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Travel Purposes *</label>
                  <div className="hor-purposes">
                    {TRAVEL_PURPOSES.map(p => (
                      <button
                        key={p}
                        type="button"
                        className={`hor-purpose ${travelPurposes.includes(p) ? 'hor-purpose-active' : ''}`}
                        onClick={() => togglePurpose(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {errors.travelPurposes && <span className="hor-error">{errors.travelPurposes.message}</span>}
                </div>

                {error && <div className="hor-error">{error}</div>}
                <div className="hor-actions">
                  <button
                    type="button"
                    className="hor-btn hor-btn-prev"
                    onClick={() => navigate('/hotel-owner-dashboard')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="hor-btn hor-btn-complete" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Hotel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}