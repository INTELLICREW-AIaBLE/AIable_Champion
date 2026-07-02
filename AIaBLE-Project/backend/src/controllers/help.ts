import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Store help requests in a JSON file for now, or just log them
const HELP_FILE = path.join(__dirname, '../../data/help.json');

export const submitHelpRequest = async (req: Request, res: Response) => {
  try {
    const { subject, message, type } = req.body;
    // @ts-ignore
    const userId = req.userId; 

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const helpEntry = {
      id: Date.now().toString(),
      userId: userId,
      subject,
      message,
      type: type || 'GENERAL',
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    let existingData = [];
    if (fs.existsSync(HELP_FILE)) {
      const data = fs.readFileSync(HELP_FILE, 'utf-8');
      if (data) {
        existingData = JSON.parse(data);
      }
    } else {
      if (!fs.existsSync(path.dirname(HELP_FILE))) {
        fs.mkdirSync(path.dirname(HELP_FILE), { recursive: true });
      }
    }

    existingData.push(helpEntry);
    fs.writeFileSync(HELP_FILE, JSON.stringify(existingData, null, 2));

    res.json({
      success: true,
      message: 'Help request submitted successfully',
      data: helpEntry
    });
  } catch (error: any) {
    console.error('Submit Help Error:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting help request' });
  }
};
