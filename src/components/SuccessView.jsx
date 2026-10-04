import React from 'react';
import { courses, aspectOptions } from '../data';

/**
 * SuccessView Component - หน้าแสดงความขอบคุณเมื่อส่งข้อมูลสำเร็จ
 * 
 * @param {Object} props
 * @param {Object} props.result - ผลลัพธ์จากการส่งข้อมูล { id: string, payload: Object }
 * @param {function(): void} props.onReset - Handler สำหรับรีเซ็ตฟอร์มกลับค่าเริ่มต้น
 */
export default function SuccessView({ result, onReset }) {
  if (!result || !result.payload) return null;

  const { id, payload } = result;
  const courseObj = courses.find((c) => c.id === payload.courseId);
  const courseTitle = courseObj ? courseObj.name : payload.courseId;

  const aspectLabels = (payload.aspects || [])
    .map((aspId) => {
      const opt = aspectOptions.find((a) => a.id === aspId);
      return opt ? opt.label : aspId;
    })
    .join(', ');

  return (
    <div className="card success-card" role="region" aria-label="ผลการส่ง Feedback">
      <div className="success-header">
        <div className="success-icon-badge">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="32"
            height="32"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className="success-title">ขอบคุณสำหรับ Feedback!</h2>
        <p className="success-subtitle">
          ข้อมูลของคุณถูกส่งไปยังอาจารย์ผู้สอนเพื่อนำไปปรับปรุงรายวิชาเรียบร้อยแล้ว
        </p>
      </div>

      <div className="reference-box">
        <span className="reference-label">รหัสอ้างอิงการส่ง</span>
        <strong className="reference-code">{id}</strong>
      </div>

      <div className="summary-section">
        <h3 className="summary-title">สรุปข้อมูลที่คุณส่ง</h3>
        <dl className="summary-list">
          <div className="summary-item">
            <dt>รายวิชา:</dt>
            <dd>{courseTitle}</dd>
          </div>
          <div className="summary-item">
            <dt>ระดับความพึงพอใจ:</dt>
            <dd className="rating-stars">
              {'★'.repeat(payload.overallRating)}{'☆'.repeat(5 - payload.overallRating)} ({payload.overallRating}/5 ดาว)
            </dd>
          </div>
          {aspectLabels && (
            <div className="summary-item">
              <dt>ด้านที่พูดถึง:</dt>
              <dd>{aspectLabels}</dd>
            </div>
          )}
          <div className="summary-item">
            <dt>ข้อเสนอแนะ:</dt>
            <dd className="comment-text">{payload.comment}</dd>
          </div>
          <div className="summary-item">
            <dt>ผู้ส่ง:</dt>
            <dd>
              {payload.isAnonymous ? (
                <span className="badge-anonymous">ไม่ระบุตัวตน</span>
              ) : (
                <span>รหัสนักศึกษา: {payload.studentId}</span>
              )}
            </dd>
          </div>
          <div className="summary-item">
            <dt>เวลาที่ส่ง:</dt>
            <dd>{new Date(payload.submittedAt).toLocaleString('th-TH')}</dd>
          </div>
        </dl>
      </div>

      <details className="json-details">
        <summary className="json-summary">ดูข้อมูลที่ระบบได้รับ (JSON)</summary>
        <pre className="json-code">
          <code>{JSON.stringify(payload, null, 2)}</code>
        </pre>
      </details>

      <button
        type="button"
        className="btn-primary reset-btn"
        onClick={onReset}
      >
        ส่ง Feedback วิชาอื่น
      </button>
    </div>
  );
}
