import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !token.startsWith('mock-jwt-token-')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Vui lòng đăng nhập lại.' });
  }
  
  const userId = token.replace('mock-jwt-token-', '');
  (req as any).userId = userId;
  next();
};
