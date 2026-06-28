import { callGemini } from './gemini';
import { WorkflowStep, TaskMatcherResponse } from '../types/matcher';

// ============================================================
// RULE-BASED DATA
// Add more subjects here to expand without touching logic
// ============================================================
const ruleBasedWorkflows: Record<string, WorkflowStep[]> = {
  'software engineering': [
    {
      stepName: 'Phan tich yeu cau',
      description: 'Xac dinh bai toan, doi tuong su dung, chuc nang chinh cua he thong.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup brainstorm nhanh cac use case va yeu cau he thong.',
      suggestedPrompt: 'Phan tich yeu cau he thong cho du an [TEN_DU_AN]. Liet ke cac actor, use case chinh va yeu cau phi chuc nang.'
    },
    {
      stepName: 'Thiet ke he thong',
      description: 'Ve so do UML, thiet ke database, xac dinh cong nghe su dung.',
      suggestedTool: 'Gemini',
      reason: 'Gemini co the goi y kien truc phu hop va sinh so do UML co ban.',
      suggestedPrompt: 'Thiet ke kien truc he thong cho [TEN_DU_AN] su dung [CONG_NGHE]. Ve so do ERD va class diagram.'
    },
    {
      stepName: 'Lap trinh',
      description: 'Viet code theo thiet ke, chia module ro rang, co comment day du.',
      suggestedTool: 'GitHub Copilot',
      reason: 'Copilot giup viet code nhanh hon, giam thieu loi cu phap.',
      suggestedPrompt: 'Viet [CHUC_NANG] bang [NGON_NGU] theo pattern MVC. Yeu cau: clean code, co xu ly loi, co comment.'
    },
    {
      stepName: 'Kiem thu',
      description: 'Viet test case, kiem tra tung chuc nang, xu ly bug.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup sinh test case da dang ma ban co the bo qua.',
      suggestedPrompt: 'Tao 10 test case cho chuc nang [CHUC_NANG] bao gom ca truong hop bien va truong hop loi.'
    },
    {
      stepName: 'Bao cao va thuyet trinh',
      description: 'Viet bao cao du an, chuan bi slide thuyet trinh ro rang.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet bao cao chuan chinh, dung van phong hoc thuat.',
      suggestedPrompt: 'Viet bao cao ket qua du an [TEN_DU_AN] bao gom: tong quan, kien truc, ket qua dat duoc, han che va huong phat trien.'
    }
  ],

  'marketing': [
    {
      stepName: 'Nghien cuu thi truong',
      description: 'Phan tich doi thu, xac dinh khach hang muc tieu, nghien cuu xu huong.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tong hop thong tin nhanh tu nhieu nguon khac nhau.',
      suggestedPrompt: 'Phan tich thi truong cho san pham [SAN_PHAM] tai Viet Nam. Bao gom: doi thu canh tranh, khach hang muc tieu, xu huong hien tai.'
    },
    {
      stepName: 'Xay dung chien luoc',
      description: 'Dinh vi thuong hieu, chon kenh phan phoi, xac dinh ngan sach.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup xay dung chien luoc 4P co cau truc ro rang.',
      suggestedPrompt: 'Xay dung chien luoc Marketing 4P cho [SAN_PHAM] huong den doi tuong [KHACH_HANG]. Ngan sach du kien: [NGAN_SACH].'
    },
    {
      stepName: 'Tao noi dung',
      description: 'Viet content cho cac kenh truyen thong, thiet ke hinh anh quang cao.',
      suggestedTool: 'Canva + Gemini',
      reason: 'Gemini viet content, Canva thiet ke hinh anh chuyen nghiep.',
      suggestedPrompt: 'Viet 5 bai post Facebook cho [SAN_PHAM], tone giong [PHONG_CACH], muc tieu tang tuong tac.'
    },
    {
      stepName: 'Trien khai chien dich',
      description: 'Dang bai theo lich, chay quang cao, theo doi phan hoi.',
      suggestedTool: 'Meta Ads Manager',
      reason: 'Quan ly quang cao tap trung, do luong hieu qua theo thoi gian thuc.',
      suggestedPrompt: 'Tao kich ban chay quang cao Facebook Ads cho [SAN_PHAM] voi ngan sach [NGAN_SACH]/ngay. Muc tieu: [MUC_TIEU].'
    },
    {
      stepName: 'Do luong va bao cao',
      description: 'Phan tich KPI, danh gia hieu qua chien dich, de xuat cai tien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phan tich so lieu va viet bao cao ket qua chien dich.',
      suggestedPrompt: 'Phan tich ket qua chien dich Marketing: [SO_LIEU]. Danh gia hieu qua va de xuat cai tien cho lan sau.'
    }
  ],

  'business administration': [
    {
      stepName: 'Xac dinh van de kinh doanh',
      description: 'Phan tich tinh huong, xac dinh van de cot loi can giai quyet.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phan tich van de da chieu, nhin tu nhieu goc do.',
      suggestedPrompt: 'Phan tich van de kinh doanh: [VAN_DE]. Su dung mo hinh SWOT de danh gia tinh huong.'
    },
    {
      stepName: 'Thu thap va phan tich du lieu',
      description: 'Thu thap so lieu, phan tich bang bieu, rut ra ket luan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup interpret so lieu va goi y phuong phap phan tich phu hop.',
      suggestedPrompt: 'Phan tich du lieu kinh doanh sau: [DU_LIEU]. Rut ra 3 ket luan chinh va de xuat hanh dong cu the.'
    },
    {
      stepName: 'De xuat giai phap',
      description: 'Xay dung 2-3 phuong an giai quyet, danh gia uu nhuoc diem tung phuong an.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup brainstorm nhieu giai phap sang tao va phan tich ro rang.',
      suggestedPrompt: 'De xuat 3 giai phap cho van de [VAN_DE]. Moi giai phap can: mo ta, uu diem, nhuoc diem, chi phi uoc tinh.'
    },
    {
      stepName: 'Lap ke hoach thuc hien',
      description: 'Xay dung lo trinh cu the, phan cong nhan su, dat moc kiem tra.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tao ke hoach co cau truc Gantt chart ro rang.',
      suggestedPrompt: 'Lap ke hoach thuc hien giai phap [GIAI_PHAP] trong [THOI_GIAN]. Bao gom: cac buoc cu the, nguoi phu trach, deadline.'
    },
    {
      stepName: 'Trinh bay va bao ve',
      description: 'Chuan bi bai thuyet trinh, luyen tap tra loi cau hoi phan bien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup chuan bi cau tra loi cho cac cau hoi kho.',
      suggestedPrompt: 'Tao 10 cau hoi phan bien cho de tai [DE_TAI] va goi y cach tra loi hieu qua.'
    }
  ],

  'data science': [
    {
      stepName: 'Xac dinh bai toan',
      description: 'Dinh nghia ro van de can giai quyet, xac dinh muc tieu phan tich.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phat bieu bai toan chinh xac va chon phuong phap phu hop.',
      suggestedPrompt: 'Phat bieu bai toan Data Science: [BAI_TOAN]. Xac dinh: input, output, metric danh gia, gia thuyet ban dau.'
    },
    {
      stepName: 'Thu thap va lam sach du lieu',
      description: 'Lay du lieu tu cac nguon, xu ly missing values, outliers.',
      suggestedTool: 'Gemini + Python',
      reason: 'Gemini viet code Python xu ly du lieu nhanh va chinh xac.',
      suggestedPrompt: 'Viet code Python de lam sach dataset: [MO_TA_DATA]. Xu ly: gia tri null, outlier, chuan hoa du lieu.'
    },
    {
      stepName: 'Phan tich kham pha du lieu (EDA)',
      description: 'Ve bieu do, tinh thong ke mo ta, tim moi tuong quan.',
      suggestedTool: 'Gemini + Python',
      reason: 'Gemini sinh code visualization nhanh, giai thich y nghia bieu do ro rang.',
      suggestedPrompt: 'Viet code EDA cho dataset [MO_TA_DATA] bang Python. Ve: histogram, correlation matrix, boxplot.'
    },
    {
      stepName: 'Xay dung mo hinh',
      description: 'Chon thuat toan, train model, toi uu tham so.',
      suggestedTool: 'Gemini + Python',
      reason: 'Gemini goi y thuat toan phu hop va viet code scikit-learn chinh xac.',
      suggestedPrompt: 'Xay dung mo hinh Machine Learning cho bai toan [BAI_TOAN] bang Python. So sanh: [THUAT_TOAN_1] va [THUAT_TOAN_2].'
    },
    {
      stepName: 'Bao cao ket qua',
      description: 'Trinh bay ket qua, giai thich y nghia, de xuat ung dung thuc te.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet bao cao ky thuat de hieu cho ca nguoi doc non-technical.',
      suggestedPrompt: 'Viet bao cao ket qua mo hinh [TEN_MO_HINH] dat [KET_QUA]. Giai thich y nghia thuc te va han che.'
    }
  ]
};

