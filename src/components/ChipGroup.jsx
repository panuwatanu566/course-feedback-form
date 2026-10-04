import React from 'react';

/**
 * ChipGroup Component - ตัวเลือกแบบ Multi-select รูปแบบ Chip
 * 
 * @param {Object} props
 * @param {Array<{id: string, label: string}>} props.options - รายการตัวเลือก
 * @param {string[]} props.selectedValues - ค่าที่ถูกเลือก
 * @param {function(string[]): void} props.onChange - Handler เปลี่ยนค่า
 * @param {function(): void} [props.onBlur] - Handler ตอน blur
 * @param {boolean} [props.disabled=false] - สถานะ disabled
 * @param {string} [props.name="aspects"] - ชื่อ field
 */
export default function ChipGroup({
  options = [],
  selectedValues = [],
  onChange,
  onBlur,
  disabled = false,
  name = 'aspects'
}) {
  const handleToggle = (optionId) => {
    if (disabled) return;
    if (selectedValues.includes(optionId)) {
      onChange(selectedValues.filter((id) => id !== optionId));
    } else {
      onChange([...selectedValues, optionId]);
    }
  };

  return (
    <div className="chip-group" role="group" aria-label="ด้านที่อยากพูดถึง">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.id);
        const inputId = `${name}-chip-${option.id}`;

        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={`chip-item ${isChecked ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          >
            <input
              type="checkbox"
              id={inputId}
              name={name}
              value={option.id}
              checked={isChecked}
              disabled={disabled}
              onChange={() => handleToggle(option.id)}
              onBlur={onBlur}
              className="visually-hidden-checkbox"
            />
            {isChecked && (
              <svg
                className="chip-check-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
