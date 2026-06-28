import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(__dirname, '../data/users.json');

const readUsers = (): any[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) { return []; }
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (err) {
    return [];
  }
};

const writeUsers = (users: any[]) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export const getProfile = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const users = readUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const profile = {
      name: user.fullName,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      bio: user.bio || 'AI enthusiast & Computer Science student.',
      location: user.location || 'Ho Chi Minh City, Vietnam',
      website: user.website || 'github.com',
      avatar: user.avatar || '',
      cover: user.cover || '',
      birthday: user.birthday || '01/01/2000'
    };

    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy profile' });
  }
};

export const updateProfile = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const updates = req.body;

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Update fields
    if (updates.name !== undefined) users[userIndex].fullName = updates.name;
    if (updates.username !== undefined) users[userIndex].username = updates.username;
    if (updates.bio !== undefined) users[userIndex].bio = updates.bio;
    if (updates.location !== undefined) users[userIndex].location = updates.location;
    if (updates.website !== undefined) users[userIndex].website = updates.website;
    if (updates.avatar !== undefined) users[userIndex].avatar = updates.avatar;
    if (updates.cover !== undefined) users[userIndex].cover = updates.cover;
    if (updates.birthday !== undefined) users[userIndex].birthday = updates.birthday;
    
    if (updates.email !== undefined) {
      // Check for duplicate email
      const existing = users.find(u => u.email === updates.email && u.id !== userId);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email đã được sử dụng bởi người khác' });
      }
      users[userIndex].email = updates.email;
    }

    writeUsers(users);

    res.json({ success: true, message: 'Cập nhật thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật profile' });
  }
};
