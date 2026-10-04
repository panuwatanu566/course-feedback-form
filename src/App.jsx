import React, { useState, useRef } from 'react';
import { courses, aspectOptions } from './data';
import { validateForm } from './validation';
import { submitFeedback } from './api';
import Field from './components/Field';
import StarRating from './components/StarRating';
import ChipGroup from './components/ChipGroup';
import SuccessView from './components/SuccessView';

const INITIAL_FORM_STATE = {
  courseId: '',
  overallRating: 0,
  aspects: [],
  comment: '',
  isAnonymous: true,
  studentId: ''
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [result, setResult] = useState(null);

  const formRef = useRef(null);

  // คำนวณ Errors จาก State ปัจจุบันเสมอ (Derived State)
  const errors = validateForm(form);
  const errorCount = Object.keys(errors).length;

  // Handler สำหรับอัปเดตฟิลด์ใน Form
  const handleChange = (field, value) => {
    let finalValue = value;
    if (field === 'comment') {
      // กรองให้พิมพ์ได้เฉพาะ ภาษาไทย, ภาษาอังกฤษ, ตัวเลข, ช่องว่าง และเครื่องหมายพื้นฐาน
      finalValue = value.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s.,!?'"()_\-/:%]/g, '');
    }
    setForm((prev) => ({ ...prev, [field]: finalValue }));
  };

  // Handler สำหรับทำเครื่องหมายว่าผู้ใช้แตะฟิลด์นั้นแล้ว (Blur)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handler สำหรับการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    // แสดงข้อความ Error ทุกช่องเมื่อกดส่งฟอร์ม
    setIsSubmitted(true);

    // 1. ตั้งค่า touched ทุกช่องเป็น true
    const allTouched = {
      courseId: true,
      overallRating: true,
      comment: true,
      studentId: true
    };
    setTouched(allTouched);

    // 2. เรียก validateForm
    const currentErrors = validateForm(form);
    const firstErrorField = Object.keys(currentErrors)[0];

    if (firstErrorField) {
      // มี Error -> เลื่อนและโฟกัสไปที่ช่องแรกที่ผิด
      let focusTargetId = firstErrorField;
      if (firstErrorField === 'overallRating') {
        focusTargetId = 'overallRating-star-1';
      }

      setTimeout(() => {
        const targetElement = document.getElementById(focusTargetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.focus();
        }
      }, 50);
      return;
    }

    // ฟังก์ชันสร้าง ISO String เวลาประเทศไทย (+07:00)
    const getThailandISOString = (date = new Date()) => {
      const pad = (n, width = 2) => String(n).padStart(width, '0');
      const bkkDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
      const year = bkkDate.getFullYear();
      const month = pad(bkkDate.getMonth() + 1);
      const day = pad(bkkDate.getDate());
      const hours = pad(bkkDate.getHours());
      const minutes = pad(bkkDate.getMinutes());
      const seconds = pad(bkkDate.getSeconds());
      const ms = pad(date.getMilliseconds(), 3);
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}+07:00`;
    };

    // 3. ผ่านการตรวจข้อมูล -> สร้าง Payload
    const payload = {
      courseId: form.courseId,
      semester: '1/2569',
      overallRating: form.overallRating,
      aspects: form.aspects,
      comment: form.comment.trim(),
      isAnonymous: form.isAnonymous,
      studentId: form.isAnonymous ? null : form.studentId.trim(),
      submittedAt: getThailandISOString()
    };

    // 4. เปลี่ยนสถานะเป็นกำลังส่ง
    setStatus('submitting');

    try {
      // 5. เรียก mock API
      const res = await submitFeedback(payload);
      setResult({
        id: res.id,
        payload
      });
      setStatus('success');
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  // รีเซ็ตฟอร์มกลับค่าเริ่มต้น
  const handleReset = () => {
    setForm(INITIAL_FORM_STATE);
    setTouched({});
    setIsSubmitted(false);
    setStatus('idle');
    setResult(null);
  };

  if (status === 'success' && result) {
    return (
      <div className="app-container">
        <SuccessView result={result} onReset={handleReset} />
      </div>
    );
  }

  const commentLength = form.comment.length;
  const isCommentOver = commentLength > 500;

  return (
    <div className="app-container">
      {/* ส่วนหัวหน้าจอ */}
      <header className="app-header">
        <span className="sub-header">แบบประเมินรายวิชา · ภาคเรียนที่ 1/2569</span>
        <h1 className="header-title">ส่ง Feedback รายวิชา</h1>
        <p className="header-desc">
          ใช้เวลาไม่เกิน 2 นาที ความเห็นของคุณช่วยให้วิชานี้ดีขึ้น
        </p>
      </header>

      {/* ฟอร์มหลักในการ์ดขาว */}
      <main className="card form-card">
        <div className="form-info-bar">
          <span className="required-notice">* จำเป็นต้องกรอก</span>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <fieldset disabled={status === 'submitting'} className="form-fieldset">
            {/* 1. เลือกรายวิชา */}
            <Field
              id="courseId"
              label="รายวิชาที่ต้องการประเมิน"
              required
              error={isSubmitted ? errors.courseId : undefined}
            >
              <select
                id="courseId"
                className="form-control select-control"
                value={form.courseId}
                onChange={(e) => handleChange('courseId', e.target.value)}
                onBlur={() => handleBlur('courseId')}
              >
                <option value="">เลือกรายวิชา</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* 2. คะแนนความพึงพอใจโดยรวม */}
            <Field
              id="overallRating"
              label="ความพึงพอใจโดยรวม"
              required
              error={isSubmitted ? errors.overallRating : undefined}
            >
              <StarRating
                id="overallRating"
                name="overallRating"
                value={form.overallRating}
                onChange={(rating) => handleChange('overallRating', rating)}
                onBlur={() => handleBlur('overallRating')}
                disabled={status === 'submitting'}
              />
            </Field>

            {/* 3. ด้านที่อยากพูดถึง */}
            <Field
              id="aspects"
              label="อยากพูดถึงด้านไหน (เลือกได้หลายข้อ)"
              helperText="เลือกหัวข้อที่สอดคล้องกับข้อเสนอแนะของคุณ"
            >
              <ChipGroup
                name="aspects"
                options={aspectOptions}
                selectedValues={form.aspects}
                onChange={(selected) => handleChange('aspects', selected)}
                onBlur={() => handleBlur('aspects')}
                disabled={status === 'submitting'}
              />
            </Field>

            {/* 4. ข้อเสนอแนะ */}
            <Field
              id="comment"
              label="ข้อเสนอแนะ"
              required
              error={isSubmitted ? errors.comment : undefined}
              helperText="พิมพ์ได้เฉพาะภาษาไทย ภาษาอังกฤษ และตัวเลขเท่านั้น"
            >
              <div className="textarea-wrapper">
                <textarea
                  id="comment"
                  className="form-control textarea-control"
                  rows={5}
                  placeholder="เช่น ชอบที่มีตัวอย่างให้ลองทำตาม อยากให้เพิ่มเวลาทำ Lab"
                  value={form.comment}
                  onChange={(e) => handleChange('comment', e.target.value)}
                  onBlur={() => handleBlur('comment')}
                />
                <div
                  className={`char-counter ${isCommentOver ? 'counter-over-limit' : ''}`}
                  aria-live="polite"
                >
                  {commentLength}/500
                </div>
              </div>
            </Field>

            {/* 5. สวิตช์เปิดเผยตัวตน */}
            <div className="anonymous-toggle-container">
              <div className="toggle-info">
                <label htmlFor="isAnonymous-switch" className="toggle-label">
                  ส่งแบบไม่ระบุตัวตน
                </label>
                <span className="toggle-desc">
                  เปิดไว้ อาจารย์จะไม่เห็นว่าใครเป็นผู้ส่ง
                </span>
              </div>
              <label className="switch-control">
                <input
                  type="checkbox"
                  id="isAnonymous-switch"
                  role="switch"
                  checked={form.isAnonymous}
                  aria-checked={form.isAnonymous}
                  disabled={status === 'submitting'}
                  onChange={(e) => handleChange('isAnonymous', e.target.checked)}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            {/* รหัสนักศึกษา (แสดงเฉพาะเมื่อปิดสวิตช์ไม่ระบุตัวตน) */}
            {!form.isAnonymous && (
              <div className="student-id-section">
                <Field
                  id="studentId"
                  label="รหัสนักศึกษา"
                  required
                  error={isSubmitted ? errors.studentId : undefined}
                  helperText="ตัวเลข 8 หลัก เช่น 66123456"
                >
                  <input
                    type="text"
                    id="studentId"
                    inputMode="numeric"
                    className="form-control text-control"
                    placeholder="กรอกรหัสนักศึกษา 8 หลัก"
                    value={form.studentId}
                    onChange={(e) => handleChange('studentId', e.target.value)}
                    onBlur={() => handleBlur('studentId')}
                  />
                </Field>
              </div>
            )}


            {/* แถบแจ้งเตือนกรณีล้มเหลวในการส่ง (Offline/Network error) */}
            {status === 'error' && (
              <div className="submission-error-banner" role="alert">
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>ส่งไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง</span>
              </div>
            )}

            {/* ปุ่มส่ง */}
            <button
              type="submit"
              className="btn-primary submit-btn"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <span className="spinner-wrapper">
                  <span className="spinner-icon"></span>
                  กำลังส่ง…
                </span>
              ) : (
                'ส่ง Feedback'
              )}
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
