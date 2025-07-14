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

interface UnmatchedSegment {
  position: string;
  characters: string;
  group: string;
  id: string;
  attempted: string;
}

interface DecodedResult {
  modelNumber: string;
  brand: string;
  manufacturer: string;
  segments: DecodedSegment[];
  confidence: 'high' | 'medium' | 'low';
  unmatchedSegments: UnmatchedSegment[];
}

interface ModelSegment {
  startPos: number;
  endPos: number;
  id: string;
  group: string;
  characters: string;
}

// ClimateMaster model number parsing configuration (legacy)
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

// GEH/GEV model number parsing configuration (35 digits)
const GEH_GEV_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_series', group: 'Model Series', characters: '' },
  { startPos: 3, endPos: 4, id: 'development_sequence', group: 'Development Sequence', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },
  { startPos: 9, endPos: 10, id: 'design_sequence', group: 'Design Sequence', characters: '' },
  { startPos: 10, endPos: 11, id: 'refrigeration_sequence', group: 'Refrigeration Sequence', characters: '' },
  { startPos: 11, endPos: 12, id: 'blower_configuration', group: 'Blower Configuration', characters: '' },
  { startPos: 12, endPos: 13, id: 'freeze_protection', group: 'Freeze Protection', characters: '' },
  { startPos: 13, endPos: 14, id: 'open_digit', group: 'Open Digit', characters: '' },
  { startPos: 14, endPos: 15, id: 'supply_air_arrangement', group: 'Supply-Air Arrangement', characters: '' },
  { startPos: 15, endPos: 16, id: 'return_air_arrangement', group: 'Return-Air Arrangement', characters: '' },
  { startPos: 16, endPos: 17, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 17, endPos: 18, id: 'tstat_location', group: 'Tstat Location', characters: '' },
  { startPos: 18, endPos: 19, id: 'fault_sensors', group: 'Fault Sensors', characters: '' },
  { startPos: 19, endPos: 20, id: 'temperature_sensor', group: 'Temperature Sensor', characters: '' },
  { startPos: 20, endPos: 21, id: 'insulation', group: 'Insulation', characters: '' },
  { startPos: 21, endPos: 22, id: 'electric_heat', group: 'Electric Heat', characters: '' },
  { startPos: 22, endPos: 23, id: 'on_off_switch', group: 'ON/OFF Switch', characters: '' },
  { startPos: 23, endPos: 24, id: 'filter_type', group: 'Filter Type', characters: '' },
  { startPos: 24, endPos: 25, id: 'acoustic_arrangement', group: 'Acoustic Arrangement', characters: '' },
  { startPos: 25, endPos: 34, id: 'not_applicable', group: 'Does Not Apply', characters: '' },
  { startPos: 34, endPos: 35, id: 'drain_pan', group: 'Drain Pan', characters: '' }
];

