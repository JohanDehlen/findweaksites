export interface Business {
  id: string;
  name: string;
  address: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  [key: string]: any;
}

export interface WeaknessScore {
  score: number;
  problems: string[];
  opportunity: string;
}

export async function calculateWeaknessScore(
  business: Business
): Promise<WeaknessScore> {
  let score = 0;
  const problems: string[] = [];

  // CHECK 1: Website exists and is secure
  if (!business.website) {
    problems.push('❌ No website');
    // Cap score at 0 if no website - this is critical
    score = 0;
  } else if (!business.website.startsWith('https')) {
    score += 30;
    problems.push('⚠️ Not HTTPS (security risk)');
  } else {
    score += 50;
  }

  // Only add other points if there's a website
  if (business.website) {
    // CHECK 2: Review count
    const reviewCount = business.reviewCount || 0;
    if (reviewCount >= 50) {
      score += 25;
    } else if (reviewCount >= 20) {
      score += 15;
    } else if (reviewCount >= 10) {
      score += 10;
      problems.push(`📝 Low review count (${reviewCount})`);
    } else {
      score += 0;
      problems.push(`📝 Only ${reviewCount} reviews`);
    }

    // CHECK 3: Rating
    const rating = business.rating || 0;
    if (rating >= 4.5) {
      score += 15;
    } else if (rating >= 4.0) {
      score += 10;
    } else if (rating >= 3.5) {
      score += 5;
      problems.push(`⭐ Below 4.0 rating (${rating})`);
    } else if (rating > 0) {
      score += 0;
      problems.push(`⭐ Low rating (${rating})`);
    }
  }

  // CHECK 4: Phone number (always check)
  if (business.phone) {
    score += 10;
  } else {
    problems.push('📞 No phone listed');
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  // Generate opportunity label
  let opportunity = '';
  if (score <= 30) {
    opportunity = '🔴 HIGH OPPORTUNITY - Critical gaps in online presence';
  } else if (score <= 50) {
    opportunity = '🟠 MEDIUM OPPORTUNITY - Multiple areas to improve';
  } else if (score <= 70) {
    opportunity = '🟡 LOW OPPORTUNITY - Decent online presence';
  } else {
    opportunity = '🟢 MINIMAL OPPORTUNITY - Strong online presence';
  }

  return {
    score,
    problems: problems.slice(0, 3),
    opportunity,
  };
}

export async function scoreAllBusinesses(
  businesses: Business[]
): Promise<(Business & WeaknessScore)[]> {
  const scored = await Promise.all(
    businesses.map(async (b) => {
      const score = await calculateWeaknessScore(b);
      return { ...b, ...score };
    })
  );

  // Sort by score (lowest first = best opportunities first)
  return scored.sort((a, b) => a.score - b.score);
}