// ============================================================
// HELPER: Normalize subject input for matching
// ============================================================
const normalizeSubject = (subject: string): string => {
  return subject.toLowerCase().trim();
};

// ============================================================
// HELPER: Find matching rule-based workflow
// ============================================================
const findRuleBasedWorkflow = (subject: string): WorkflowStep[] | null => {
  const normalized = normalizeSubject(subject);

  // Check exact match first
  if (ruleBasedWorkflows[normalized]) {
    return ruleBasedWorkflows[normalized];
  }

  // Check partial match / abbreviations
  const keywords: Record<string, string> = {
    'se': 'software engineering',
    'sw': 'software engineering',
    'phan mem': 'software engineering',
    'mkt': 'marketing',
    'qtkd': 'business administration',
    'quan tri': 'business administration',
    'ds': 'data science',
    'data': 'data science',
    'khoa hoc du lieu': 'data science'
  };

  if (keywords[normalized]) {
    return ruleBasedWorkflows[keywords[normalized]];
  }

  return null;
};

// ============================================================
// HELPER: Call Gemini to generate workflow for unknown subject
// ============================================================
const generateWorkflowWithGemini = async (
  subject: string,
  description: string
): Promise<WorkflowStep[]> => {
  const prompt = `
You are an academic assistant helping university students break down their assignments.

Subject: "${subject}"
Task description: "${description}"

Generate a workflow with exactly 5 steps to complete this assignment.
Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "stepName": "Step name here",
    "description": "What to do in this step",
    "suggestedTool": "Tool name (e.g. Gemini, Canva, Python, Word)",
    "reason": "Why this tool is recommended",
    "suggestedPrompt": "A sample prompt the student can use for this step"
  }
]
`;

  const raw = await callGemini(prompt);

  // Remove markdown code blocks if Gemini wraps response in ```json
  const cleaned = raw.replace(/```json|```/g, '').trim();

  // Parse Gemini response safely
  let steps: WorkflowStep[];
  try {
    steps = JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini returned invalid JSON. Please try again.');
  }

  // Validate each step has all required fields
  const requiredFields: (keyof WorkflowStep)[] = [
    'stepName', 'description', 'suggestedTool', 'reason', 'suggestedPrompt'
  ];

  for (const step of steps) {
    for (const field of requiredFields) {
      if (!step[field]) {
        throw new Error(`Gemini response missing required field: "${field}"`);
      }
    }
  }

  return steps;
};

// ============================================================
// MAIN FUNCTION: Match task to workflow
// ============================================================
export const matchTask = async (
  subject: string,
  description: string
): Promise<TaskMatcherResponse> => {
  // Try rule-based first
  const ruleSteps = findRuleBasedWorkflow(subject);

  if (ruleSteps) {
    return {
      success: true,
      subject,
      source: 'rule-based',
      steps: ruleSteps
    };
  }

  // Fallback to Gemini for unknown subjects
  const geminiSteps = await generateWorkflowWithGemini(subject, description);

  return {
    success: true,
    subject,
    source: 'gemini',
    steps: geminiSteps
  };
};