import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    role TEXT,
    link TEXT,
    thumbnail TEXT,
    is_featured INTEGER DEFAULT 0,
    is_main INTEGER DEFAULT 0,
    is_hidden INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    category TEXT NOT NULL,
    notes TEXT,
    work_point TEXT,
    problem_goal TEXT,
    solution_point TEXT,
    tools TEXT,
    production_scope TEXT
  );

  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    period TEXT,
    field TEXT,
    scope TEXT,
    strengths TEXT,
    brands TEXT
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    about_text TEXT,
    featured_title TEXT,
    featured_subtitle TEXT,
    work_title TEXT,
    work_subtitle TEXT,
    contact_title TEXT,
    contact_subtitle TEXT,
    contact_email TEXT,
    contact_kakao TEXT,
    exp_title TEXT,
    exp_label_field TEXT,
    exp_label_scope TEXT,
    exp_label_strengths TEXT,
    exp_label_brands TEXT,
    about_title TEXT,
    about_subtitle TEXT,
    about_strengths_title TEXT,
    site_name TEXT
  );
`);

// Ensure columns exist (Migration)
try { db.prepare("ALTER TABLE projects ADD COLUMN is_main INTEGER DEFAULT 0").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN is_hidden INTEGER DEFAULT 0").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN order_index INTEGER DEFAULT 0").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN notes TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN work_point TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN problem_goal TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN solution_point TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN tools TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE projects ADD COLUMN production_scope TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE experience ADD COLUMN brands TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN exp_label_brands TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN strength1_title TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN strength1_desc TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN strength2_title TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN strength2_desc TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN strength3_title TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE profile ADD COLUMN strength3_desc TEXT").run(); } catch (e) {}

// Seed initial data
const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
if (projectCount.count <= 3) { // Clear and re-seed if it's just the initial 3 or empty
  db.prepare("DELETE FROM projects").run();
  
  const insert = db.prepare(`
    INSERT INTO projects (title, type, description, role, link, thumbnail, is_featured, is_main, category, production_scope, work_point, tools, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // AIA Vitality Series
  insert.run("AIA생명 바이탈리티 - 건강한 습관 A", "Brand Content", "사용자의 건강한 습관 형성을 돕는 바이탈리티 프로그램 홍보 영상", "Video Producer", "https://youtu.be/hv67efNVXlU", "https://img.youtube.com/vi/hv67efNVXlU/maxresdefault.jpg", 1, 1, "Corporate", "기획, 연출, 편집", "브랜드 컬러와 톤을 유지하며 정보 전달력을 극대화한 모션 그래픽 및 편집", "Premiere, After Effects", 1);
  insert.run("AIA생명 바이탈리티 - 리워드 안내", "Brand Content", "바이탈리티 멤버십의 다양한 혜택과 리워드 시스템 소개", "Video Producer", "https://youtu.be/QRfrphexPUU", "https://img.youtube.com/vi/QRfrphexPUU/maxresdefault.jpg", 1, 0, "Corporate", "연출, 편집", "복잡한 혜택 구조를 시각적으로 단순화하여 직관적인 이해 도모", "Premiere, After Effects", 2);
  insert.run("AIA생명 바이탈리티 - 챌린지 가이드", "Brand Content", "주간 챌린지 참여 방법 및 목표 달성 가이드", "Video Producer", "https://youtu.be/BL408Rw1H3A", "https://img.youtube.com/vi/BL408Rw1H3A/maxresdefault.jpg", 0, 0, "Corporate", "편집, 자막 디자인", "빠른 템포의 편집으로 도전 욕구를 자극하는 리듬감 구현", "Premiere, After Effects", 3);
  insert.run("AIA생명 바이탈리티 - 파트너십 소개", "Brand Content", "다양한 브랜드와의 파트너십 및 연계 혜택 홍보", "Video Producer", "https://youtu.be/WTxwZyFoH2A", "https://img.youtube.com/vi/WTxwZyFoH2A/maxresdefault.jpg", 0, 0, "Corporate", "편집", "깔끔한 레이아웃과 자막 디자인으로 브랜드 신뢰도 강조", "Premiere, After Effects", 4);
  insert.run("AIA생명 바이탈리티 - 사용자 인터뷰", "Brand Content", "실제 사용자의 경험담을 통한 프로그램 신뢰도 제고", "Video Producer", "https://youtu.be/G62DHDg633M", "https://img.youtube.com/vi/G62DHDg633M/maxresdefault.jpg", 0, 0, "Interview", "인터뷰 연출, 편집", "인물의 진정성이 느껴지는 호흡 조절과 감성적인 톤 보정", "Premiere, After Effects", 5);

  // KIRIA
  insert.run("한국로봇산업진흥원 기업 홍보", "Corporate", "로봇 산업의 미래와 진흥원의 역할을 담은 공식 홍보 영상", "Director / PD", "https://youtu.be/SJ6D0q8lX2I", "https://img.youtube.com/vi/SJ6D0q8lX2I/maxresdefault.jpg", 1, 0, "Corporate", "기획, 연출, 편집", "기술적인 전문성과 미래 지향적인 이미지를 결합한 세련된 영상미", "Premiere, After Effects", 6);

  // Huno
  insert.run("휴노 온라인 교육 강의", "Education", "전문 지식을 체계적으로 전달하는 온라인 교육 콘텐츠", "Video Producer", "https://youtu.be/unKl30tKt2I", "https://img.youtube.com/vi/unKl30tKt2I/maxresdefault.jpg", 0, 0, "Education", "구성, 편집", "학습 몰입도를 높이는 자막 구조화와 시각 자료 배치", "Premiere, After Effects", 7);

  // Sketch
  insert.run("대구콘텐츠페어 현장 스케치", "Event Sketch", "행사의 열기와 주요 장면을 감각적으로 담아낸 스케치 영상", "Video Producer", "https://youtu.be/UKy_SlYDnAE", "https://img.youtube.com/vi/UKy_SlYDnAE/maxresdefault.jpg", 0, 0, "Sketch/Event", "현장 연출, 편집", "행사의 역동성을 살린 빠른 컷 전환과 현장감 있는 사운드 디자인", "Premiere, After Effects", 8);

  // Wedding
  insert.run("결혼식 식전 영상 - Our Story", "Wedding", "두 사람의 소중한 기록을 담은 감성적인 식전 영상", "Director", "https://youtu.be/97DRbrsP8Gc", "https://img.youtube.com/vi/97DRbrsP8Gc/maxresdefault.jpg", 0, 0, "Sketch/Event", "기획, 편집", "따뜻한 색감과 서정적인 편집으로 감동적인 분위기 연출", "Premiere", 9);

  // Instagram Interview
  insert.run("멜리아트 아티스트 인터뷰", "Interview", "아티스트의 철학과 작업 과정을 담은 릴스 인터뷰", "Video Producer", "https://www.instagram.com/reel/ClQIVq4IQUC/", "https://images.weserv.nl/?url=https://www.instagram.com/p/ClQIVq4IQUC/media/?size=l", 0, 0, "Interview", "연출, 편집", "모바일 환경에 최적화된 세로형 레이아웃과 가독성 높은 자막", "Premiere, After Effects", 10);

  // Shorts
  insert.run("스컬판다 피규어 리뷰", "Shorts", "제품의 디테일과 매력을 짧고 강렬하게 전달하는 리뷰", "Video Producer", "https://youtube.com/shorts/bax7JZJk-64", "https://img.youtube.com/vi/bax7JZJk-64/maxresdefault.jpg", 0, 0, "Shorts", "편집", "시선을 사로잡는 빠른 템포와 효과적인 사운드 활용", "Premiere", 11);
  insert.run("귀필러 시술 리뷰", "Shorts", "시술 과정과 결과를 직관적으로 보여주는 뷰티 콘텐츠", "Video Producer", "https://youtube.com/shorts/yNnhV7FPeMA", "https://img.youtube.com/vi/yNnhV7FPeMA/maxresdefault.jpg", 0, 0, "Shorts", "편집", "비포/애프터의 확실한 대비와 정보 전달 중심의 편집", "Premiere", 12);
}

