import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !token.startsWith('mock-jwt-token-')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Vui lòng đăng nhập.' });
  }
  
  const userId = token.replace('mock-jwt-token-', '');
  
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(403).json({ success: false, message: 'Forbidden. User không tồn tại.' });
    }
    
    // First registered user in mongo might not be easily determinable by id without sorting by createdAt
    // We will just rely on role === 'admin'
    const doc = user as any;
    if (doc.role === 'admin') {
      (req as any).userId = userId;
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden. Quyền truy cập bị từ chối.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi xác thực admin' });
  }
};
