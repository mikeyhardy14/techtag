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
// ClimateMaster model number parsing configuration (legacy) - 14 digits
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

const EXW_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_series', group: 'Model Series', characters: '' },
  { startPos: 3, endPos: 4, id: 'development_sequence', group: 'Development Sequence', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },
  { startPos: 9, endPos: 10, id: 'design_sequence', group: 'Design Sequence', characters: '' },
  { startPos: 10, endPos: 11, id: 'refrigeration_sequence', group: 'Refrigeration Sequence', characters: '' },
  { startPos: 11, endPos: 12, id: 'open_digit_1', group: 'Open Digit', characters: '' },
  { startPos: 12, endPos: 13, id: 'freeze_protection', group: 'Freeze Protection', characters: '' },
  { startPos: 13, endPos: 14, id: 'open_digit_2', group: 'Open Digit', characters: '' },
  { startPos: 14, endPos: 15, id: 'open_digit_3', group: 'Open Digit', characters: '' },
  { startPos: 15, endPos: 16, id: 'open_digit_4', group: 'Open Digit', characters: '' },
  { startPos: 16, endPos: 17, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 17, endPos: 18, id: 'tstat_location', group: 'Tstat Location', characters: '' }
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

// DAIKIN Brands
const WCA_WHA_WRA_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },
  { startPos: 1, endPos: 4, id: 'product_identifier', group: 'Product Identifier', characters: '' },
  { startPos: 4, endPos: 5, id: 'design_series', group: 'Design Series', characters: '' },
  { startPos: 5, endPos: 8, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 8, endPos: 9, id: 'unit_controls', group: 'Unit Controls', characters: '' },
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 10, endPos: 11, id: 'head_pressure_control', group: 'Head Pressure Control', characters: '' },
  { startPos: 11, endPos: 12, id: 'water_piping_location', group: 'Water Piping Location', characters: '' },
  { startPos: 12, endPos: 13, id: 'control_box_location', group: 'Control Box Location', characters: '' },
  { startPos: 13, endPos: 15, id: 'status_lights', group: 'Status Lights', characters: '' },
  { startPos: 15, endPos: 17, id: 'freezestat', group: 'Freezestat', characters: '' },
  { startPos: 17, endPos: 18, id: 'construction_type', group: 'Construction Type', characters: '' },
  { startPos: 18, endPos: 19, id: 'source_water_heat_exchanger_construction', group: 'Source Water to Refrigerant Heat Exchanger Construction', characters: '' },
  { startPos: 19, endPos: 20, id: 'desuperheater', group: 'Desuperheater', characters: '' },
  { startPos: 20, endPos: 21, id: 'refrigerant', group: 'Refrigerant', characters: '' },
  { startPos: 21, endPos: 24, id: 'cabinet_electrical', group: 'Cabinet Electrical', characters: '' }
];

const WSC_WSD_WSM_WSN_WSS_WST_WSLV_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },
  { startPos: 1, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },
  { startPos: 3, endPos: 4, id: 'configuration', group: 'Configuration', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'design_series', group: 'Design Series', characters: '' },
  { startPos: 9, endPos: 10, id: 'piping_hand', group: 'Piping Hand', characters: '' },
  { startPos: 10, endPos: 12, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },
  { startPos: 12, endPos: 13, id: 'water_coil_type', group: 'Water Coil Type', characters: '' },
  { startPos: 13, endPos: 14, id: 'unit_controls', group: 'Unit Controls', characters: '' },
  { startPos: 14, endPos: 15, id: 'controller_options', group: 'Controller Options', characters: '' },
  { startPos: 15, endPos: 16, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },
  { startPos: 16, endPos: 17, id: 'insulation', group: 'Insulation', characters: '' },
  { startPos: 17, endPos: 18, id: 'water_coil_indoor_coil', group: 'Water Coil Indoor Coil', characters: '' },
  { startPos: 18, endPos: 19, id: 'dehumidification', group: 'Dehumidification', characters: '' },
  { startPos: 19, endPos: 20, id: 'transformer', group: 'Transformer', characters: '' },
  { startPos: 20, endPos: 22, id: 'options', group: 'Options', characters: '' },
  { startPos: 22, endPos: 23, id: 'filter_racks_and_filter', group: 'Filter Racks and Filter', characters: '' },
  { startPos: 23, endPos: 24, id: 'water_flow_options', group: 'Water Flow Options', characters: '' },
  { startPos: 24, endPos: 25, id: 'piping_package', group: 'Piping Package', characters: '' },
  { startPos: 25, endPos: 26, id: 'electric_heat_size', group: 'Electric Heat Size', characters: '' },
  { startPos: 26, endPos: 27, id: 'electric_heat_control', group: 'Electric Heat Control', characters: '' },
  { startPos: 27, endPos: 28, id: 'cabinet_color', group: 'Cabinet Color', characters: '' },
  { startPos: 28, endPos: 29, id: 'standard_or_special', group: 'Standard or Special', characters: '' },
  { startPos: 29, endPos: 30, id: 'drain_pan_material', group: 'Drain Pan Material', characters: '' },
  { startPos: 30, endPos: 31, id: 'electrical_options', group: 'Electrical Options', characters: '' },
  { startPos: 31, endPos: 32, id: 'corrosion_protection', group: 'Corrosion Protection', characters: '' },
  { startPos: 32, endPos: 33, id: 'future_use', group: 'Future Use', characters: '' },
  { startPos: 33, endPos: 34, id: 'extended_warranty', group: 'Extended Warranty', characters: '' }
];

const WSR_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },
  { startPos: 1, endPos: 4, id: 'model_type', group: 'Model Type', characters: '' },
  { startPos: 4, endPos: 5, id: 'design_series', group: 'Design Series', characters: '' },
  { startPos: 5, endPos: 8, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 10, endPos: 11, id: 'cabinet_height', group: 'Cabinet Height', characters: '' },
  { startPos: 11, endPos: 12, id: 'return_air_corrosion_protection', group: 'Return Air Corrosion Protection', characters: '' },
  { startPos: 12, endPos: 13, id: 'discharge_air', group: 'Discharge Air', characters: '' },
  { startPos: 13, endPos: 15, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },
  { startPos: 15, endPos: 16, id: 'cabinet_type', group: 'Cabinet Type', characters: '' },
  { startPos: 16, endPos: 17, id: 'discharge_grille', group: 'Discharge Grille', characters: '' },
  { startPos: 17, endPos: 18, id: 'construction_type', group: 'Construction Type', characters: '' },
  { startPos: 18, endPos: 19, id: 'water_refrigerant_heat_exchanger_construction', group: 'Water to Refrigerant Heat Exchanger Construction', characters: '' },
  { startPos: 19, endPos: 20, id: 'heating_options', group: 'Heating Options', characters: '' },
  { startPos: 20, endPos: 22, id: 'future_use_21_22', group: 'Future Use', characters: '' },
  { startPos: 22, endPos: 23, id: 'piping_hand', group: 'Piping Hand', characters: '' },
  { startPos: 23, endPos: 24, id: 'thermostat_control', group: 'Thermostat Control', characters: '' },
  { startPos: 24, endPos: 25, id: 'thermostat_programmability', group: 'Thermostat Programmability', characters: '' },
  { startPos: 25, endPos: 26, id: 'thermostat_option', group: 'Thermostat Option', characters: '' },
  { startPos: 26, endPos: 29, id: 'standard_or_special', group: 'Standard or Special', characters: '' },
  { startPos: 29, endPos: 32, id: 'options', group: 'Options', characters: '' },
  { startPos: 32, endPos: 33, id: 'refrigerant', group: 'Refrigerant', characters: '' },
  { startPos: 33, endPos: 34, id: 'power_connection', group: 'Power Connection', characters: '' },
  { startPos: 34, endPos: 37, id: 'cabinet_electrical', group: 'Cabinet Electrical', characters: '' },
  { startPos: 37, endPos: 38, id: 'water_flow_control', group: 'Water Flow Control', characters: '' },
  { startPos: 38, endPos: 39, id: 'color', group: 'Color', characters: '' },
  { startPos: 39, endPos: 40, id: 'outside_air', group: 'Outside Air', characters: '' },
  { startPos: 40, endPos: 41, id: 'agency_type', group: 'Agency Type', characters: '' },
  { startPos: 41, endPos: 42, id: 'packaging', group: 'Packaging', characters: '' },
  { startPos: 42, endPos: 43, id: 'extended_warranty', group: 'Extended Warranty', characters: '' },
  { startPos: 43, endPos: 44, id: 'product_style', group: 'Product Style', characters: '' }
];

