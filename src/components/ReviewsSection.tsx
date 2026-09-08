'use client';

import React, { useState, useEffect } from 'react';

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  const loadReviews = () => {
    // Check localStorage cache first
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_reviews_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviews(parsed);
          }
        } catch (e) {}
      }
    }

    // Fetch from API
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_reviews_cache', JSON.stringify(data));
          }
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    loadReviews();

    const handleUpdate = () => {
      loadReviews();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('reviews_updated', handleUpdate);
      return () => {
        window.removeEventListener('reviews_updated', handleUpdate);
      };
    }
  }, []);

  return (
    <section id="reviews" className="section-wrap reviews-section">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Words from the wild</p>
          <h2>
            Guests who <em>wandered</em> with us
          </h2>
        </div>

        <div className="rating-lockup">
          <strong>4.9</strong>
          <div>
            <div className="stars">★★★★★</div>
            <span>Tripadvisor · {180 + reviews.length} reviews</span>
          </div>
        </div>
      </div>

      <div className="reviews-grid">
        {reviews.map((rev) => (
          <article key={rev.id} className="review-card">
            <div className="review-top">
              <span className="flag-dot">{rev.countryFlag}</span>
              <span>{rev.country}</span>
              <div className="stars">
                {'★'.repeat(Math.min(5, Math.max(1, Number(rev.rating) || 5)))}
              </div>
            </div>
            <p>“{rev.text}”</p>
            <strong>{rev.author}</strong>
            <small>Verified traveller</small>
          </article>
        ))}
      </div>
    </section>
  );
};
