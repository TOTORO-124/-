import Database from "better-sqlite3";
const db = new Database("portfolio.db");
const projects = db.prepare("SELECT COUNT(*) as count FROM projects").get();
console.log("Projects count:", projects.count);
const profile = db.prepare("SELECT site_name FROM profile LIMIT 1").get();
console.log("Profile site name:", profile?.site_name);
