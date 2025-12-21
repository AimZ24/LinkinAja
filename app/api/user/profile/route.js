import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'linkinaja-secret-key-123';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, bio, profile_image } = await req.json();

    const updateStmt = db.prepare('UPDATE users SET name = ?, bio = ?, profile_image = ? WHERE id = ?');
    const result = updateStmt.run(name, bio, profile_image, decoded.userId);

    if (result.changes > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
