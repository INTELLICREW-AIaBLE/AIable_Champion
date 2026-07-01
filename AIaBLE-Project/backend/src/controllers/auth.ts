import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // if needed, but Next/Node 18+ has fetch built-in, assuming Node 18+ because Express + Next14.

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

// Helper to verify Turnstile token
const verifyTurnstile = async (token: string): Promise<boolean> => {
  if (!token) return false;
  try {
    const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    
    // Cloudflare validation requires x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error('[Turnstile Verify Error]:', error);
    return false;
  }
};

export const register = async (req: Request, res: Response) => {
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

export const login = async (req: Request, res: Response) => {
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

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Thiếu Google Access Token.' });
    }

    // Fetch user info from Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ success: false, message: 'Google Access Token không hợp lệ.' });
    }

    const payload = await response.json();
    const { email, name, sub } = payload;

    const users = readUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
      // Auto-register
      user = {
        id: 'google-' + sub,
        fullName: name,
        email,
        password: 'google-oauth-dummy-password',
      };
      users.push(user);
      writeUsers(users);
    }

    res.json({
      success: true,
      message: 'Đăng nhập bằng Google thành công!',
      token: 'mock-jwt-token-' + user.id,
      data: { id: user.id, email: user.email, fullName: user.fullName }
    });
  } catch (error: any) {
    console.error('[Google Login Error]:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xử lý Google Login.' });
  }
};

export const verifyBot = async (req: Request, res: Response) => {
  try {
    const { turnstileToken } = req.body;
    if (!turnstileToken) {
      return res.status(400).json({ success: false, message: 'Missing token' });
    }
    
    const isValid = await verifyTurnstile(turnstileToken);
    if (isValid) {
      res.json({ success: true, message: 'Xác minh thành công' });
    } else {
      res.status(403).json({ success: false, message: 'Xác minh thất bại' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email.' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);
    
    // Luôn trả về success để tránh dò rỉ email (security best practice)
    if (!user) {
      return res.json({ success: true, message: 'Nếu email tồn tại, một hướng dẫn đã được gửi đi.' });
    }

    // TODO: Send email here
    console.log(`[Mock Email] Gửi link reset password tới ${email}`);

    res.json({ success: true, message: 'Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Lỗi server khi xử lý yêu cầu quên mật khẩu.' });
  }
};
