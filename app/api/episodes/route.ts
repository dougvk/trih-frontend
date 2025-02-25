import { getEpisodes } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const episodes = await getEpisodes();
    return NextResponse.json(episodes);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
} 