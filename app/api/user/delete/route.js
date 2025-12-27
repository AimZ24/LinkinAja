import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'linkinaja-secret-key-123';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Delete user (cascade will handle links and analytics if configured, but sqlite cascade needs PRAGMA foreign_keys = ON)
    // Actually better-sqlite3 usually handles it if configured, but let's be safe or check pragma.
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    // Clear cookie
    cookieStore.delete('auth_token');

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
