import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/User';

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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    // Create new user (Storing password as plain text just for mock purposes)
    const newUser = await User.create({
      id: Date.now().toString(),
      fullName,
      email,
      password,
      username: email.split('@')[0]
    });

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

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    if (user.isLocked) {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa.' });
    }

    // Return fake token
    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token: 'mock-jwt-token-' + user.id,
      data: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
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

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-register
      user = await User.create({
        id: 'google-' + sub,
        fullName: name,
        email,
        password: 'google-oauth-dummy-password',
        username: email.split('@')[0]
      });
    }

    if (user.isLocked) {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa.' });
    }

    res.json({
      success: true,
      message: 'Đăng nhập bằng Google thành công!',
      token: 'mock-jwt-token-' + user.id,
      data: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
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

    const user = await User.findOne({ email });
    
    // Luôn trả về success để tránh dò rỉ email (security best practice)
    if (!user) {
      return res.json({ success: true, message: 'Nếu email tồn tại, một hướng dẫn đã được gửi đi.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token to user via generic field or extending schema
    // Using any cast to bypass mongoose strict typing temporarily for reset logic
    await User.updateOne({ _id: user._id }, { $set: { resetToken, resetTokenExpiry } } as any);

    // Prepare Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use host/port if not gmail
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD // App Password
      }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"AIaBLE Support" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Khôi phục mật khẩu tài khoản AIaBLE',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B5CF6;">AIaBLE - Khôi phục mật khẩu</h2>
          <p>Xin chào ${user.fullName},</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản AIaBLE của mình.</p>
          <p>Vui lòng click vào nút bên dưới để tiến hành đặt lại mật khẩu. Link này sẽ hết hạn sau 1 giờ.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Đặt Lại Mật Khẩu
            </a>
          </div>
          <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">Đội ngũ AIaBLE INTELLICREW</p>
        </div>
      `
    };

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      await transporter.sendMail(mailOptions);
      console.log(`[Email Sent] Đã gửi link reset password tới ${email}`);
    } else {
      console.log(`[Mock Email] SMTP chưa được cấu hình. Gửi link reset password tới ${email}: ${resetLink}`);
    }

    res.json({ success: true, message: 'Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.' });
  } catch (error: any) {
    console.error('[Forgot Password Error]', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xử lý yêu cầu quên mật khẩu.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, newPassword } = req.body;
    
    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin yêu cầu.' });
    }

    // Cast any to access generic fields
    const user = await User.findOne({ email, resetToken: token } as any);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc sai email.' });
    }

    const doc = user as any;
    if (!doc.resetTokenExpiry || Date.now() > doc.resetTokenExpiry) {
      return res.status(400).json({ success: false, message: 'Token đã hết hạn. Vui lòng yêu cầu lại.' });
    }

    // Update password and remove reset token
    user.password = newPassword;
    await User.updateOne({ _id: user._id }, { 
      $set: { password: newPassword },
      $unset: { resetToken: 1, resetTokenExpiry: 1 } 
    } as any);

    res.json({ success: true, message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch (error: any) {
    console.error('[Reset Password Error]', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi đặt lại mật khẩu.' });
  }
};
