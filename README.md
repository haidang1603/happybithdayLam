# GALAXY BIRTHDAY UNIVERSE ✨
> **A Little Universe Made Just for You**  
> Website chúc mừng sinh nhật 3D tương tác cao cấp dành tặng bạn thân.

---

## 1. Giới thiệu dự án
**Galaxy Birthday Universe** là một trải nghiệm kỹ thuật số 3D có tính kể chuyện và cảm xúc, đưa người nhận vào một vũ trụ thu nhỏ ngập tràn ánh sao, tinh vân chuyển động, âm thanh không gian du dương và những kỷ niệm chân thành giữa hai người bạn.

### Trải nghiệm qua 7 phân đoạn chính:
1. **Galaxy Portal**: Cổng vũ trụ 3D với hàng nghìn vì sao, hiệu ứng warp speed bước vào hành trình.
2. **Birthday Celebration**: Bánh sinh nhật 3D nhiều tầng, nến thắp sáng có thể thổi tắt bằng tương tác, hiệu ứng pháo giấy confetti và bóng bay lơ lửng.
3. **Memory Gallery**: Album ảnh kỷ niệm dạng thẻ Polaroid 3D lơ lửng với góc nghiêng parallax, hỗ trợ phóng to Lightbox toàn màn hình.
4. **Friendship Timeline**: Dòng thời gian phát sáng dạng chòm sao ghi lại các cột mốc tình bạn từ ngày đầu quen biết.
5. **Secret Gift Box**: Hộp quà bí mật 3D lơ lửng, nắp mở bật ra ánh sáng rực rỡ và phần thưởng tình bạn ("VIP Friendship Pass", lẩu full topping, phiếu miễn càu nhàu 365 ngày).
6. **Birthday Letter**: Lá thư chân thành từ trạm vũ trụ với phong thư tương tác, hiệu ứng xuất hiện từng đoạn văn bản tiếng Việt có dấu.
7. **Fireworks Finale**: Màn pháo hoa 3D rực rỡ trên bầu trời sao và nút trải nghiệm lại từ đầu.

---

## 2. Công nghệ sử dụng
- **Frontend Core**: React 19, TypeScript, Vite.
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
- **Styling & UI**: Tailwind CSS v4, Glassmorphism design system.
- **Animation**: Framer Motion, GSAP, CSS Keyframes.
- **Audio**: Web Audio API Procedural Synthesizer (nhạc ambient lofi sinh nhật tự sinh không phụ thuộc file ngoài) + hỗ trợ Howler.js và custom file MP3.
- **Effects**: Canvas Confetti, 3D Particle Systems.
- **State Management**: Zustand.
- **Schema Validation**: Zod.
- **Testing**: Vitest.

---

## 3. Yêu cầu môi trường
- **Node.js**: Phiên bản 18.x trở lên (đã kiểm thử và tối ưu trên Node v24).
- **Trình duyệt**: Hỗ trợ WebGL (Chrome, Edge, Safari, Firefox trên cả PC và Mobile). Thiết bị không có WebGL sẽ tự động chuyển sang chế độ nền sao 2D Fallback mượt mà.

---

## 4. Hướng dẫn cài đặt

```bash
# 1. Clone repository hoặc giải nén source code
cd "GALAXY BIRTHDAY UNIVERSE"

# 2. Cài đặt các gói phụ thuộc
npm install
```

---

## 5. Hướng dẫn chạy Local

```bash
# Khởi chạy server phát triển
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:5173`

```bash
# Kiểm thử unit test
npm run test

# Build bản production
npm run build

# Xem trước bản build
npm run preview
```

---

## 6. Hướng dẫn thêm ảnh kỷ niệm thật

Tất cả ảnh kỷ niệm được lưu trữ trong thư mục:
`public/images/memories/`