// GET model number parsing configuration (36 digits) - Crane
const GET_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_series', group: 'Model Series', characters: '' },
  { startPos: 3, endPos: 4, id: 'development_sequence', group: 'Development Sequence', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },
  { startPos: 9, endPos: 10, id: 'design_sequence', group: 'Design Sequence', characters: '' },
  { startPos: 10, endPos: 11, id: 'refrigeration_sequence', group: 'Refrigeration Sequence', characters: '' },
  { startPos: 11, endPos: 12, id: 'blower_configuration', group: 'Blower Configuration', characters: '' },
  { startPos: 12, endPos: 13, id: 'freeze_protection', group: 'Freeze Protection', characters: '' },
  { startPos: 13, endPos: 14, id: 'open_digit', group: 'Open Digit', characters: '' },
  { startPos: 14, endPos: 15, id: 'supply_air_arrangement', group: 'Supply-Air Arrangement', characters: '' },
  { startPos: 15, endPos: 16, id: 'return_air_arrangement', group: 'Return-Air Arrangement', characters: '' },
  { startPos: 16, endPos: 17, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 17, endPos: 18, id: 'tstat_location', group: 'Tstat Location', characters: '' },
  { startPos: 18, endPos: 19, id: 'fault_sensors', group: 'Fault Sensors', characters: '' },
  { startPos: 19, endPos: 20, id: 'temperature_sensor', group: 'Temperature Sensor', characters: '' },
  { startPos: 20, endPos: 22, id: 'open_digit_2', group: 'Open Digit', characters: '' },
  { startPos: 22, endPos: 23, id: 'unit_mounted_disconnect', group: 'Unit Mounted Disconnect', characters: '' },
  { startPos: 23, endPos: 24, id: 'filter_type', group: 'Filter Type', characters: '' },
  { startPos: 24, endPos: 25, id: 'acoustic_arrangement', group: 'Acoustic Arrangement', characters: '' },
  { startPos: 25, endPos: 26, id: 'factory_configuration', group: 'Factory Configuration', characters: '' },
  { startPos: 26, endPos: 27, id: 'paint_color', group: 'Paint Color', characters: '' },
  { startPos: 27, endPos: 28, id: 'outside_air_option', group: 'Outside Air Option', characters: '' },
  { startPos: 28, endPos: 29, id: 'piping_arrangement', group: 'Piping Arrangement', characters: '' },
  { startPos: 29, endPos: 30, id: 'riser_type', group: 'Riser Type', characters: '' },
  { startPos: 30, endPos: 31, id: 'supply_riser', group: 'Supply Riser', characters: '' },
  { startPos: 31, endPos: 32, id: 'return_riser', group: 'Return Riser', characters: '' },
  { startPos: 32, endPos: 33, id: 'condensate_riser', group: 'Condensate Riser', characters: '' },
  { startPos: 33, endPos: 36, id: 'riser_length', group: 'Riser Length', characters: '' }
];

// GWS model number parsing configuration (45 digits) - Trane
const GWS_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_series', group: 'Model Series', characters: '' },
  { startPos: 3, endPos: 4, id: 'airflow_configuration', group: 'Airflow Configuration', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'design_sequence', group: 'Design Sequence', characters: '' },
  { startPos: 8, endPos: 9, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 9, endPos: 10, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 10, endPos: 11, id: 'electric_heat', group: 'Electric Heat', characters: '' },
  { startPos: 11, endPos: 12, id: 'minor_design_sequence', group: 'Minor Design Sequence', characters: '' },
  { startPos: 12, endPos: 14, id: 'service_sequence', group: 'Service Sequence', characters: '' },
  { startPos: 14, endPos: 15, id: 'fresh_air_selection', group: 'Fresh Air Selection', characters: '' },
  { startPos: 15, endPos: 16, id: 'supply_fan_drive_motor', group: 'Supply Fan/Drive Type/Motor', characters: '' },
  { startPos: 16, endPos: 17, id: 'hinged_service_access_filters', group: 'Hinged Service Access and Filters', characters: '' },
  { startPos: 17, endPos: 18, id: 'design_sequence_2', group: 'Design Sequence', characters: '' },
  { startPos: 18, endPos: 19, id: 'through_base_provisions', group: 'Through the Base Provisions', characters: '' },
  { startPos: 19, endPos: 20, id: 'disconnect_circuit_breaker', group: 'Disconnect/Circuit Breaker', characters: '' },
  { startPos: 20, endPos: 21, id: 'convenience_outlet', group: 'Convenience Outlet', characters: '' },
  { startPos: 21, endPos: 22, id: 'communications_options', group: 'Communications Options', characters: '' },
  { startPos: 22, endPos: 23, id: 'refrigeration_sequence', group: 'Refrigeration Sequence', characters: '' },
  { startPos: 23, endPos: 24, id: 'refrigeration_controls', group: 'Refrigeration Controls', characters: '' },
  { startPos: 24, endPos: 25, id: 'smoke_detector', group: 'Smoke Detector', characters: '' },
  { startPos: 25, endPos: 26, id: 'system_monitoring_controls', group: 'System Monitoring Controls', characters: '' },
  { startPos: 26, endPos: 27, id: 'more_system_monitoring_controls', group: 'More System Monitoring Controls', characters: '' },
  { startPos: 27, endPos: 28, id: 'unit_hardware_enhancements', group: 'Unit Hardware Enhancements', characters: '' },
  { startPos: 28, endPos: 29, id: 'short_circuit_current_rating', group: 'Short Circuit Current Rating', characters: '' },
  { startPos: 29, endPos: 31, id: 'standard', group: 'Standard', characters: '' },
  { startPos: 31, endPos: 32, id: 'more_controls', group: 'More Controls', characters: '' },
  { startPos: 32, endPos: 41, id: 'not_used', group: 'Not Used', characters: '' },
  { startPos: 41, endPos: 42, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },
  { startPos: 42, endPos: 43, id: 'freeze_protection', group: 'Freeze Protection', characters: '' },
  { startPos: 43, endPos: 44, id: 'special', group: 'Special', characters: '' },
  { startPos: 44, endPos: 45, id: 'minor_design_sequence_2', group: 'Minor Design Sequence', characters: '' }
];

