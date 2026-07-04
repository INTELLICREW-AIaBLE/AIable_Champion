import mongoose, { Schema, Document } from 'mongoose';

export interface IEssay extends Document {
  userId?: string;
  rawText: string;
  criticalThinkingScore: number;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const EssaySchema: Schema = new Schema({
  userId: { type: String, index: true },
  rawText: { type: String, required: true },
  criticalThinkingScore: { type: Number, required: true },
  summary: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IEssay>('Essay', EssaySchema);
