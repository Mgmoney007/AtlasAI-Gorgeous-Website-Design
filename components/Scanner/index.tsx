import React, { useEffect, useRef } from 'react';
import { ParticleScanner } from './ParticleScanner';
import { ParticleSystem } from './ParticleSystem';
import { CardStreamController } from './CardStreamController';
import './styles.css';

const ScannerSection: React.FC = () => {
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!cardStreamRef.current || !cardLineRef.current || !particleCanvasRef.current || !scannerCanvasRef.current) return;

    const scanner = new ParticleScanner(scannerCanvasRef.current);
    const particles = new ParticleSystem(particleCanvasRef.current);
    const cardStream = new CardStreamController(
      cardStreamRef.current,
      cardLineRef.current,
      null,
      scanner
    );

    return () => {
      scanner.destroy();
      particles.destroy();
      cardStream.destroy();
    };
  }, []);

  return (
    <div className="scanner-section-wrapper">
      <div className="scanner-container">
        <canvas ref={particleCanvasRef} id="particleCanvas"></canvas>
        <canvas ref={scannerCanvasRef} id="scannerCanvas"></canvas>
        <div className="scanner-beam"></div>
        <div className="card-stream" ref={cardStreamRef} id="cardStream">
          <div className="card-line" ref={cardLineRef} id="cardLine"></div>
        </div>
      </div>
    </div>
  );
};

export default ScannerSection;