const WGC_WGD_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },
  { startPos: 1, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },
  { startPos: 3, endPos: 4, id: 'configuration', group: 'Configuration', characters: '' },
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },
  { startPos: 8, endPos: 9, id: 'design_series', group: 'Design Series', characters: '' },
  { startPos: 9, endPos: 11, id: 'return_air_discharge_air', group: 'Return Air Discharge Air', characters: '' },
  { startPos: 11, endPos: 12, id: 'water_coil_type', group: 'Water Coil Type', characters: '' },
  { startPos: 12, endPos: 13, id: 'unit_controls', group: 'Unit Controls', characters: '' },
  { startPos: 13, endPos: 14, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },
  { startPos: 14, endPos: 15, id: 'insulation', group: 'Insulation', characters: '' },
  { startPos: 15, endPos: 17, id: 'options', group: 'Options', characters: '' },
  { startPos: 17, endPos: 18, id: 'filters_and_racks', group: 'Filters and Racks', characters: '' },
  { startPos: 18, endPos: 19, id: 'two_way_motorized_valve', group: 'Two-Way Motorized Valve', characters: '' },
  { startPos: 19, endPos: 20, id: 'electric_heat', group: 'Electric Heat', characters: '' },
  { startPos: 20, endPos: 21, id: 'additional_options', group: 'Additional Options', characters: '' },
  { startPos: 21, endPos: 22, id: 'standard_or_special_22', group: 'Standard or Special', characters: '' },
  { startPos: 22, endPos: 24, id: 'transformer', group: 'Transformer', characters: '' },
  { startPos: 24, endPos: 25, id: 'corrosion_protection_25', group: 'Corrosion Protection', characters: '' },
  { startPos: 25, endPos: 26, id: 'disconnect_switch', group: 'Disconnect Switch', characters: '' },
  { startPos: 26, endPos: 27, id: 'electric_heat_control', group: 'Electric Heat Control', characters: '' },
  { startPos: 27, endPos: 28, id: 'cabinet_color', group: 'Cabinet Color', characters: '' },
  { startPos: 28, endPos: 29, id: 'standard_or_special_29', group: 'Standard or Special', characters: '' },
  { startPos: 29, endPos: 30, id: 'drain_pan_material', group: 'Drain Pan Material', characters: '' },
  { startPos: 30, endPos: 31, id: 'electrical_options', group: 'Electrical Options', characters: '' },
  { startPos: 31, endPos: 32, id: 'corrosion_protection_32', group: 'Corrosion Protection', characters: '' },
  { startPos: 32, endPos: 33, id: 'future_use_33', group: 'Future Use', characters: '' }
];

const MHC_MHW_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },           // Digit 1
  { startPos: 1, endPos: 4, id: 'model_type', group: 'Model Type', characters: '' },                       // Digits 2–4
  { startPos: 4, endPos: 5, id: 'design_series', group: 'Design Series', characters: '' },                 // Digit 5
  { startPos: 5, endPos: 8, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },           // Digits 6–8
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },                           // Digit 9
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },                            // Digit 10
  { startPos: 10, endPos: 11, id: 'cabinet_height', group: 'Cabinet Height', characters: '' },             // Digit 11
  { startPos: 11, endPos: 12, id: 'return_air', group: 'Return Air', characters: '' },                     // Digit 12
  { startPos: 12, endPos: 13, id: 'discharge_air', group: 'Discharge Air', characters: '' },               // Digit 13
  { startPos: 13, endPos: 15, id: 'blower_motor', group: 'Blower Motor', characters: '' },                 // Digits 14–15
  { startPos: 15, endPos: 16, id: 'cabinet_type', group: 'Cabinet Type', characters: '' },                 // Digit 16
  { startPos: 16, endPos: 17, id: 'discharge_grille', group: 'Discharge Grille', characters: '' },         // Digit 17
  { startPos: 17, endPos: 18, id: 'heating_options', group: 'Heating Options', characters: '' },           // Digit 18
  { startPos: 18, endPos: 19, id: 'water_refrigerant_hx_construction', group: 'Water to Refrigerant Heat Exchanger Construction', characters: '' }, // Digit 19
  // Missing Digits 20
  { startPos: 20, endPos: 22, id: 'future_use_21_22', group: 'Future Use', characters: '' },               // Digits 21–22
  { startPos: 22, endPos: 23, id: 'piping_hand', group: 'Piping Hand', characters: '' },                   // Digit 23
  { startPos: 23, endPos: 24, id: 'thermostat_control', group: 'Thermostat Control', characters: '' },     // Digit 24
  { startPos: 24, endPos: 25, id: 'thermostat_programmability', group: 'Thermostat Programmability', characters: '' }, // Digit 25
  { startPos: 25, endPos: 26, id: 'thermostat_option', group: 'Thermostat Option', characters: '' },       // Digit 26
  // Missing Digits 27-29
  { startPos: 29, endPos: 32, id: 'options', group: 'Options', characters: '' },                           // Digits 30–32
  { startPos: 32, endPos: 33, id: 'future_use_33', group: 'Future Use', characters: '' },                  // Digit 33
  { startPos: 33, endPos: 34, id: 'power_connection', group: 'Power Connection', characters: '' },         // Digit 34
  { startPos: 34, endPos: 37, id: 'cabinet_electrical', group: 'Cabinet Electrical', characters: '' },     // Digits 35–37
  { startPos: 37, endPos: 38, id: 'water_flow_control', group: 'Water Flow Control', characters: '' }      // Digit 38
];

const WCC_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },         // Digit 1
  { startPos: 1, endPos: 4, id: 'product_identifier', group: 'Product Identifier', characters: '' },     // Digits 2–4
  { startPos: 4, endPos: 5, id: 'design_series', group: 'Design Series', characters: '' },               // Digit 5
  { startPos: 5, endPos: 8, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },         // Digits 6–8
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },                         // Digit 9
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },                          // Digit 10
  { startPos: 10, endPos: 11, id: 'empty', group: 'Empty', characters: '' },                          // Digit 11
  { startPos: 11, endPos: 12, id: 'return_air', group: 'Return Air', characters: '' },                   // Digit 12
  { startPos: 12, endPos: 13, id: 'discharge_air', group: 'Discharge Air', characters: '' },             // Digit 13
  { startPos: 13, endPos: 15, id: 'blower_motor', group: 'Blower Motor', characters: '' },               // Digits 14–15
  { startPos: 15, endPos: 17, id: 'empty', group: 'Empty', characters: '' },                       // Digits 16–17
  { startPos: 17, endPos: 18, id: 'construction_type', group: 'Construction Type', characters: '' },     // Digit 18
  { startPos: 18, endPos: 19, id: 'heat_exchanger', group: 'Heat Exchanger', characters: '' },           // Digit 19
  { startPos: 19, endPos: 29, id: 'empty', group: 'Empty', characters: '' },                       // Digits 20–29
  { startPos: 29, endPos: 32, id: 'drain_pan', group: 'Drain Pan', characters: '' },                     // Digits 30–32
  { startPos: 32, endPos: 33, id: 'refrigerant', group: 'Refrigerant', characters: '' },                 // Digit 33
  { startPos: 33, endPos: 34, id: 'empty', group: 'Empty', characters: '' },                          // Digit 34
  { startPos: 34, endPos: 37, id: 'cabinet_electrical', group: 'Cabinet Electrical', characters: '' },   // Digits 35–37
  { startPos: 37, endPos: 38, id: 'empty', group: 'Empty', characters: '' },                          // Digit 38
  { startPos: 38, endPos: 39, id: 'color', group: 'Color', characters: '' },                             // Digit 39
  { startPos: 39, endPos: 40, id: 'empty', group: 'Empty', characters: '' },                          // Digit 40
  { startPos: 40, endPos: 41, id: 'agency_listing', group: 'Agency Listing', characters: '' },           // Digit 41
  { startPos: 41, endPos: 42, id: 'packaging', group: 'Packaging', characters: '' },                     // Digit 42
  { startPos: 42, endPos: 43, id: 'empty', group: 'Empty', characters: '' },                          // Digit 43
  { startPos: 43, endPos: 44, id: 'product_style', group: 'Product Style', characters: '' }              // Digit 44
];

// McQuay
const MCQUAY_STANDARD_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },       // Digit 1
  { startPos: 1, endPos: 4, id: 'product_identifier', group: 'Product Identifier', characters: '' },   // Digits 2–4
  { startPos: 4, endPos: 5, id: 'design_series', group: 'Design Series', characters: '' },             // Digit 5
  { startPos: 5, endPos: 8, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },       // Digits 6–8
  { startPos: 8, endPos: 9, id: 'voltage', group: 'Voltage', characters: '' },                         // Digit 9
  { startPos: 9, endPos: 10, id: 'coil_options', group: 'Coil Options', characters: '' }               // Digit 10
];

const CCH_CCW_CRH_CRW_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_category', group: 'Product Category', characters: '' },        // Digit 1
  { startPos: 1, endPos: 4, id: 'product_identifier', group: 'Product Identifier', characters: '' },    // Digits 2–4
  { startPos: 4, endPos: 5, id: 'design_series', group: 'Design Series', characters: '' },              // Digit 5
  { startPos: 5, endPos: 8, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },        // Digits 6–8
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },                        // Digit 9
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },                         // Digit 10
  { startPos: 10, endPos: 11, id: 'future', group: 'Future', characters: '' },                          // Digit 11
  { startPos: 11, endPos: 12, id: 'return_air', group: 'Return Air', characters: '' },                   // Digit 12
  { startPos: 12, endPos: 13, id: 'discharge_air', group: 'Discharge Air', characters: '' }              // Digit 13
];

