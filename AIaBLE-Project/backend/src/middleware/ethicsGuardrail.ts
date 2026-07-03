import { Request, Response, NextFunction } from 'express';

// Danh sách các từ khóa vi phạm tiêu chuẩn đạo đức (Cập nhật linh hoạt)
const BANNED_KEYWORDS = [
  'giết người', 'tự tử', 'chế tạo bom', 'thuốc nổ', 'khủng bố',
  'hack tài khoản', 'đánh cắp mật khẩu', 'lừa đảo', 'ma túy', 
  'ấu dâm', 'buôn người', 'vũ khí sinh học', 'làm giả giấy tờ'
];

export const checkEthics = (req: Request, res: Response, next: NextFunction) => {
  // Lấy prompt từ body (dùng chung cho Sandbox, Optimizer, Matcher...)
  const prompt = req.body.prompt || req.body.text || req.body.input || '';
  
  if (!prompt) return next();

  const lowerPrompt = prompt.toLowerCase();
  
  for (const keyword of BANNED_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      return res.status(403).json({
        success: false,
        message: `⚠️ [CẢNH BÁO ĐẠO ĐỨC]: Yêu cầu của bạn chứa nội dung vi phạm tiêu chuẩn an toàn cộng đồng ("${keyword}"). Hệ thống AIaBLE từ chối phục vụ yêu cầu này.`
      });
    }
  }

  next();
};
