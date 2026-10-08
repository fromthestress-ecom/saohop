/**
 * Bảng giải nghĩa cho lá số tử vi: tên gọi và ý nghĩa của từng sao, cung chức, tứ hóa, cục, độ sáng.
 * Viết bằng lời gần gũi để người không biết tử vi vẫn đọc được. Mọi ý nghĩa mang tính truyền thống,
 * chỉ để tham khảo và giải trí.
 *
 * Khóa của `STAR_INFO` trùng tên sao do engine `tuvi.ts` trả về. Test đảm bảo engine không sinh ra
 * sao nào thiếu mô tả.
 */

import type { Brightness, Hoa, PalaceName } from "@/lib/engines/tuvi";

export type StarTone = "tot" | "xau" | "trung";

export interface StarInfo {
  /** Loại sao, vd. "Đế tinh · hành Thổ". */
  kind: string;
  /** Tốt, xấu hay tùy hoàn cảnh (chỉ dùng để tô màu và sắp xếp). */
  tone: StarTone;
  /** Một đến hai câu, lời đời thường. */
  meaning: string;
}

export const STAR_INFO: Record<string, StarInfo> = {
  // ---- 14 chính tinh ----
  "Tử Vi": {
    kind: "Đế tinh · hành Thổ",
    tone: "tot",
    meaning: "Sao vua của lá số: quyền uy, phong thái, thích dẫn dắt. Hợp với vai trò đứng đầu, nhưng dễ cô độc hoặc cứng đầu nếu thiếu người phò tá.",
  },
  "Liêm Trinh": {
    kind: "Chính tinh · hành Hỏa",
    tone: "trung",
    meaning: "Sao của nguyên tắc và đam mê. Sống có chính kiến, ranh giới rõ, tình cảm mãnh liệt nhưng đôi lúc quá cứng rắn hoặc cực đoan.",
  },
  "Thiên Đồng": {
    kind: "Phúc tinh · hành Thủy",
    tone: "tot",
    meaning: "Sao của sự hiền hòa và hưởng thụ. Dễ chịu, hay nghĩ cho người khác, được lộc nhàn; điểm yếu là ngại va chạm và hơi lười bứt phá.",
  },
  "Vũ Khúc": {
    kind: "Tài tinh · hành Kim",
    tone: "trung",
    meaning: "Sao của tiền bạc và hành động. Quyết đoán, giỏi tính toán, có đầu óc kinh doanh; tình cảm thường kín, nói ít làm nhiều.",
  },
  "Thái Dương": {
    kind: "Quý tinh · hành Hỏa",
    tone: "tot",
    meaning: "Mặt trời: rộng rãi, nhiệt tình, thích giúp người và muốn được ghi nhận. Mạnh ở nơi sáng sủa, dễ thiệt thân nếu gánh quá nhiều cho người khác.",
  },
  "Thiên Cơ": {
    kind: "Trí tinh · hành Mộc",
    tone: "trung",
    meaning: "Sao của đầu óc: nhanh nhạy, hay suy tính, giỏi lập kế hoạch và học hỏi. Mặt trái là nghĩ nhiều, hay lo và thay đổi ý.",
  },
  "Thiên Phủ": {
    kind: "Kho tinh · hành Thổ",
    tone: "tot",
    meaning: "Sao của kho báu và sự ổn định: chín chắn, biết giữ của, thích an toàn. Đáng tin, nhưng đôi khi bảo thủ và ngại mạo hiểm.",
  },
  "Thái Âm": {
    kind: "Tài tinh · hành Thủy",
    tone: "tot",
    meaning: "Mặt trăng: dịu dàng, tinh tế, nhạy cảm, hợp với nhà cửa, tiền tích lũy và tình cảm. Sáng thì đẹp, mờ thì dễ buồn và hay nghĩ ngợi.",
  },
  "Tham Lang": {
    kind: "Đào hoa tinh · hành Thủy",
    tone: "trung",
    meaning: "Sao của ham muốn: khéo giao tiếp, đa tài, thích vui và thích thử cái mới. Sức hút lớn, nhưng cần tiết chế để không sa vào chuyện được mất và tình cảm rối.",
  },
  "Cự Môn": {
    kind: "Ám tinh · hành Thủy",
    tone: "trung",
    meaning: "Sao của lời nói: giỏi phân tích, tranh luận, nhìn ra điểm sai. Dễ gây hiểu lầm hoặc thị phi nếu nói thẳng quá, nhưng rất hợp nghề cần ăn nói.",
  },
  "Thiên Tướng": {
    kind: "Ấn tinh · hành Thủy",
    tone: "tot",
    meaning: "Sao của người phò tá: ngay thẳng, biết giúp và biết giữ lễ nghĩa. Hợp làm cánh tay đắc lực, nhưng hay phụ thuộc vào người mình đi theo.",
  },
  "Thiên Lương": {
    kind: "Thọ tinh · hành Mộc",
    tone: "tot",
    meaning: "Sao của sự che chở: điềm đạm, hay lo cho người khác, có duyên được quý nhân giúp. Hợp với việc chăm sóc, cố vấn; đôi lúc già dặn sớm hơn tuổi.",
  },
  "Thất Sát": {
    kind: "Tướng tinh · hành Kim",
    tone: "trung",
    meaning: "Sao của tướng quân: gan dạ, quyết liệt, dám làm dám chịu, hợp thời điểm cần xông pha. Hay đơn độc và cuộc đời nhiều thăng trầm.",
  },
  "Phá Quân": {
    kind: "Hao tinh · hành Thủy",
    tone: "trung",
    meaning: "Sao của đổi mới: dám phá cái cũ để làm cái mới, ưa thay đổi, sức bật mạnh. Đường đời nhiều biến động, cần học cách giữ lại thay vì chỉ phá.",
  },

  // ---- Lục cát ----
  "Tả Phù": { kind: "Trợ tinh · hành Thổ", tone: "tot", meaning: "Người giúp việc đắc lực: hay có người đỡ đần, dễ hòa đồng. Đi cùng Hữu Bật càng mạnh." },
  "Hữu Bật": { kind: "Trợ tinh · hành Thủy", tone: "tot", meaning: "Sự trợ giúp thầm lặng, đặc biệt từ bạn bè và người khác giới. Tả Hữu gặp nhau thì quý nhân nhiều." },
  "Văn Xương": { kind: "Văn tinh · hành Kim", tone: "tot", meaning: "Học hành, chữ nghĩa, giấy tờ, thi cử. Giúp tư duy rõ ràng và khéo viết, khéo trình bày." },
  "Văn Khúc": { kind: "Văn tinh · hành Thủy", tone: "tot", meaning: "Năng khiếu nghệ thuật, âm nhạc, ăn nói duyên dáng. Thiên về cảm xúc và sự khéo léo hơn Văn Xương." },
  "Thiên Khôi": { kind: "Quý nhân · hành Hỏa", tone: "tot", meaning: "Quý nhân dương, thường là người lớn tuổi hoặc cấp trên nâng đỡ. Hay gặp may nơi cần người giúp." },
  "Thiên Việt": { kind: "Quý nhân · hành Hỏa", tone: "tot", meaning: "Quý nhân âm, thường giúp kín đáo, đúng lúc. Cùng Thiên Khôi tạo nên cặp quý nhân hiếm có." },
  "Lộc Tồn": { kind: "Phúc tinh · hành Thổ", tone: "tot", meaning: "Lộc của trời cho, nghĩa là có của ăn của để, sống vững. Hơi dè dặt, giữ của kỹ, đôi khi hơi cô độc." },
  "Thiên Mã": { kind: "Động tinh · hành Hỏa", tone: "trung", meaning: "Sao của sự di chuyển và thay đổi: đi xa, đổi việc, đổi nơi ở. Gặp Lộc thì thành 'lộc mã', gặp sao xấu thì vất vả chạy vạy." },

  // ---- Lục sát và các sát tinh ----
  "Kình Dương": { kind: "Sát tinh · hành Kim", tone: "xau", meaning: "Sự gai góc, nóng nảy, dễ va chạm. Có mặt tốt là liều lĩnh, quyết đoán khi cần; cần tiết chế để khỏi tự gây thương tổn." },
  "Đà La": { kind: "Sát tinh · hành Kim", tone: "xau", meaning: "Sự trì trệ, dây dưa, chuyện kéo dài khó dứt. Đổi lại tính kiên nhẫn, bền bỉ; hay ôm chuyện cũ trong lòng." },
  "Hỏa Tinh": { kind: "Sát tinh · hành Hỏa", tone: "xau", meaning: "Cái nóng bộc phát: nóng tính, làm gì cũng nhanh và gấp. Hợp việc cần tốc độ, kỵ chuyện cần kiên nhẫn." },
  "Linh Tinh": { kind: "Sát tinh · hành Hỏa", tone: "xau", meaning: "Cái nóng âm ỉ: ít nói nhưng bên trong nhiều áp lực, dễ bất ngờ bùng lên. Cùng Hỏa Tinh là cặp tính nóng." },
  "Địa Không": { kind: "Sát tinh · hành Hỏa", tone: "xau", meaning: "Sự trống rỗng, hụt hẫng, kế hoạch dễ 'hụt' giữa chừng. Mặt tích cực là suy nghĩ độc đáo, thoát khỏi lối mòn." },
  "Địa Kiếp": { kind: "Sát tinh · hành Hỏa", tone: "xau", meaning: "Biến cố bất ngờ, mất mát rồi lại gây dựng. Dạy cách đứng dậy sau vấp ngã, hợp việc cần phá cũ lập mới." },
  "Kiếp Sát": { kind: "Sát tinh · hành Hỏa", tone: "xau", meaning: "Sự cướp đoạt, hao tổn bất ngờ, dễ gặp người lợi dụng. Cần cẩn trọng khi hợp tác về tiền bạc." },

  // ---- Đào hoa, hỷ sự ----
  "Hồng Loan": { kind: "Đào hoa · hành Thủy", tone: "tot", meaning: "Duyên tình cảm, hôn nhân, tin vui. Có sức hút tự nhiên với người khác giới." },
  "Thiên Hỷ": { kind: "Hỷ tinh · hành Thủy", tone: "tot", meaning: "Tin vui, cưới hỏi, sinh nở. Đi cùng Hồng Loan thì chuyện vui về tình cảm đến sớm." },
  "Đào Hoa": { kind: "Đào hoa · hành Mộc", tone: "trung", meaning: "Nét duyên, sức hút bề ngoài, nhiều người để ý. Tốt khi giao tiếp, cần tỉnh táo trong chuyện tình cảm." },
  "Hoa Cái": { kind: "Đài các tinh · hành Kim", tone: "trung", meaning: "Vẻ sang trọng, thích nghệ thuật, tôn giáo, triết lý. Hơi tách biệt, ít hòa vào đám đông." },
  "Thiên Riêu": { kind: "Đào hoa tinh · hành Thủy", tone: "trung", meaning: "Sự quyến rũ, đa cảm, lãng mạn; cũng dễ vướng tình cảm lằng nhằng. Hợp nghệ thuật, thẩm mỹ." },
  "Thiên Y": { kind: "Y tinh · hành Thủy", tone: "tot", meaning: "Sao của chữa lành: liên quan y dược, chăm sóc người khác, khả năng hồi phục tốt." },

  // ---- Phúc, thọ, quý ----
  "Long Trì": { kind: "Phúc tinh · hành Thủy", tone: "tot", meaning: "Sự duyên dáng, khéo tay, có tài lẻ. Hợp với nghề thủ công, nghệ thuật nhỏ." },
  "Phượng Các": { kind: "Phúc tinh · hành Thổ", tone: "tot", meaning: "Vẻ thanh nhã, tài hoa, duyên với nghệ thuật. Cùng Long Trì tạo nên cặp 'long phượng'." },
  "Thiên Quan": { kind: "Phúc tinh · hành Hỏa", tone: "tot", meaning: "Quý nhân về công danh, giúp gỡ rối trong sự nghiệp, gặp hung hóa nhẹ." },
  "Thiên Phúc": { kind: "Phúc tinh · hành Hỏa", tone: "tot", meaning: "Phúc đức, được hưởng lộc từ tổ tiên và người đi trước. Gặp hung hóa nhẹ." },
  "Thiên Tài": { kind: "Phụ tinh · hành Thổ", tone: "tot", meaning: "Tài năng, khả năng học nhanh, khéo thích nghi với việc mới." },
  "Thiên Thọ": { kind: "Phúc tinh · hành Thổ", tone: "tot", meaning: "Sức bền, tuổi thọ, khả năng vượt qua bệnh tật." },
  "Ân Quang": { kind: "Quý tinh · hành Mộc", tone: "tot", meaning: "Ân huệ, được người giúp đỡ vô điều kiện, hay có người nhớ ơn mình." },
  "Thiên Quý": { kind: "Quý tinh · hành Thổ", tone: "tot", meaning: "Sự tôn quý, phẩm chất tốt, hay được kính trọng. Cùng Ân Quang là cặp 'ân quý'." },
  "Tam Thai": { kind: "Đài các tinh · hành Thủy", tone: "tot", meaning: "Địa vị, sự nâng đỡ của cấp trên, đường công danh lên dần." },
  "Bát Tọa": { kind: "Đài các tinh · hành Thổ", tone: "tot", meaning: "Vị thế, nếp sống đài các, được tôn trọng trong nhóm." },
  "Thai Phụ": { kind: "Văn tinh · hành Kim", tone: "tot", meaning: "Sự phụ giúp về văn hóa, học vấn, giúp thi cử và làm việc giấy tờ thuận lợi." },
  "Phong Cáo": { kind: "Quý tinh · hành Thổ", tone: "tot", meaning: "Sự công nhận, bằng cấp, danh hiệu, thường đến qua văn bản hoặc lời khen." },
  "Văn Tinh": { kind: "Văn tinh · hành Hỏa", tone: "tot", meaning: "Khiếu văn chương, ăn nói, khéo trình bày." },
  "Đường Phù": { kind: "Quý tinh · hành Mộc", tone: "tot", meaning: "Sự uy tín, được tín nhiệm, hợp nghề cần giữ chữ tín." },
  "Quốc Ấn": { kind: "Quyền tinh · hành Thổ", tone: "tot", meaning: "Quyền hành, con dấu, chức vụ. Thuận cho nghề nghiệp ổn định, có trách nhiệm." },
  "Lưu Hà": { kind: "Hung tinh · hành Thủy", tone: "xau", meaning: "Liên quan nước, sông hồ và các chuyện dây dưa; nên cẩn thận khi đi lại gần nước." },
  "Thiên Trù": { kind: "Phúc tinh · hành Thổ", tone: "tot", meaning: "Cái ăn cái mặc, tài nấu nướng, được hưởng phúc ăn uống." },
  "Đẩu Quân": { kind: "Phụ tinh · hành Hỏa", tone: "trung", meaning: "Tính cách thẳng, khô khan, ít nói. Bình thường là ổn định, nhưng dễ cô đơn." },

  // ---- Hung, cô độc ----
  "Thiên Hình": { kind: "Hình tinh · hành Hỏa", tone: "xau", meaning: "Sự nghiêm khắc, kỷ luật, đôi khi là tranh chấp, pháp lý. Hợp ngành cần kỷ luật như luật, quân đội, y." },
  "Cô Thần": { kind: "Ám tinh · hành Thổ", tone: "xau", meaning: "Cảm giác cô đơn, tự lập sớm. Cần chủ động mở lòng hơn trong quan hệ." },
  "Quả Tú": { kind: "Ám tinh · hành Thổ", tone: "xau", meaning: "Cảm giác lạc lõng, khó gần. Đi cùng Cô Thần là cặp 'cô quả', ảnh hưởng nhiều đến duyên phận." },
  "Thiên Khốc": { kind: "Hung tinh · hành Thủy", tone: "xau", meaning: "Hay buồn, dễ khóc, nhiều cảm xúc. Mặt tốt là sống tình cảm, biết thương người." },
  "Thiên Hư": { kind: "Hung tinh · hành Thủy", tone: "xau", meaning: "Cảm giác trống vắng, kế hoạch đôi khi hư hao. Cần cẩn thận lời hứa và cam kết." },
  "Thiên Thương": { kind: "Hung tinh · hành Thổ", tone: "xau", meaning: "Mất mát nhỏ, tổn thương tinh thần, hay liên quan đến bạn bè." },
  "Thiên Sứ": { kind: "Hung tinh · hành Thủy", tone: "xau", meaning: "Tin buồn, sức khỏe giảm; thường nằm cùng cung Tật Ách nên nhắc chăm sóc sức khỏe." },
  "Thiên Không": { kind: "Hung tinh · hành Thủy", tone: "xau", meaning: "Sự lệch pha giữa mong muốn và thực tế. Nhưng cũng cho trí tưởng tượng và cái nhìn xa." },
  "Thiên La": { kind: "Hung tinh · hành Thổ", tone: "xau", meaning: "Lưới trời: cảm giác bị ràng buộc, khó thoát ở cung này." },
  "Địa Võng": { kind: "Hung tinh · hành Thổ", tone: "xau", meaning: "Lưới đất: cảm giác bị giam hãm, khó phát triển thoải mái. Cùng Thiên La nằm cố định ở Thìn và Tuất." },
};

