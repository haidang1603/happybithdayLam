import { z } from 'zod';

export const MemoryItemSchema = z.object({
  id: z.string(),
  image: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tag: z.string().optional(),
});

export const TimelineItemSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  tag: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
});

export const BirthdayConfigSchema = z.object({
  recipientName: z.string(),
  recipientNickname: z.string().optional(),
  senderName: z.string(),
  birthdayDate: z.string(),
  age: z.number().optional(),
  theme: z.enum(['galaxy', 'nebula', 'aurora', 'supernova']).default('galaxy'),
  
  hero: z.object({
    badge: z.string(),
    preTitle: z.string(),
    title: z.string(),
    subtitle: z.string(),
    ctaText: z.string(),
  }),
  
  cake: z.object({
    heading: z.string(),
    subtitle: z.string(),
    candleWish: z.string(),
    blowButtonText: z.string(),
    relightButtonText: z.string(),
    afterBlowMessage: z.string(),
  }),
  
  memories: z.array(MemoryItemSchema),
  
  timeline: z.array(TimelineItemSchema),
  
  gift: z.object({
    title: z.string(),
    subtitle: z.string(),
    closedHint: z.string(),
    openTitle: z.string(),
    badge: z.string(),
    message: z.string(),
    rewardTitle: z.string(),
    rewardDetails: z.array(z.string()),
    ps: z.string(),
  }),
  
  letter: z.object({
    title: z.string(),
    subtitle: z.string(),
    salutation: z.string(),
    paragraphs: z.array(z.string()),
    signature: z.string(),
    footerNote: z.string(),
  }),
  
  finale: z.object({
    quote: z.string(),
    heading: z.string(),
    subheading: z.string(),
    replayButtonText: z.string(),
  }),
  
  music: z.object({
    enabled: z.boolean(),
    trackName: z.string(),
    artist: z.string(),
    source: z.string(), // mp3 path or synthesized fallback
    autoPlayPrompt: z.string(),
  }),
});

export type BirthdayConfig = z.infer<typeof BirthdayConfigSchema>;
export type MemoryItem = z.infer<typeof MemoryItemSchema>;
export type TimelineItem = z.infer<typeof TimelineItemSchema>;

