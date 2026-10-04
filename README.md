# ระบบส่ง Feedback รายวิชา (Course Feedback Form)

ระบบประเมินและให้ข้อเสนอแนะรายวิชาแบบหน้าเดียว (Single Page Application) พัฒนาด้วย React และ Vite ตามข้อกำหนดงานวิชา **ICT12267 Form Design Challenge (ข้อ 10)**

---

## 🚀 วิธีการรันโปรเจกต์ (Getting Started)

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **เปิด Dev Server สำหรับทดสอบ (รองรับการเข้าจากเครื่องอื่นในวง LAN):**
   ```bash
   npm run dev
   ```
   จากนั้น Vite จะแสดงทั้ง `Local:` (เข้าจากเครื่องนี้) และ `Network:` (เช่น `http://192.168.x.x:5173` สำหรับให้มือถือหรือเครื่องอื่นในวง Wi-Fi เดียวกันเข้าถึง)

3. **ทดสอบสร้าง Production Build:**
   ```bash
   npm run build
   ```

---

## 🎨 การออกแบบตามหลัก 6 ข้อ (Design Rationale)

### 1. User คือใคร (User Persona)
- **ผู้กรอก**: นักศึกษาที่เรียนวิชานั้นในภาคเรียนนี้ ส่วนใหญ่กรอกจากมือถือช่วงท้ายคาบ มีเวลาน้อย และบางคนไม่กล้าวิจารณ์หากต้องเปิดเผยชื่อ
- **เป้าหมายของผู้กรอก**: ให้คะแนนและส่งความเห็นเสร็จสิ้นได้ภายใน 2 นาที โดยสามารถเลือกไม่เปิดเผยตัวตนได้
- **ผู้ใช้ข้อมูล**: อาจารย์ผู้สอน นำคะแนนเฉลี่ยและความเห็นไปปรับปรุงวิชาในภาคเรียนถัดไป
- **ผลต่อการออกแบบ**: ออกแบบ Mobile-First, Touch Target มีขนาดอย่างน้อย 44px, ตั้งค่าไม่ระบุตัวตนเป็นค่าเริ่มต้น (`isAnonymous = true`)

### 2. Software ต้องการข้อมูลอะไร (Data Requirements)
- ประเมินวิชาไหน → `courseId`
- ความพึงพอใจโดยรวมเป็นตัวเลข → `overallRating` (1–5)
- ประเด็นที่อยากพูดถึง → `aspects` ( string[] )
- รายละเอียดข้อเสนอแนะ → `comment`
- สถานะการระบุตัวตนและรหัสนักศึกษา → `isAnonymous`, `studentId`
- ข้อมูลที่ระบบเติมให้อัตโนมัติ → `semester` ("1/2569"), `submittedAt` (ISO Timestamp)

### 3 & 4. Field, UI Control, Data Type และเหตุผลในการเลือก

| Field | Label บนจอ | UI Control | Data Type | จำเป็น | เหตุผลในการเลือก |
|---|---|---|---|---|---|
| `courseId` | รายวิชาที่ต้องการประเมิน * | `<select>` | `string` | ใช่ | รายวิชามีจำนวนจำกัด การเลือกจากรายการช่วยป้องกันการพิมพ์รหัสวิชาผิด |
| `overallRating` | ความพึงพอใจโดยรวม * | ดาว 5 ดวง (Radio group) | `number` (1–5) | ใช่ | ให้คะแนนได้รวดเร็วด้วยการแตะครั้งเดียว และเป็น number เพื่อนำไปคำนวณค่าเฉลี่ย |
| `aspects` | อยากพูดถึงด้านไหน | Chip Group (Checkbox group) | `string[]` | ไม่ | สามารถเลือกได้หลายประเด็น มองเห็นตัวเลือกครบถ้วนโดยไม่ต้องเปิด dropdown |
| `comment` | ข้อเสนอแนะ * | `<textarea>` 5 แถว พร้อมตัวนับ | `string` | ใช่ | รองรับข้อความยาวหลายบรรทัด มีตัวนับ 0/500 เพื่อแจ้งความยาว |
| `isAnonymous` | ส่งแบบไม่ระบุตัวตน | Toggle Switch (`role="switch"`) | `boolean` | – | เป็นสถานะทวิภาค (Binary State) สลับเปิด-ปิดได้ชัดเจน |
| `studentId` | รหัสนักศึกษา * | `<input type="text" inputMode="numeric">` | `string` | ใช่ (เฉพาะเปิดเผยตัวตน) | เก็บเป็น string ไม่ใช่ number เพื่อรักษาสภาพเลข `0` นำหน้า แสดงเฉพาะเมื่อปิด switch ไม่ระบุตัวตน |

---

## 5. Validation และ Error Message