1. Chuẩn bị ảnh chụp thực tế của hai bạn (định dạng `.jpg`, `.png`, hoặc `.webp`).
2. Đổi tên ảnh thành `photo-01.jpg`, `photo-02.jpg`, ... và đặt vào thư mục `public/images/memories/`.
3. Mở file [src/config/birthday.config.ts](file:///d:/DELL/Dowloads/GALAXY%20BIRTHDAY%20UNIVERSE/src/config/birthday.config.ts) và cập nhật đường dẫn ảnh trong mảng `memories`:

```typescript
memories: [
  {
    id: "memory-001",
    image: "/images/memories/photo-01.jpg",
    title: "Chuyến săn hoàng hôn 'bất ổn'",
    description: "Hôm đó định ngắm hoàng hôn chill chill, ai ngờ dắt bộ xe...",
    date: "15 Tháng 03, 2024",
    tag: "Kỷ niệm bất ổn",
  },
  // Thêm các ảnh khác tương tự...
]
```

---

## 7. Hướng dẫn thêm nhạc nền tùy thích

Mặc định, website đã tích hợp sẵn **Cosmic Synthesizer** (bộ tổng hợp âm thanh Web Audio tự động chơi giai điệu Happy Birthday và tiếng chuông sao lofi êm dịu mà không cần tải bất kỳ file MP3 nào).

Nếu bạn muốn phát một bài hát MP3 cụ thể:
1. Sao chép file nhạc của bạn vào `public/audio/birthday.mp3`.
2. Kiểm tra cấu hình trong [src/config/birthday.config.ts](file:///d:/DELL/Dowloads/GALAXY%20BIRTHDAY%20UNIVERSE/src/config/birthday.config.ts):

```typescript
music: {
  enabled: true,
  trackName: "Tên bài hát của bạn",
  artist: "Tên ca sĩ",
  source: "/audio/birthday.mp3",
  autoPlayPrompt: "Bật âm thanh không gian để có trải nghiệm trọn vẹn nhất",
}
```

---

## 8. Hướng dẫn chỉnh sửa lời chúc & lá thư

Mở file [src/config/birthday.config.ts](file:///d:/DELL/Dowloads/GALAXY%20BIRTHDAY%20UNIVERSE/src/config/birthday.config.ts) và tìm đến mục `letter`:

```typescript
letter: {
  title: "LÁ THƯ TỪ TRẠM VŨ TRỤ",
  subtitle: "Những dòng tâm sự chân thành gửi tới người bạn tuyệt vời",
  salutation: "Gửi Ánh Dương thân mến,",
  paragraphs: [
    "Chúc mừng sinh nhật nhé!",
    "Vậy là cậu lại bước sang một tuổi mới rồi...",
    "Cảm ơn cậu vì đã luôn là một người bạn lắng nghe kiên nhẫn...",
    "Tuổi mới thật rực rỡ và thành công nhé bạn tôi!",
  ],
  signature: "Bạn thân của cậu,",
  footerNote: "Trái Đất — Ngày đặc biệt của Ánh Dương",
}
```
Bạn có thể tự do thêm, bớt các đoạn văn trong mảng `paragraphs` tùy ý!

---

## 9. Hướng dẫn tùy chỉnh tên người nhận & ngày sinh

Chỉ cần thay đổi các dòng đầu tiên của [src/config/birthday.config.ts](file:///d:/DELL/Dowloads/GALAXY%20BIRTHDAY%20UNIVERSE/src/config/birthday.config.ts):

```typescript
export const birthdayConfig = {
  recipientName: "Tên Bạn Của Bạn",      // Ví dụ: Minh Anh, Thảo My, ...
  recipientNickname: "Biệt danh",       // Ví dụ: Cua Càng, Bé Bự, ...
  senderName: "Tên Của Bạn",             // Ví dụ: Hoàng Nam, Bạn thân,...
  birthdayDate: "2026-11-02",            // Ngày sinh nhật (YYYY-MM-DD)
  age: 22,                               // Số tuổi (tùy chọn)
  // ...
};
```
Tất cả các màn hình (Cổng vũ trụ, Bánh sinh nhật, Thư chúc mừng, Hộp quà, Pháo hoa) sẽ tự động cập nhật đồng bộ!

---

## 10. Hướng dẫn Deploy lên Vercel

Dự án đã có sẵn file [vercel.json](file:///d:/DELL/Dowloads/GALAXY%20BIRTHDAY%20UNIVERSE/vercel.json) với cấu hình tối ưu SPA routing, nén cache và bảo mật.

### Cách 1: Deploy qua Vercel CLI (nhanh nhất)
```bash
# Cài đặt Vercel CLI nếu chưa có
npm i -g vercel

# Đăng nhập và triển khai
vercel
```

### Cách 2: Deploy qua GitHub & Vercel Dashboard
1. Tạo một repository mới trên GitHub và push mã nguồn lên:
   ```bash
   git init
   git add .
   git commit -m "feat: Galaxy Birthday Universe 3D interactive celebration"
   git branch -M main
   git remote add origin <URL-REPO-CUA-BAN>
   git push -u origin main
   ```
2. Truy cập [vercel.com](https://vercel.com), chọn **Add New Project**.
3. Import repository vừa tạo.
4. Giữ nguyên các thông số mặc định (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Bấm **Deploy**. Sau khoảng 1 phút, bạn sẽ có liên kết công khai (ví dụ `https://galaxy-birthday-universe.vercel.app`) để gửi tặng người bạn thân!

---

## Kiểm thử & Hiệu năng
- Đã chạy kiểm thử tự động với Vitest: `10/10 tests passed`.
- Tự động tối ưu giảm bớt số lượng hạt sao 3D khi phát hiện thiết bị di động.
- Cung cấp nút điều chỉnh hiệu năng (`Cài đặt hiển thị` ở góc trên bên trái) cho phép người dùng bật/tắt chế độ Tiết kiệm pin & Giảm chuyển động.
