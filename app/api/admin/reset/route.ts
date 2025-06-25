import { NextResponse } from 'next/server';
import getRedisClient from '@/lib/redis';

export async function POST() {
  try {
    const redis = getRedisClient();
    await redis.connect();

    // FLUSHDB will delete all keys in the current database.
    await redis.flushDb();

    await redis.quit();

    return NextResponse.json({ message: 'Game has been reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Failed to reset game:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 