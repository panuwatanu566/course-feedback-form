/**
 * @typedef {Object} FeedbackPayload
 * @property {string} courseId - รหัสรายวิชาที่เลือก
 * @property {string} semester - ภาคเรียน (เช่น "1/2569")
 * @property {number} overallRating - คะแนนความพึงพอใจโดยรวม (1-5)
 * @property {string[]} aspects - ด้านที่เลือกแสดงความเห็น
 * @property {string} comment - ข้อเสนอแนะ (ตัด space หัวท้ายแล้ว)
 * @property {boolean} isAnonymous - สถานะส่งแบบไม่ระบุตัวตน
 * @property {string|null} studentId - รหัสนักศึกษา (ถ้าไม่ระบุตัวตนจะเป็น null เสมอ)
 * @property {string} submittedAt - เวลาที่ส่งรูปแบบ ISO String
 */

/**
 * @typedef {Object} SubmitResult
 * @property {string} id - รหัสอ้างอิงของ Feedback (เช่น "FB-123456")
 */

/**
 * จำลองการส่งข้อมูล Feedback ไปยังระบบ Backend API
 * 
 * [หมายเหตุสำหรับการทำงานกับระบบจริง]:
 * ในระบบ Production จริง ฟังก์ชันนี้จะทำการส่ง HTTP POST Request ไปยัง REST API endpoint (เช่น `/api/v1/feedback`)
 * โดยที่เซิร์ฟเวอร์จะทำหน้าที่:
 * 1. ตรวจสอบความถูกต้องของข้อมูลซ้ำอีกครั้ง (Server-side Validation)
 * 2. บันทึกข้อมูลลงในฐานข้อมูล (Database)
 * 3. คำนวณคะแนนเฉลี่ยใหม่ของรายวิชา (Recalculate Average Course Rating)
 * 4. ส่งการแจ้งเตือนไปยังอาจารย์ผู้สอนรายวิชานั้นๆ
 * 
 * @param {FeedbackPayload} payload - ข้อมูลที่พร้อมส่งไปเซิร์ฟเวอร์
 * @returns {Promise<SubmitResult>} ผลลัพธ์พร้อมรหัสอ้างอิง
 */
export function submitFeedback(payload) {
  return new Promise((resolve, reject) => {
    // แสดง log ใน console ตามสเปก
    console.log('Sending Feedback Payload:', payload);

    // จำลองการหน่วงเวลาเครือข่าย 1.2 วินาที (1200ms)
    setTimeout(() => {
      // ตรวจสอบสถานะการเชื่อมต่ออินเทอร์เน็ต
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        reject(new Error('ส่งไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง'));
        return;
      }

      // สุ่มรหัสอ้างอิง FB-XXXXXX 6 หลัก
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const result = {
        id: `FB-${randomCode}`
      };

      resolve(result);
    }, 1200);
  });
}
