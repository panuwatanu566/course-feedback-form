/**
 * @typedef {Object} Course
 * @property {string} id - รหัสรายวิชา
 * @property {string} name - ชื่อรายวิชา
 */

/**
 * รายวิชาที่มีเปิดให้ประเมินในระบบ
 * @type {Course[]}
 */
export const courses = [
  {
    id: "ICT12267",
    name: "ICT12267 React & Software Creator in the AI Era"
  },
  {
    id: "ICT24167",
    name: "ICT24167 Network Management"
  },
  {
    id: "ICT22567",
    name: "ICT22567 Data Analysis and Data Visualization"
  }
];

/**
 * @typedef {Object} AspectOption
 * @property {string} id - รหัสด้านที่ประเมิน
 * @property {string} label - ข้อความแสดงบนหน้าจอ
 */

/**
 * ตัวเลือกด้านที่ต้องการประเมิน (เลือกได้หลายข้อ)
 * @type {AspectOption[]}
 */
export const aspectOptions = [
  { id: "content", label: "เนื้อหา" },
  { id: "teaching", label: "วิธีการสอน" },
  { id: "materials", label: "สื่อและเอกสาร" },
  { id: "workload", label: "งานและการบ้าน" },
  { id: "assessment", label: "การวัดผล" }
];
