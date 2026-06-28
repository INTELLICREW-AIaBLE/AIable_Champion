import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper to read users
const readUsers = (): any[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, '[]');
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to write users
const writeUsers = (users: any[]) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export const register = (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const users = readUsers();
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    // Create new user (Storing password as plain text just for mock purposes)
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      password 
    };

    users.push(newUser);
    writeUsers(users);

    res.json({ success: true, message: 'Đăng ký thành công!', data: { id: newUser.id, email: newUser.email, fullName: newUser.fullName } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký.' });
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu.' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Return fake token
    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token: 'mock-jwt-token-' + user.id,
      data: { id: user.id, email: user.email, fullName: user.fullName }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.' });
  }
};
