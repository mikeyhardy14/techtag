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

