import React from 'react';
import styles from './NomenclatureVisualizer.module.css';

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

interface NomenclatureVisualizerProps {
  modelNumber: string;
  brand: string;
  manufacturer: string;
  segments: DecodedSegment[];
  unmatchedSegments: UnmatchedSegment[];
  confidence: 'high' | 'medium' | 'low';
}

export default function NomenclatureVisualizer({
  modelNumber,
  brand,
  manufacturer,
  segments,
  unmatchedSegments,
  confidence
}: NomenclatureVisualizerProps) {
  // Sort segments by position to display them in order
  const sortedSegments = [...segments].sort((a, b) => {
    const aStart = parseInt(a.position.split('-')[0]);
    const bStart = parseInt(b.position.split('-')[0]);
    return aStart - bStart;
  });
  
  // Create an array that represents each character position in the model number
  const modelChars = modelNumber.split('');
  const segmentDisplay: Array<{
    char: string;
    segment?: DecodedSegment;
    isUnmatched?: boolean;
    unmatchedInfo?: UnmatchedSegment;
  }> = [];

  // Map each character to its segment information
  modelChars.forEach((char, index) => {
    const segment = sortedSegments.find(s => {
      const positions = s.position.split('-').map(p => parseInt(p));
      const startPos = positions[0] - 1; // Convert to 0-based index
      const endPos = positions[1] ? positions[1] - 1 : startPos;
      return index >= startPos && index <= endPos;
    });

    const unmatched = unmatchedSegments.find(u => {
      const positions = u.position.split('-').map(p => parseInt(p));
      const startPos = positions[0] - 1; // Convert to 0-based index
      const endPos = positions[1] ? positions[1] - 1 : startPos;
      return index >= startPos && index <= endPos;
    });

    segmentDisplay.push({
      char,
      segment,
      isUnmatched: !!unmatched,
      unmatchedInfo: unmatched
    });
  });

  // Group consecutive characters that belong to the same segment
  const groupedDisplay: Array<{
    characters: string;
    segment?: DecodedSegment;
    isUnmatched?: boolean;
    unmatchedInfo?: UnmatchedSegment;
    startIndex: number;
    endIndex: number;
  }> = [];

  let currentGroup = {
    characters: '',
    segment: undefined as DecodedSegment | undefined,
    isUnmatched: false,
    unmatchedInfo: undefined as UnmatchedSegment | undefined,
    startIndex: 0,
    endIndex: 0
  };

  segmentDisplay.forEach((item, index) => {
    if (
      currentGroup.characters === '' ||
      currentGroup.segment?.position === item.segment?.position ||
      (currentGroup.isUnmatched && item.isUnmatched && currentGroup.unmatchedInfo?.position === item.unmatchedInfo?.position)
    ) {
      if (currentGroup.characters === '') {
        currentGroup.startIndex = index;
      }
      currentGroup.characters += item.char;
      currentGroup.segment = item.segment;
      currentGroup.isUnmatched = item.isUnmatched || false;
      currentGroup.unmatchedInfo = item.unmatchedInfo;
      currentGroup.endIndex = index;
    } else {
      groupedDisplay.push({ ...currentGroup });
      currentGroup = {
        characters: item.char,
        segment: item.segment,
        isUnmatched: item.isUnmatched || false,
        unmatchedInfo: item.unmatchedInfo,
        startIndex: index,
        endIndex: index
      };
    }
  });

  if (currentGroup.characters !== '') {
    groupedDisplay.push(currentGroup);
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'var(--success-green)';
      case 'medium': return 'var(--warning-orange)';
      case 'low': return 'var(--error-red)';
      default: return 'var(--text-gray)';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'High Confidence';
      case 'medium': return 'Medium Confidence';
      case 'low': return 'Low Confidence';
      default: return 'Unknown';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>HVAC Nomenclature</h2>
          <div className={styles.searchIcon}>🔍</div>
        </div>
        
        <div className={styles.basicInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Brand:</span>
            <span className={styles.infoValue}>{brand}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Manufacturer:</span>
            <span className={styles.infoValue}>{manufacturer}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Confidence:</span>
            <span 
              className={styles.confidence}
              style={{ backgroundColor: getConfidenceColor(confidence) }}
            >
              {getConfidenceText(confidence)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.diagram}>
        <div className={styles.modelNumber}>
          {groupedDisplay.map((group, index) => (
            <div
              key={index}
              className={`${styles.segment} ${
                group.isUnmatched ? styles.unmatchedSegment : 
                group.segment ? styles.matchedSegment : styles.unknownSegment
              }`}
            >
              {group.characters}
            </div>
          ))}
        </div>

        <div className={styles.connectors}>
          {groupedDisplay.map((group, index) => (
            <div
              key={index}
              className={`${styles.connector} ${
                group.isUnmatched ? styles.unmatchedConnector : 
                group.segment ? styles.matchedConnector : styles.hiddenConnector
              }`}
            />
          ))}
        </div>

        <div className={styles.meanings}>
          {groupedDisplay.map((group, index) => (
            <div
              key={index}
              className={`${styles.meaning} ${
                group.isUnmatched ? styles.unmatchedMeaning : 
                group.segment ? styles.matchedMeaning : styles.hiddenMeaning
              }`}
            >
              {group.segment ? (
                <>
                  <div className={styles.meaningText}>{group.segment.meaning}</div>
                  <div className={styles.meaningGroup}>{group.segment.group}</div>
                </>
              ) : group.isUnmatched ? (
                <>
                  <div className={styles.meaningText}>Unmatched</div>
                  <div className={styles.meaningGroup}>Position {group.unmatchedInfo?.position}</div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>Sample nomenclature</span>
      </div>
    </div>
  );
} 