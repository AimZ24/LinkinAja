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
    const links = db.prepare(`
      SELECT l.*, COUNT(a.id) as clicks 
      FROM links l 
      LEFT JOIN analytics a ON l.id = a.link_id 
      WHERE l.user_id = ? 
      GROUP BY l.id
      ORDER BY l.sort_order ASC, l.created_at DESC
    `).all(userId);
    return NextResponse.json(links);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, url, icon } = await request.json();

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    const result = db.prepare('INSERT INTO links (user_id, title, url, icon) VALUES (?, ?, ?, ?)')
      .run(userId, title, url, icon || null);

    const newLink = db.prepare('SELECT * FROM links WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, title, url, icon, is_active, sort_order } = await request.json();

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const existingLink = db.prepare('SELECT id FROM links WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existingLink) return NextResponse.json({ error: 'Link not found' }, { status: 404 });

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (url !== undefined) { updates.push('url = ?'); params.push(url); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(sort_order); }

    if (updates.length === 0) return NextResponse.json({ error: 'No updates provided' }, { status: 400 });

    params.push(id, userId);
    db.prepare(`UPDATE links SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);

    const updatedLink = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
    return NextResponse.json(updatedLink);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const result = db.prepare('DELETE FROM links WHERE id = ? AND user_id = ?').run(id, userId);

    if (result.changes === 0) return NextResponse.json({ error: 'Link not found or unauthorized' }, { status: 404 });

    return NextResponse.json({ message: 'Link deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