// GSK/GSJ model number parsing configuration (43 digits) - Trane
const GSK_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_series', group: 'Model Series', characters: '' },
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 6, endPos: 7, id: 'design_sequence', group: 'Design Sequence', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 9, endPos: 10, id: 'heat_type', group: 'Heat Type', characters: '' },
  { startPos: 10, endPos: 11, id: 'heating_capacity', group: 'Heating Capacity', characters: '' },
  { startPos: 11, endPos: 13, id: 'service_options', group: 'Service Options', characters: '' },
  { startPos: 13, endPos: 14, id: 'fresh_air_selection', group: 'Fresh Air Selection', characters: '' },
  { startPos: 14, endPos: 15, id: 'supply_fan', group: 'Supply Fan', characters: '' },
  { startPos: 15, endPos: 16, id: 'hinged_service_access_filters', group: 'Hinged Service Access and Filters', characters: '' },
  { startPos: 16, endPos: 17, id: 'coil_protection', group: 'Coil Protection', characters: '' },
  { startPos: 17, endPos: 18, id: 'through_base_provisions', group: 'Through the Base Provisions', characters: '' },
  { startPos: 18, endPos: 19, id: 'disconnect_circuit_breaker', group: 'Disconnect/Circuit Breaker', characters: '' },
  { startPos: 19, endPos: 20, id: 'convenience_outlet', group: 'Convenience Outlet', characters: '' },
  { startPos: 20, endPos: 21, id: 'communications', group: 'Communications', characters: '' },
  { startPos: 21, endPos: 22, id: 'refrigeration_sequence', group: 'Refrigeration Sequence', characters: '' },
  { startPos: 22, endPos: 23, id: 'controls_expansion_module', group: 'Controls Expansion Module', characters: '' },
  { startPos: 23, endPos: 24, id: 'smoke_detector', group: 'Smoke Detector', characters: '' },
  { startPos: 24, endPos: 25, id: 'system_monitoring_controls', group: 'System Monitoring Controls', characters: '' },
  { startPos: 25, endPos: 26, id: 'open_digit', group: 'Open Digit', characters: '' },
  { startPos: 26, endPos: 27, id: 'hardware_enhancements', group: 'Hardware Enhancements', characters: '' },
  { startPos: 27, endPos: 28, id: 'short_circuit_current_rating', group: 'Short Circuit Current Rating', characters: '' },
  { startPos: 28, endPos: 40, id: 'not_used', group: 'Not Used', characters: '' },
  { startPos: 40, endPos: 41, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },
  { startPos: 41, endPos: 42, id: 'freeze_protection', group: 'Freeze Protection', characters: '' },
  { startPos: 42, endPos: 43, id: 'special', group: 'Special', characters: '' }
];

