import { NextResponse } from 'next/server';
import connectToRedis from '@/lib/redis';

export async function POST() {
  try {
    const redis = await connectToRedis();

    // FLUSHDB will delete all keys in the current database.
    await redis.flushDb();

    return NextResponse.json({ message: 'Game has been reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Failed to reset game:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 