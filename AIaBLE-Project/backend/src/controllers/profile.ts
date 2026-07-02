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
      role: user.role || 'user',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      avatar: user.avatar || '',
      cover: user.cover || '',
      birthday: user.birthday || '',
      apiKeys: user.apiKeys || {
        openai: process.env.OPENAI_API_KEY || '',
        anthropic: process.env.ANTHROPIC_API_KEY || '',
        gemini: process.env.GEMINI_API_KEY || ''
      },
      skills: user.skills || []
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
    if (updates.skills !== undefined) users[userIndex].skills = updates.skills;
    
    if (updates.email !== undefined) {
      // Check for duplicate email
      const existing = users.find(u => u.email === updates.email && u.id !== userId);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email đã được sử dụng bởi người khác' });
      }
      users[userIndex].email = updates.email;
    }

    if (updates.apiKeys !== undefined) {
      users[userIndex].apiKeys = updates.apiKeys;
    }

    writeUsers(users);

    res.json({ success: true, message: 'Cập nhật thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật profile' });
  }
};

export const getHistory = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const users = readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    res.json({ success: true, data: user.history || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const logHistoryHelper = (userId: string, action: string, tool: string, detail: string, model: string = 'System', prompt?: string, result?: string) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;
    
    if (!users[userIndex].history) users[userIndex].history = [];
    const newItem = {
      id: Date.now().toString(),
      action, tool, detail, model, prompt, result,
      time: new Date().toISOString()
    };
    users[userIndex].history.unshift(newItem);
    if (users[userIndex].history.length > 50) {
      users[userIndex].history = users[userIndex].history.slice(0, 50);
    }
    writeUsers(users);
  } catch (err) {
    console.error('Error logging history helper:', err);
  }
};

export const addHistory = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { action, tool, detail, model, prompt, result } = req.body;
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    if (!users[userIndex].history) users[userIndex].history = [];
    const newItem = {
      id: Date.now().toString(),
      action, tool, detail, model, prompt, result,
      time: new Date().toISOString()
    };
    users[userIndex].history.unshift(newItem);
    // Keep max 50 history items
    if (users[userIndex].history.length > 50) {
      users[userIndex].history = users[userIndex].history.slice(0, 50);
    }
    writeUsers(users);
    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const getSavedRecipes = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const users = readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    res.json({ success: true, data: user.savedRecipes || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const toggleSavedRecipe = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { recipe } = req.body;
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    if (!users[userIndex].savedRecipes) users[userIndex].savedRecipes = [];
    const existingIndex = users[userIndex].savedRecipes.findIndex((r: any) => r.id === recipe.id);
    
    if (existingIndex > -1) {
      users[userIndex].savedRecipes.splice(existingIndex, 1);
    } else {
      users[userIndex].savedRecipes.unshift(recipe);
    }
    
    writeUsers(users);
    res.json({ success: true, message: 'Đã cập nhật danh sách lưu' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
