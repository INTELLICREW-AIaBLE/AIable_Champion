import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Vui lòng đăng nhập lại.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hoangbeo172006_secret_jwt_key') as any;
    (req as any).userId = decoded.id;
    (req as any).user = decoded; // Lưu lại payload JWT để dùng khi cần phân quyền
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' });
  }
};
