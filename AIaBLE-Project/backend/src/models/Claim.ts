import mongoose, { Schema, Document } from 'mongoose';

export interface IClaim extends Document {
  essayId: mongoose.Types.ObjectId;
  text: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  signals: {
    selfInconsistency: number;
    noSourceFound: number;
    sourceContradiction: number;
    overconfidenceLanguage: number;
  };
  card: {
    reasonText: string;
    guidingQuestions: string[];
    suggestedSearchTerms: string[];
    sourceUrl?: string;
  };
  sources: { title: string; url: string; snippet?: string }[];
  resolution: {
    resolved: boolean;
    resolvedAt?: Date;
    userNote?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema: Schema = new Schema({
  essayId: { type: Schema.Types.ObjectId, ref: 'Essay', required: true, index: true },
  text: { type: String, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
  signals: {
    selfInconsistency: { type: Number, default: 0 },
    noSourceFound: { type: Number, default: 0 },
    sourceContradiction: { type: Number, default: 0 },
    overconfidenceLanguage: { type: Number, default: 0 },
  },
  card: {
    reasonText: { type: String, required: true },
    guidingQuestions: { type: [String], default: [] },
    suggestedSearchTerms: { type: [String], default: [] },
    sourceUrl: { type: String, default: '' },
  },
  sources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    snippet: { type: String }
  }],
  resolution: {
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    userNote: { type: String, default: '' },
  }
}, { timestamps: true });

export default mongoose.model<IClaim>('Claim', ClaimSchema);
