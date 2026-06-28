import { callGemini } from './gemini';
import { WorkflowStep, TaskMatcherResponse } from '../types/matcher';

// ============================================================
// RULE-BASED DATA - 10 popular subjects at FPT University
// ============================================================
const ruleBasedWorkflows: Record<string, WorkflowStep[]> = {
  'software engineering': [
    {
      stepName: 'Phan tich yeu cau',
      description: 'Xac dinh bai toan, doi tuong su dung, chuc nang chinh cua he thong. Phan biet yeu cau chuc nang va phi chuc nang.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup brainstorm nhanh cac use case, actor va yeu cau he thong mot cach co cau truc.',
      suggestedPrompt: 'Phan tich yeu cau he thong cho du an [TEN_DU_AN]. Liet ke: 1) Cac actor chinh, 2) Use case tuong ung, 3) Yeu cau phi chuc nang (hieu nang, bao mat, giao dien).'
    },
    {
      stepName: 'Thiet ke he thong',
      description: 'Ve so do UML (use case, class, sequence), thiet ke database ERD, chon tech stack phu hop.',
      suggestedTool: 'Gemini',
      reason: 'Gemini sinh so do UML va ERD co ban nhanh, giup tiet kiem thoi gian thiet ke ban dau.',
      suggestedPrompt: 'Thiet ke he thong [TEN_DU_AN] voi cong nghe [CONG_NGHE]. Can: 1) So do ERD voi cac bang chinh, 2) Class diagram cho tang Business Logic, 3) Sequence diagram cho luong [CHUC_NANG_CHINH].'
    },
    {
      stepName: 'Lap trinh',
      description: 'Viet code theo thiet ke, chia module ro rang, ap dung design pattern phu hop, co comment day du.',
      suggestedTool: 'GitHub Copilot',
      reason: 'Copilot giup hoan thien code nhanh hon 40%, giam loi cu phap va goi y cach viet sach hon.',
      suggestedPrompt: 'Viet [CHUC_NANG] bang [NGON_NGU] theo pattern [PATTERN]. Yeu cau: clean code, xu ly loi day du, co unit test, comment giai thich logic phuc tap.'
    },
    {
      stepName: 'Kiem thu',
      description: 'Viet test case bao phu ca normal flow va edge case, thuc hien kiem thu don vi va tich hop.',
      suggestedTool: 'Gemini',
      reason: 'Gemini sinh bo test case da dang bao gom ca truong hop bien ma lap trinh vien thuong bo qua.',
      suggestedPrompt: 'Sinh 15 test case cho chuc nang [CHUC_NANG] cua he thong [TEN_DU_AN]. Bao gom: 5 test case binh thuong, 5 test case bien, 5 test case loi. Format: Test ID | Input | Expected Output | Priority.'
    },
    {
      stepName: 'Bao cao va thuyet trinh',
      description: 'Viet bao cao du an day du cac muc, chuan bi slide thuyet trinh 10-15 phut, luyen tap tra loi phan bien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet bao cao dung van phong hoc thuat, tao outline slide chuan va chuan bi cau hoi phan bien.',
      suggestedPrompt: 'Viet bao cao ket qua du an [TEN_DU_AN] theo cau truc: 1) Tong quan du an, 2) Phan tich yeu cau, 3) Thiet ke he thong, 4) Ket qua dat duoc, 5) Han che va huong phat trien. Van phong hoc thuat, khoang 3000 tu.'
    }
  ],

  'marketing': [
    {
      stepName: 'Nghien cuu thi truong',
      description: 'Phan tich thi truong bang mo hinh PEST, xac dinh doi tuong khach hang muc tieu, nghien cuu doi thu canh tranh.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tong hop thong tin thi truong nhanh tu nhieu goc do, giup phan tich PEST va customer persona chinh xac.',
      suggestedPrompt: 'Phan tich thi truong cho san pham [SAN_PHAM] tai Viet Nam nam [NAM]. Can: 1) Phan tich PEST, 2) Top 3 doi thu canh tranh kem diem manh/yeu, 3) Customer persona chi tiet cho phan khuc [PHAN_KHUC].'
    },
    {
      stepName: 'Xay dung chien luoc Marketing 4P',
      description: 'Dinh vi san pham, dat gia, chon kenh phan phoi, lap ke hoach truyen thong.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup xay dung chien luoc 4P co cau truc, phu hop voi ngan sach va muc tieu kinh doanh.',
      suggestedPrompt: 'Xay dung chien luoc Marketing 4P cho [SAN_PHAM] huong den [KHACH_HANG]. Ngan sach: [NGAN_SACH]. Can: Product (dinh vi, USP), Price (chien luoc gia), Place (kenh phan phoi), Promotion (ke hoach truyen thong 3 thang).'
    },
    {
      stepName: 'San xuat noi dung',
      description: 'Viet content calendar 1 thang, tao bai post mang xa hoi, thiet ke banner quang cao.',
      suggestedTool: 'Canva + Gemini',
      reason: 'Gemini viet content hap dan, Canva thiet ke hinh anh chuyen nghiep ma khong can ky nang do hoa.',
      suggestedPrompt: 'Tao content calendar 1 thang cho [SAN_PHAM] tren [KENH_MXH]. Moi tuan 3 bai, xen ke: 1 bai giao duc, 1 bai gioi thieu san pham, 1 bai tuong tac. Tone giong: [PHONG_CACH]. Viet san caption cho 4 bai dau.'
    },
    {
      stepName: 'Trien khai va quan ly chien dich',
      description: 'Dang bai theo content calendar, chay quang cao paid, theo doi comment va inbox.',
      suggestedTool: 'Meta Business Suite + Gemini',
      reason: 'Meta Business Suite quan ly dang bai tu dong, Gemini giup viet kich ban tra loi comment nhanh.',
      suggestedPrompt: 'Viet 10 mau tra loi comment cho [SAN_PHAM] theo cac tinh huong: hoi gia, khieu nai chat luong, yeu cau tu van, binh luan tieu cuc. Tone: chuyen nghiep, than thien.'
    },
    {
      stepName: 'Do luong hieu qua va bao cao',
      description: 'Theo doi KPI (reach, engagement, conversion), phan tich so lieu, de xuat cai tien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup giai thich so lieu marketing va viet bao cao ket qua chien dich de hieu.',
      suggestedPrompt: 'Phan tich ket qua chien dich Marketing tuan [TUAN]: Reach [SO], Engagement [SO], Click [SO], Conversion [SO]. Danh gia: dat/chua dat KPI, nguyen nhan, de xuat cai tien cu the cho tuan sau.'
    }
  ],

  'business administration': [
    {
      stepName: 'Xac dinh va phan tich van de',
      description: 'Phan tich tinh huong kinh doanh, xac dinh van de cot loi bang cong cu SWOT/PEST/5 Forces.',
      suggestedTool: 'Gemini',
      reason: 'Gemini phan tich van de kinh doanh da chieu, ap dung dung mo hinh phan tich phu hop.',
      suggestedPrompt: 'Phan tich tinh huong kinh doanh: [MO_TA_TINH_HUONG]. Su dung: 1) Ma tran SWOT, 2) Mo hinh 5 Forces cua Porter, 3) Xac dinh van de cot loi can giai quyet ngay.'
    },
    {
      stepName: 'Thu thap va phan tich du lieu',
      description: 'Thu thap so lieu dinh tinh va dinh luong, phan tich xu huong, rut ra insight.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup interpret so lieu phuc tap va de xuat phuong phap phan tich phu hop voi bai toan.',
      suggestedPrompt: 'Phan tich tap du lieu kinh doanh sau [DU_LIEU]. Yeu cau: 1) Tom tat 5 chi so quan trong nhat, 2) Phan tich xu huong 3 thang gan nhat, 3) So sanh voi trung binh nganh, 4) Rut ra 3 insight chinh.'
    },
    {
      stepName: 'De xuat giai phap chien luoc',
      description: 'Xay dung 3 phuong an giai quyet, phan tich chi phi-loi ich, chon phuong an toi uu.',
      suggestedTool: 'Gemini',
      reason: 'Gemini brainstorm nhieu giai phap sang tao va phan tich uu nhuoc diem mot cach khach quan.',
      suggestedPrompt: 'De xuat 3 giai phap cho van de [VAN_DE] voi ngan sach [NGAN_SACH]. Moi giai phap gom: mo ta chi tiet, chi phi uoc tinh, loi ich du kien (dinh luong), rui ro, thoi gian trien khai. Cuoi cung khuyen nghi giai phap tot nhat kem ly do.'
    },
    {
      stepName: 'Lap ke hoach hanh dong',
      description: 'Xay dung lo trinh trien khai cu the, phan cong nhan su, thiet lap KPI va moc kiem tra.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tao ke hoach hanh dong dang bang bieu ro rang, de theo doi va dieu chinh.',
      suggestedPrompt: 'Lap ke hoach hanh dong trien khai giai phap [GIAI_PHAP] trong [THOI_GIAN]. Format bang: STT | Cong viec | Nguoi phu trach | Deadline | KPI | Trang thai. Them phan rui ro va ke hoach du phong.'
    },
    {
      stepName: 'Trinh bay va bao ve truoc hoi dong',
      description: 'Chuan bi slide thuyet trinh 15 phut, luyen tap tra loi cau hoi kho tu mentor/giang vien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini chuan bi bo cau hoi phan bien sat thuc te va goi y cach tra loi thuyet phuc.',
      suggestedPrompt: 'Tao 15 cau hoi phan bien cho bai trinh bay ve [CHU_DE]. Chia lam 3 nhom: 5 cau ve phan tich du lieu, 5 cau ve tinh kha thi giai phap, 5 cau ve rui ro. Kem goi y cach tra loi cho tung cau.'
    }
  ],

  'data science': [
    {
      stepName: 'Xac dinh bai toan va muc tieu',
      description: 'Phat bieu chinh xac bai toan, xac dinh loai bai toan (classification/regression/clustering), chon metric danh gia.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phat bieu bai toan chinh xac va chon metric danh gia phu hop tranh sai huong ngay tu dau.',
      suggestedPrompt: 'Phat bieu bai toan Data Science: [MO_TA]. Xac dinh: 1) Loai bai toan (supervised/unsupervised), 2) Input features va target variable, 3) Metric danh gia phu hop (accuracy/F1/RMSE...), 4) Baseline performance can dat.'
    },
    {
      stepName: 'Thu thap va tien xu ly du lieu',
      description: 'Lay du lieu tu cac nguon, kiem tra chat luong, xu ly missing values, outliers, encode categorical.',
      suggestedTool: 'Gemini + Python',
      reason: 'Gemini viet code Python xu ly du lieu nhanh, giai thich tung buoc xu ly ro rang.',
      suggestedPrompt: 'Viet code Python day du xu ly dataset [MO_TA_DATA] voi [SO_DONG] dong, [SO_COT] cot. Bao gom: 1) Kiem tra missing values va xu ly, 2) Phat hien va xu ly outlier bang IQR, 3) Encode categorical variables, 4) Chuan hoa du lieu bang StandardScaler.'
    },
    {
      stepName: 'Phan tich kham pha du lieu (EDA)',
      description: 'Ve bieu do phan phoi, correlation matrix, boxplot, tim moi quan he giua cac bien.',
      suggestedTool: 'Gemini + Python',
      reason: 'Gemini sinh code EDA hoan chinh voi matplotlib/seaborn va giai thich y nghia tung bieu do.',
      suggestedPrompt: 'Viet code EDA day du cho dataset [MO_TA]. Can: 1) Distribution plot cho tung bien so, 2) Correlation heatmap, 3) Boxplot phat hien outlier, 4) Pairplot giua cac bien quan trong, 5) Nhan xet phat hien chinh tu moi bieu do.'
    },
    {
      stepName: 'Xay dung va danh gia mo hinh',
      description: 'Chon va so sanh nhieu thuat toan, toi uu hyperparameter, danh gia tren tap test.',
      suggestedTool: 'Gemini + Python',
      reason: 'Gemini viet code so sanh nhieu mo hinh va giai thich cach chon mo hinh tot nhat mot cach ro rang.',
      suggestedPrompt: 'Viet code so sanh 4 mo hinh Machine Learning cho bai toan [BAI_TOAN]: LogisticRegression, RandomForest, XGBoost, SVM. Dung cross-validation 5-fold. Danh gia bang [METRIC]. Tinh: mean, std cua moi mo hinh. Ve bieu do so sanh va ket luan mo hinh tot nhat.'
    },
    {
      stepName: 'Bao cao ket qua va de xuat ung dung',
      description: 'Trinh bay quy trinh da lam, ket qua dat duoc, han che, de xuat cai tien va ung dung thuc te.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet bao cao ky thuat de hieu cho ca nguoi doc non-technical va chuyen gia.',
      suggestedPrompt: 'Viet bao cao Data Science Project [TEN_DU_AN]. Mo hinh tot nhat: [TEN_MO_HINH] dat [METRIC]: [KET_QUA]. Bao gom: 1) Tom tat cho non-technical reader, 2) Giai thich feature importance, 3) Han che cua mo hinh, 4) 3 huong cai tien cu the, 5) De xuat ung dung thuc te.'
    }
  ],

  'english': [
    {
      stepName: 'Hieu de bai va lap dan y',
      description: 'Doc ky de bai, xac dinh dang bai (essay/report/letter), lap dan y chi tiet truoc khi viet.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phan tich de bai chinh xac va tao dan y co cau truc phu hop voi dang bai.',
      suggestedPrompt: 'Phan tich de bai tieng Anh sau: [DE_BAI]. Xac dinh: 1) Dang bai (argumentative/descriptive/report), 2) Cac y chinh can trinh bay, 3) Dan y chi tiet voi topic sentence cho tung doan. Word limit: [SO_TU].'
    },
    {
      stepName: 'Viet ban nhap dau tien',
      description: 'Viet theo dan y da lap, tap trung vao noi dung truoc, chua can chinh sua ngu phap.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet ban nhap nhanh, sau do chinh sua theo phong cach cua ban than.',
      suggestedPrompt: 'Viet ban nhap bai [DANG_BAI] tieng Anh ve chu de [CHU_DE] theo dan y [DAN_Y]. Yeu cau: [SO_TU] tu, academic tone, co topic sentence ro rang moi doan, su dung linking words nhieu dang.'
    },
    {
      stepName: 'Chinh sua ngu phap va tu vung',
      description: 'Kiem tra grammar, chinh sua tu vung cho phong phu, tranh lap tu, nang cap cau phuc.',
      suggestedTool: 'Gemini',
      reason: 'Gemini phat hien loi ngu phap tinh te va goi y tu vung hoc thuat phong phu hon.',
      suggestedPrompt: 'Review bai viet tieng Anh sau va cai thien theo 4 tieu chi: 1) Sua loi grammar, 2) Nang cap tu vung len B2-C1, 3) Da dang hoa cau truc cau, 4) Cai thien cohesion va coherence. Giu nguyen y chinh cua tac gia: [BAI_VIET].'
    },
    {
      stepName: 'Hoan thien va kiem tra lan cuoi',
      description: 'Doc lai toan bo, kiem tra format, word count, chinh ta, dam bao dung yeu cau de bai.',
      suggestedTool: 'Gemini',
      reason: 'Gemini kiem tra tong the bai viet theo rubric cham diem tieng Anh hoc thuat.',
      suggestedPrompt: 'Cham diem bai viet tieng Anh sau theo thang diem IELTS Writing Task 2 (Task Achievement, Coherence, Lexical Resource, Grammar). Cho diem tung tieu chi, nhan xet diem manh/yeu va goi y cai thien cu the: [BAI_VIET].'
    },
    {
      stepName: 'Luyen tap thuyet trinh bang tieng Anh',
      description: 'Chuan bi script thuyet trinh, luyen phat am, chuan bi cau tra loi Q&A.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tao script thuyet trinh tu nhien va bo cau hoi Q&A sat thuc te.',
      suggestedPrompt: 'Tao script thuyet trinh tieng Anh 5 phut ve [CHU_DE] tu bai viet [TOM_TAT_BAI]. Bao gom: opening hook, 3 diem chinh, closing. Them 5 cau hoi Q&A pho bien va goi y cach tra loi tu tin.'
    }
  ],

  'economics': [
    {
      stepName: 'Xac dinh van de kinh te va thu thap du lieu',
      description: 'Xac dinh hien tuong kinh te can nghien cuu, thu thap so lieu tu nguon chinh thong (GSO, World Bank, IMF).',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup xac dinh nguon du lieu uy tin va phuong phap thu thap du lieu kinh te chinh xac.',
      suggestedPrompt: 'Huong dan thu thap du lieu cho de tai kinh te: [DE_TAI]. Can: 1) Danh sach cac bien kinh te can do luong, 2) Nguon du lieu uy tin (GSO/World Bank/IMF), 3) Phuong phap lay mau neu khao sat so cap, 4) Cach xu ly so lieu thu.'
    },
    {
      stepName: 'Phan tich ly thuyet va mo hinh',
      description: 'Van dung ly thuyet kinh te phu hop, xay dung mo hinh phan tich (dinh tinh hoac dinh luong).',
      suggestedTool: 'Gemini',
      reason: 'Gemini goi y ly thuyet kinh te phu hop va giai thich cach ap dung mo hinh vao bai toan cu the.',
      suggestedPrompt: 'Phan tich hien tuong kinh te [HIEN_TUONG] bang ly thuyet [LY_THUYET]. Can: 1) Tom tat ly thuyet va cac gia dinh, 2) Ap dung vao truong hop cu the cua Viet Nam, 3) Cac nhan to anh huong chinh, 4) Du bao xu huong ngan han.'
    },
    {
      stepName: 'Viet bai nghien cuu kinh te',
      description: 'Trinh bay ket qua phan tich theo cau truc bai nghien cuu kinh te chuan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet bai nghien cuu kinh te dung van phong hoc thuat, trich dan dung APA.',
      suggestedPrompt: 'Viet phan [PHAN] cua bai nghien cuu kinh te ve [CHU_DE]. Van phong hoc thuat, co trich dan. Dua tren so lieu: [SO_LIEU]. Dai khoang [SO_TU] tu.'
    },
    {
      stepName: 'De xuat chinh sach',
      description: 'Tu ket qua phan tich, de xuat chinh sach kinh te kha thi cho Viet Nam.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tong hop ket qua phan tich va de xuat chinh sach thuc te dua tren bang chung.',
      suggestedPrompt: 'Dua tren ket qua phan tich [TOM_TAT_KET_QUA], de xuat 3 chinh sach kinh te cho [DOI_TUONG_CHINH_SACH]. Moi chinh sach gom: mo ta, co so ly luan, loi ich du kien, rui ro, dieu kien trien khai.'
    },
    {
      stepName: 'Trinh bay va bao ve',
      description: 'Chuan bi slide trinh bay ket qua nghien cuu, bao ve truoc giang vien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup tao slide co cau truc tot va chuan bi cau hoi phan bien chuyen nganh.',
      suggestedPrompt: 'Tao outline slide trinh bay bai nghien cuu kinh te [TEN_BAI] trong 15 phut. Them 10 cau hoi phan bien thuong gap trong bao ve luan van kinh te va goi y cach tra loi.'
    }
  ],

  'accounting': [
    {
      stepName: 'Thu thap chung tu va so lieu ke toan',
      description: 'Tap hop chung tu, so sach ke toan, bao cao tai chinh can phan tich.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giai thich cach doc va phan loai chung tu ke toan chinh xac.',
      suggestedPrompt: 'Huong dan thu thap va phan loai chung tu ke toan cho bai tap [BAI_TAP]. Can: 1) Danh sach chung tu can thiet, 2) Cach kiem tra tinh hop le, 3) Nguyen tac ghi nhan theo chuan muc ke toan Viet Nam (VAS).'
    },
    {
      stepName: 'Ghi chep va xu ly but toan',
      description: 'Lap dinh khoan ke toan, vao so nhat ky, so cai, tinh so du cac tai khoan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini kiem tra dinh khoan ke toan, giai thich nguyen tac no-co chinh xac.',
      suggestedPrompt: 'Kiem tra va giai thich dinh khoan ke toan cho nghiep vu: [MO_TA_NGHIEP_VU]. Theo chuan muc VAS. Can: 1) Dinh khoan chinh xac, 2) Giai thich tai khoan su dung, 3) Anh huong den bao cao tai chinh.'
    },
    {
      stepName: 'Lap bao cao tai chinh',
      description: 'Lap Bang can doi ke toan, Bao cao ket qua kinh doanh, Bao cao luu chuyen tien te.',
      suggestedTool: 'Gemini',
      reason: 'Gemini kiem tra tinh can doi cua bao cao tai chinh va giai thich cac khoan muc phuc tap.',
      suggestedPrompt: 'Kiem tra Bang can doi ke toan sau va chi ra cac diem bat thuong: [SO_LIEU_BCKT]. Giai thich: 1) Cac khoan muc can chu y, 2) Tinh hop ly cua co cau tai san-nguon von, 3) De xuat dieu chinh neu co.'
    },
    {
      stepName: 'Phan tich bao cao tai chinh',
      description: 'Tinh toan va phan tich cac chi so tai chinh: thanh khoan, hieu qua, don bay, sinh loi.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tinh toan nhanh cac chi so tai chinh va giai thich y nghia trong boi canh nganh.',
      suggestedPrompt: 'Phan tich bao cao tai chinh cua [TEN_CONG_TY] nam [NAM]. So lieu: [SO_LIEU]. Tinh va nhan xet: 1) Chi so thanh khoan (Current/Quick ratio), 2) Chi so hieu qua (ROA, ROE), 3) Chi so don bay (D/E ratio), 4) So sanh voi trung binh nganh [TEN_NGANH].'
    },
    {
      stepName: 'Bao cao ket qua va de xuat',
      description: 'Tong hop ket qua phan tich, de xuat cai thien tinh hinh tai chinh, trinh bay ro rang.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet bao cao ke toan chuyen nghiep, de hieu voi ca doi tuong non-financial.',
      suggestedPrompt: 'Viet bao cao phan tich tai chinh [TEN_CONG_TY] dua tren ket qua [TOM_TAT_KET_QUA]. Bao gom: 1) Tom tat suc khoe tai chinh (1 trang), 2) Diem manh/yeu chinh, 3) 3 de xuat cai thien cu the kem lo trinh trien khai.'
    }
  ],

  'project management': [
    {
      stepName: 'Khoi dong du an (Project Initiation)',
      description: 'Xac dinh pham vi du an, cac ben lien quan, muc tieu SMART, lap Project Charter.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup lap Project Charter day du, xac dinh stakeholder va muc tieu SMART chinh xac.',
      suggestedPrompt: 'Lap Project Charter cho du an [TEN_DU_AN]. Can: 1) Muc tieu SMART cu the, 2) Danh sach stakeholder kem muc do anh huong, 3) Pham vi du an (trong/ngoai pham vi), 4) Rui ro ban dau, 5) Ngan sach va thoi gian uoc tinh.'
    },
    {
      stepName: 'Lap ke hoach du an (Project Planning)',
      description: 'Phan ra cong viec (WBS), lap lich Gantt, phan cong nguon luc, xac dinh duong ki han.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phan ra WBS chi tiet va xac dinh duong ki han (critical path) chinh xac.',
      suggestedPrompt: 'Lap WBS cho du an [TEN_DU_AN] ke hoach [THOI_GIAN] thang, nhan su [SO_NGUOI]. Can: 1) WBS 3 cap chi tiet, 2) Uoc tinh thoi gian moi task, 3) Phan cong nhan su, 4) Xac dinh cac milestone chinh, 5) Nhan biet cong viec tren duong ki han.'
    },
    {
      stepName: 'Thuc thi du an (Project Execution)',
      description: 'Trieu tap cuoc hop kickoff, phan cong cong viec, theo doi tien do hang tuan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tao template bao cao tien do va goi y cach xu ly cac tinh huong phat sinh.',
      suggestedPrompt: 'Tao template bao cao tien do hang tuan cho du an [TEN_DU_AN]. Bao gom: 1) % hoan thanh tong the va tung hang muc, 2) Cong viec hoan thanh tuan nay, 3) Cong viec ke hoach tuan sau, 4) Van de/Rui ro phat sinh, 5) Quyet dinh can phê duyet.'
    },
    {
      stepName: 'Kiem soat va xu ly rui ro',
      description: 'Theo doi KPI du an, xu ly thay doi pham vi, giai quyet rui ro, cap nhat ke hoach.',
      suggestedTool: 'Gemini',
      reason: 'Gemini phan tich tinh huong rui ro va de xuat phuong an xu ly hieu qua.',
      suggestedPrompt: 'Du an [TEN_DU_AN] dang gap van de: [MO_TA_VAN_DE]. Tien do tri hoan [SO] ngay, ngan sach vuot [SO]%. Phan tich nguyen nhan goc re (Root Cause Analysis) va de xuat 3 phuong an xu ly kem phan tich Cost-Benefit.'
    },
    {
      stepName: 'Dong du an va rut kinh nghiem',
      description: 'Ban giao san pham, hop Lessons Learned, lap bao cao ket thuc du an.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup lap bao cao ket thuc du an day du va tong ket bai hoc kinh nghiem co gia tri.',
      suggestedPrompt: 'Lap bao cao ket thuc du an [TEN_DU_AN]. Ket qua: [MO_TA_KET_QUA]. Can: 1) So sanh ke hoach vs thuc te (thoi gian, ngan sach, chat luong), 2) Top 5 thanh cong, 3) Top 5 bai hoc kinh nghiem, 4) De xuat cai thien cho du an tuong tu, 5) Mau ban giao san pham.'
    }
  ],

  'human resource management': [
    {
      stepName: 'Phan tich nhu cau nhan su',
      description: 'Xac dinh nhu cau nhan luc, phan tich cong viec, xay dung Job Description chuan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup viet Job Description chuan, phan tich yeu cau vi tri chinh xac va hap dan.',
      suggestedPrompt: 'Viet Job Description cho vi tri [TEN_VI_TRI] tai cong ty [LOAI_CONG_TY] nganh [NGANH]. Bao gom: 1) Mo ta cong viec chi tiet, 2) Yeu cau ky nang (must-have va nice-to-have), 3) Quyen loi, 4) Van hoa cong ty. Phong cach: thu hut ung vien chat luong cao.'
    },
    {
      stepName: 'Tuyen dung va lua chon',
      description: 'Dang tin tuyen dung, sang loc ho so, to chuc phong van, danh gia ung vien.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tao bo cau hoi phong van theo competency-based kem rubric cham diem khach quan.',
      suggestedPrompt: 'Tao bo cau hoi phong van cho vi tri [TEN_VI_TRI] theo phuong phap STAR (Situation-Task-Action-Result). Can: 10 cau hoi chia 3 nhom: 1) Ky nang chuyen mon, 2) Ky nang mem, 3) Phu hop van hoa. Kem dap an mau va tieu chi danh gia.'
    },
    {
      stepName: 'Dao tao va phat trien',
      description: 'Thiet ke chuong trinh onboarding, lap ke hoach dao tao, danh gia hieu qua sau dao tao.',
      suggestedTool: 'Gemini',
      reason: 'Gemini thiet ke chuong trinh dao tao co cau truc, phu hop voi muc tieu phat trien nhan vien.',
      suggestedPrompt: 'Thiet ke chuong trinh Onboarding 30 ngay cho [TEN_VI_TRI] moi. Bao gom: Tuan 1 (lam quen cong ty), Tuan 2-3 (dao tao ky nang), Tuan 4 (thuc hanh co huong dan). Moi ngay ghi ro: muc tieu, hoat dong, nguoi ho tro, ket qua can dat.'
    },
    {
      stepName: 'Danh gia hieu suat (KPI)',
      description: 'Thiet lap KPI ro rang, to chuc danh gia dinh ky, xu ly nhan vien khong dat chi tieu.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup thiet ke he thong KPI cong bang va quy trinh danh gia hieu suat chuan.',
      suggestedPrompt: 'Thiet ke he thong KPI cho vi tri [TEN_VI_TRI]. Can: 1) 5-7 KPI chinh kem trong so, 2) Cach do luong tung KPI, 3) Muc tieu dat/vuot/khong dat, 4) Quy trinh danh gia 6 thang, 5) Chinh sach khen thuong/ky luat tuong ung.'
    },
    {
      stepName: 'Chinh sach luong thuong va phuc loi',
      description: 'Xay dung bang luong canh tranh, chinh sach thuong, phuc loi giu chan nhan tai.',
      suggestedTool: 'Gemini',
      reason: 'Gemini tong hop xu huong luong thi truong va de xuat co cau luong thuong canh tranh.',
      suggestedPrompt: 'Xay dung chinh sach luong thuong cho vi tri [TEN_VI_TRI] tai cong ty [QUY_MO] nganh [NGANH] o [THANH_PHO]. Can: 1) Khung luong phu hop thi truong 2026, 2) Cac loai thuong (KPI/Tet/du an), 3) Phuc loi phi tien te hap dan, 4) Chinh sach tang luong hang nam.'
    }
  ],

  'law': [
    {
      stepName: 'Xac dinh van de phap ly va thu thap van ban luat',
      description: 'Phan tich tinh huong phap ly, xac dinh cac van ban luat ap dung, thu thap an le lien quan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup xac dinh nhanh cac van ban luat lien quan va tom tat noi dung chinh xac.',
      suggestedPrompt: 'Phan tich tinh huong phap ly: [MO_TA_TINH_HUONG]. Xac dinh: 1) Cac van ban luat ap dung (Luat, Nghi dinh, Thong tu), 2) Cac dieu khoan cu the lien quan, 3) Van de phap ly chinh can giai quyet, 4) An le tuong tu neu co.'
    },
    {
      stepName: 'Phan tich phap luat va lap luan',
      description: 'Phan tich quy dinh phap luat, xay dung lap luan phap ly chac chan, du bao phan bac.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup phan tich quy dinh phap luat da chieu va xay dung lap luan co can cu vung chac.',
      suggestedPrompt: 'Phan tich quy dinh [DIEU_KHOAN] cua [TEN_LUAT] ap dung vao tinh huong [TINH_HUONG]. Can: 1) Giai thich dieu khoan, 2) Ap dung vao truong hop cu the, 3) Lap luan bao ve quan diem [QUAN_DIEM], 4) Du doan va phan bac lap luan doi lap.'
    },
    {
      stepName: 'Soan thao van ban phap ly',
      description: 'Soan hop dong, don tu, van ban phap ly dung quy dinh phap luat hien hanh.',
      suggestedTool: 'Gemini',
      reason: 'Gemini soan thao van ban phap ly dung dinh dang, dung thuat ngu phap ly chinh xac.',
      suggestedPrompt: 'Soan thao [LOAI_VAN_BAN] cho tinh huong [MO_TA]. Theo phap luat Viet Nam hien hanh. Bao gom day du: cac dieu khoan bat buoc, dieu khoan bao ve quyen loi [BEN_DUOC_BAO_VE], co che giai quyet tranh chap.'
    },
    {
      stepName: 'Nghien cuu an le va hoc thuat',
      description: 'Tim kiem va phan tich an le, bai viet hoc thuat de lam vung them lap luan.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup tom tat an le phuc tap va chon loc nghien cuu hoc thuat lien quan.',
      suggestedPrompt: 'Tim kiem va tom tat cac an le Viet Nam lien quan den [VAN_DE_PHAP_LY]. Voi moi an le: 1) Tom tat tinh huong, 2) Quyet dinh cua Toa an, 3) Nguyen tac phap ly duoc thiet lap, 4) Ap dung vao tinh huong cua toi nhu the nao.'
    },
    {
      stepName: 'Trinh bay luan diem phap ly',
      description: 'Viet bai luan phap ly hoan chinh, thuyet trinh truoc lop, tra loi phan van.',
      suggestedTool: 'Gemini',
      reason: 'Gemini giup to chuc bai luan phap ly logic, thuyet phuc va chuan bị cau phan van.',
      suggestedPrompt: 'Tao outline bai trinh bay phap ly ve [CHU_DE] trong 15 phut. Them 10 cau phan van thuong gap trong moot court/bao ve mon hoc luat va goi y cach tra loi co can cu phap ly.'
    }
  ]
};

