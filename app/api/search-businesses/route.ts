import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { niche, location, country } = await req.json();

    console.log('Search params:', { niche, location, country });

    if (!niche || !location) {
      return NextResponse.json(
        { error: 'Niche and location required' },
        { status: 400 }
      );
    }

    const query = `${niche} in ${location}, ${country}`;

    const params = new URLSearchParams({
      query,
      key: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
      type: 'establishment',
    });

    const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`;

    console.log('API URL:', apiUrl);
    console.log('Google API Key:', process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY);

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('Google Response:', data);

    const businesses = (data.results || []).map((b: any) => ({
      id: b.place_id,
      name: b.name,
      address: b.formatted_address,
      rating: b.rating,
      reviewCount: b.user_ratings_total,
      website: b.website || null,
      phone: b.formatted_phone_number || null,
      types: b.types,
      lat: b.geometry.location.lat,
      lng: b.geometry.location.lng,
    }));

    console.log('Businesses mapped:', businesses);

    return NextResponse.json({
      businesses,
      total: businesses.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', businesses: [] },
      { status: 500 }
    );
  }
}