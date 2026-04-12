import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Import the Firebase configuration
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));

// Initialize Firebase SDK for server-side
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve public folder
app.use(express.static(path.join(process.cwd(), "public")));

async function getOgImage() {
  try {
    const docSnap = await getDoc(doc(db, 'profile', 'main'));
    if (docSnap.exists()) {
      return docSnap.data().og_image || "https://img.youtube.com/vi/hv67efNVXlU/maxresdefault.jpg";
    }
  } catch (e) {
    console.error("Error fetching OG image:", e);
  }
  return "https://img.youtube.com/vi/hv67efNVXlU/maxresdefault.jpg";
}

async function setupVite() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(async (req, res, next) => {
      if (req.method === 'GET' && (req.url === '/' || req.url === '/proposal')) {
        try {
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(req.url, template);
          
          const ogImage = await getOgImage();
          template = template.replace(/property="og:image" content="[^"]*"/g, `property="og:image" content="${ogImage}"`);
          template = template.replace(/property="twitter:image" content="[^"]*"/g, `property="twitter:image" content="${ogImage}"`);
          
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
          return;
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
          return;
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, { index: false }));
      app.get("*", async (req, res) => {
        try {
          let template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
          const ogImage = await getOgImage();
          template = template.replace(/property="og:image" content="[^"]*"/g, `property="og:image" content="${ogImage}"`);
          template = template.replace(/property="twitter:image" content="[^"]*"/g, `property="twitter:image" content="${ogImage}"`);
          res.send(template);
        } catch (e) {
          res.sendFile(path.join(distPath, "index.html"));
        }
      });
    }
  }
}

setupVite();

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
