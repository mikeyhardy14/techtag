'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './DecoderForm.module.css';

interface DecodedSegment {
  position: number;
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

interface ManufacturerPattern {
  name: string;
  patterns: RegExp[];
  format: string;
  example: string;
}

const MANUFACTURER_PATTERNS: ManufacturerPattern[] = [
  { name: 'Carrier', patterns: [/^(24|25|38|40|48|50)/], format: '##XXX###XX', example: '24ACC636A003' },
  { name: 'Trane', patterns: [/^(4T|2T|XR|XL|XV)/i], format: 'XXXX#####', example: '4TTR5030E1000AA' },
  { name: 'Lennox', patterns: [/^(XC|SL|EL|ML|13|14|15|16)/i], format: 'XX##-###-##', example: 'XC21-060-230' },
  { name: 'Rheem/Ruud', patterns: [/^(RA|RC|RH|RP|RU)/i], format: 'XX##XXX###', example: 'RA1424AJ1NA' },
  { name: 'Goodman/Amana', patterns: [/^(GSX|GSZ|GSXC|AVXC|SSX)/i], format: 'XXXX##XXXX', example: 'GSXC180601' },
  { name: 'York', patterns: [/^(YC|YZ|TM|DERA|DERA)/i], format: 'XXXX###X##', example: 'DERA060A00A' },
  { name: 'Daikin', patterns: [/^(DX|DZ|DP)/i], format: 'XX##XX####', example: 'DX16SA0603' },
  { name: 'ClimateMaster', patterns: [/^(CM|TT|TS|TW|TH|HT|TC)/i], format: 'XX-###-XX', example: 'CM-350-TR' },
];

const EXAMPLE_MODELS = [
  { model: 'HTH024A1C00ALK', brand: 'ClimateMaster', description: 'Water Source Heat Pump' },
  { model: 'GEHE01547A3FB0LFG03125140000000000B', brand: 'Trane', description: 'Horizontal Unit' },
  // { model: '24ACC636A003', brand: 'Carrier', description: 'Infinity Series AC' },
  // { model: 'GSXC180601', brand: 'Goodman', description: '18 SEER Condenser' },
];

const COMMON_MISTAKES = [
  { mistake: 'Using O instead of 0', tip: 'Model numbers typically use zeros (0), not the letter O' },
  { mistake: 'Missing dashes', tip: 'Some brands use dashes (CM-350-TR), others don\'t' },
  { mistake: 'Partial numbers', tip: 'Enter the complete model number from the unit nameplate' },
];

interface DecoderFormProps {
  initialQuery?: string;
}

// Why this matters context for each spec group
const SPEC_CONTEXT: { [key: string]: { icon: string; why: string } } = {
  'Capacity': { 
    icon: '⚡', 
    why: 'Determines if the unit can adequately heat/cool the space' 
  },
  'Voltage': { 
    icon: '🔌', 
    why: 'Must match your electrical supply to avoid damage' 
  },
  'Refrigerant': { 
    icon: '❄️', 
    why: 'Affects serviceability and environmental compliance' 
  },
  'Configuration': { 
    icon: '📐', 
    why: 'Impacts installation requirements and space planning' 
  },
  'Product Type': { 
    icon: '🏷️', 
    why: 'Identifies the unit\'s primary function in your system' 
  },
  'Efficiency': { 
    icon: '📊', 
    why: 'Higher ratings mean lower operating costs' 
  },
  'Model Series': { 
    icon: '📋', 
    why: 'Helps locate documentation and compatible parts' 
  },
  'Features': { 
    icon: '✨', 
    why: 'Special capabilities that may require specific setup' 
  },
  'Options': { 
    icon: '🔧', 
    why: 'Factory-installed options affecting performance' 
  },
  'Version': { 
    icon: '🔄', 
    why: 'Indicates design revisions or regional variants' 
  },
};

// Priority order for spec display
const SPEC_PRIORITY = [
  'Product Type',
  'Capacity', 
  'Configuration',
  'Voltage',
  'Efficiency',
  'Refrigerant',
  'Model Series',
  'Features',
  'Options',
  'Version',
];

export default function DecoderForm({ initialQuery = '' }: DecoderFormProps) {
  const { session } = useAuth();
  const [modelNumber, setModelNumber] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'validation' | 'network' | 'decode' | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [detectedManufacturer, setDetectedManufacturer] = useState<ManufacturerPattern | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [decodeTime, setDecodeTime] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Detect manufacturer while typing
  useEffect(() => {
    if (modelNumber.length >= 2) {
      const detected = MANUFACTURER_PATTERNS.find(m => 
        m.patterns.some(p => p.test(modelNumber.toUpperCase()))
      );
      setDetectedManufacturer(detected || null);
    } else {
      setDetectedManufacturer(null);
    }
  }, [modelNumber]);

  // Auto-format input (uppercase, handle common substitutions)
  const formatInput = useCallback((value: string) => {
    return value.toUpperCase().replace(/[oO]/g, (match, offset, string) => {
      const prevChar = string[offset - 1];
      const nextChar = string[offset + 1];
      if (prevChar && /[0-9]/.test(prevChar)) return '0';
      if (nextChar && /[0-9]/.test(nextChar)) return '0';
      return match.toUpperCase();
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInput(e.target.value);
    setModelNumber(formatted);
    
    if (error) {
      setError(null);
      setErrorType(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && modelNumber.trim()) {
      e.preventDefault();
      handleDecode();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
  };

  const handleDecode = async () => {
    if (!modelNumber.trim()) {
      setError('Enter a model number to decode');
      setErrorType('validation');
      inputRef.current?.focus();
      return;
    }

    // Store scroll position for stability
    const scrollY = window.scrollY;
    
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setResult(null);
    const startTime = performance.now();

    try {
      // Build headers - include auth token if user is logged in to save history
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/decode', {
        method: 'POST',
        headers,
        body: JSON.stringify({ modelNumber: modelNumber.trim() }),
      });

      const endTime = performance.now();
      setDecodeTime(Math.round(endTime - startTime));

      if (!response.ok) {
        if (response.status === 404) {
          setError('Model format not recognized. Try checking for typos or entering the full model number.');
          setErrorType('decode');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setResult(data);
      
      // Auto-expand key specs sections
      const sections: { [key: string]: boolean } = {};
      ['Capacity', 'Voltage', 'Product Type', 'Configuration'].forEach(key => {
        sections[key] = true;
      });
      setExpandedSections(sections);
      
      // Restore scroll position after state update
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
      
    } catch (err) {
      console.error('Decode error:', err);
      setError('Connection error. Please check your internet and try again.');
      setErrorType('network');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (model: string) => {
    setModelNumber(model);
    setResult(null);
    setError(null);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setModelNumber('');
    setResult(null);
    setError(null);
    setErrorType(null);
    setDetectedManufacturer(null);
    setDecodeTime(null);
    setHoveredSegment(null);
    inputRef.current?.focus();
  };

  const toggleSection = (group: string) => {
    setExpandedSections(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Get sorted and prioritized specs
  const getSortedSpecs = useCallback(() => {
    if (!result) return [];
    
    // Sort by priority order
    const sorted = [...result.segments].sort((a, b) => {
      const aIndex = SPEC_PRIORITY.indexOf(a.group);
      const bIndex = SPEC_PRIORITY.indexOf(b.group);
      // If not in priority list, put at end
      const aVal = aIndex === -1 ? 999 : aIndex;
      const bVal = bIndex === -1 ? 999 : bIndex;
      return aVal - bVal;
    });
    
    return showAllSpecs ? sorted : sorted.slice(0, 4);
  }, [result, showAllSpecs]);

  // Group segments by category with priority sorting
  const getGroupedSegments = useCallback(() => {
    if (!result) return {};
    
    const grouped = result.segments.reduce((acc, segment) => {
      if (!acc[segment.group]) acc[segment.group] = [];
      acc[segment.group].push(segment);
      return acc;
    }, {} as { [key: string]: DecodedSegment[] });
    
    // Sort groups by priority
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
      const aIndex = SPEC_PRIORITY.indexOf(a);
      const bIndex = SPEC_PRIORITY.indexOf(b);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
    
    return Object.fromEntries(sortedEntries);
  }, [result]);

  const getGroupColor = (group: string): string => {
    const colors: { [key: string]: string } = {
      // Core identification
      'Product Type': '#3B82F6',
      'Model Type': '#3B82F6',
      'Model Series': '#10B981',
      'Configuration': '#F59E0B',
      'Airflow Configuration': '#F59E0B',
      
      // Capacity & sizing
      'Capacity': '#EF4444',
      'Nominal Capacity': '#EF4444',
      'Unit Size': '#EF4444',
      
      // Efficiency & performance
      'Efficiency': '#8B5CF6',
      'SEER Rating': '#8B5CF6',
      
      // Electrical
      'Voltage': '#EC4899',
      'Electric Heat': '#DB2777',
      'Disconnect/Circuit Breaker': '#BE185D',
      'Convenience Outlet': '#9D174D',
      'ON/OFF Switch': '#831843',
      
      // Controls & sensors
      'Controls': '#06B6D4',
      'Refrigeration Controls': '#0891B2',
      'System Monitoring Controls': '#0E7490',
      'Communications Options': '#155E75',
      'Tstat Location': '#164E63',
      'Fault Sensors': '#083344',
      'Temperature Sensor': '#0D9488',
      'Smoke Detector': '#14B8A6',
      
      // Air handling
      'Supply Air': '#22C55E',
      'Supply-Air Arrangement': '#22C55E',
      'Return Air': '#16A34A',
      'Return-Air Arrangement': '#16A34A',
      'Fresh Air Selection': '#15803D',
      'Outside Air Option': '#166534',
      'Blower Configuration': '#4ADE80',
      'Supply Fan/Drive Type/Motor': '#86EFAC',
      
      // Heat & refrigeration
      'Heat Exchanger': '#F97316',
      'Heat Exchanger Options': '#EA580C',
      'Refrigeration Sequence': '#C2410C',
      'Freeze Protection': '#7C2D12',
      
      // Design & sequence
      'Design Sequence': '#A855F7',
      'Development Sequence': '#9333EA',
      'Minor Design Sequence': '#7E22CE',
      'Service Sequence': '#6B21A8',
      'Revision Level': '#581C87',
      
      // Physical features
      'Filter Type': '#64748B',
      'Drain Pan': '#475569',
      'Acoustic Arrangement': '#334155',
      'Cabinet Insulation': '#1E293B',
      'Insulation': '#0F172A',
      'Paint Color': '#78716C',
      'Factory Configuration': '#57534E',
      
      // Water & piping
      'Water Circuit Options': '#0EA5E9',
      'Piping Arrangement': '#0284C7',
      'Riser Type': '#0369A1',
      'Supply Riser': '#075985',
      'Return Riser': '#0C4A6E',
      'Condensate Riser': '#082F49',
      'Riser Length': '#164E63',
      
      // Mounting & access
      'Unit Mounted Disconnect': '#84CC16',
      'Through the Base Provisions': '#65A30D',
      'Hinged Service Access and Filters': '#4D7C0F',
      
      // Generic
      'Features': '#06B6D4',
      'Options': '#F97316',
      'Version': '#84CC16',
      'Open Digit': '#94A3B8',
      'Does Not Apply': '#CBD5E1',
    };
    return colors[group] || '#6B7280';
  };

  // Calculate decode completeness
  const getDecodeCompleteness = () => {
    if (!result) return 100;
    const total = result.segments.length + result.unmatchedSegments.length;
    if (total === 0) return 100;
    return Math.round((result.segments.length / total) * 100);
  };

  // Get position range label for segment
  const getPositionLabel = (segment: DecodedSegment) => {
    const start = segment.position;
    const end = segment.position + segment.characters.length - 1;
    return start === end ? `Pos ${start}` : `Pos ${start}-${end}`;
  };

  const sortedSpecs = getSortedSpecs();
  const groupedSegments = getGroupedSegments();
  const completeness = getDecodeCompleteness();
  const isPartialDecode = completeness < 100;

  return (
    <div className={styles.container}>
      {/* Main Decoder Card */}
      <div className={`${styles.decoderCard} ${result ? styles.hasResult : ''}`}>
        {/* Input Section */}
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <div className={styles.inputBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5z" fill="currentColor"/>
              </svg>
              <span>MODEL DECODER</span>
            </div>
            {detectedManufacturer && (
              <div className={styles.detectedBrand}>
                <span className={styles.detectedLabel}>Detected:</span>
                <span className={styles.detectedName}>{detectedManufacturer.name}</span>
              </div>
            )}
          </div>

          <div className={`${styles.inputWrapper} ${isInputFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
            <input
              ref={inputRef}
              type="text"
              value={modelNumber}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Paste or type model number from nameplate"
              className={styles.input}
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
            />
            {modelNumber && !isLoading && (
              <button onClick={handleClear} className={styles.clearBtn} aria-label="Clear">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            <button
              onClick={handleDecode}
              disabled={isLoading || !modelNumber.trim()}
              className={`${styles.decodeBtn} ${isLoading ? styles.loading : ''}`}
            >
              {isLoading ? (
                <div className={styles.spinner} />
              ) : (
                <>
                  <span>Decode</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Format hint */}
          {detectedManufacturer && !result && (
            <div className={styles.formatHint}>
              <span className={styles.formatLabel}>Expected format:</span>
              <code className={styles.formatCode}>{detectedManufacturer.format}</code>
              <span className={styles.formatExample}>e.g., {detectedManufacturer.example}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className={`${styles.errorBox} ${styles[`error${errorType?.charAt(0).toUpperCase()}${errorType?.slice(1)}`]}`}>
              <div className={styles.errorIcon}>
                {errorType === 'validation' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
                {errorType === 'network' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {errorType === 'decode' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className={styles.errorContent}>
                <p className={styles.errorText}>{error}</p>
                {errorType === 'decode' && (
                  <p className={styles.errorTip}>
                    <strong>Tip:</strong> Check the nameplate on your unit for the exact model number format.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Empty State - Transitions out when loading or has results */}
        <div className={`${styles.emptyState} ${(result || isLoading) ? styles.emptyStateHidden : ''}`}>
          <div className={styles.examplesSection}>
            <h3 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Try an Example
            </h3>
            <div className={styles.exampleGrid}>
              {EXAMPLE_MODELS.map((ex, i) => (
                <button key={i} className={styles.exampleCard} onClick={() => handleExampleClick(ex.model)}>
                  <div className={styles.exampleTop}>
                    <code className={styles.exampleModel}>{ex.model}</code>
                    <svg className={styles.exampleArrow} width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className={styles.exampleBrand}>{ex.brand}</span>
                  <span className={styles.exampleDesc}>{ex.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tipsSection}>
            <h3 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Common Mistakes
            </h3>
            <div className={styles.tipsList}>
              {COMMON_MISTAKES.map((item, i) => (
                <div key={i} className={styles.tipItem}>
                  <span className={styles.tipMistake}>{item.mistake}</span>
                  <span className={styles.tipText}>{item.tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.proTip}>
            <div className={styles.proTipIcon}>⚡</div>
            <div className={styles.proTipContent}>
              <strong>Pro Tip:</strong> Press <kbd>Enter</kbd> to decode instantly
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.loadingPulse}>
              <div className={styles.loadingBar} />
              <div className={styles.loadingBar} />
              <div className={styles.loadingBar} />
            </div>
            <p className={styles.loadingText}>Analyzing model nomenclature...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={styles.results} ref={resultsRef}>
            {/* Model Number Hero - Primary Anchor */}
            <div className={styles.resultHero}>
              <div className={styles.heroModel}>
                <h2 className={styles.modelNumberDisplay}>{result.modelNumber}</h2>
                <div className={styles.heroBrandLine}>
                  <span className={styles.heroBrand}>{result.brand}</span>
                  <span className={styles.heroSeparator}>•</span>
                  <span className={styles.heroSegmentCount}>{result.segments.length} segments decoded</span>
                </div>
              </div>
              {/* De-emphasized metadata */}
              <div className={styles.heroMeta}>
                {decodeTime && (
                  <span className={styles.metaItem}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {decodeTime}ms
                  </span>
                )}
                <span className={`${styles.metaConfidence} ${styles[`conf${result.confidence}`]}`}>
                  {result.confidence === 'high' ? '✓' : result.confidence === 'medium' ? '~' : '?'} {result.confidence}
                </span>
              </div>
            </div>

            {/* Key Specs - Values Prominent */}
            {/* <div className={styles.specsSection}>
              <div className={styles.specsHeader}>
                <h3 className={styles.specsTitle}>Key Specifications</h3>
                {result.segments.length > 4 && (
                  <button 
                    className={styles.showMoreBtn}
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                  >
                    {showAllSpecs ? 'Show Primary' : `Show All ${result.segments.length}`}
                  </button>
                )}
              </div>
              <div className={styles.specsGrid}>
                {sortedSpecs.map((spec, i) => (
                  <div 
                    key={i} 
                    className={`${styles.specCard} ${i < 4 ? styles.specPrimary : styles.specSecondary}`}
                    style={{ '--spec-color': getGroupColor(spec.group) } as React.CSSProperties}
                  >
                    <div className={styles.specLabel}>
                      <span className={styles.specIcon}>{SPEC_CONTEXT[spec.group]?.icon || '📌'}</span>
                      <span className={styles.specGroupName}>{spec.group}</span>
                    </div>
                    <div className={styles.specValue}>{spec.meaning}</div>
                    <code className={styles.specCode}>{spec.characters}</code>
                    {SPEC_CONTEXT[spec.group] && (
                      <div className={styles.specWhy}>
                        <span className={styles.whyLabel}>Why it matters:</span> {SPEC_CONTEXT[spec.group].why}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div> */}

            {/* Visual Breakdown - Simplified with Hover States */}
            <div className={styles.visualSection}>
              <div className={styles.visualHeader}>
                <h3 className={styles.visualTitle}>Model Number Breakdown</h3>
                <span className={styles.visualHint}>Hover to highlight</span>
              </div>
              
              {/* Full model with character positions */}
              <div className={styles.modelBreakdown}>
                <div className={styles.positionRuler}>
                  {result.modelNumber.split('').map((_, i) => (
                    <span key={i} className={styles.positionMark}>{i + 1}</span>
                  ))}
                </div>
                <div className={styles.modelChars}>
                  {result.segments.map((segment, segIndex) => (
                    <div
                      key={segIndex}
                      className={`${styles.segmentGroup} ${hoveredSegment === segIndex ? styles.segmentActive : ''}`}
                      onMouseEnter={() => setHoveredSegment(segIndex)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ '--seg-color': getGroupColor(segment.group) } as React.CSSProperties}
                    >
                      {segment.characters.split('').map((char, charIndex) => (
                        <span key={charIndex} className={styles.modelChar}>{char}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Segment Legend */}
              <div className={styles.segmentLegend}>
                {result.segments.map((segment, index) => (
                  <div 
                    key={index}
                    className={`${styles.legendItem} ${hoveredSegment === index ? styles.legendActive : ''}`}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{ '--seg-color': getGroupColor(segment.group) } as React.CSSProperties}
                  >
                    <span className={styles.legendDot} />
                    <code className={styles.legendCode}>{segment.characters}</code>
                    <span className={styles.legendPos}>{getPositionLabel(segment)}</span>
                    <span className={styles.legendMeaning}>{segment.meaning}</span>
                    <span className={styles.legendGroup}>{segment.group}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Details with Context */}
            <div className={styles.detailsSection}>
              <h3 className={styles.detailsTitle}>Technical Details</h3>
              {Object.entries(groupedSegments).map(([group, segments]) => (
                <div key={group} className={styles.detailGroup}>
                  <button
                    onClick={() => toggleSection(group)}
                    className={styles.detailHeader}
                    style={{ '--grp-color': getGroupColor(group) } as React.CSSProperties}
                  >
                    <div className={styles.detailHeaderLeft}>
                      <span className={styles.detailIcon}>{SPEC_CONTEXT[group]?.icon || '📌'}</span>
                      <span className={styles.detailGroupName}>{group}</span>
                      <span className={styles.detailCount}>{segments.length}</span>
                    </div>
                    <svg 
                      className={`${styles.detailChevron} ${expandedSections[group] ? styles.expanded : ''}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {expandedSections[group] && (
                    <div className={styles.detailContent}>
                      {SPEC_CONTEXT[group] && (
                        <div className={styles.detailContext}>
                          <strong>Why this matters:</strong> {SPEC_CONTEXT[group].why}
                        </div>
                      )}
                      {segments.map((seg, i) => (
                        <div key={i} className={styles.detailItem}>
                          <div className={styles.detailItemMain}>
                            <span className={styles.detailValue}>{seg.meaning}</span>
                            <code className={styles.detailCode}>{seg.characters}</code>
                          </div>
                          <span className={styles.detailPos}>{getPositionLabel(seg)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Partial Decode Guidance - Not an Error */}
            {isPartialDecode && result.unmatchedSegments.length > 0 && (
              <div className={styles.partialSection}>
                <div className={styles.partialHeader}>
                  <div className={styles.partialIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className={styles.partialInfo}>
                    <span className={styles.partialTitle}>{completeness}% Decoded</span>
                    <span className={styles.partialSubtitle}>Some segments need manual review</span>
                  </div>
                </div>
                <div className={styles.partialBody}>
                  <p className={styles.partialMessage}>
                    The following characters weren't automatically recognized. They may be optional codes, 
                    regional variants, or newer additions not yet in our database.
                  </p>
                  <div className={styles.unmatchedChips}>
                    {result.unmatchedSegments.map((seg, i) => (
                      <span key={i} className={styles.unmatchedChip}>
                        <code>{seg.characters}</code>
                      </span>
                    ))}
                  </div>
                  <div className={styles.partialActions}>
                    <span className={styles.partialHint}>
                      💡 Check manufacturer documentation or contact support for these codes
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className={styles.actionBar}>
              <button onClick={handleClear} className={styles.newDecodeBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Decode Another
              </button>
              <div className={styles.actionRight}>
                <button className={styles.actionBtn} title="Copy results">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button className={styles.actionBtn} title="Print">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Power User Features */}
      <div className={`${styles.powerFeatures} ${result ? styles.powerFeaturesCompact : ''}`}>
        <div className={styles.powerItem}>
          <kbd>Enter</kbd>
          <span>Decode</span>
        </div>
        <div className={styles.powerItem}>
          <kbd>Esc</kbd>
          <span>Clear</span>
        </div>
        <div className={styles.featureHint}>
          <span>Supports 50+ manufacturers</span>
          <span className={styles.featureDot}>•</span>
          <span>Real-time detection</span>
        </div>
      </div>
    </div>
  );
}