| # | Field | กฎการตรวจสอบ (Validation Rules) | Error Message |
|---|---|---|---|
| 1 | `courseId` | ต้องเลือกรายวิชา | `กรุณาเลือกรายวิชา` |
| 2 | `overallRating` | ต้องเลือกดาว 1–5 (ค่าเริ่มต้น 0 = ยังไม่เลือก) | `กรุณาให้คะแนน 1–5 ดาว` |
| 3 | `comment` | หลัง trim() ต้องไม่เป็นค่าว่าง | `กรุณาเขียนข้อเสนอแนะ` |
| 4 | `comment` | ความยาวหลัง trim() ต้องอย่างน้อย 10 ตัวอักษร | `ข้อเสนอแนะสั้นเกินไป เขียนอย่างน้อย 10 ตัวอักษร` |
| 5 | `comment` | ความยาวต้องไม่เกิน 500 ตัวอักษร | `ข้อเสนอแนะยาวเกิน 500 ตัวอักษร` |
| 6 | `studentId` | ตรวจเฉพาะกรณี `isAnonymous === false`: ห้ามว่าง | `กรุณากรอกรหัสนักศึกษา` |
| 7 | `studentId` | ตรวจเฉพาะกรณี `isAnonymous === false`: ต้องเป็นตัวเลข 8 หลักพอดี (`/^\d{8}$/`) | `รหัสนักศึกษาต้องเป็นตัวเลข 8 หลัก` |

> **หมายเหตุการทำ Validation:**
> - `validateForm(form)` เป็น Pure Function ที่คืนค่า Object ของ Error เช่น `{ courseId: "กรุณาเลือกรายวิชา" }`
> - หน้าจอจะไม่แสดง Error ตอนเปิดหน้าครั้งแรก แต่จะแสดงเมื่อผู้ใช้ออกจากช่องนั้น (blur) หรือเมื่อกดปุ่มส่ง และจะหายไปทันทีเมื่อแก้ไขข้อมูลถูกต้อง
> - Textarea ไม่ใส่คุณสมบัติ `maxLength` เพื่อให้ผู้ใช้พิมพ์เกินได้ แล้วแสดงตัวนับเป็นสีแดงแจ้งเตือน
> - ช่องที่มีข้อผิดพลาดจะมีไอคอนและข้อความใต้ช่อง พร้อมส่งผ่าน `aria-invalid` และ `aria-describedby` เพื่อความเข้าถึงได้ (Accessibility)

---

## 6. Submit Flow & Handling

```
[กดปุ่ม ส่ง Feedback]
         │
         ▼
[1. preventDefault() & ตั้งค่า touched ทุกช่องเป็น true]
         │
         ▼
[2. เรียก validateForm(form)]
         │
         ├──► [พบ Error] ──► แสดงกล่องสรุป Error เหนือปุ่มส่ง ──► Smooth Scroll & Focus ช่องแรกที่ผิด ──► หยุดการทำงาน
         │
         └──► [ข้อมูลถูกต้อง]
                   │
                   ▼
       [3. สร้าง Payload] (กรณี isAnonymous = true จะบังคับ studentId: null เสมอ)
                   │
                   ▼
       [4. ตั้ง status = "submitting"] ──► ครอบ <fieldset disabled> ป้องกันการส่งซ้ำ ──► ปุ่มแสดง "กำลังส่ง…"
                   │
                   ▼
       [5. เรียก submitFeedback(payload) ใน api.js (หน่วงเวลา 1.2 วินาที)]
                   │
                   ├──► [สำเร็จ] ──► ตั้ง status = "success" ──► แสดงหน้า SuccessView ขอบคุณ + รหัสอ้างอิง FB-XXXXXX
                   │
                   └──► [ล้มเหลว / Offline] ──► ตั้ง status = "error" ──► แสดงแถบแจ้งเตือนล้มเหลว ──► คงข้อมูลเดิมให้แก้ไข/ส่งซ้ำได้
```

---

## 📁 โครงสร้างไฟล์ในโปรเจกต์ (File Structure)

- `index.html`: กำหนด Viewport และเชื่อมต่อ Google Font (IBM Plex Sans Thai)
- `src/App.jsx`: ส่วนควบคุม State หลัก, Form Submit Flow, การจัดการ Error และการแสดงผลหน้าจอ
- `src/App.css`: สไตล์ชีต CSS Variables, Mobile-First Responsive Layout, Component Controls, Focus Visible และ Reduced Motion Rules
- `src/validation.js`: Pure Function สำหรับตรวจข้อมูลในฟอร์มตามกฎ Validation 5 ข้อ
- `src/api.js`: Mock API สำหรับส่ง Feedback พร้อม JSDoc อธิบายการทำงานของระบบเซิร์ฟเวอร์จริง
- `src/data.js`: ข้อมูลรายวิชา (`courses`) และประเด็นการประเมิน (`aspectOptions`)
- `src/components/Field.jsx`: Wrapper Component จัดการ Label, Required Asterisk, Helper Text และ Accessible Error Message
- `src/components/StarRating.jsx`: Radio Group ประเมินดาว 5 ดวง ปรับแต่งรูปดาว SVG พร้อมข้อความบอกระดับคะแนน
- `src/components/ChipGroup.jsx`: Multi-Select Checkbox Group ออกแบบเป็น Chip พร้อมไอคอนเครื่องหมายถูก
- `src/components/SuccessView.jsx`: หน้าแสดงผลส่งสำเร็จ สรุปข้อมูล พร้อม `<details>` แสดง JSON Payload และปุ่มส่งวิชาอื่น
