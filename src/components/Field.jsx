import React from 'react';

/**
 * Field Component - Wrapper สำหรับควบคุมการแสดงผล Label, Asterisk, Error Message และ Helper Text
 * 
 * @param {Object} props
 * @param {string} props.id - HTML ID สำหรับผูก label กับ input
 * @param {string} props.label - ข้อความ Label
 * @param {boolean} [props.required=false] - แสดงเครื่องหมาย *
 * @param {string} [props.error] - ข้อความ Error (ถ้ามี)
 * @param {string} [props.helperText] - ข้อความแนะนำเพิ่มเติม
 * @param {React.ReactNode} props.children - UI Control (select, input, textarea ฯลฯ)
 * @param {string} [props.className] - CSS Class เพิ่มเติม
 */
export default function Field({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = ''
}) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  // โคลน children เพื่อฉีด aria-invalid และ aria-describedby ให้แบบอัตโนมัติ
  const childWithAria = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: children.props.id || id,
        'aria-invalid': !!error,
        'aria-describedby': describedBy,
      })
    : children;

  return (
    <div className={`field-container ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="required-asterisk" aria-hidden="true"> *</span>}
        </label>
      )}

      {childWithAria}

      {error ? (
        <div id={errorId} className="field-error-msg" role="alert">
          <svg
            className="field-error-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            width="16"
            height="16"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={helperId} className="field-helper-text">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
