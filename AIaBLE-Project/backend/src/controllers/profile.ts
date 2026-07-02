import { Request, Response } from 'express';
import User from '../models/User';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const doc = user as any;
    const profile = {
      name: doc.fullName,
      username: doc.username || doc.email.split('@')[0],
      email: doc.email,
      role: doc.role || 'user',
      bio: doc.bio || '',
      location: doc.location || '',
      website: doc.website || '',
      avatar: doc.avatar || '',
      cover: doc.cover || '',
      birthday: doc.birthday || '',
      apiKeys: doc.apiKeys || {
        openai: process.env.OPENAI_API_KEY || '',
        anthropic: process.env.ANTHROPIC_API_KEY || '',
        gemini: process.env.GEMINI_API_KEY || ''
      },
      skills: doc.skills || []
    };

    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const updates = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const doc = user as any;

    // Update fields
    if (updates.name !== undefined) doc.fullName = updates.name;
    if (updates.username !== undefined) doc.username = updates.username;
    if (updates.bio !== undefined) doc.bio = updates.bio;
    if (updates.location !== undefined) doc.location = updates.location;
    if (updates.website !== undefined) doc.website = updates.website;
    if (updates.avatar !== undefined) doc.avatar = updates.avatar;
    if (updates.cover !== undefined) doc.cover = updates.cover;
    if (updates.birthday !== undefined) doc.birthday = updates.birthday;
    if (updates.skills !== undefined) doc.skills = updates.skills;
    
    if (updates.email !== undefined && updates.email !== doc.email) {
      // Check for duplicate email
      const existing = await User.findOne({ email: updates.email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email đã được sử dụng bởi người khác' });
      }
      doc.email = updates.email;
    }

    if (updates.apiKeys !== undefined) {
      doc.apiKeys = updates.apiKeys;
    }

    await doc.save();

    res.json({ success: true, message: 'Cập nhật thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật profile' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    const doc = user as any;
    res.json({ success: true, data: doc.history || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const logHistoryHelper = async (userId: string, action: string, tool: string, detail: string, model: string = 'System', prompt?: string, result?: string) => {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) return;
    
    const doc = user as any;
    if (!doc.history) doc.history = [];
    
    const newItem = {
      id: Date.now().toString(),
      action, tool, detail, model, prompt, result,
      time: new Date().toISOString()
    };
    
    doc.history.unshift(newItem);
    if (doc.history.length > 50) {
      doc.history = doc.history.slice(0, 50);
    }
    
    await User.updateOne({ id: userId }, { $set: { history: doc.history } });
  } catch (err) {
    console.error('Error logging history helper:', err);
  }
};

export const addHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { action, tool, detail, model, prompt, result } = req.body;
    
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    const doc = user as any;
    if (!doc.history) doc.history = [];
    
    const newItem = {
      id: Date.now().toString(),
      action, tool, detail, model, prompt, result,
      time: new Date().toISOString()
    };
    
    doc.history.unshift(newItem);
    // Keep max 50 history items
    if (doc.history.length > 50) {
      doc.history = doc.history.slice(0, 50);
    }
    
    await User.updateOne({ id: userId }, { $set: { history: doc.history } });
    
    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const getSavedRecipes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    const doc = user as any;
    res.json({ success: true, data: doc.savedRecipes || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const toggleSavedRecipe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { recipe } = req.body;
    
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    const doc = user as any;
    if (!doc.savedRecipes) doc.savedRecipes = [];
    
    const existingIndex = doc.savedRecipes.findIndex((r: any) => r.id === recipe.id);
    
    if (existingIndex > -1) {
      doc.savedRecipes.splice(existingIndex, 1);
    } else {
      doc.savedRecipes.unshift(recipe);
    }
    
    await User.updateOne({ id: userId }, { $set: { savedRecipes: doc.savedRecipes } });
    
    res.json({ success: true, message: 'Đã cập nhật danh sách lưu' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