/** Bốn sao Tuần/Triệt không nằm trong danh sách sao thường. */
export const TUAN_TRIET_INFO = {
  tuan: {
    name: "Tuần",
    meaning: "Tuần Không: làm giảm sức của sao trong cung, như che bớt ánh sáng. Cái tốt đến chậm hơn, cái xấu cũng bớt nặng; nặng nhất khi đang trẻ rồi nhẹ dần.",
  },
  triet: {
    name: "Triệt",
    meaning: "Triệt Lộ: cắt ngang, làm sao trong cung giảm hoặc đổi nghĩa. Giống 'chặn đường': việc đang suôn sẻ có thể gián đoạn, chuyện xấu cũng có thể giải tỏa.",
  },
} as const;

export const PALACE_INFO: Record<PalaceName, { asks: string; meaning: string }> = {
  Mệnh: { asks: "Bạn là người thế nào?", meaning: "Tính cách, thiên hướng và vận số chung của cả đời. Đây là cung quan trọng nhất của lá số." },
  "Phụ Mẫu": { asks: "Cha mẹ và cấp trên", meaning: "Quan hệ với cha mẹ, thầy cô, cấp trên; cũng nói về giấy tờ, bằng cấp." },
  "Phúc Đức": { asks: "Phúc phần và tinh thần", meaning: "Phúc đức tổ tiên để lại, đời sống nội tâm, cách bạn nghỉ ngơi và tận hưởng." },
  "Điền Trạch": { asks: "Nhà cửa và tài sản", meaning: "Nhà đất, tài sản tích lũy, nơi ở và cảm giác an cư." },
  "Quan Lộc": { asks: "Sự nghiệp", meaning: "Công việc, địa vị, hướng đi nghề nghiệp phù hợp." },
  "Nô Bộc": { asks: "Bạn bè và đồng nghiệp", meaning: "Quan hệ với bạn bè, cấp dưới, đồng nghiệp; ai giúp bạn và ai làm bạn mệt." },
  "Thiên Di": { asks: "Ra ngoài xã hội", meaning: "Cách bạn thể hiện ra bên ngoài, vận ở nơi xa, gặp quý nhân hay tiểu nhân." },
  "Tật Ách": { asks: "Sức khỏe", meaning: "Thể chất, những điểm yếu về sức khỏe và tâm lý cần lưu ý." },
  "Tài Bạch": { asks: "Tiền bạc", meaning: "Cách kiếm tiền, tiêu tiền, khả năng giữ của." },
  "Tử Tức": { asks: "Con cái và sáng tạo", meaning: "Duyên với con cái, học trò, cũng nói về nguồn cảm hứng và những gì bạn tạo ra." },
  "Phu Thê": { asks: "Tình duyên và hôn nhân", meaning: "Kiểu người bạn đời, cách bạn yêu và những điều hay gặp trong tình cảm." },
  "Huynh Đệ": { asks: "Anh chị em và bạn thân", meaning: "Quan hệ với anh chị em, bạn thân; cũng nói về nguồn hỗ trợ ngang hàng." },
};

