import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'linkinaja-secret-key-123';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Get total clicks today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const todayClicks = db.prepare(`
      SELECT COUNT(a.id) as count 
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ? AND date(a.clicked_at) = date('now', 'localtime')
    `).get(userId).count;

    // Get total clicks this week
    const weekClicks = db.prepare(`
      SELECT COUNT(a.id) as count 
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ? AND a.clicked_at >= date('now', '-7 days')
    `).get(userId).count;

    // Get active links count
    const activeLinks = db.prepare(`
      SELECT COUNT(id) as count FROM links WHERE user_id = ? AND is_active = 1
    `).get(userId).count;

    // Get daily stats for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const count = db.prepare(`
        SELECT COUNT(a.id) as count 
        FROM analytics a
        JOIN links l ON a.link_id = l.id
        WHERE l.user_id = ? AND date(a.clicked_at) = date('now', ?, 'localtime')
      `).get(userId, `-${i} days`).count;

      dailyStats.push({ day: dayName, count, date: dateStr });
    }

    return NextResponse.json({
      todayClicks,
      weekClicks,
      activeLinks,
      dailyStats
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