const MWH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'brand_name', group: 'Brand Name', characters: '' },                             // Digit 1
  { startPos: 1, endPos: 3, id: 'water_source_heat_pump', group: 'Water Source Heat Pump', characters: '' },     // Digits 2–3
  { startPos: 3, endPos: 6, id: 'nominal_cooling_capacity', group: 'Nominal Cooling Capacity', characters: '' }, // Digits 4–6
  { startPos: 6, endPos: 7, id: 'generation', group: 'Generation', characters: '' },                             // Digit 7
  { startPos: 7, endPos: 8, id: 'cooling_or_heat_pump', group: 'Cooling Only or Heat Pump', characters: '' }     // Digit 8
];

// SA model number parsing configuration
const SA_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_name', group: 'Product Name', characters: '' },       // Digit 1
  { startPos: 1, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },           // Digit 2
  { startPos: 2, endPos: 3, id: 'future', group: 'Future', characters: '' },                   // Digit 3
  { startPos: 3, endPos: 6, id: 'capacity', group: 'Capacity', characters: '' },               // Digits 4–6
  { startPos: 6, endPos: 7, id: 'revision', group: 'Revision', characters: '' },               // Digit 7
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                 // Digit 8
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },               // Digit 9
  { startPos: 9, endPos: 10, id: 'cabinet', group: 'Cabinet', characters: '' },                // Digit 10
  { startPos: 10, endPos: 11, id: 'future_2', group: 'Future', characters: '' },               // Digit 11
  { startPos: 11, endPos: 12, id: 'future_3', group: 'Future', characters: '' },               // Digit 12
  { startPos: 12, endPos: 13, id: 'future_4', group: 'Future', characters: '' },               // Digit 13
  { startPos: 13, endPos: 14, id: 'blower_motor', group: 'Blower Motor', characters: '' },     // Digit 14
  { startPos: 14, endPos: 15, id: 'standard', group: 'Standard', characters: '' }              // Digit 15
];

// WaterFurnace
// ND and NS model numbers parsing configuration
const ND_NS_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'vintage', group: 'Vintage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'hot_water_option', group: 'Hot Water Option', characters: '' },                            // Digit 8
  { startPos: 9, endPos: 10, id: 'blower_options', group: 'Blower Options', characters: '' },                               // Digit 9
  { startPos: 10, endPos: 11, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'filter_option', group: 'Filter Option', characters: '' },                                // Digit 13
  { startPos: 14, endPos: 15, id: 'controls_options', group: 'Controls Options', characters: '' },                          // Digit 14
  { startPos: 15, endPos: 16, id: 'intellistart_options', group: 'Intellistart Options', characters: '' }                   // Digit 15
];

// NV model number parsing configuration
const NV_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'vintage', group: 'Vintage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'hot_water_option', group: 'Hot Water Option', characters: '' },                            // Digit 8
  { startPos: 9, endPos: 10, id: 'blower_options', group: 'Blower Options', characters: '' },                               // Digit 9
  { startPos: 10, endPos: 11, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'filter_option', group: 'Filter Option', characters: '' },                                // Digit 13
  { startPos: 14, endPos: 15, id: 'controls_options', group: 'Controls Options', characters: '' },                          // Digit 14
  { startPos: 15, endPos: 16, id: 'future_option', group: 'Future Option', characters: '' }                                 // Digit 15
];

// Synergy 3D and LS model numbers parsing configuration
const SYNERGY_LS_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'vintage', group: 'Vintage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'hot_water_option', group: 'Hot Water Option', characters: '' },                            // Digit 8
  { startPos: 9, endPos: 10, id: 'fan_option', group: 'Fan Option', characters: '' },                                       // Digit 9
  { startPos: 10, endPos: 11, id: 'coax_options', group: 'Coax Options', characters: '' },                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
];

// NSW model number parsing configuration
const NSW_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'vintage', group: 'Vintage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'hot_water_option', group: 'Hot Water Option', characters: '' },                            // Digit 8
  { startPos: 9, endPos: 10, id: 'reversible_option', group: 'Reversible Option', characters: '' },                         // Digit 9
  { startPos: 10, endPos: 11, id: 'source_coax', group: 'Source Coax', characters: '' },                                    // Digit 10
  { startPos: 11, endPos: 12, id: 'load_coax', group: 'Load Coax', characters: '' }                                         // Digit 11
];

