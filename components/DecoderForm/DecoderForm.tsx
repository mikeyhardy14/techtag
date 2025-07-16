'use client';

import React, { useState } from 'react';
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

export default function DecoderForm() {
  const [modelNumber, setModelNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasValidationError, setHasValidationError] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showHorizontalView, setShowHorizontalView] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Color palette for different segment groups
  const getGroupColor = (group: string): string => {
    const colorMap: { [key: string]: string } = {
      'Product Type': '#3B82F6', // Blue
      'Model Series': '#10B981', // Green
      'Configuration': '#F59E0B', // Amber
      'Capacity': '#EF4444', // Red
      'Efficiency': '#8B5CF6', // Purple
      'Features': '#06B6D4', // Cyan
      'Options': '#F97316', // Orange
      'Version': '#84CC16', // Lime
      'Voltage': '#EC4899', // Pink
      'Default': '#6B7280', // Gray
    };
    return colorMap[group] || colorMap['Default'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelNumber.trim()) {
      setHasValidationError(true);
      setError('Please enter a model number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasValidationError(false);

    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelNumber: modelNumber.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Auto-expand all sections for better UX
      const sections: { [key: string]: boolean } = {};
      data.segments.forEach((segment: DecodedSegment) => {
        sections[segment.group] = true;
      });
      setExpandedSections(sections);
      
    } catch (error) {
      console.error('Error decoding model number:', error);
      setError('Failed to decode model number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModelNumber(value);
    
    if (hasValidationError && value.trim()) {
      setHasValidationError(false);
      setError(null);
    }
  };

  const handleClear = () => {
    setModelNumber('');
    setResult(null);
    setError(null);
    setHasValidationError(false);
  };

  const toggleSection = (group: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Group segments by their group
  const groupedSegments = result?.segments.reduce((acc, segment) => {
    if (!acc[segment.group]) {
      acc[segment.group] = [];
    }
    acc[segment.group].push(segment);
    return acc;
  }, {} as { [key: string]: DecodedSegment[] }) || {};

  return (
    <div className={styles.container}>
      {/* Card Container */}
      <div className={styles.decoderCard}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.cardTitle}>HVAC Model Decoder</h2>
            <p className={styles.cardSubtitle}>
              Decode any HVAC model number instantly and get detailed specifications
            </p>
          </div>
          <div className={styles.headerIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.inputContainer} ${isInputFocused ? styles.inputFocused : ''} ${hasValidationError ? styles.inputError : ''}`}>
            <label htmlFor="modelNumber" className={styles.inputLabel}>
              Model Number
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                id="modelNumber"
                value={modelNumber}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="e.g., CM-350-TR, HT024-A1C2"
                className={styles.input}
                disabled={isLoading}
              />
              {modelNumber && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={styles.clearButton}
                  aria-label="Clear input"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !modelNumber.trim()}
                className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
              >
                {isLoading ? (
                  <div className={styles.loadingSpinner}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <>
                    <span>Decode</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className={styles.errorMessage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className={styles.results}>
            <div className={styles.resultHeader}>
              <div className={styles.resultInfo}>
                <h3 className={styles.resultTitle}>Decoded: {result.modelNumber}</h3>
                <div className={styles.resultMeta}>
                  <span className={styles.brand}>{result.brand}</span>
                  <span className={styles.manufacturer}>{result.manufacturer}</span>
                  <div className={`${styles.confidence} ${styles[`confidence${result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}`]}`}>
                    {result.confidence} confidence
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHorizontalView(!showHorizontalView)}
                className={styles.viewToggle}
                aria-label={showHorizontalView ? "Switch to list view" : "Switch to horizontal view"}
              >
                {showHorizontalView ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v18H3zM9 9h6v6H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Horizontal Visualization */}
            {showHorizontalView && (
              <div className={styles.horizontalView}>
                <div className={styles.modelVisualization}>
                  {result.segments.map((segment, index) => (
                    <div 
                      key={index} 
                      className={styles.segmentItem}
                      style={{ '--segment-color': getGroupColor(segment.group) } as React.CSSProperties}
                    >
                      <div className={styles.segmentCharacters}>
                        {segment.characters}
                      </div>
                      <div className={styles.segmentLine}></div>
                      <div className={styles.segmentTooltip}>
                        <div className={styles.tooltipGroup}>{segment.group}</div>
                        <div className={styles.tooltipMeaning}>{segment.meaning}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Breakdown */}
            <div className={styles.breakdown}>
              {Object.entries(groupedSegments).map(([group, segments]) => (
                <div key={group} className={styles.segmentGroup}>
                  <button
                    onClick={() => toggleSection(group)}
                    className={styles.groupHeader}
                    style={{ '--group-color': getGroupColor(group) } as React.CSSProperties}
                  >
                    <div className={styles.groupIcon}></div>
                    <span className={styles.groupTitle}>{group}</span>
                    <div className={styles.groupBadge}>{segments.length}</div>
                    <div className={`${styles.expandIcon} ${expandedSections[group] ? styles.expanded : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                  
                  {expandedSections[group] && (
                    <div className={styles.groupContent}>
                      {segments.map((segment, index) => (
                        <div key={index} className={styles.segmentDetail}>
                          <div className={styles.detailHeader}>
                            <span className={styles.detailCharacters}>{segment.characters}</span>
                            <span className={styles.detailPosition}>Position {segment.position}</span>
                          </div>
                          <p className={styles.detailMeaning}>{segment.meaning}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Unmatched Segments */}
            {result.unmatchedSegments.length > 0 && (
              <div className={styles.unmatchedSection}>
                <h4 className={styles.unmatchedTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Unmatched Segments
                </h4>
                <div className={styles.unmatchedGrid}>
                  {result.unmatchedSegments.map((segment, index) => (
                    <div key={index} className={styles.unmatchedItem}>
                      <span className={styles.unmatchedCharacters}>{segment.characters}</span>
                      <span className={styles.unmatchedGroup}>{segment.group}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}