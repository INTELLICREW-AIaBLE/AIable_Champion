import mongoose, { Schema, Document } from 'mongoose';

export interface IApiToken extends Document {
  name: string;
  usedTokens: number;
  limit: number;
  warningThreshold: number; // percentage
  lastWarningSent?: Date;
}

const apiTokenSchema = new Schema<IApiToken>({
  name: { type: String, required: true, unique: true },
  usedTokens: { type: Number, default: 0 },
  limit: { type: Number, default: 1000000 },
  warningThreshold: { type: Number, default: 80 },
  lastWarningSent: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IApiToken>('ApiToken', apiTokenSchema);
