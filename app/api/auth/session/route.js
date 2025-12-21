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
      return NextResponse.json({ authenticated: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get fresh user data
    const user = db.prepare('SELECT name, email, username, bio, profile_image FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ 
      authenticated: true,
      user
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