// NDW model number parsing configuration
const NDW_WATERFURNACE_SEGEMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'operation', group: 'Operation', characters: '' },                                          // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'controls', group: 'Controls', characters: '' },                                            // Digit 8
  { startPos: 9, endPos: 10, id: 'intellistart_options', group: 'Intellistart Options', characters: '' },                   // Digit 9
  { startPos: 10, endPos: 11, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 10
  { startPos: 11, endPos: 13, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                  // Digits 11–12
  { startPos: 13, endPos: 14, id: 'voltage', group: 'Voltage', characters: '' }                                             // Digit 13
];

// NL and NX model number parsing configuration
const NL_NX_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                                // Digits 0–2
  { startPos: 2, endPos: 5, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },              // Digit 5
  { startPos: 6, endPos: 7, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },                    // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                                      // Digit 7
  { startPos: 8, endPos: 9, id: 'future_option', group: 'Future Option', characters: '' },                                          // Digit 8
  { startPos: 9, endPos: 10, id: 'blower_options', group: 'Blower Options', characters: '' },                                       // Digit 9
  { startPos: 10, endPos: 11, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                              // Digit 10
  { startPos: 11, endPos: 12, id: 'sound_kit_options', group: 'Sound Kit Options', characters: '' },                                // Digit 11
  { startPos: 12, endPos: 13, id: 'hot_gas_bypass_and_reheat_option', group: 'Hot Gas Bypass and Reheat Option', characters: '' },  // Digit 12
  { startPos: 13, endPos: 14, id: 'water_control_option', group: 'Water Control Option', characters: '' },                          // Digit 13
  { startPos: 14, endPos: 15, id: 'controls_options', group: 'Controls Options', characters: '' },                                  // Digit 14
  { startPos: 15, endPos: 16, id: 'air_coil_and_insulation_option', group: 'Air Coil and Insulation Option', characters: '' },      // Digit 15
  { startPos: 16, endPos: 18, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                          // Digit 16
  { startPos: 18, endPos: 19, id: 'vintage', group: 'Vintage', characters: '' }                                                     // Digit 17
];

// NS Single Speed and ND Dual Speed model number parsing configuration
const NS_ND_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                                // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                          // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                                    // Digits 3–6
  { startPos: 6, endPos: 7, id: 'cabinet_configuration_2', group: 'Cabinet Configuration 2', characters: '' },                      // Digit 6
  { startPos: 7, endPos: 8, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },                    // Digit 7
  { startPos: 8, endPos: 9, id: 'voltage', group: 'Voltage', characters: '' },                                                      // Digit 8
  { startPos: 9, endPos: 10, id: 'hot_water_option', group: 'Hot Water Option', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'blower_options', group: 'Blower Options', characters: '' },                                      // Digit 10
  { startPos: 11, endPos: 12, id: 'coax_options', group: 'Coax Options', characters: '' },                                          // Digit 11
  { startPos: 12, endPos: 13, id: 'sound_kit_options', group: 'Sound Kit Options', characters: '' },                                // Digit 12
  { startPos: 13, endPos: 14, id: 'hot_gas_bypass_and_reheat_option', group: 'Hot Gas Bypass and Reheat Option', characters: '' },  // Digit 13
  { startPos: 14, endPos: 15, id: 'water_control_option', group: 'Water Control Option', characters: '' },                          // Digit 14
  { startPos: 15, endPos: 16, id: 'controls_options', group: 'Controls Options', characters: '' },                                  // Digit 15
  { startPos: 16, endPos: 17, id: 'air_coil_and_insulation_option', group: 'Air Coil and Insulation Option', characters: '' },      // Digit 16
  { startPos: 17, endPos: 19, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                          // Digit 17-19
  { startPos: 19, endPos: 20, id: 'vintage', group: 'Vintage', characters: '' }                                                     // Digit 19
];

// EW Series model number parsing configuration
const EW_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 2, endPos: 5, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 2–5
  { startPos: 5, endPos: 6, id: 'operation', group: 'Operation', characters: '' },                                          // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 8, id: 'desuperheater', group: 'Desuperheater', characters: '' },                                  // Digit 7
  { startPos: 8, endPos: 10, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                   // Digits 8–9
  { startPos: 10, endPos: 11, id: 'vintage', group: 'Vintage', characters: '' }                                             // Digit 10
];

// LC R410A model number parsing configuration
const LC_R410A_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                            // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                      // Digit 2
  { startPos: 3, endPos: 5, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                                // Digits 3–5
  { startPos: 5, endPos: 6, id: 'piping_option', group: 'Piping Option', characters: '' },                                      // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                                  // Digit 6
  { startPos: 7, endPos: 8, id: 'controls_options', group: 'Controls Options', characters: '' },                                // Digit 7
  { startPos: 8, endPos: 9, id: 'thermostat_control', group: 'Thermostart Control', characters: '' },                           // Digit 8
  { startPos: 9, endPos: 10, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                           // Digit 9
  { startPos: 10, endPos: 11, id: 'future_option', group: 'Future Option', characters: '' },                                    // Digit 10
  { startPos: 11, endPos: 12, id: 'future_option', group: 'Future Option', characters: '' },                                    // Digit 11
  { startPos: 12, endPos: 13, id: 'sound_kit_options', group: 'Sound Kit Options', characters: '' },                            // Digit 12
  { startPos: 13, endPos: 14, id: 'air_coil_and_insulation_option', group: 'Air Coil and Insulation Option', characters: '' },  // Digit 13
  { startPos: 14, endPos: 16, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                      // Digit 14-16
  { startPos: 16, endPos: 17, id: 'vintage', group: 'Vintage', characters: '' }                                                 // Digit 16
];

// NC R410A model number parsing configuration
const NC_R410A_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                            // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                      // Digit 2
  { startPos: 3, endPos: 5, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                                // Digits 3–5
  { startPos: 5, endPos: 6, id: 'piping_option', group: 'Piping Option', characters: '' },                                      // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                                  // Digit 6
  { startPos: 7, endPos: 8, id: 'controls_options', group: 'Controls Options', characters: '' },                                // Digit 7
  { startPos: 8, endPos: 9, id: 'thermostat_control', group: 'Thermostart Control', characters: '' },                           // Digit 8
  { startPos: 9, endPos: 10, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                           // Digit 9
  { startPos: 10, endPos: 11, id: 'motorized_outside_air_damper', group: 'Motorized Outside Air Damper', characters: '' },      // Digit 10
  { startPos: 11, endPos: 12, id: 'auxillary_electric_heat', group: 'Auxillary Electric Heat', characters: '' },                // Digit 11
  { startPos: 12, endPos: 13, id: 'sound_kit_options', group: 'Sound Kit Options', characters: '' },                            // Digit 12
  { startPos: 13, endPos: 14, id: 'air_coil_and_insulation_option', group: 'Air Coil and Insulation Option', characters: '' },  // Digit 13
  { startPos: 14, endPos: 16, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                      // Digit 14-16
  { startPos: 16, endPos: 17, id: 'vintage', group: 'Vintage', characters: '' }                                                 // Digit 16
];

// V3C model number parsing configuration
const V3C_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },                                          // Digits 0–3
  { startPos: 3, endPos: 4, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                    // Digit 3
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                              // Digits 4–7
  { startPos: 7, endPos: 8, id: 'refrigerant', group: 'Refrigerant', characters: '' },                                        // Digit 7
  { startPos: 8, endPos: 9, id: 'compressor_type', group: 'Compressor Type', characters: '' },                                // Digit 8
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },                                               // Digit 9
  { startPos: 10, endPos: 11, id: 'vintage_factory_use', group: 'Vintage Factory Use', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'future_option', group: 'Future Option', characters: '' },                                  // Digit 11
  { startPos: 12, endPos: 13, id: 'blower_options_r454b', group: 'Blower Options R454B', characters: '' },                    // Digit 12
  { startPos: 13, endPos: 14, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                        // Digit 13
  { startPos: 14, endPos: 15, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },      // Digit 14
  { startPos: 15, endPos: 16, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },            // Digit 15
  { startPos: 16, endPos: 17, id: 'sound_kit_option', group: 'Sound Kit Option', characters: '' },                            // Digit 16
  { startPos: 17, endPos: 18, id: 'controls_options_r454b_models', group: 'Controls Options R454B Models', characters: '' },  // Digit 17
  { startPos: 18, endPos: 19, id: 'electrical_options', group: 'Electrical Options', characters: '' },                        // Digit 18
  { startPos: 19, endPos: 20, id: 'water_control_option', group: 'Water Control Option', characters: '' },                    // Digit 19
  { startPos: 20, endPos: 21, id: 'cabinet_option', group: 'Cabinet Option', characters: '' },                                // Digit 20
  { startPos: 21, endPos: 22, id: 'air_coil_option', group: 'Air Coil Option', characters: '' },                              // Digit 21
  { startPos: 22, endPos: 23, id: 'thermostat_control', group: 'Thermostat Control', characters: '' },                        // Digit 22
  { startPos: 23, endPos: 26, id: 'non_standard_options', group: 'Non Standard Options', characters: '' }                     // Digits 23-25
];

// V5C model number parsing configuration
const V5C_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },                                          // Digits 0–3
  { startPos: 3, endPos: 4, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                    // Digit 3
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                              // Digits 4–7
  { startPos: 7, endPos: 8, id: 'refrigerant', group: 'Refrigerant', characters: '' },                                        // Digit 7
  { startPos: 8, endPos: 9, id: 'compressor_type', group: 'Compressor Type', characters: '' },                                // Digit 8
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },                                               // Digit 9
  { startPos: 10, endPos: 11, id: 'vintage_factory_use', group: 'Vintage Factory Use', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'refrigeration_option', group: 'Refrigeration Option', characters: '' },                    // Digit 11
  { startPos: 12, endPos: 13, id: 'blower_options_r454b', group: 'Blower Options R454B', characters: '' },                    // Digit 12
  { startPos: 13, endPos: 14, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                        // Digit 13
  { startPos: 14, endPos: 15, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },      // Digit 14
  { startPos: 15, endPos: 16, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },            // Digit 15
  { startPos: 16, endPos: 17, id: 'sound_kit_option', group: 'Sound Kit Option', characters: '' },                            // Digit 16
  { startPos: 17, endPos: 18, id: 'controls_options_r454b_models', group: 'Controls Options R454B Models', characters: '' },  // Digit 17
  { startPos: 18, endPos: 19, id: 'auxillary_electric_heat', group: 'Auxillary Electric Heat', characters: '' },              // Digit 18
  { startPos: 19, endPos: 20, id: 'water_control_option', group: 'Water Control Option', characters: '' },                    // Digit 19
  { startPos: 20, endPos: 21, id: 'cabinet_option', group: 'Cabinet Option', characters: '' },                                // Digit 20
  { startPos: 21, endPos: 22, id: 'air_coil_option', group: 'Air Coil Option', characters: '' },                              // Digit 21
  { startPos: 22, endPos: 23, id: 'thermostat_control', group: 'Thermostat Control', characters: '' },                        // Digit 22
  { startPos: 23, endPos: 26, id: 'non_standard_options', group: 'Non Standard Options', characters: '' }                     // Digits 23-25
];

// VXA model number parsing configuration
const VXA_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 3, id: 'model_type', group: 'Model Type', characters: '' },                                          // Digits 0–3
  { startPos: 3, endPos: 4, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                    // Digit 3
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                              // Digits 4–7
  { startPos: 7, endPos: 8, id: 'refrigerant', group: 'Refrigerant', characters: '' },                                        // Digit 7
  { startPos: 8, endPos: 9, id: 'compressor_type', group: 'Compressor Type', characters: '' },                                // Digit 8
  { startPos: 9, endPos: 10, id: 'voltage', group: 'Voltage', characters: '' },                                               // Digit 9
  { startPos: 10, endPos: 11, id: 'vintage_factory_use', group: 'Vintage Factory Use', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'refrigeration_option', group: 'Refrigeration Option', characters: '' },                    // Digit 11
  { startPos: 12, endPos: 13, id: 'blower_options_r454b', group: 'Blower Options R454B', characters: '' },                    // Digit 12
  { startPos: 13, endPos: 14, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                        // Digit 13
  { startPos: 14, endPos: 15, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },      // Digit 14
  { startPos: 15, endPos: 16, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },            // Digit 15
  { startPos: 16, endPos: 17, id: 'sound_kit_option', group: 'Sound Kit Option', characters: '' },                            // Digit 16
  { startPos: 17, endPos: 18, id: 'controls_options_r454b_models', group: 'Controls Options R454B Models', characters: '' },  // Digit 17
  { startPos: 18, endPos: 19, id: 'electrical_options', group: 'Electrical Options', characters: '' },                        // Digit 18
  { startPos: 19, endPos: 20, id: 'water_control_option', group: 'Water Control Option', characters: '' },                    // Digit 19
  { startPos: 20, endPos: 21, id: 'cabinet_option', group: 'Cabinet Option', characters: '' },                                // Digit 20
  { startPos: 21, endPos: 22, id: 'air_coil_option', group: 'Air Coil Option', characters: '' },                              // Digit 21
  { startPos: 22, endPos: 23, id: 'drain_pan_options', group: 'Drain Pan Options', characters: '' },                          // Digit 22
  { startPos: 23, endPos: 26, id: 'non_standard_options', group: 'Non Standard Options', characters: '' }                     // Digits 23-25
];

// UD model number parsing configuration
const UD_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },      // Digit 6
  { startPos: 7, endPos: 8, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },            // Digit 7
  { startPos: 8, endPos: 9, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 8
  { startPos: 9, endPos: 10, id: 'refrigeration_option', group: 'Refrigeration Option', characters: '' },                   // Digit 9
  { startPos: 10, endPos: 11, id: 'blower_options', group: 'Blower Options', characters: '' },                              // Digit 10
  { startPos: 11, endPos: 12, id: 'future_option', group: 'Future Option', characters: '' },                                // Digit 11
  { startPos: 12, endPos: 13, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                      // Digit 12
  { startPos: 13, endPos: 14, id: 'sound_kit_option', group: 'Sound Kit Option', characters: '' },                          // Digit 13
  { startPos: 14, endPos: 15, id: 'water_control_option', group: 'Water Control Option', characters: '' },                  // Digit 14
  { startPos: 15, endPos: 16, id: 'controls_options', group: 'Controls Options', characters: '' },                          // Digit 15
  { startPos: 16, endPos: 17, id: 'electrical_options', group: 'Electrical Options', characters: '' },                      // Digit 16
  { startPos: 17, endPos: 18, id: 'cabinet_option', group: 'Cabinet Option', characters: '' },                              // Digit 17
  { startPos: 18, endPos: 19, id: 'future_option', group: 'Future Option', characters: '' },                                // Digit 18
  { startPos: 19, endPos: 20, id: 'air_coil_option', group: 'Air Coil Option', characters: '' },                            // Digit 19
  { startPos: 20, endPos: 21, id: 'economizer_option', group: 'Economizer Option', characters: '' },                        // Digits 20-21
  { startPos: 21, endPos: 23, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                  // Digit 21-22
  { startPos: 23, endPos: 24, id: 'vintage', group: 'Vintage', characters: '' }                                             // Digit 23
];

// NB and UB model number parsing configuration
const NB_UB_WATERFURNACE_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_type', group: 'Model Type', characters: '' },                                        // Digits 0–2
  { startPos: 2, endPos: 3, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                            // Digits 3–6
  { startPos: 6, endPos: 7, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },      // Digit 6
  { startPos: 7, endPos: 8, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },            // Digit 7
  { startPos: 8, endPos: 9, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 8
  { startPos: 9, endPos: 10, id: 'refrigeration_option', group: 'Refrigeration Option', characters: '' },                   // Digit 9
  { startPos: 10, endPos: 11, id: 'blower_options', group: 'Blower Options', characters: '' },                              // Digit 10
  { startPos: 11, endPos: 12, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                                // Digit 11
  { startPos: 12, endPos: 13, id: 'sound_kit_option', group: 'Sound Kit Option', characters: '' },                        // Digit 12
  { startPos: 13, endPos: 14, id: 'water_control_option', group: 'Water Control Option', characters: '' },                  // Digit 13
  { startPos: 14, endPos: 15, id: 'controls_options', group: 'Controls Options', characters: '' },                          // Digit 14
  { startPos: 15, endPos: 16, id: 'electrical_options', group: 'Electrical Options', characters: '' },                      // Digit 15
  { startPos: 16, endPos: 17, id: 'cabinet_option', group: 'Cabinet Option', characters: '' },                              // Digit 16
  { startPos: 17, endPos: 18, id: 'filter_option', group: 'Filter Option', characters: '' },                            // Digit 17
  { startPos: 18, endPos: 19, id: 'air_coil_option', group: 'Air Coil Option', characters: '' },                            // Digit 18
  { startPos: 19, endPos: 20, id: 'drain_pan_options', group: 'Drain Pan Options', characters: '' },                          // Digit 19
  { startPos: 20, endPos: 22, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                  // Digit 20-21
  { startPos: 22, endPos: 23, id: 'vintage', group: 'Vintage', characters: '' }                                             // Digit 22
];

// BOSCH models
// CP, CF, CL, ES, EP, QV, LV, and MC model number parsing configuration
const STANDARD_BOSCH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 7-9
  { startPos: 9, endPos: 10, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 13
  { startPos: 14, endPos: 15, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },                        // Digit 14
  { startPos: 15, endPos: 16, id: 'air_coil', group: 'Air Coil', characters: '' },                                          // Digit 15
  { startPos: 16, endPos: 17, id: 'revision_level', group: 'Revision Level', characters: '' },                              // Digit 16
  { startPos: 17, endPos: 18, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 17
  { startPos: 18, endPos: 19, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 18
  { startPos: 19, endPos: 20, id: 'cabinet_construction', group: 'Cabinet Construction', characters: '' },                  // Digit 19
  { startPos: 20, endPos: 21, id: 'application', group: 'Application', characters: '' },                                    // Digit 20
  { startPos: 21, endPos: 26, id: 'electrical_options', group: 'Electrical Options', characters: '' },                      // Digits 21–26
  { startPos: 26, endPos: 27, id: 'refrigeration', group: 'Refrigeration', characters: '' },                                // Digit 26
  { startPos: 27, endPos: 28, id: 'transformer', group: 'Transformer', characters: '' },                                    // Digit 27
  { startPos: 28, endPos: 29, id: 'controls', group: 'Controls', characters: '' },                                          // Digit 28
  { startPos: 29, endPos: 30, id: 'water_flow_control_options', group: 'Water Flow Control Options', characters: '' },      // Digit 29
  { startPos: 30, endPos: 31, id: 'economizer', group: 'Economizer', characters: '' },                                      // Digit 30
  { startPos: 31, endPos: 32, id: 'open', group: 'Open', characters: '' },                                                  // Digit 31
  { startPos: 32, endPos: 33, id: 'air_filtration', group: 'Air Filtration', characters: '' },                              // Digit 32
  { startPos: 33, endPos: 34, id: 'motor_hp', group: 'Motor HP', characters: '' },                                          // Digit 33
  { startPos: 34, endPos: 35, id: 'drive_speed', group: 'Drive Speed', characters: '' },                                    // Digit 34
  { startPos: 35, endPos: 36, id: 'open', group: 'Open', characters: '' },                                                  // Digit 35
  { startPos: 36, endPos: 37, id: 'agency_options', group: 'Agency Options', characters: '' },                              // Digit 36
  { startPos: 37, endPos: 38, id: 'standard_or_special', group: 'Standard or Special', characters: '' },                    // Digit 37
  { startPos: 38, endPos: 39, id: 'channel', group: 'Channel', characters: '' },                                            // Digit 38
  { startPos: 39, endPos: 40, id: 'code_string_level', group: 'Code String Level', characters: '' }                         // Digit 39
];

// CA models number parsing configuration
const CA_BOSCH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 7-9
  { startPos: 9, endPos: 10, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'cabinet_width', group: 'Cabinet Width', characters: '' },                                // Digit 11
  { startPos: 12, endPos: 13, id: 'supply_air_configuration', group: 'Supply Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },                        // Digit 13
  { startPos: 14, endPos: 15, id: 'air_coil', group: 'Air Coil', characters: '' },                                          // Digit 14
  { startPos: 15, endPos: 16, id: 'cabinet_construction', group: 'Cabinet Construction', characters: '' },                  // Digit 15
  { startPos: 16, endPos: 17, id: 'revision_level', group: 'Revision Level', characters: '' },                              // Digit 16
  { startPos: 17, endPos: 18, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 17
  { startPos: 18, endPos: 19, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 18
  { startPos: 19, endPos: 20, id: 'application', group: 'Application', characters: '' },                                    // Digit 19
  { startPos: 20, endPos: 21, id: 'electrical_options', group: 'Electrical Options', characters: '' },                      // Digit 20
  { startPos: 21, endPos: 26, id: 'refrigeration', group: 'Refrigeration', characters: '' },                                // Digits 21–26
  { startPos: 26, endPos: 27, id: 'transformer', group: 'Transformer', characters: '' },                                    // Digit 26
  { startPos: 27, endPos: 28, id: 'controls', group: 'Controls', characters: '' },                                          // Digit 27
  { startPos: 28, endPos: 29, id: 'water_flow_control_options', group: 'Water Flow Control Options', characters: '' },      // Digit 28
  { startPos: 29, endPos: 30, id: 'economizer', group: 'Economizer', characters: '' },                                      // Digit 29
  { startPos: 30, endPos: 31, id: 'open', group: 'Open', characters: '' },                                                  // Digit 30
  { startPos: 31, endPos: 32, id: 'air_filtration', group: 'Air Filtration', characters: '' },                              // Digit 31
  { startPos: 32, endPos: 33, id: 'motor_hp', group: 'Motor HP', characters: '' },                                          // Digit 32
  { startPos: 33, endPos: 34, id: 'drive_speed', group: 'Drive Speed', characters: '' },                                    // Digit 33
  { startPos: 34, endPos: 35, id: 'open', group: 'Open', characters: '' },                                                  // Digit 34
  { startPos: 35, endPos: 36, id: 'open', group: 'Open', characters: '' },                                                  // Digit 35
  { startPos: 36, endPos: 37, id: 'standard_or_special', group: 'Standard or Special', characters: '' },                    // Digit 36
  { startPos: 37, endPos: 38, id: 'channel', group: 'Channel', characters: '' },                                            // Digit 37
  { startPos: 38, endPos: 39, id: 'code_string_level', group: 'Code String Level', characters: '' },                        // Digit 38
];

// SM model number parsing configuration
const SM_BOSCH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 7-9
  { startPos: 9, endPos: 10, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 13
  { startPos: 14, endPos: 15, id: 'dash', group: 'Dash', characters: '' },                        // Digit 14
  { startPos: 15, endPos: 16, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },                        // Digit 15
  { startPos: 16, endPos: 17, id: 'revision_level', group: 'Revision Level', characters: '' },                              // Digit 16
  { startPos: 17, endPos: 18, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 17
  { startPos: 18, endPos: 19, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 18
  { startPos: 19, endPos: 20, id: 'refrigeration', group: 'Refrigeration', characters: '' },                                // Digit 19
  { startPos: 20, endPos: 21, id: 'open', group: 'Open', characters: '' },                                                  // Digit 20
  { startPos: 21, endPos: 22, id: 'smart_start', group: 'Smart Start', characters: '' },                                    // Digit 21
  { startPos: 22, endPos: 23, id: 'sm_electrical_options', group: 'SM Electrical Options', characters: '' },                // Digit 22
  { startPos: 23, endPos: 24, id: 'standard_or_special', group: 'Standard or Special', characters: '' },                    // Digit 23
];

// WT model number parsing configuration
const WT_BOSCH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 7-9
  { startPos: 9, endPos: 10, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 13
  { startPos: 14, endPos: 15, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },                        // Digit 14
  { startPos: 15, endPos: 16, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 15
  { startPos: 16, endPos: 17, id: 'revision_level', group: 'Revision Level', characters: '' },                              // Digit 16
  { startPos: 17, endPos: 18, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 17
  { startPos: 18, endPos: 19, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 18
  { startPos: 19, endPos: 20, id: 'cabinet_construction', group: 'Cabinet Construction', characters: '' },                  // Digit 19
  { startPos: 20, endPos: 21, id: 'application', group: 'Application', characters: '' },                                    // Digit 20
  { startPos: 21, endPos: 26, id: 'electrical_options', group: 'Electrical Options', characters: '' },                      // Digits 21–26
  { startPos: 26, endPos: 27, id: 'refrigeration', group: 'Refrigeration', characters: '' },                                // Digit 26
  { startPos: 27, endPos: 28, id: 'transformer', group: 'Transformer', characters: '' },                                    // Digit 27
  { startPos: 28, endPos: 29, id: 'controls', group: 'Controls', characters: '' },                                          // Digit 28
  { startPos: 29, endPos: 30, id: 'open', group: 'Open', characters: '' },                                                  // Digit 29
  { startPos: 30, endPos: 31, id: 'open', group: 'Open', characters: '' },                                                  // Digit 30
  { startPos: 31, endPos: 32, id: 'open', group: 'Open', characters: '' },                                                  // Digit 31
  { startPos: 32, endPos: 33, id: 'open', group: 'Open', characters: '' },                                                  // Digit 32
  { startPos: 33, endPos: 34, id: 'open', group: 'Open', characters: '' },                                                  // Digit 33
  { startPos: 34, endPos: 35, id: 'open', group: 'Open', characters: '' },                                                  // Digit 34
  { startPos: 35, endPos: 36, id: 'open', group: 'Open', characters: '' },                                                  // Digit 35
  { startPos: 36, endPos: 37, id: 'open', group: 'Open', characters: '' },                              // Digit 36
  { startPos: 37, endPos: 38, id: 'standard_or_special', group: 'Standard or Special', characters: '' },                    // Digit 37
  { startPos: 38, endPos: 39, id: 'channel', group: 'Channel', characters: '' },                                            // Digit 38
  { startPos: 39, endPos: 40, id: 'code_string_level', group: 'Code String Level', characters: '' }                         // Digit 39
];

// BP model number parsing configuration
const BP_BOSCH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 7-9
  { startPos: 9, endPos: 10, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'supply_air_configuration', group: 'Supply Air Configuration', characters: '' },          // Digit 13
];

// EC Model number parsing configuration
const EC_BOSCH_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_configuration', group: 'Cabinet Configuration', characters: '' },                  // Digit 7-9
  { startPos: 9, endPos: 10, id: 'coax_options', group: 'Coax Options', characters: '' },                                   // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 13
  { startPos: 14, endPos: 15, id: 'fan_motor_options', group: 'Fan Motor Options', characters: '' },                        // Digit 14
  { startPos: 15, endPos: 16, id: 'air_coil', group: 'Air Coil', characters: '' },                                          // Digit 15
  { startPos: 16, endPos: 17, id: 'revision_level', group: 'Revision Level', characters: '' },                              // Digit 16
  { startPos: 17, endPos: 18, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 17
  { startPos: 18, endPos: 19, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 18
  { startPos: 19, endPos: 20, id: 'cabinet_construction', group: 'Cabinet Construction', characters: '' },                  // Digit 19
  { startPos: 20, endPos: 21, id: 'application', group: 'Application', characters: '' },                                    // Digit 20
  { startPos: 21, endPos: 26, id: 'electrical_options', group: 'Electrical Options', characters: '' },                      // Digits 21–26
  { startPos: 26, endPos: 27, id: 'refrigeration', group: 'Refrigeration', characters: '' },                                // Digit 26
  { startPos: 27, endPos: 28, id: 'transformer', group: 'Transformer', characters: '' },                                    // Digit 27
  { startPos: 28, endPos: 29, id: 'controls', group: 'Controls', characters: '' },                                          // Digit 28
  { startPos: 29, endPos: 30, id: 'water_flow_control_options', group: 'Water Flow Control Options', characters: '' },      // Digit 29
  { startPos: 30, endPos: 31, id: 'economizer', group: 'Economizer', characters: '' },                                      // Digit 30
  { startPos: 31, endPos: 32, id: 'open', group: 'Open', characters: '' },                                                  // Digit 31
  { startPos: 32, endPos: 33, id: 'air_filtration', group: 'Air Filtration', characters: '' },                              // Digit 32
  { startPos: 33, endPos: 34, id: 'motor_hp', group: 'Motor HP', characters: '' },                                          // Digit 33
  { startPos: 34, endPos: 35, id: 'drive_speed', group: 'Drive Speed', characters: '' },                                    // Digit 34
  { startPos: 35, endPos: 36, id: 'motor_or_blower_orientation', group: 'Motor or Blower Orientation', characters: '' },    // Digit 35
  { startPos: 36, endPos: 37, id: 'agency_options', group: 'Agency Options', characters: '' },                              // Digit 36
  { startPos: 37, endPos: 38, id: 'standard_or_special', group: 'Standard or Special', characters: '' },                    // Digit 37
  { startPos: 38, endPos: 39, id: 'channel', group: 'Channel', characters: '' },                                            // Digit 38
  { startPos: 39, endPos: 40, id: 'code_string_level', group: 'Code String Level', characters: '' }                         // Digit 39
];

// FLORIDA HEAT PUMP
// Standard FLORIDA HEAT PUMP model number parsing configuration
const STANDARD_FLORIDA_HEAT_PUMP_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'cabinet_construction', group: 'Cabinet Construction', characters: '' },                    // Digit 7-9
  { startPos: 9, endPos: 10, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                       // Digit 9
  { startPos: 10, endPos: 11, id: 'dash', group: 'Dash', characters: '' },                                                  // Digit 10
  { startPos: 11, endPos: 12, id: 'water_connections', group: 'Water Connections', characters: '' },                        // Digit 11
  { startPos: 12, endPos: 13, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },          // Digit 12
  { startPos: 13, endPos: 14, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },    // Digit 13
];

// CA and CS model number parsing configuration
const CA_CS_FLORIDA_HEAT_PUMP_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'dash', group: 'Dash', characters: '' },                                                    // Digit 5
  { startPos: 6, endPos: 7, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 6
  { startPos: 7, endPos: 9, id: 'control_options', group: 'Control Options', characters: '' },                              // Digit 7-9
  { startPos: 9, endPos: 10, id: 'water_connections', group: 'Water Connections', characters: '' },                         // Digit 9
  { startPos: 10, endPos: 11, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'open', group: 'Open', characters: '' },                                                  // Digit 11
  { startPos: 12, endPos: 13, id: 'open', group: 'Open', characters: '' },                                                  // Digit 12
  { startPos: 13, endPos: 14, id: 'open', group: 'Open', characters: '' },                                                  // Digit 13
];

// GS and GT model number parsing configuration
const GS_GT_FLORIDA_HEAT_PUMP_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 2, id: 'model_series', group: 'Model Series', characters: '' },                                    // Digits 0–2
  { startPos: 2, endPos: 5, id: 'size', group: 'Size', characters: '' },                                                    // Digits 2–5
  { startPos: 5, endPos: 6, id: 'discharge_air_configuration', group: 'Discharge Air Configuration', characters: '' },      // Digit 5
  { startPos: 6, endPos: 7, id: 'return_air_configuration', group: 'Return Air Configuration', characters: '' },            // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'hot_water_options', group: 'Hot Water Options', characters: '' },                          // Digit 8
  { startPos: 9, endPos: 10, id: 'blower_options', group: 'Blower Options', characters: '' },                               // Digit 9
  { startPos: 10, endPos: 11, id: 'water_coil_options', group: 'Water Coil Options', characters: '' },                      // Digit 10
  { startPos: 11, endPos: 12, id: 'sound_kit', group: 'Sound Kit', characters: '' },                                        // Digit 11 Unsure if this is supposed to be sound kit or sound kit option
  { startPos: 12, endPos: 13, id: 'cabinet_options', group: 'Cabinet Options', characters: '' },                            // Digit 12
  { startPos: 13, endPos: 14, id: 'non_standard_options', group: 'Non Standard Options', characters: '' },                  // Digit 13
  { startPos: 14, endPos: 15, id: 'non_standard_options_details', group: 'Non Standard Options Details', characters: '' },  // Digit 14
  { startPos: 15, endPos: 16, id: 'vintage', group: 'Vintage', characters: '' }                                             // Digit 15
];

// WHALEN
// WHALEN 2021 model number parsing configuration // needs to be renamed
const OLDER_WHALEN_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'product_family', group: 'Product Family', characters: '' },                                // Digit 0
  { startPos: 1, endPos: 2, id: 'product_type', group: 'Product Type', characters: '' },                                  // Digit 1
  { startPos: 2, endPos: 3, id: 'system_configuration', group: 'System Configuration', characters: '' },                        // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                          // Digits 3–6
  { startPos: 6, endPos: 7, id: 'revision', group: 'Revision', characters: '' },                                    // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'fan', group: 'Fan', characters: '' },                                                  // Digit 8
  { startPos: 9, endPos: 10, id: 'minor_revision', group: 'Minor Revision', characters: '' },                                    // Digit 9
  { startPos: 10, endPos: 11, id: 'sound_attenuation', group: 'Sound Attenuation', characters: '' },                          // Digit 10
  { startPos: 11, endPos: 12, id: 'cabinet_type_and_height', group: 'Cabinet Type and Height', characters: '' },          // Digit 11
  { startPos: 12, endPos: 13, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 12
  { startPos: 13, endPos: 14, id: 'electric_heat_voltage', group: 'Electric Heat Voltage', characters: '' },                // Digit 13
  { startPos: 14, endPos: 15, id: 'fan_control', group: 'Fan Control', characters: '' },                                // Digit 14
  { startPos: 15, endPos: 16, id: 'supply_air_discharge', group: 'Supply Air Discharge', characters: '' },                // Digit 15
  { startPos: 16, endPos: 17, id: 'cabinet_protection', group: 'Cabinet Protection', characters: '' },                // Digit 16
  { startPos: 17, endPos: 18, id: 'power_termination_and_entry_location', group: 'Power Termination and Entry Location', characters: '' },
  { startPos: 18, endPos: 19, id: 'thermostat_extension', group: 'Thermostat Extension', characters: '' },                // Digit 18
  { startPos: 19, endPos: 20, id: 'control_type', group: 'Control Type', characters: '' },                                     // Digit 19
  { startPos: 20, endPos: 21, id: 'water_temperature_sensors', group: 'Water Temperature Sensors', characters: '' },                             // Digit 20
  { startPos: 21, endPos: 22, id: 'ddc_control', group: 'DDC Control', characters: '' },                                     // Digit 21
  { startPos: 22, endPos: 23, id: 'drain_pan_options', group: 'Drain Pan Options', characters: '' },                                                  // Digit 22
  { startPos: 23, endPos: 24, id: 'insulation_option', group: 'Insulation Option', characters: '' },                                                  // Digit 23
  { startPos: 24, endPos: 25, id: 'outdoor_air', group: 'Outdoor Air', characters: '' },                                                  // Digit 24
  { startPos: 25, endPos: 26, id: 'filtration', group: 'Filtration', characters: '' },                                                  // Digit 25
  { startPos: 26, endPos: 27, id: 'riser_style', group: 'Riser Style', characters: '' },                           // Digit 26
  { startPos: 27, endPos: 28, id: 'riser_spacing', group: 'Riser Spacing', characters: '' },                           // Digit 27
  { startPos: 28, endPos: 29, id: 'riser_location', group: 'Riser Location', characters: '' },                           // Digit 28
  { startPos: 29, endPos: 30, id: 'special_configuration', group: 'Special Configuration', characters: '' },                           // Digit 29
];

// WHALEN 2024 model number parsing configuration // needs to be renamed
const NEWER_WHALEN_SEGMENTS: ModelSegment[] = [
    { startPos: 0, endPos: 1, id: 'product_family', group: 'Product Family', characters: '' },                                // Digit 0
  { startPos: 1, endPos: 2, id: 'product_type', group: 'Product Type', characters: '' },                                  // Digit 1
  { startPos: 2, endPos: 3, id: 'system_configuration', group: 'System Configuration', characters: '' },                        // Digit 2
  { startPos: 3, endPos: 6, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                          // Digits 3–6
  { startPos: 6, endPos: 7, id: 'revision', group: 'Revision', characters: '' },                                    // Digit 6
  { startPos: 7, endPos: 8, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 7
  { startPos: 8, endPos: 9, id: 'fan', group: 'Fan', characters: '' },                                                  // Digit 8
  { startPos: 9, endPos: 10, id: 'minor_revision', group: 'Minor Revision', characters: '' },                                    // Digit 9
  { startPos: 10, endPos: 11, id: 'sound_attenuation', group: 'Sound Attenuation', characters: '' },                          // Digit 10
  { startPos: 11, endPos: 12, id: 'cabinet_type_and_height', group: 'Cabinet Type and Height', characters: '' },          // Digit 11
  { startPos: 12, endPos: 13, id: 'electric_heat', group: 'Electric Heat', characters: '' },                                // Digit 12
  { startPos: 13, endPos: 14, id: 'electric_heat_voltage', group: 'Electric Heat Voltage', characters: '' },                // Digit 13
  { startPos: 14, endPos: 15, id: 'fan_control_wiring', group: 'Fan Control Wiring', characters: '' },                                // Digit 14
  { startPos: 15, endPos: 16, id: 'supply_air_discharge_r454b', group: 'Supply Air Discharge R454B', characters: '' },                // Digit 15
  { startPos: 16, endPos: 17, id: 'cabinet_protection', group: 'Cabinet Protection', characters: '' },                // Digit 16
  { startPos: 17, endPos: 18, id: 'power_termination_r454b', group: 'Power Termination R454B', characters: '' },
  { startPos: 18, endPos: 19, id: 'thermostat_extension', group: 'Thermostat Extension', characters: '' },                // Digit 18
  { startPos: 20, endPos: 21, id: 'water_temperature_sensors', group: 'Water Temperature Sensors', characters: '' },                             // Digit 20
  { startPos: 21, endPos: 22, id: 'ddc_control', group: 'DDC Control', characters: '' },                                     // Digit 21
  { startPos: 22, endPos: 23, id: 'drain_pan_options', group: 'Drain Pan Options', characters: '' },                                                  // Digit 22
  { startPos: 23, endPos: 24, id: 'insulation_option', group: 'Insulation Option', characters: '' },                                                  // Digit 23
  { startPos: 24, endPos: 25, id: 'outdoor_air', group: 'Outdoor Air', characters: '' },                                                  // Digit 24
  { startPos: 25, endPos: 26, id: 'filtration', group: 'Filtration', characters: '' },                                                  // Digit 25
  { startPos: 26, endPos: 27, id: 'riser_style_r454b', group: 'Riser Style R454B', characters: '' },                           // Digit 26
  { startPos: 27, endPos: 28, id: 'riser_spacing_r454b', group: 'Riser Spacing R454B', characters: '' },                           // Digit 27
  { startPos: 28, endPos: 29, id: 'riser_location_r454b', group: 'Riser Location R454B', characters: '' },                           // Digit 28
  { startPos: 29, endPos: 30, id: 'special_configuration', group: 'Special Configuration', characters: '' },                           // Digit 29
];

// WVI and WVP model number parsing configuration
const WVI_WVP_WHALEN_SEGMENTS: ModelSegment[] = [
  { startPos: 0, endPos: 1, id: 'brand', group: 'Brand', characters: '' },                                                // Digit 0
  { startPos: 1, endPos: 3, id: 'product_family', group: 'Product Family', characters: '' },                                    // Digits 1–3
  { startPos: 3, endPos: 4, id: 'system_configuration', group: 'System Configuration', characters: '' },                        // Digit 3
  { startPos: 4, endPos: 7, id: 'nominal_capacity', group: 'Nominal Capacity', characters: '' },                          // Digits 4–7
  { startPos: 7, endPos: 8, id: 'revision', group: 'Revision', characters: '' },                                    // Digit 7
  { startPos: 8, endPos: 9, id: 'voltage', group: 'Voltage', characters: '' },                                              // Digit 8
  { startPos: 9, endPos: 10, id: 'compressor', group: 'Compressor', characters: '' },                                                  // Digit 9
  { startPos: 10, endPos: 11, id: 'distributor_options', group: 'Distributor Options', characters: '' },                               // Digit 10
  { startPos: 11, endPos: 12, id: 'minor_revision', group: 'Minor Revision', characters: ''},                                    // Digit 11
  { startPos: 12, endPos: 13, id: 'control_voltage', group: 'Control Voltage', characters: '' },                          // Digit 12
  { startPos: 13, endPos: 14, id: 'control_type', group: 'Cabinet Type', characters: '' },          // Digit 13
  { startPos: 14, endPos: 15, id: 'sound_attenuation', group: 'Sound Attenuation', characters: '' },                                // Digit 14
  { startPos: 15, endPos: 16, id: 'coil_and_chasis_protection', group: 'Coil and Chasis Protection', characters: ''}, // Digit 15
  { startPos: 16, endPos: 17, id: 'hot_water_coil', group: 'Hot Water Coil', characters: '' },
  { startPos: 17, endPos: 18, id: 'control_valve', group: 'Control Valve', characters: '' },                                // Digit 17
  { startPos: 18, endPos: 19, id: 'flow_control', group: 'Flow Control', characters: '' },                // Digit 18
  { startPos: 19, endPos: 23, id: 'water_flow', group: 'Water Flow', characters: ''}, // Digits 19-23
  { startPos: 23, endPos: 24, id: 'strainer', group: 'Strainer', characters: ''}, // Digit 23
  { startPos: 24, endPos: 25, id: 'water_connections', group: 'Water Connections', characters: ''}, // Digit 24
  { startPos: 25, endPos: 26, id: 'water_side_access_ports', group: 'Water Side Access Ports', characters: ''}, // Digit 25
  { startPos: 26, endPos: 27, id: 'coax_type', group: 'Coax Type', characters: ''}, // Digit 26
  { startPos: 27, endPos: 28, id: 'chassis_plug', group: 'Chassis Plug', characters: ''}, // Digit 27
  { startPos : 28, endPos: 29, id: 'air_and_fluid_sensor', group: 'Air and Fluid Sensor', characters: ''}, // Digit 28
  { startPos: 29, endPos: 30, id: 'coil_height', group: 'Coil Height', characters: '' }                           // Digit 29
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

    // Define brand configurations with their prefixes
    const brandConfigs = [
      {
        brand: 'ClimateMaster',
        manufacturer: 'climatemaster',
        prefixes: ['SA', 'HT'],
        getModelType: (_modelNumber: string, prefix: string) => prefix
      },
      {
        brand: 'Trane',
        manufacturer: 'trane',
        prefixes: ['GEH', 'GEV', 'EXV', 'EXH', 'VSH', 'VSV', 'GET', 'GWS', 'GSK', 'GSJ'],
        getModelType: (_modelNumber: string, prefix: string) => prefix
      },
      {
        brand: 'Daikin',
        manufacturer: 'daikin',
        prefixes: ['WWCA', 'WWHA', 'WRWA', 'WWSC', 'WWSD', 'WWSM', 'WWSN', 'WWSS', 'WWST', 'WWSL', 'WWSR', 'WWGC', 'WWGD', 'WWMHC', 'WWMHW', 'WWWCC'],
        getModelType: (modelNumber: string, prefix: string) => modelNumber.substring(1, 4)
      },
      {
        brand: 'McQuay',
        manufacturer: 'mcquay',
        prefixes: ['FDD', 'FDE', 'FDL', 'FDS', 'FME', 'FMS', 'CCH', 'CCH', 'CCW', 'CRH', 'CRW', 'LDD', 'LDE', 'LDL', 'LDS', 'LME', 'LMH', 'LML', 'LMS', 'MWH'],
        getModelType: (modelNumber: string, prefix: string) => modelNumber.substring(1, 4)
      },
    ];

    // Determine model type, brand, and manufacturer based on prefix
    let brand: string = 'Unknown';
    let manufacturer: string = 'unknown';
    let modelType: string = cleanModelNumber.substring(0, 2);

    // Find matching brand configuration
    for (const config of brandConfigs) {
      const matchingPrefix = config.prefixes.find(prefix => cleanModelNumber.startsWith(prefix));
      if (matchingPrefix) {
        brand = config.brand;
        manufacturer = config.manufacturer;
        modelType = config.getModelType(cleanModelNumber, matchingPrefix);
        break;
      }
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

// Query the Supabase "techtag" table for EXV/EXH models with fallback logic
async function queryDatabaseWithFallback(segmentType: string, manufacturer: string, characters: string, modelType: string): Promise<string | null> {
  // For EXV/EXH models, try trane_exh first, then fallback to trane
  if (modelType === 'EXV' || modelType === 'EXH') {
    // First try with trane_exh
    let result = await queryDatabase(segmentType, `${manufacturer}_${modelType.toLowerCase()}`, characters);
    if (result) {
      return result;
    }

    // If no result, fallback to trane
    result = await queryDatabase(segmentType, manufacturer, characters);
    return result;
  }

  // For all other models, use the original manufacturer
  return await queryDatabase(segmentType, manufacturer, characters);
}

// Query the Supabase "techtag" table for a specific segment
async function queryDatabase(segmentType: string, manufacture: string, characters: string): Promise<string | null> {
  try {
    // Query techtag table for segment meaning

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
    // Execute Supabase query for segment lookup

    // Return the value from the first matching result
    if (results && results.length > 0 && results[0].value) {
      return results[0].value;
    }

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
  const segments: DecodedSegment[] = [];
  const unmatchedSegments: UnmatchedSegment[] = [];

  // Define segment configurations for different model types
  const segmentConfigs = [
    {
      modelTypes: ['GEH', 'GEV', 'EXV', 'EXH'],
      segments: GEH_GEV_SEGMENTS,
      getConfigName: (modelType: string) =>
        modelType === 'EXV' || modelType === 'EXH' ? `${modelType} (Trane)` : 'GEH/GEV (Trane)'
    },
    {
      modelTypes: ['GET'],
      segments: GET_SEGMENTS,
      getConfigName: () => 'GET (Crane)'
    },
    {
      modelTypes: ['GWS'],
      segments: GWS_SEGMENTS,
      getConfigName: () => 'GWS (Trane)'
    },
    {
      modelTypes: ['GSK', 'GSJ'],
      segments: GSK_SEGMENTS,
      getConfigName: (modelType: string) => `${modelType} (Trane)`
    },
    {
      modelTypes: ['VSH', 'VSV'],
      segments: VSH_VSV_SEGMENTS,
      getConfigName: (modelType: string) => `${modelType} (Trane)`
    },
    {
      modelTypes: ['WCA', 'WHA', 'WRA'],
      segments: WCA_WHA_WRA_SEGMENTS,
      getConfigName: () => 'WCA (Daikin)'
    },
    {
      modelTypes: ['WSC', 'WSD', 'WSM', 'WSN', 'WSS', 'WST', 'WSL'],
      segments: WSC_WSD_WSM_WSN_WSS_WST_WSLV_SEGMENTS,
      getConfigName: () => 'WCA (Daikin)'
    },
    {
      modelTypes: ['WSR'],
      segments: WSR_SEGMENTS,
      getConfigName: () => 'WSR (Daikin)'
    },
    {
      modelTypes: ['WGC', 'WGD'],
      segments: WGC_WGD_SEGMENTS,
      getConfigName: () => 'WGC (Daikin)'
    },
    {
      modelTypes: ['MHC', 'MHW'],
      segments: MHC_MHW_SEGMENTS,
      getConfigName: () => 'MHC (Daikin)'
    },
    {
      modelTypes: ['WCC',],
      segments: WCC_SEGMENTS,
      getConfigName: () => 'WCC (Daikin)'
    },
    {
      modelTypes: ['FDD', 'FDE', 'FDL', 'FDS', 'FME', 'FMS', 'LDD', 'LDE', 'LDL', 'LDS', 'LME', 'LMH', 'LML', 'LMS'],
      segments: MCQUAY_STANDARD_SEGMENTS,
      getConfigName: () => 'McQuay'
    },
    {
      modelTypes: ['CCH', 'CCW', 'CRH', 'CRW'],
      segments: CCH_CCW_CRH_CRW_SEGMENTS,
      getConfigName: () => 'McQuay'
    },
    {
      modelTypes: ['MWH'],
      segments: MWH_SEGMENTS,
      getConfigName: () => 'McQuay'
    },
    {
      modelTypes: ['SA'],
      segments: SA_SEGMENTS,
      getConfigName: () => 'SA (ClimateMaster)'
    },
  ];

  // Select appropriate parsing configuration based on model type
  let segmentConfig: ModelSegment[] = CLIMATEMASTER_SEGMENTS;
  let configName: string = 'HT (ClimateMaster)';

  // Find matching segment configuration
  for (const config of segmentConfigs) {
    if (config.modelTypes.includes(modelType)) {
      segmentConfig = config.segments;
      configName = config.getConfigName(modelType);
      break;
    }
  }

  // Using selected parsing configuration

  // Parse each segment according to the selected specification
  for (const segment of segmentConfig) {
    // Extract characters for this segment
    const characters = modelNumber.substring(segment.startPos, segment.endPos);

    // Parse segment characters from model number

    // Skip if we don't have enough characters
    if (characters.length === 0) {
      continue;
    }

    // Handle 'not_applicable' and 'open_digit' segments without database query
    if (segment.id === 'not_applicable') {
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Not Applicable',
        group: segment.group
      });
      continue;
    }

    if (segment.id === 'open_digit' || segment.id === 'open_digit_2') {
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Open Digit',
        group: segment.group
      });
      continue;
    }

    if (segment.id === 'not_used') {
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Not Used',
        group: segment.group
      });
      continue;
    }

    if (segment.id === 'standard') {
      segments.push({
        position: `${segment.startPos + 1}-${segment.endPos}`, // 1-based position for display
        characters,
        meaning: 'Standard',
        group: segment.group
      });
      continue;
    }

    // Query database for this segment (with fallback for EXV/EXH models)
    const meaning = await queryDatabaseWithFallback(segment.id, manufacturer, characters, modelType);

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

