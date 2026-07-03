import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string; // Có thể bỏ nếu dùng _id mặc định của MongoDB
  fullName: string;
  email: string;
  password?: string;
  username: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  cover?: string;
  birthday?: string;
  role?: string;
  isLocked?: boolean;
  resetToken?: string;
  resetTokenExpiry?: number;
  savedRecipes?: any[];
  history?: any[];
}

const userSchema = new Schema<IUser>({
  id: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String, required: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  avatar: { type: String, default: '' },
  cover: { type: String, default: '' },
  birthday: { type: String, default: '' },
  role: { type: String, default: 'user' },
  isLocked: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Number },
  savedRecipes: { type: [Schema.Types.Mixed], default: [] },
  history: { type: [Schema.Types.Mixed], default: [] }
}, {
  timestamps: true // Tự động tạo createdAt, updatedAt
});

export default mongoose.model<IUser>('User', userSchema);
