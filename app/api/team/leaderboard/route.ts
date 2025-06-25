import { NextRequest, NextResponse } from 'next/server';
import connectToRedis from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const redis = await connectToRedis();

    // Get top 100 teams from leaderboard
    const leaderboardData = await redis.zRangeWithScores('leaderboard', 0, 99, { REV: true });

    const leaderboard = leaderboardData.map((entry, index) => {
      const entryData = JSON.parse(entry.value);
      return {
        ...entryData,
        rank: index + 1,
      };
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 