// VSH/VSV model number parsing configuration (19 digits) - Trane
const VSH_VSV_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_series', group: 'Model Series', characters: '' },
  { startPos: 3, endPos: 4, id: 'development_sequence', group: 'Development Sequence', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },
  { startPos: 9, endPos: 11, id: 'design_sequence', group: 'Design Sequence', characters: '' },
  { startPos: 11, endPos: 12, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 12, endPos: 13, id: 'freeze_protection', group: 'Freeze Protection', characters: '' },
  { startPos: 13, endPos: 14, id: 'open_digit', group: 'Open Digit', characters: '' },
  { startPos: 14, endPos: 15, id: 'supply_air_arrangement', group: 'Supply-Air Arrangement', characters: '' },
  { startPos: 15, endPos: 16, id: 'return_air_arrangement', group: 'Return-Air Arrangement', characters: '' },
  { startPos: 16, endPos: 17, id: 'on_off_switch', group: 'On/Off Switch', characters: '' },
  { startPos: 17, endPos: 18, id: 'filter_type', group: 'Filter Type', characters: '' },
  { startPos: 18, endPos: 19, id: 'blower_configuration', group: 'Blower Configuration', characters: '' }
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
    
    // Determine model type, brand, and manufacturer based on prefix
    let brand: string;
    let manufacturer: string;
    let modelType: string;
    
    if (cleanModelNumber.startsWith('HT')) {
      brand = 'ClimateMaster';
      manufacturer = 'climatemaster';
      modelType = 'HT';
    } else if (cleanModelNumber.startsWith('GEH') || cleanModelNumber.startsWith('GEV')) {
      brand = 'Trane';
      manufacturer = 'trane';
      modelType = cleanModelNumber.substring(0, 3); // GEH or GEV
    } else if (cleanModelNumber.startsWith('GET')) {
      brand = 'Trane';
      manufacturer = 'trane';
      modelType = 'GET';
    } else if (cleanModelNumber.startsWith('GWS')) {
      brand = 'Trane';
      manufacturer = 'trane';
      modelType = 'GWS';
    } else if (cleanModelNumber.startsWith('GSK')) {
      brand = 'Trane';
      manufacturer = 'trane';
      modelType = 'GSK';
    } else if (cleanModelNumber.startsWith('GSJ')) {
      brand = 'Trane';
      manufacturer = 'trane';
      modelType = 'GSJ';
    } else if (cleanModelNumber.startsWith('VSH') || cleanModelNumber.startsWith('VSV')) {
      brand = 'Trane';
      manufacturer = 'trane';
      modelType = cleanModelNumber.substring(0, 3); // VSH or VSV
    } else {
      // Default fallback for unknown prefixes
      brand = 'Unknown';
      manufacturer = 'unknown';
      modelType = cleanModelNumber.substring(0, 2);
    }
    
    // Decode the model number using appropriate parsing configuration
    const decodedResult = await decodeClimateMasterModel(cleanModelNumber, brand, manufacturer, modelType);
    
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
    const response = await fetch(`${SUPABASE_URL}/rest/v1/techtag?key=eq.${characters}&manufacture=eq.${manufacture}&description=eq.${segmentType}`, {
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

// Decode model number using character position parsing
async function decodeClimateMasterModel(
  modelNumber: string, 
  brand: string, 
  manufacturer: string,
  modelType: string
): Promise<DecodedResult> {
  console.log(`🚀 Starting decode for model: "${modelNumber}" (${brand}) - Type: ${modelType}`);
  
  const segments: DecodedSegment[] = [];
  const unmatchedSegments: UnmatchedSegment[] = [];
  
  // Select appropriate parsing configuration based on model type
  let segmentConfig: ModelSegment[];
  let configName: string;
  
  if (modelType === 'GEH' || modelType === 'GEV') {
    segmentConfig = GEH_GEV_SEGMENTS;
    configName = 'GEH/GEV (Trane)';
  } else if (modelType === 'GET') {
    segmentConfig = GET_SEGMENTS;
    configName = 'GET (Crane)';
  } else if (modelType === 'GWS') {
    segmentConfig = GWS_SEGMENTS;
    configName = 'GWS (Trane)';
  } else if (modelType === 'GSK' || modelType === 'GSJ') {
    segmentConfig = GSK_SEGMENTS;
    configName = `${modelType} (Trane)`;
  } else if (modelType === 'VSH' || modelType === 'VSV') {
    segmentConfig = VSH_VSV_SEGMENTS;
    configName = `${modelType} (Trane)`;
  } else {
    segmentConfig = CLIMATEMASTER_SEGMENTS;
    configName = 'HT (ClimateMaster)';
  }
  
  console.log(`📋 Using ${configName} parsing configuration`);
  
  // Parse each segment according to the selected specification
  for (const segment of segmentConfig) {
    // Extract characters for this segment
    const characters = modelNumber.substring(segment.startPos, segment.endPos);
    
    console.log(`📍 Parsing segment "${segment.group}": positions ${segment.startPos + 1}-${segment.endPos} = "${characters}"`);
    
    // Skip if we don't have enough characters
    if (characters.length === 0) {
      console.log(`⏭️ Skipping empty segment: ${segment.group}`);
      continue;
    }
    
    // Handle 'not_applicable' and 'open_digit' segments without database query
    if (segment.id === 'not_applicable') {
      console.log(`✅ Skipping database query for not applicable segment: ${segment.group}`);
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Not Applicable',
        group: segment.group
      });
      continue;
    }
    
    if (segment.id === 'open_digit' || segment.id === 'open_digit_2') {
      console.log(`✅ Skipping database query for open digit segment: ${segment.group}`);
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Open Digit',
        group: segment.group
      });
      continue;
    }
    
    if (segment.id === 'not_used') {
      console.log(`✅ Skipping database query for not used segment: ${segment.group}`);
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Not Used',
        group: segment.group
      });
      continue;
    }
    
    if (segment.id === 'standard') {
      console.log(`✅ Skipping database query for standard segment: ${segment.group}`);
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Standard',
        group: segment.group
      });
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
      unmatchedSegments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`,
        characters,
        group: segment.group,
        id: segment.id,
        attempted: `${segment.group} (${segment.id})`
      });
    }
  }
  
  // Handle any extra characters beyond the expected length
  const expectedLength = segmentConfig[segmentConfig.length - 1].endPos;
  if (modelNumber.length > expectedLength) {
    const extraCharacters = modelNumber.substring(expectedLength);
    unmatchedSegments.push({
      position: `${expectedLength + 1}-${modelNumber.length}`,
      characters: extraCharacters,
      group: 'Extra Characters',
      id: 'extra',
      attempted: 'Beyond expected model number length'
    });
  }
  
  // Calculate confidence based on successful database lookups
  const confidence = calculateClimateMasterConfidence(segments, unmatchedSegments, modelNumber, segmentConfig);
  
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
  unmatchedSegments: UnmatchedSegment[], 
  modelNumber: string,
  segmentConfig: ModelSegment[]
): 'high' | 'medium' | 'low' {
  const totalSegments = segmentConfig.length;
  const matchedSegments = segments.length;
  const matchPercentage = matchedSegments / totalSegments;
  
  // For longer models, adjust minimum length requirement based on expected length
  const isVeryLongModel = segmentConfig === GEH_GEV_SEGMENTS || segmentConfig === GET_SEGMENTS || segmentConfig === GWS_SEGMENTS || segmentConfig === GSK_SEGMENTS;
  const isMediumModel = segmentConfig === VSH_VSV_SEGMENTS;
  let minLength: number;
  
  if (isVeryLongModel) {
    minLength = 20; // Very long models (35+ digits)
  } else if (isMediumModel) {
    minLength = 15; // Medium models (19 digits)
  } else {
    minLength = 10; // Legacy models
  }
  
  // High confidence: 80%+ segments matched and model number is proper length
  if (matchPercentage >= 0.8 && modelNumber.length >= minLength) return 'high';
  
  // Medium confidence: 60%+ segments matched
  if (matchPercentage >= 0.6 && matchedSegments >= 4) return 'medium';
  
  // Low confidence: everything else
  return 'low';
}