// ============================================================
// KEYWORD MAP - abbreviations and Vietnamese names
// ============================================================
const keywords: Record<string, string> = {
  // Software Engineering
  'se': 'software engineering',
  'sw': 'software engineering',
  'swt': 'software engineering',
  'phan mem': 'software engineering',
  'cong nghe phan mem': 'software engineering',
  'ky thuat phan mem': 'software engineering',

  // Marketing
  'mkt': 'marketing',
  'tiep thi': 'marketing',
  'marketing can ban': 'marketing',
  'nguyen ly marketing': 'marketing',

  // Business Administration
  'ba': 'business administration',
  'qtkd': 'business administration',
  'quan tri': 'business administration',
  'quan tri kinh doanh': 'business administration',
  'business': 'business administration',

  // Data Science
  'ds': 'data science',
  'ml': 'data science',
  'ai': 'data science',
  'machine learning': 'data science',
  'khoa hoc du lieu': 'data science',
  'tri tue nhan tao': 'data science',

  // English
  'eng': 'english',
  'tieng anh': 'english',
  'english writing': 'english',
  'academic english': 'english',
  'tieng anh hoc thuat': 'english',

  // Economics
  'eco': 'economics',
  'econ': 'economics',
  'kinh te': 'economics',
  'kinh te hoc': 'economics',
  'kinh te vi mo': 'economics',
  

  // Accounting
  'acc': 'accounting',
  'acct': 'accounting',
  'ke toan': 'accounting',
  'ke toan tai chinh': 'accounting',
  'nguyen ly ke toan': 'accounting',

  // Project Management
  'pm': 'project management',
  'pmp': 'project management',
  'quan ly du an': 'project management',
  'qlda': 'project management',

  // HRM
  'hrm': 'human resource management',
  'hr': 'human resource management',
  'quan tri nhan luc': 'human resource management',
  'quan ly nhan su': 'human resource management',
  'nhan su': 'human resource management',

  // Law
  'luat': 'law',
  'phap luat': 'law',
  'luat kinh te': 'law',
  'luat dan su': 'law',
  'phap ly': 'law'
};

