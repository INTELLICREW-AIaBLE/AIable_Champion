import { Request, Response } from 'express';
import { validateText, fallbackValidate } from '../services/validatorService';
import Essay from '../models/Essay';
import Claim from '../models/Claim';

// POST /api/validator/analyze
// Body: { text: string, userId?: string, geminiKey?: string }
export const handleValidate = async (req: Request, res: Response) => {
  try {
    const { text, geminiKey } = req.body;
    const userId = req.body.userId || (req.query.userId as string) || 'default-user';

    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đoạn văn bản tối thiểu 20 ký tự để kiểm chứng.',
      });
    }

    if (text.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Văn bản quá dài. Tối đa 5000 ký tự.',
      });
    }

    // Call service to perform Factored CoVe + RAG analysis
    const result = await validateText(text.trim(), geminiKey);

    // Save Essay to MongoDB
    const essay = await Essay.create({
      userId,
      rawText: text.trim(),
      criticalThinkingScore: result.criticalThinkingScore,
      summary: result.summary
    });

    // Save Claims to MongoDB referencing the Essay
    const claimPromises = result.claims.map((c: any) => {
      return Claim.create({
        essayId: essay._id,
        text: c.text,
        riskScore: c.riskScore,
        riskLevel: c.riskLevel,
        signals: c.signals,
        card: c.card,
        sources: c.sources || [],
        resolution: {
          resolved: false,
          userNote: ''
        }
      });
    });

    const savedClaims = await Promise.all(claimPromises);

    res.json({
      success: true,
      essay,
      claims: savedClaims
    });
  } catch (error: any) {
    console.error('[Validator Controller Error]:', error.message);

    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit') || msg.includes('token') || msg.includes('overloaded')) {
      return res.status(429).json({
        success: false,
        message: 'Hệ thống AI đang quá tải hoặc hết Token (Rate Limit). Vui lòng thử lại sau ít phút!',
      });
    }

    // Fallback logic
    try {
      const userId = req.body.userId || (req.query.userId as string) || 'default-user';
      const fallback = fallbackValidate(req.body.text || '');
      
      const essay = await Essay.create({
        userId,
        rawText: (req.body.text || '').trim(),
        criticalThinkingScore: fallback.criticalThinkingScore,
        summary: fallback.summary
      });

      const claimPromises = fallback.claims.map((c: any) => {
        return Claim.create({
          essayId: essay._id,
          text: c.text,
          riskScore: c.riskScore,
          riskLevel: c.riskLevel,
          signals: c.signals,
          card: c.card,
          sources: c.sources || [],
          resolution: {
            resolved: false,
            userNote: ''
          }
        });
      });

      const savedClaims = await Promise.all(claimPromises);

      res.json({
        success: true,
        essay,
        claims: savedClaims,
        isFallback: true
      });
    } catch (fallbackErr: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi kiểm định văn bản.',
      });
    }
  }
};

// GET /api/validator/history
export const getHistory = async (req: Request, res: Response) => {
  try {
    // Admin sees all essays submitted to the system for auditing purposes
    const essays = await Essay.find().sort({ createdAt: -1 }).limit(10);
    
    // For each essay, fetch its claims
    const historyData = await Promise.all(
      essays.map(async (essay) => {
        const claims = await Claim.find({ essayId: essay._id });
        return {
          essay,
          claims
        };
      })
    );

    res.json({
      success: true,
      data: historyData
    });
  } catch (error: any) {
    console.error('[Validator Controller History Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy lịch sử phân tích.',
    });
  }
};

// PATCH /api/validator/claims/:claimId/resolve
// Body: { resolved: boolean, userNote?: string }
export const resolveClaim = async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;
    const { resolved, userNote } = req.body;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin cảnh báo này.',
      });
    }

    claim.resolution = {
      resolved: !!resolved,
      resolvedAt: resolved ? new Date() : undefined,
      userNote: userNote || ''
    };

    await claim.save();

    res.json({
      success: true,
      data: claim
    });
  } catch (error: any) {
    console.error('[Validator Controller Resolve Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái kiểm chứng.',
    });
  }
};
