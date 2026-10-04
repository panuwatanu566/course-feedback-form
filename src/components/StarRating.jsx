import React, { useState } from 'react';

const RATING_LABELS = {
  1: '1 ควรปรับปรุงมาก',
  2: '2 ควรปรับปรุง',
  3: '3 พอใช้',
  4: '4 ดี',
  5: '5 ดีมาก'
};

/**
 * StarRating Component - ให้คะแนน 1-5 ดาวด้วย Radio Group
 * 
 * @param {Object} props
 * @param {string} [props.name="overallRating"] - ชื่อ field
 * @param {number} props.value - ค่าคะแนนปัจจุบัน (0-5)
 * @param {function(number): void} props.onChange - Handler เปลี่ยนค่า
 * @param {function(): void} [props.onBlur] - Handler ตอน blur
 * @param {boolean} [props.disabled=false] - สถานะ disabled
 * @param {string} [props.id] - ID ขององค์ประกอบ
 */
export default function StarRating({
  name = 'overallRating',
  value = 0,
  onChange,
  onBlur,
  disabled = false,
  id = 'overallRating'
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayRating = hoverValue || value;

  return (
    <div className="star-rating-wrapper">
      <div 
        className="star-rating-group" 
        role="radiogroup" 
        aria-label="ความพึงพอใจโดยรวม 1 ถึง 5 ดาว"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= displayRating;
          const inputId = `${id}-star-${starIndex}`;

          return (
            <label
              key={starIndex}
              htmlFor={inputId}
              className={`star-label ${isFilled ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
              onMouseEnter={() => !disabled && setHoverValue(starIndex)}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={starIndex}
                checked={value === starIndex}
                disabled={disabled}
                onChange={() => onChange(starIndex)}
                onBlur={onBlur}
                className="visually-hidden-radio"
              />
              <svg
                className="star-icon"
                viewBox="0 0 24 24"
                width="36"
                height="36"
                aria-hidden="true"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            </label>
          );
        })}
      </div>

      <div className="star-rating-text" aria-live="polite">
        {displayRating > 0 ? (
          <span className="rating-badge">{RATING_LABELS[displayRating]}</span>
        ) : (
          <span className="rating-hint">แตะเพื่อเลือกคะแนน (1-5 ดาว)</span>
        )}
      </div>
    </div>
  );
}
