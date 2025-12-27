import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const linkId = searchParams.get('id');
  
  if (!linkId) {
    return NextResponse.json({ error: 'Missing link ID' }, { status: 400 });
  }

  try {
    // Fetch the link to get the destination URL
    const link = db.prepare('SELECT url FROM links WHERE id = ?').get(linkId);
    
    if (!link) {
       return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Capture requester info
    const headerList = await headers();
    const userAgent = headerList.get('user-agent');
    const forwardedFor = headerList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Log the click in analytics
    db.prepare(`
      INSERT INTO analytics (link_id, ip_address, user_agent)
      VALUES (?, ?, ?)
    `).run(linkId, ip, userAgent);

    // Redirect to the actual link
    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error('Click tracking error:', error);
    // Even if tracking fails, try to redirect if we have the URL
    const url = searchParams.get('url');
    if (url) return NextResponse.redirect(url);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
