import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Vui lòng đăng nhập.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hoangbeo172006_secret_jwt_key') as any;
    const userId = decoded.id;
    
    // Tìm user theo id từ payload JWT
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(403).json({ success: false, message: 'Forbidden. User không tồn tại.' });
    }
    
    if (user.role === 'admin') {
      (req as any).userId = userId;
      (req as any).user = decoded;
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden. Quyền truy cập bị từ chối.' });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};
