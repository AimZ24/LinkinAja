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

    const user = db.prepare('SELECT name, bio, profile_image, theme, bg_type, bg_color, button_shape, button_style, button_color, font_family, title_color, bio_color, text_align FROM users WHERE id = ?').get(userId);
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const data = await request.json();
    const { name, bio, profile_image, theme, bg_type, bg_color, button_shape, button_style, button_color, font_family, title_color, bio_color, text_align } = data;

    db.prepare(`
      UPDATE users SET 
        name = ?,
        bio = ?,
        profile_image = ?,
        theme = ?, 
        bg_type = ?, 
        bg_color = ?, 
        button_shape = ?, 
        button_style = ?, 
        button_color = ?, 
        font_family = ?,
        title_color = ?,
        bio_color = ?,
        text_align = ?
      WHERE id = ?
    `).run(name, bio, profile_image, theme, bg_type, bg_color, button_shape, button_style, button_color, font_family, title_color, bio_color, text_align, userId);

    return NextResponse.json({ message: 'Appearance and Profile updated' });
  } catch (error) {
    console.error('Appearance update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
