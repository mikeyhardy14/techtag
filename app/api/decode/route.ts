import { NextRequest, NextResponse } from 'next/server';

interface DatabaseRequest {
  id: string;
  manufacture: string;
  description: string;
}

interface DecodedSegment {
  position: string;
  characters: string;
  meaning: string;
  group: string;
}

interface DecodedResult {
  modelNumber: string;
  brand: string;
  manufacturer: string;
  segments: DecodedSegment[];
  confidence: 'high' | 'medium' | 'low';
  unmatchedSegments: string[];
}

interface ModelSegment {
  startPos: number;
  endPos: number;
  id: string;
  group: string;
  characters: string;
}

// ClimateMaster model number parsing configuration
const CLIMATEMASTER_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },
  { startPos: 2, endPos: 3, id: 'configuration', group: 'Configuration', characters: '' },
  { startPos: 3, endPos: 6, id: 'unit_size', group: 'Unit Size', characters: '' },
  { startPos: 6, endPos: 7, id: 'revision_level', group: 'Revision Level', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 9, endPos: 10, id: 'cabinet_insulation', group: 'Cabinet Insulation', characters: '' },
  { startPos: 10, endPos: 11, id: 'water_circuit_options', group: 'Water Circuit Options', characters: '' },
  { startPos: 11, endPos: 12, id: 'heat_exchanger_options', group: 'Heat Exchanger Options', characters: '' },
  { startPos: 12, endPos: 13, id: 'return_air', group: 'Return Air', characters: '' },
  { startPos: 13, endPos: 14, id: 'supply_air', group: 'Supply Air', characters: '' }
];

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { modelNumber } = body;
    
    // Validate input
    if (!modelNumber) {
      return NextResponse.json(
        { error: 'Model number is required' },
        { status: 400 }
      );
    }

    if (typeof modelNumber !== 'string') {
      return NextResponse.json(
        { error: 'Model number must be a string' },
        { status: 400 }
      );
    }

    if (modelNumber.trim().length === 0) {
      return NextResponse.json(
        { error: 'Model number cannot be empty' },
        { status: 400 }
      );
    }

    if (modelNumber.trim().length > 50) {
      return NextResponse.json(
        { error: 'Model number is too long (maximum 50 characters)' },
        { status: 400 }
      );
    }

    // Check for valid characters
    if (!/^[A-Za-z0-9\-_\s]+$/.test(modelNumber.trim())) {
      return NextResponse.json(
        { error: 'Model number contains invalid characters' },
        { status: 400 }
      );
    }

    const cleanModelNumber = modelNumber.trim().toUpperCase();
    
    // Parse the first 2 characters to determine brand
    const brandPrefix = cleanModelNumber.substring(0, 2);
    
    // For now, all models are treated as ClimateMaster
    const brand = 'ClimateMaster';
    const manufacturer = 'climatemaster';
    
    // Decode the model number using ClimateMaster parsing
    const decodedResult = await decodeClimateMasterModel(cleanModelNumber, brand, manufacturer);
    
    return NextResponse.json(decodedResult);
    
  } catch (error) {
    console.error('Decode error:', error);
    
    // Provide specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408 }
        );
      }

      if (error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { error: 'Database server not found. Please contact support.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Query the Supabase "techtag" table for a specific segment
async function queryDatabase(segmentType: string, manufacture: string, characters: string): Promise<string | null> {
  try {
    // Debug logging to see what we're requesting
    console.log(`🔍 Making database query:`, {
      'segmentType': segmentType,
      'manufacture': manufacture, 
      'characters': characters,
      'ACTUAL_QUERY': `SELECT * FROM techtag WHERE id='${characters}' AND manufacture='${manufacture}' AND description='${segmentType}'`
    });
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Supabase configuration missing');
      return null;
    }

    // Query the techtag table for matching records  
    const response = await fetch(`${SUPABASE_URL}/rest/v1/techtag?id=eq.${characters}&manufacture=eq.${manufacture}&description=eq.${segmentType}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.error(`Supabase query failed for ${segmentType}: ${response.status} ${response.statusText}`);
      return null;
    }

    const results = await response.json();
    
    // Debug logging to see what Supabase returns
    console.log(`Supabase query for segment_type=${segmentType}, characters=${characters}:`, {
      actualUrl: `${SUPABASE_URL}/rest/v1/techtag?id=eq.${characters}&manufacture=eq.${manufacture}&description=eq.${segmentType}`,
      status: response.status,
      results: results,
      resultCount: results?.length || 0
    });
    
    // Return the value from the first matching result
    if (results && results.length > 0 && results[0].value) {
      console.log(`✅ Found meaning for segment ${segmentType} with characters "${characters}": "${results[0].value}"`);
      return results[0].value;
    }
    
    console.log(`❌ No meaning found for segment ${segmentType} with characters "${characters}"`);
    return null;
    
  } catch (error) {
    console.error(`Supabase query error for ${segmentType}:`, error);
    return null;
  }
}

// Decode ClimateMaster model number using character position parsing
async function decodeClimateMasterModel(
  modelNumber: string, 
  brand: string, 
  manufacturer: string
): Promise<DecodedResult> {
  console.log(`🚀 Starting decode for model: "${modelNumber}" (${brand})`);
  
  const segments: DecodedSegment[] = [];
  const unmatchedSegments: string[] = [];
  
  // Parse each segment according to ClimateMaster specification
  for (const segment of CLIMATEMASTER_SEGMENTS) {
    // Extract characters for this segment
    const characters = modelNumber.substring(segment.startPos, segment.endPos);
    
    console.log(`📍 Parsing segment "${segment.group}": positions ${segment.startPos + 1}-${segment.endPos} = "${characters}"`);
    
    // Skip if we don't have enough characters
    if (characters.length === 0) {
      console.log(`⏭️ Skipping empty segment: ${segment.group}`);
      continue;
    }
    
    // Query database for this segment
    const meaning = await queryDatabase(segment.id, manufacturer, characters);
    
    if (meaning) {
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning,
        group: segment.group
      });
    } else {
      // If no database result, add to unmatched
      unmatchedSegments.push(characters);
    }
  }
  
  // Handle any extra characters beyond position 14
  if (modelNumber.length > 14) {
    const extraCharacters = modelNumber.substring(14);
    unmatchedSegments.push(extraCharacters);
  }
  
  // Calculate confidence based on successful database lookups
  const confidence = calculateClimateMasterConfidence(segments, unmatchedSegments, modelNumber);
  
  console.log(`📊 Decode complete:`, {
    modelNumber,
    matchedSegments: segments.length,
    unmatchedSegments: unmatchedSegments.length,
    confidence,
    segments: segments.map(s => `${s.group}: ${s.characters} = ${s.meaning}`),
    unmatched: unmatchedSegments
  });
  
  return {
    modelNumber,
    brand,
    manufacturer,
    segments,
    confidence,
    unmatchedSegments
  };
}

function calculateClimateMasterConfidence(
  segments: DecodedSegment[], 
  unmatchedSegments: string[], 
  modelNumber: string
): 'high' | 'medium' | 'low' {
  const totalSegments = CLIMATEMASTER_SEGMENTS.length;
  const matchedSegments = segments.length;
  const matchPercentage = matchedSegments / totalSegments;
  
  // High confidence: 80%+ segments matched and model number is proper length
  if (matchPercentage >= 0.8 && modelNumber.length >= 10) return 'high';
  
  // Medium confidence: 60%+ segments matched
  if (matchPercentage >= 0.6 && matchedSegments >= 4) return 'medium';
  
  // Low confidence: everything else
  return 'low';
}