export const HOA_INFO: Record<Hoa, { name: string; meaning: string }> = {
  Lộc: { name: "Hóa Lộc", meaning: "Thêm lộc, thêm duyên: sao này dễ có tiền bạc, cơ hội và sự thuận lợi." },
  Quyền: { name: "Hóa Quyền", meaning: "Thêm quyền: sao này chủ động, có sức nắm giữ, thích điều khiển." },
  Khoa: { name: "Hóa Khoa", meaning: "Thêm danh tiếng, học hành: sao này được quý nhân giúp, dễ có tiếng tốt." },
  Kỵ: { name: "Hóa Kỵ", meaning: "Thêm vướng mắc: sao này dễ gây lo lắng, ghen tuông hoặc hiểu lầm, cũng là điều bạn hay bận tâm nhất." },
};

export const BRIGHTNESS_INFO: Record<Brightness, { short: string; meaning: string }> = {
  Miếu: { short: "M", meaning: "Miếu: rất sáng, sao phát huy tốt nhất." },
  Vượng: { short: "V", meaning: "Vượng: sáng và khỏe, phát huy khá tốt." },
  Đắc: { short: "Đ", meaning: "Đắc: khá sáng, đủ sức làm việc." },
  Bình: { short: "B", meaning: "Bình: bình thường, tốt xấu phụ thuộc các sao đi cùng." },
  Hãm: { short: "H", meaning: "Hãm: sao yếu, dễ bộc lộ mặt trái, cần sao tốt hỗ trợ." },
};