export const birthdayConfig: BirthdayConfig = {
  recipientName: "Ánh Dương",
  recipientNickname: "Cô bạn sao Hỏa",
  senderName: "Người bạn Trái Đất",
  birthdayDate: "2026-11-02",
  age: 22,
  theme: "galaxy",
  
  hero: {
    badge: "Vũ Trụ Kỷ Niệm ✦ Edition 2026",
    preTitle: "Somewhere in this vast universe...",
    title: "Có một vì sao đặc biệt đang tỏa sáng hôm nay",
    subtitle: "Một vũ trụ mini ngập tràn kỷ niệm, tiếng cười và những điều bất ngờ được lập trình riêng để chúc mừng sinh nhật cậu!",
    ctaText: "BẮT ĐẦU CHUYẾN DU HÀNH VŨ TRỤ",
  },
  
  cake: {
    heading: "HAPPY BIRTHDAY!",
    subtitle: "Thêm một tuổi mới, thêm một hành trình rực rỡ giữa dải ngân hà!",
    candleWish: "Nhắm mắt lại, nghĩ về 1 điều ước chân thành nhất rồi hãy bấm thổi nến nhé...",
    blowButtonText: "✦ Thổi Nến Ước Nguyện ✦",
    relightButtonText: "Thắp lại ngọn nến",
    afterBlowMessage: "Điều ước đã được gửi tới trạm thu sóng vũ trụ! Mong mọi điều tốt lành nhất sẽ thành hiện thực với cậu!",
  },
  
  memories: [
    {
      id: "memory-001",
      image: "/images/memories/photo-01.svg",
      title: "Chuyến săn hoàng hôn 'bất ổn'",
      description: "Hôm đó định ngắm hoàng hôn chill chill, ai ngờ xe thủng lốp dắt bộ 3km nhưng cậu vẫn cười toe toét ăn hết cây kem que.",
      date: "15 Tháng 03, 2024",
      tag: "Kỷ niệm bất ổn",
    },
    {
      id: "memory-002",
      image: "/images/memories/photo-02.svg",
      title: "Đêm bàn chuyện nhân sinh",
      description: "Ngồi quán cà phê vỉa hè đến 2h sáng, uống trà đá mà đàm đạo như thể hai đứa sắp sửa phóng tên lửa lên sao Hỏa.",
      date: "08 Tháng 07, 2024",
      tag: "Trà đá vỉa hè",
    },
    {
      id: "memory-003",
      image: "/images/memories/photo-03.svg",
      title: "Bữa lẩu cứu vớt tâm hồn",
      description: "Những ngày deadline ngập đầu, chỉ cần một câu 'Ê đi ăn lẩu không?' là 15 phút sau đã thấy hai đứa mặt hớn hở trước nồi nước lẩu cay xè.",
      date: "24 Tháng 11, 2024",
      tag: "Lẩu là chân ái",
    },
    {
      id: "memory-004",
      image: "/images/memories/photo-04.svg",
      title: "Chuyến đi trốn thành phố",
      description: "Lên đồi thông đón sương sớm, hai đứa co ro vì lạnh nhưng khoảnh khắc mây trôi dưới chân thì đẹp quên lối về.",
      date: "12 Tháng 02, 2025",
      tag: "Road trip",
    },
    {
      id: "memory-005",
      image: "/images/memories/photo-05.svg",
      title: "Lần thi trượt và cốc trà sữa",
      description: "Cảm ơn vì đã kiên nhẫn đứng đợi, mua cho tớ ly trà sữa full topping và bảo: 'Trượt thì thi lại, có gì to tát đâu!'.",
      date: "19 Tháng 06, 2025",
      tag: "Đồng đội tốt",
    },
    {
      id: "memory-006",
      image: "/images/memories/photo-06.svg",
      title: "Một khoảnh khắc rạng rỡ",
      description: "Cậu luôn có nụ cười tỏa nắng tràn đầy năng lượng tích cực, khiến mọi người xung quanh đều thấy nhẹ nhõm theo.",
      date: "28 Tháng 10, 2025",
      tag: "Best smile",
    },
  ],
  
  timeline: [
    {
      id: "event-001",
      date: "Tháng 09, 2023",
      title: "Cú va chạm định mệnh",
      description: "Lần đầu tiên gặp nhau trong buổi sinh hoạt nhóm. Hai đứa nhìn nhau ngơ ngác không ngờ sau này lại thành cạ cứng.",
      tag: "Khởi đầu",
      icon: "Sparkles",
    },
    {
      id: "event-002",
      date: "Tháng 01, 2024",
      title: "Lập liên minh 'Cứu trợ Deadline'",
      description: "Chính thức trở thành bạn cùng tiến (và cùng lười), thức trắng đêm gánh đồ án mà không một lời oán thán.",
      tag: "Chiến hữu",
      icon: "Terminal",
    },
    {
      id: "event-003",
      date: "Tháng 08, 2024",
      title: "Hành trình phượt 200km",
      description: "Chuyến đi xa đầu tiên. Mưa ướt như chuột lột nhưng có những câu chuyện kể suốt cả đời không chán.",
      tag: "Khám phá",
      icon: "Compass",
    },
    {
      id: "event-004",
      date: "Tháng 04, 2025",
      title: "Những lúc vực dậy tinh thần",
      description: "Những khi một trong hai đứa bế tắc hay mỏi mệt, luôn có một người bạn sẵn sàng lắng nghe mà không phán xét.",
      tag: "Chân thành",
      icon: "HeartHandshake",
    },
    {
      id: "event-005",
      date: "Hôm nay ✦ 2026",
      title: "Vũ trụ tuổi mới rực rỡ",
      description: "Một cột mốc mới trên hành trình trưởng thành. Chúc cho tình bạn của chúng mình mãi bền chặt và luôn rộn rã tiếng cười!",
      tag: "Hiện tại & Tương lai",
      icon: "Crown",
    },
  ],
  
  gift: {
    title: "HỘP QUÀ BÍ MẬT 3D",
    subtitle: "Một món quà tinh thần đặc biệt được bọc kín giữa các vì sao. Nhấn để mở nắp!",
    closedHint: "✦ Nhấn vào hộp quà để mở điều bí mật ✦",
    openTitle: "SURPRISE! CHÚC MỪNG SINH NHẬT CẬU!",
    badge: "Vip Friendship Pass ✦ Phiên bản vĩnh viễn",
    message: "Tình bạn với cậu là một trong những điều tuyệt vời và may mắn nhất mà vũ trụ đã trao tặng cho tớ!",
    rewardTitle: "ĐẶC QUYỀN TÌNH BẠN KÈM THEO:",
    rewardDetails: [
      "01 Vé bao trọn gói 1 bữa lẩu/nướng full topping bất cứ lúc nào cậu thèm.",
      "01 Phiếu miễn trừ cằn nhằn trong 365 ngày tiếp theo (áp dụng mọi hoàn cảnh).",
      "Dịch vụ tài xế kiêm tổng đài tâm sự 24/7 không tính cước khi cậu cần chia sẻ.",
      "Và vô vàn năng lượng tích cực, may mắn gửi thẳng tới quỹ đạo của cậu!",
    ],
    ps: "*Lưu ý: Thẻ quà tặng có giá trị sử dụng vô thời hạn và không thể quy đổi ra tiền mặt nhưng có thể quy đổi ra niềm vui không giới hạn!",
  },
  
  letter: {
    title: "LÁ THƯ TỪ TRẠM VŨ TRỤ",
    subtitle: "Những dòng tâm sự chân thành gửi tới người bạn tuyệt vời",
    salutation: "Gửi Ánh Dương thân mến,",
    paragraphs: [
      "Chúc mừng sinh nhật nhé!",
      "Vậy là cậu lại bước sang một tuổi mới rồi. Nhìn lại chặng đường vừa qua, tớ cảm thấy thật may mắn khi trên hành trình ấy luôn có sự đồng hành của một người bạn như cậu.",
      "Cảm ơn cậu vì đã luôn là một người bạn lắng nghe kiên nhẫn, luôn mang lại năng lượng tích cực và những trận cười sảng khoái dù trong những ngày áp lực nhất. Tình bạn của chúng mình không màu mè, không sến súa, nhưng lúc nào cũng chân thật và ấm áp.",
      "Bước sang tuổi mới, chúc cậu luôn mạnh khỏe, giữ vững nụ cười rạng rỡ và bản lĩnh kiên cường để theo đuổi mọi ước mơ, mục tiêu mà cậu đang ấp ủ. Mong rằng cuộc sống sẽ đối xử thật dịu dàng với cậu, và những điều tốt đẹp nhất sẽ luôn tìm đến cậu.",
      "Cho dù vũ trụ có rộng lớn bao la và cuộc sống có bận rộn đến đâu, hãy nhớ rằng cậu luôn có một người bạn đồng hành đáng tin cậy ở đây.",
      "Tuổi mới thật rực rỡ và thành công nhé bạn tôi!",
    ],
    signature: "Bạn thân của cậu,",
    footerNote: "Trái Đất — Ngày đặc biệt của Ánh Dương",
  },
  
  finale: {
    quote: "“Vũ trụ rộng lớn vô tận với hàng tỷ vì sao, nhưng tìm được một người bạn tâm đầu ý hợp là điều kỳ diệu nhất.”",
    heading: "CHÚC MỪNG SINH NHẬT CẬU!",
    subheading: "Chúc cho mọi ước mơ của cậu sẽ cất cánh và tỏa sáng rực rỡ như những chòm sao!",
    replayButtonText: "✦ Trải Nghiệm Lại Từ Đầu ✦",
  },
  
  music: {
    enabled: true,
    trackName: "Cosmic Birthday Serenade",
    artist: "Galaxy Ambient Studio",
    source: "/audio/birthday.mp3",
    autoPlayPrompt: "Bật âm thanh không gian để có trải nghiệm trọn vẹn nhất",
  },
};
