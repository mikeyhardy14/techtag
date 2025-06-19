'use client';

import React, { useState } from 'react';
import styles from './DecoderForm.module.css';

interface DecodedSegment {
  position: number;
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

export default function DecoderForm() {
  const [modelNumber, setModelNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!modelNumber.trim()) {
      setError('Please enter a model number to decode');
      return;
    }

    if (modelNumber.trim().length < 2) {
      setError('Model number must be at least 2 characters long');
      return;
    }

    if (modelNumber.trim().length > 50) {
      setError('Model number is too long (maximum 50 characters)');
      return;
    }

    // Check for invalid characters
    if (!/^[A-Za-z0-9\-_]+$/.test(modelNumber.trim())) {
      setError('Model number can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelNumber: modelNumber.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Failed to decode model number';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use status-based messages
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid model number format';
              break;
            case 404:
              errorMessage = 'Decoder service not found';
              break;
            case 500:
              errorMessage = 'Server error - please try again in a moment';
              break;
            case 503:
              errorMessage = 'Service temporarily unavailable';
              break;
            default:
              errorMessage = `Server error (${response.status}) - please try again`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const decodedResult: DecodedResult = await response.json();
      
      // Validate the response structure
      if (!decodedResult || typeof decodedResult !== 'object') {
        throw new Error('Invalid response from decoder service');
      }

      if (!decodedResult.modelNumber) {
        throw new Error('Incomplete response from decoder service');
      }

      setResult(decodedResult);
      
    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out - please check your connection and try again');
        } else if (err.message.includes('fetch')) {
          setError('Unable to connect to the decoder service. Please check your internet connection and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#28a745';
      case 'medium': return '#ffc107';
      case 'low': return '#dc3545';
      default: return '#6c757d';
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

  // Group segments by their group for better display
  const groupedSegments = result?.segments.reduce((acc, segment) => {
    if (!acc[segment.group]) acc[segment.group] = [];
    acc[segment.group].push(segment);
    return acc;
  }, {} as { [group: string]: DecodedSegment[] }) || {};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>HVAC Model Number Decoder</h2>
        <p className={styles.subtitle}>
          Enter your HVAC model number to get a detailed breakdown of its specifications
        </p>
      </div>

      <form onSubmit={handleDecode} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            placeholder="Enter model number (e.g., HT024-A1C2)"
            className={styles.input}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !modelNumber.trim()}
            className={styles.decodeButton}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Decoding...
              </>
            ) : (
              'Decode'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorContent}>
            <div className={styles.errorText}>{error}</div>
            <div className={styles.errorHelp}>
              {error.includes('connection') && (
                <div className={styles.troubleshoot}>
                  <p><strong>Troubleshooting steps:</strong></p>
                  <ul>
                    <li>Check your internet connection</li>
                    <li>Refresh the page and try again</li>
                    <li>Contact support if the problem persists</li>
                  </ul>
                </div>
              )}
              {error.includes('characters') && (
                <div className={styles.troubleshoot}>
                  <p><strong>Valid model number examples:</strong></p>
                  <ul>
                    <li>25HCC024300</li>
                    <li>XR13ACO24</li>
                    <li>AC-123-456</li>
                  </ul>
                </div>
              )}
              {error.includes('timeout') && (
                <div className={styles.troubleshoot}>
                  <p><strong>Try these steps:</strong></p>
                  <ul>
                    <li>Check your internet connection speed</li>
                    <li>Try with a shorter model number</li>
                    <li>Wait a moment and try again</li>
                  </ul>
                </div>
              )}
              {error.includes('Database') && (
                <div className={styles.troubleshoot}>
                  <p><strong>This is a temporary service issue:</strong></p>
                  <ul>
                    <li>Our team has been notified</li>
                    <li>Please try again in a few minutes</li>
                    <li>Contact support if this persists</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={styles.results}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>Decoding Results</h3>
            <div 
              className={styles.confidence}
              style={{ backgroundColor: getConfidenceColor(result.confidence) }}
            >
              {getConfidenceText(result.confidence)}
            </div>
          </div>

          <div className={styles.basicInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Model Number:</span>
                <span className={styles.infoValue}>{result.modelNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Brand:</span>
                <span className={styles.infoValue}>{result.brand}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Manufacturer:</span>
                <span className={styles.infoValue}>{result.manufacturer}</span>
              </div>
            </div>
          </div>

          {result.segments.length > 0 && (
            <div className={styles.segmentsSection}>
              <h4 className={styles.sectionTitle}>Model Number Breakdown</h4>
              
              {Object.entries(groupedSegments).map(([group, segments]) => (
                <div key={group} className={styles.groupSection}>
                  <h5 className={styles.groupTitle}>{group}</h5>
                  <div className={styles.segmentsList}>
                    {segments.map((segment, index) => (
                      <div key={index} className={styles.segment}>
                        <div className={styles.segmentCode}>{segment.characters}</div>
                        <div className={styles.segmentMeaning}>{segment.meaning}</div>
                        <div className={styles.segmentPosition}>Position {segment.position}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.unmatchedSegments.length > 0 && (
            <div className={styles.unmatchedSection}>
              <h4 className={styles.sectionTitle}>Unmatched Segments</h4>
              <div className={styles.unmatchedList}>
                {result.unmatchedSegments.map((segment, index) => (
                  <span key={index} className={styles.unmatchedSegment}>
                    {segment}
                  </span>
                ))}
              </div>
              <p className={styles.unmatchedNote}>
                These segments could not be decoded. They may be serial numbers, 
                date codes, or patterns not yet in our database.
              </p>
            </div>
          )}

          {result.segments.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h4>No Pattern Match Found</h4>
              <p>
                We couldn't find matching patterns for <strong>{result.modelNumber}</strong> in our database. 
                This could mean:
              </p>
              <ul>
                <li>The model number format is not yet supported</li>
                <li>It might be from a newer or less common manufacturer</li>
                <li>There could be a typo in the model number</li>
                <li>It might be a serial number instead of a model number</li>
              </ul>
              
              <div className={styles.suggestions}>
                <h5>💡 Suggestions:</h5>
                <ul>
                  <li>Try removing any serial numbers or suffixes (e.g., try "25HCC024" instead of "25HCC024300-ABC123")</li>
                  <li>Check if you have the correct model number (not serial number)</li>
                  <li>Look for the model number on the unit's nameplate or manual</li>
                  <li>Try one of our working examples: <code>25HCC024300</code>, <code>XR13ACO24</code>, or <code>XC13024</code></li>
                </ul>
              </div>
              
              <div className={styles.contactHelp}>
                <p>
                  <strong>Need help?</strong> Contact our support team with your model number and we'll add it to our database.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}