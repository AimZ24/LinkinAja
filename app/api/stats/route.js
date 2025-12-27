import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'linkinaja-secret-key-123';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get user role
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    const isAdmin = user?.role === 'admin';

    // 1. Basic Stats
    const today = new RegExp('^' + new Date().toISOString().split('T')[0]);
    
    const todayClicks = db.prepare(`
      SELECT COUNT(*) as count FROM analytics 
      WHERE link_id IN (SELECT id FROM links WHERE user_id = ?) 
      AND clicked_at >= date('now', 'start of day')
    `).get(userId).count;

    const todayViews = db.prepare(`
        SELECT COUNT(*) as count FROM analytics 
        WHERE user_id = ? AND link_id IS NULL
        AND clicked_at >= date('now', 'start of day')
    `).get(userId).count;

    const totalViews = db.prepare(`
        SELECT COUNT(*) as count FROM analytics 
        WHERE user_id = ? AND link_id IS NULL
    `).get(userId).count;

    const weekClicks = db.prepare(`
      SELECT COUNT(*) as count FROM analytics 
      WHERE link_id IN (SELECT id FROM links WHERE user_id = ?) 
      AND clicked_at >= date('now', '-7 days')
    `).get(userId).count;

    const activeLinks = db.prepare('SELECT COUNT(*) as count FROM links WHERE user_id = ? AND is_active = 1').get(userId).count;

    // 2. Daily Stats (Chart)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
       const date = new Date();
       date.setDate(date.getDate() - i);
       const dateStr = date.toISOString().split('T')[0];
       
       const count = db.prepare(`
         SELECT COUNT(*) as count FROM analytics 
         WHERE link_id IN (SELECT id FROM links WHERE user_id = ?) 
         AND clicked_at LIKE ?
       `).get(userId, dateStr + '%').count;
       
       dailyStats.push({
         day: date.toLocaleDateString('en-US', { weekday: 'short' }),
         count
       });
    }

    // 3. Top Links
    const topLinks = db.prepare(`
        SELECT l.title, l.url, COUNT(a.id) as clicks
        FROM links l
        LEFT JOIN analytics a ON l.id = a.link_id
        WHERE l.user_id = ?
        GROUP BY l.id
        ORDER BY clicks DESC
        LIMIT 5
    `).all(userId);

    // 4. Device Stats
    const deviceStats = db.prepare(`
        SELECT 
            CASE 
                WHEN user_agent LIKE '%Mobi%' OR user_agent LIKE '%Android%' THEN 'Mobile'
                ELSE 'Desktop'
            END as device,
            COUNT(*) as count
        FROM analytics
        WHERE (link_id IN (SELECT id FROM links WHERE user_id = ?) OR user_id = ?)
        GROUP BY device
    `).all(userId, userId);

    const ctr = totalViews > 0 ? ((weekClicks / totalViews) * 100).toFixed(1) : 0;

    // Admin Global Stats
    let adminStats = null;
    if (isAdmin) {
      const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      const totalLinks = db.prepare('SELECT COUNT(*) as count FROM links').get().count;
      adminStats = { totalUsers, totalLinks };
    }

    return NextResponse.json({
      todayClicks,
      todayViews,
      totalViews,
      weekClicks,
      activeLinks,
      dailyStats,
      topLinks,
      deviceStats,
      ctr,
      isAdmin,
      adminStats
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
