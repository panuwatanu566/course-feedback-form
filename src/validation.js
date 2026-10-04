/**
 * @typedef {Object} FeedbackForm
 * @property {string} courseId - รหัสวิชาที่เลือก
 * @property {number} overallRating - คะแนนความพึงพอใจโดยรวม (1-5)
 * @property {string[]} aspects - ด้านที่ต้องการพูดถึง
 * @property {string} comment - ข้อเสนอแนะ
 * @property {boolean} isAnonymous - สถานะส่งแบบไม่ระบุตัวตน
 * @property {string} studentId - รหัสนักศึกษา (กรณีไม่ปิดบังตัวตน)
 */

/**
 * @typedef {Object.<string, string>} ValidationErrors
 */

/**
 * ฟังก์ชัน Pure Function ตรวจสอบความถูกต้องของข้อมูลในฟอร์ม
 * @param {FeedbackForm} form - ข้อมูลฟอร์มปัจจุบัน
 * @returns {ValidationErrors} Object เก็บข้อความ Error ตามชื่อ Field (ถ้าไม่มี Error จะได้ Object ว่าง)
 */
export function validateForm(form) {
  const errors = {};

  // 1. ตรวจสอบ courseId
  if (!form.courseId || form.courseId.trim() === '') {
    errors.courseId = 'กรุณาเลือกรายวิชา';
  }

  // 2. ตรวจสอบ overallRating (ต้องเป็นจำนวนเต็ม 1–5)
  if (!form.overallRating || form.overallRating < 1 || form.overallRating > 5) {
    errors.overallRating = 'กรุณาให้คะแนน 1–5 ดาว';
  }

  // 3. ตรวจสอบ comment
  const trimmedComment = form.comment ? form.comment.trim() : '';
  if (trimmedComment.length === 0) {
    errors.comment = 'กรุณาเขียนข้อเสนอแนะ';
  } else if (!/^[a-zA-Z0-9\u0E00-\u0E7F\s.,!?'"()_\-/:%]*$/.test(form.comment)) {
    errors.comment = 'ข้อเสนอแนะต้องเป็นภาษาไทย ภาษาอังกฤษ หรือตัวเลขเท่านั้น';
  } else if (trimmedComment.length < 10) {
    errors.comment = 'ข้อเสนอแนะสั้นเกินไป เขียนอย่างน้อย 10 ตัวอักษร';
  } else if (form.comment.length > 500) {
    errors.comment = 'ข้อเสนอแนะยาวเกิน 500 ตัวอักษร';
  }

  // 4. ตรวจสอบ studentId (เฉพาะกรณีปิด switch ไม่ระบุตัวตน คือ isAnonymous = false)
  if (!form.isAnonymous) {
    const trimmedStudentId = form.studentId ? form.studentId.trim() : '';
    if (trimmedStudentId.length === 0) {
      errors.studentId = 'กรุณากรอกรหัสนักศึกษา';
    } else if (!/^\d{8}$/.test(trimmedStudentId)) {
      errors.studentId = 'รหัสนักศึกษาต้องเป็นตัวเลข 8 หลัก';
    }
  }

  return errors;
}
