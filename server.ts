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
    category TEXT NOT NULL,
    notes TEXT
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
try {
  db.prepare("ALTER TABLE projects ADD COLUMN notes TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN is_main INTEGER DEFAULT 0").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN order_index INTEGER DEFAULT 0").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE experience ADD COLUMN brands TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE profile ADD COLUMN exp_label_brands TEXT").run();
} catch (e) {}

// Seed initial data if empty
const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
if (projectCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (title, type, description, role, link, thumbnail, is_featured, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insert.run("브랜드 홍보 영상 A", "Corporate", "전달력과 톤을 맞추기 위해 구조와 자막 리듬 중심으로 편집", "편집 100%, 자막 디자인", "https://youtube.com", "https://picsum.photos/seed/p1/800/450", 1, "Corporate");
  insert.run("교육 콘텐츠 시리즈 B", "Education", "복잡한 개념을 시각적으로 쉽게 풀이한 모션 그래픽", "모션 그래픽, 편집", "https://youtube.com", "https://picsum.photos/seed/p2/800/450", 1, "Education");
  insert.run("인물 인터뷰 다큐멘터리 C", "Interview", "인물의 감정과 메시지가 잘 전달되도록 호흡 조절", "편집, 사운드 믹싱", "https://youtube.com", "https://picsum.photos/seed/p3/800/450", 1, "Interview");
}

const expCount = db.prepare("SELECT COUNT(*) as count FROM experience").get() as { count: number };
if (expCount.count === 0) {
  db.prepare(`
    INSERT INTO experience (role, period, field, scope, strengths, brands)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    "영상 제작/편집 담당",
    "2021 - Present",
    "교육/브랜드 콘텐츠 중심",
    "기획/디자인/촬영팀과 협업, 납품용 마감 경험",
    "일정 대응 + 반복 제작에서도 톤 유지",
    "삼성전자, 현대자동차, LG유플러스, 배달의민족 등"
  );
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
      site_name
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "브랜드 톤은 지키고,",
    "메시지는 더 또렷하게.",
    "기업·교육·인터뷰 중심의 영상 편집/모션 작업을 합니다.\n목적에 맞는 구조, 자막 가독성, 리듬감 있는 편집에 강합니다.",
    "영상 편집자로서 저는 단순한 컷 편집을 넘어, 브랜드의 가치를 시각적으로 극대화하는 작업을 지향합니다.",
    "Featured Projects",
    "선별된 대표작",
    "Work Archive",
    "전체 작업 모음",
    "Contact",
    "Let's collaborate.",
    "gns8365@naver.com",
    "https://open.kakao.com/o/sribRuxh",
    "Experience Snapshot",
    "주 작업 분야",
    "협업 범위",
    "강점",
    "협력 브랜드",
    "About Me",
    "시청자의 시선을 붙잡는\n감각적인 스토리텔링.",
    "About & Strengths",
    "TEDIO"
  );
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
    const { title, type, description, role, link, thumbnail, is_featured, is_main, category, notes, order_index, token } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");
    
    if (is_main) {
      db.prepare("UPDATE projects SET is_main = 0").run();
    }

    const stmt = db.prepare(`
      INSERT INTO projects (title, type, description, role, link, thumbnail, is_featured, is_main, category, notes, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, type, description, role, link, thumbnail, is_featured ? 1 : 0, is_main ? 1 : 0, category, notes, order_index || 0);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { title, type, description, role, link, thumbnail, is_featured, is_main, category, notes, order_index, token } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    if (is_main) {
      db.prepare("UPDATE projects SET is_main = 0").run();
    }

    const stmt = db.prepare(`
      UPDATE projects 
      SET title = ?, type = ?, description = ?, role = ?, link = ?, thumbnail = ?, is_featured = ?, is_main = ?, category = ?, notes = ?, order_index = ?
      WHERE id = ?
    `);
    stmt.run(title, type, description, role, link, thumbnail, is_featured ? 1 : 0, is_main ? 1 : 0, category, notes, order_index || 0, id);
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
      token 
    } = req.body;
    if (token !== "admin-token-tedio") return res.status(403).send("Unauthorized");

    db.prepare(`
      UPDATE profile 
      SET hero_title = ?, hero_subtitle = ?, hero_description = ?, about_text = ?,
          featured_title = ?, featured_subtitle = ?, work_title = ?, work_subtitle = ?,
          contact_title = ?, contact_subtitle = ?, contact_email = ?, contact_kakao = ?,
          exp_title = ?, exp_label_field = ?, exp_label_scope = ?, exp_label_strengths = ?, exp_label_brands = ?,
          about_title = ?, about_subtitle = ?, about_strengths_title = ?, site_name = ?
      WHERE id = 1
    `).run(
      hero_title, hero_subtitle, hero_description, about_text,
      featured_title, featured_subtitle, work_title, work_subtitle,
      contact_title, contact_subtitle, contact_email, contact_kakao,
      exp_title, exp_label_field, exp_label_scope, exp_label_strengths, exp_label_brands,
      about_title, about_subtitle, about_strengths_title, site_name
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