export const CUC_INFO: Record<string, string> = {
  "Thủy Nhị Cục": "Cục 2: khởi vận sớm, hợp tính linh hoạt, thích nghi nhanh.",
  "Mộc Tam Cục": "Cục 3: vận mở dần, hợp sự phát triển bền, nhẹ nhàng.",
  "Kim Tứ Cục": "Cục 4: vận vững chắc, thiên về nguyên tắc và sự rõ ràng.",
  "Thổ Ngũ Cục": "Cục 5: vận chậm mà chắc, hợp người kiên nhẫn, tích lũy.",
  "Hỏa Lục Cục": "Cục 6: vận đến muộn hơn nhưng bền, nhiều năng lượng và nhiệt huyết.",
};

/** Ba vòng sao đi theo cung, mỗi cung đúng một sao. Chỉ cần mô tả ngắn. */
export const RING_INFO = {
  thaiTue: {
    title: "Vòng Thái Tuế",
    meaning: "Mười hai sao đi từ cung tuổi của bạn, nói về năm tháng, quan hệ xã hội và những chuyện thị phi hay phúc đức.",
  },
  bacSi: {
    title: "Vòng Lộc Tồn",
    meaning: "Mười hai sao đi từ Lộc Tồn (Bác Sĩ, Lực Sĩ, Thanh Long...), nói về tài lộc, trợ giúp và những hao tốn trong cuộc sống.",
  },
  trangSinh: {
    title: "Vòng Tràng Sinh",
    meaning: "Mười hai giai đoạn từ sinh ra đến Tuyệt rồi Dưỡng, cho biết cung đang ở giai đoạn đầy sức hay đang nghỉ.",
  },
} as const;

export function starInfo(name: string): StarInfo | undefined {
  return STAR_INFO[name];
}