// ============================================================
// HELPER: Normalize input
// ============================================================
const normalizeSubject = (subject: string): string => {
  return subject.toLowerCase().trim();
};

// ============================================================
// HELPER: Find rule-based workflow
// ============================================================
const findRuleBasedWorkflow = (subject: string): WorkflowStep[] | null => {
  const normalized = normalizeSubject(subject);

  // Exact match
  if (ruleBasedWorkflows[normalized]) {
    return ruleBasedWorkflows[normalized];
  }

  // Keyword/abbreviation match
  if (keywords[normalized]) {
    return ruleBasedWorkflows[keywords[normalized]] || null;
  }

  // Partial match - check if subject contains any keyword
  for (const [key, value] of Object.entries(keywords)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return ruleBasedWorkflows[value] || null;
    }
  }

  return null;
};

// ============================================================
// HELPER: Generate workflow with Gemini
// ============================================================
const generateWorkflowWithGemini = async (
  subject: string,
  description: string
): Promise<WorkflowStep[]> => {
  const prompt = `
You are an academic assistant helping Vietnamese university students break down their assignments into clear, actionable steps.

Subject: "${subject}"
Task description: "${description}"

Generate a workflow with exactly 5 steps to complete this assignment.
Each step must be specific, practical, and include a concrete AI prompt the student can use immediately.

Return ONLY a valid JSON array with no markdown, no explanation, no code blocks. Just the raw JSON:
[
  {
    "stepName": "Concise step name (5-8 words)",
    "description": "Detailed description of what to do in this step (2-3 sentences)",
    "suggestedTool": "Most suitable tool (e.g. Gemini, ChatGPT, Canva, Python, Excel, Word)",
    "reason": "Why this specific tool is best for this step (1-2 sentences)",
    "suggestedPrompt": "A complete, ready-to-use prompt the student can copy and paste. Include [PLACEHOLDERS] for student to fill in."
  }
]
`;

  const raw = await callGemini(prompt);

  // Remove markdown code blocks if present
  const cleaned = raw.replace(/```json|```/g, '').trim();

  // Parse safely
  let steps: WorkflowStep[];
  try {
    steps = JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini returned invalid JSON. Please try again.');
  }

  // Validate required fields
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
// MAIN: Match task to workflow
// ============================================================
export const matchTask = async (
  subject: string,
  description: string
): Promise<TaskMatcherResponse> => {
  const ruleSteps = findRuleBasedWorkflow(subject);

  if (ruleSteps) {
    return {
      success: true,
      subject,
      source: 'rule-based',
      steps: ruleSteps
    };
  }

  const geminiSteps = await generateWorkflowWithGemini(subject, description);

  return {
    success: true,
    subject,
    source: 'gemini',
    steps: geminiSteps
  };
};