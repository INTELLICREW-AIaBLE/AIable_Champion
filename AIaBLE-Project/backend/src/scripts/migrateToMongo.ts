import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Khởi tạo dotenv để lấy MONGO_URI
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User';

const USERS_FILE = path.join(__dirname, '../data/users.json');

const migrate = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('Không tìm thấy MONGO_URI trong .env');
      process.exit(1);
    }

    console.log('Đang kết nối MongoDB...');
    await mongoose.connect(uri);
    console.log('Đã kết nối thành công!');

    // Đọc dữ liệu từ users.json
    console.log('Đang đọc file users.json...');
    const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

    // Xoá dữ liệu cũ trong Collection User (nếu có) để tránh duplicate
    console.log('Đang dọn dẹp dữ liệu cũ trên MongoDB...');
    await User.deleteMany({});

    // Import dữ liệu mới
    console.log(`Bắt đầu import ${usersData.length} users...`);
    await User.insertMany(usersData);
    
    console.log('🎉 Quá trình Migrate thành công!');
    process.exit(0);
  } catch (error) {
    console.error('Migrate thất bại:', error);
    process.exit(1);
  }
};

migrate();
