import { NextRequest, NextResponse } from 'next/server';

interface WebsiteCheck {
  hasSSL: boolean;
  hasSchema: boolean;
  socialMedia: {
    facebook: boolean;
    instagram: boolean;
  };
  aiVisibilityScore: number;
  problems: string[];
}

async function checkSSL(url: string): Promise<boolean> {
  try {
    if (!url) return false;
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    return cleanUrl.startsWith('https://');
  } catch {
    return false;
  }
}

async function checkSchema(url: string): Promise<boolean> {
  try {
    if (!url) return false;
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return false;

    const html = await response.text();
    
    const hasJsonLd = html.includes('application/ld+json');
    const hasOrganizationSchema = html.includes('"@type":"Organization"');
    const hasLocalBusinessSchema = html.includes('"@type":"LocalBusiness"');
    const hasBusinessSchema = hasJsonLd && (hasOrganizationSchema || hasLocalBusinessSchema);

    return hasBusinessSchema;
  } catch {
    return false;
  }
}

async function checkSocialMedia(url: string): Promise<{ facebook: boolean; instagram: boolean }> {
  try {
    if (!url) return { facebook: false, instagram: false };
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return { facebook: false, instagram: false };

    const html = await response.text();

    const facebook = html.includes('facebook.com') || html.includes('/facebook/');
    const instagram = html.includes('instagram.com') || html.includes('/instagram/');

    return { facebook, instagram };
  } catch {
    return { facebook: false, instagram: false };
  }
}

function calculateAIVisibilityScore(
  hasSSL: boolean,
  hasSchema: boolean,
  hasSocial: boolean
): number {
  let score = 0;

  if (hasSSL) score += 30;
  if (hasSchema) score += 40;
  if (hasSocial) score += 30;

  return Math.min(100, Math.max(0, score));
}

export async function POST(request: NextRequest) {
  try {
    const { website } = await request.json();

    if (!website) {
      return NextResponse.json(
        { error: 'Website URL required' },
        { status: 400 }
      );
    }

    const [hasSSL, hasSchema, socialMedia] = await Promise.all([
      checkSSL(website),
      checkSchema(website),
      checkSocialMedia(website),
    ]);

    const hasSocial = socialMedia.facebook || socialMedia.instagram;
    const aiVisibilityScore = calculateAIVisibilityScore(hasSSL, hasSchema, hasSocial);

    const problems: string[] = [];
    if (!hasSSL) problems.push('No SSL certificate (HTTP)');
    if (!hasSchema) problems.push('No schema markup detected');
    if (!hasSocial) problems.push('No social media links found');

    const result: WebsiteCheck = {
      hasSSL,
      hasSchema,
      socialMedia,
      aiVisibilityScore,
      problems,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking website:', error);
    return NextResponse.json(
      { error: 'Failed to check website' },
      { status: 500 }
    );
  }
}