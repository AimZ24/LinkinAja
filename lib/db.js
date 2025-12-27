import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'linkinaja.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE,
    bio TEXT,
    profile_image TEXT,
    theme TEXT DEFAULT 'Classic Dark',
    bg_type TEXT DEFAULT 'Flat Color',
    bg_color TEXT DEFAULT '#ffffff',
    button_shape TEXT DEFAULT 'Rounded',
    button_style TEXT DEFAULT 'Fill',
    button_color TEXT DEFAULT '#000000',
    font_family TEXT DEFAULT 'Plus Jakarta Sans',
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    link_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
  );
`);

// Auto-migration for existing users (Add missing appearance columns)
const columnsToAdd = [
  { name: 'theme', type: 'TEXT', default: "'Classic Dark'" },
  { name: 'bg_type', type: 'TEXT', default: "'Flat Color'" },
  { name: 'bg_color', type: 'TEXT', default: "'#ffffff'" },
  { name: 'button_shape', type: 'TEXT', default: "'Rounded'" },
  { name: 'button_style', type: 'TEXT', default: "'Fill'" },
  { name: 'button_color', type: 'TEXT', default: "'#000000'" },
  { name: 'font_family', type: 'TEXT', default: "'Plus Jakarta Sans'" },
  { name: 'role', type: 'TEXT', default: "'user'" },
  { name: 'title_color', type: 'TEXT', default: "'#000000'" },
  { name: 'bio_color', type: 'TEXT', default: "'#666666'" }
];

const existingColumns = db.prepare("PRAGMA table_info(users)").all().map(col => col.name);
columnsToAdd.forEach(col => {
  if (!existingColumns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type} DEFAULT ${col.default}`);
      console.log(`Migration: Added column ${col.name} to users table.`);
    } catch (e) {
      console.error(`Migration error adding ${col.name}:`, e);
    }
  }
});

// Auto-migration for analytics (Add user_id if missing from previous sessions)
const analyticsColumns = db.prepare("PRAGMA table_info(analytics)").all().map(col => col.name);
if (!analyticsColumns.includes('user_id')) {
    try {
        db.exec(`ALTER TABLE analytics ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
        console.log(`Migration: Added column user_id to analytics table.`);
    } catch (e) {
        console.error(`Migration error adding user_id to analytics:`, e);
    }
}


export default db;
