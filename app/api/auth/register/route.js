import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create username from name (simple version)
    const baseUsername = name.toLowerCase().replace(/\s+/g, '');
    let username = baseUsername;
    
    // Check if username exists and add suffix if needed
    const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUsername) {
      username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
    }

    // Insert user
    db.prepare('INSERT INTO users (name, email, password, username) VALUES (?, ?, ?, ?)')
      .run(name, email, hashedPassword, username);

    return NextResponse.json({ message: 'Pendaftaran berhasil' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
