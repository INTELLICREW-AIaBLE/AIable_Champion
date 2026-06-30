import rateLimit from 'express-rate-limit';

// Limit each IP to 20 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Bạn đã vượt quá giới hạn yêu cầu (tối đa 20 yêu cầu mỗi 15 phút). Vui lòng thử lại sau.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
