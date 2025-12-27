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

    const { items } = await request.json(); // Array of { id, sort_order }

    if (!Array.isArray(items)) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const updateStmt = db.prepare('UPDATE links SET sort_order = ? WHERE id = ? AND user_id = ?');
    
    const transaction = db.transaction((data) => {
        for (const item of data) {
            updateStmt.run(item.sort_order, item.id, userId);
        }
    });

    transaction(items);

    return NextResponse.json({ message: 'Reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