const expCount = db.prepare("SELECT COUNT(*) as count FROM experience").get() as { count: number };
if (expCount.count === 0) {
  db.prepare(`
    INSERT INTO experience (role, period, field, scope, strengths, brands)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    "비디오 프로듀서 / 영상 제작 총괄",
    "2021 - Present",
    "브랜드 홍보, 교육 콘텐츠, 기업 다큐멘터리",
    "기획, 연출, 편집, 모션 그래픽, 최종 납품",
    "메시지 구조화, 브랜드 톤앤매너 유지, AI 워크플로우 효율화",
    "AIA생명, 현대글로비스, 닥터지, 삼성셀레나영어, 한국로봇산업진흥원 등"
  );
} else {
  db.prepare(`
    UPDATE experience 
    SET brands = ?
    WHERE id = 1
  `).run("AIA생명, 현대글로비스, 닥터지, 삼성셀레나영어, 한국로봇산업진흥원 등");
}

const profileCount = db.prepare("SELECT COUNT(*) as count FROM profile").get() as { count: number };
if (profileCount.count === 0) {
  db.prepare(`
    INSERT INTO profile (
      hero_title, hero_subtitle, hero_description, about_text,
      featured_title, featured_subtitle, work_title, work_subtitle,
      contact_title, contact_subtitle, contact_email, contact_kakao,
      exp_title, exp_label_field, exp_label_scope, exp_label_strengths, exp_label_brands,
      about_title, about_subtitle, about_strengths_title,
      site_name,
      strength1_title, strength1_desc,
      strength2_title, strength2_desc,
      strength3_title, strength3_desc
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "기획부터 납품까지,",
    "브랜드의 본질을 영상으로 구현합니다.",
    "단순한 편집을 넘어, 메시지의 구조를 설계하고 시청자의 몰입을 연출합니다.\n기획 → 구성 → 연출 → 편집 → 납품 전 과정을 연결하는 비디오 프로듀서 TEDIO입니다.",
    "영상 제작자로서 저는 단순한 컷 편집을 넘어, 브랜드의 가치를 시각적으로 극대화하는 작업을 지향합니다. 기획 단계부터 참여하여 최종 결과물의 톤앤매너를 일관되게 유지합니다.",
    "Featured Projects",
    "엄선된 대표작",
    "Work Archive",
    "전체 작업 모음",
    "Contact",
    "Let's create something great.",
    "gns8365@naver.com",
    "https://open.kakao.com/o/sribRuxh",
    "Experience Snapshot",
    "주 제작 분야",
    "제작 범위",
    "핵심 역량",
    "협력 브랜드",
    "About Me",
    "브랜드의 메시지를 가장 또렷하게\n전달하는 비디오 프로듀서.",
    "About & Strengths",
    "TEDIO",
    "기획 및 구성", "정보의 우선순위를 파악하여 흐름이 자연스러운 영상 설계",
    "연출 및 편집", "브랜드 톤을 유지하며 몰입감을 극대화하는 시각적 연출",
    "AI 워크플로우", "AI 도구를 활용한 효율적인 제작 및 기획의 정확도 향상"
  );
} else {
  db.prepare(`
    UPDATE profile 
    SET exp_label_brands = ?, contact_subtitle = ?
    WHERE id = 1
  `).run("협력 브랜드", "Let's create something great.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve public folder for uploads
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Routes
  
  // File upload endpoint
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ url: filePath });
  });

  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects ORDER BY order_index ASC, id DESC").all() as any[];
    res.json(projects.map(p => ({ ...p, is_featured: !!p.is_featured, is_main: !!p.is_main })));
  });

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === "041977") {
      res.json({ success: true, token: "admin-token-tedio" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  app.post("/api/projects", (req, res) => {
    const { title, type, description, role, link, thumbnail, is_featured, is_main, is_hidden, category, notes, work_point, problem_goal, solution_point, tools, production_scope, order_index, token } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");
    
    if (is_main) {
      db.prepare("UPDATE projects SET is_main = 0").run();
    }

    const stmt = db.prepare(`
      INSERT INTO projects (title, type, description, role, link, thumbnail, is_featured, is_main, is_hidden, category, notes, work_point, problem_goal, solution_point, tools, production_scope, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, type, description, role, link, thumbnail, is_featured ? 1 : 0, is_main ? 1 : 0, is_hidden ? 1 : 0, category, notes, work_point, problem_goal, solution_point, tools, production_scope, order_index || 0);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { title, type, description, role, link, thumbnail, is_featured, is_main, is_hidden, category, notes, work_point, problem_goal, solution_point, tools, production_scope, order_index, token } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    if (is_main) {
      db.prepare("UPDATE projects SET is_main = 0").run();
    }

    const stmt = db.prepare(`
      UPDATE projects 
      SET title = ?, type = ?, description = ?, role = ?, link = ?, thumbnail = ?, is_featured = ?, is_main = ?, is_hidden = ?, category = ?, notes = ?, work_point = ?, problem_goal = ?, solution_point = ?, tools = ?, production_scope = ?, order_index = ?
      WHERE id = ?
    `);
    stmt.run(title, type, description, role, link, thumbnail, is_featured ? 1 : 0, is_main ? 1 : 0, is_hidden ? 1 : 0, category, notes, work_point, problem_goal, solution_point, tools, production_scope, order_index || 0, id);
    res.json({ success: true });
  });

  app.post("/api/projects/reorder", (req, res) => {
    const { orders, token } = req.body; // orders: [{id: 1, order_index: 0}, ...]
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    const updateStmt = db.prepare("UPDATE projects SET order_index = ? WHERE id = ?");
    const transaction = db.transaction((items) => {
      for (const item of items) {
        updateStmt.run(item.order_index, item.id);
      }
    });

    transaction(orders);
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/experience", (req, res) => {
    const exp = db.prepare("SELECT * FROM experience LIMIT 1").get();
    res.json(exp);
  });

  app.put("/api/experience", (req, res) => {
    const { role, period, field, scope, strengths, brands, token } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    db.prepare(`
      UPDATE experience 
      SET role = ?, period = ?, field = ?, scope = ?, strengths = ?, brands = ?
      WHERE id = 1
    `).run(role, period, field, scope, strengths, brands);
    res.json({ success: true });
  });

  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM profile LIMIT 1").get();
    res.json(profile);
  });

  app.put("/api/profile", (req, res) => {
    const { 
      hero_title, hero_subtitle, hero_description, about_text,
      featured_title, featured_subtitle, work_title, work_subtitle,
      contact_title, contact_subtitle, contact_email, contact_kakao,
      exp_title, exp_label_field, exp_label_scope, exp_label_strengths, exp_label_brands,
      about_title, about_subtitle, about_strengths_title,
      site_name,
      strength1_title, strength1_desc,
      strength2_title, strength2_desc,
      strength3_title, strength3_desc,
      token 
    } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    db.prepare(`
      UPDATE profile 
      SET hero_title = ?, hero_subtitle = ?, hero_description = ?, about_text = ?,
          featured_title = ?, featured_subtitle = ?, work_title = ?, work_subtitle = ?,
          contact_title = ?, contact_subtitle = ?, contact_email = ?, contact_kakao = ?,
          exp_title = ?, exp_label_field = ?, exp_label_scope = ?, exp_label_strengths = ?, exp_label_brands = ?,
          about_title = ?, about_subtitle = ?, about_strengths_title = ?, site_name = ?,
          strength1_title = ?, strength1_desc = ?,
          strength2_title = ?, strength2_desc = ?,
          strength3_title = ?, strength3_desc = ?
      WHERE id = 1
    `).run(
      hero_title, hero_subtitle, hero_description, about_text,
      featured_title, featured_subtitle, work_title, work_subtitle,
      contact_title, contact_subtitle, contact_email, contact_kakao,
      exp_title, exp_label_field, exp_label_scope, exp_label_strengths, exp_label_brands,
      about_title, about_subtitle, about_strengths_title, site_name,
      strength1_title, strength1_desc,
      strength2_title, strength2_desc,
      strength3_title, strength3_desc
    );
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
