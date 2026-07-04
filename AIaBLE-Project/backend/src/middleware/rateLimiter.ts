import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// In-memory violation records for blacklisting
const violationMap = new Map<string, { count: number; bannedUntil?: number }>();
const BANNED_DURATION = 24 * 60 * 60 * 1000; // Ban for 24 hours

/**
 * Middleware to completely block requests from blacklisted IPs
 */
export const ipBlacklistMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const record = violationMap.get(ip);

  if (record && record.bannedUntil && Date.now() < record.bannedUntil) {
    return res.status(403).json({
      success: false,
      message: 'Truy cập của bạn đã bị khóa tạm thời do phát hiện hành vi tấn công spam liên tục.'
    });
  }

  next();
};

/**
 * Handler invoked when an IP exceeds rate limit bounds.
 * Tracks violations and blacklists the IP on repeated infractions.
 */
const handleViolation = (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const record = violationMap.get(ip) || { count: 0 };
  
  record.count += 1;
  
  // If they violate the rate limit 5 times, ban them for 24 hours
  if (record.count >= 5) {
    record.bannedUntil = Date.now() + BANNED_DURATION;
    console.warn(`[SECURITY WARN]: IP ${ip} banned for 24h due to repeated rate limit violations.`);
  }

  violationMap.set(ip, record);

  res.status(429).json({
    success: false,
    message: 'Bạn đã vượt quá giới hạn yêu cầu liên tiếp. Vui lòng thử lại sau ít phút.'
  });
};

/**
 * Rate Limiter for general public endpoints (max 100 requests per 15 minutes)
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: handleViolation,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict Rate Limiter for high-CPU or sensitive actions (Auth, Optimizer, Validator)
 * Limit each IP to 15 requests per 15 minutes
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler: handleViolation,
  standardHeaders: true,
  legacyHeaders: false,
});
