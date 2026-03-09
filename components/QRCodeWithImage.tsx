import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  data: string;
  size?: number;
}

const QRCodeCanvas: React.FC<QRCodeCanvasProps> = ({ data, size = 250 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.startsWith('http')) return;

    QRCode.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a', // slate-800
        light: '#ffffff',
      }
    }).catch(err => {
      console.error('Failed to generate QR code', err);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, size, size);
      context.font = "14px sans-serif";
      context.fillStyle = "red";
      context.textAlign = "center";
      context.fillText("Could not generate QR code.", size / 2, size / 2);
    });

  }, [data, size]);

  // Render a fallback view if the data is an error message
  if (!data.startsWith('http')) {
      return (
          <div className="w-[250px] h-[250px] flex items-center justify-center bg-slate-100 text-slate-700 p-4 rounded-md text-center border-2 border-dashed">
              <p className="text-sm font-medium">Cannot generate QR code: <br/> {data}</p>
          </div>
      )
  }

  return <canvas ref={canvasRef} className="rounded-md shadow-md" />;
};

export default QRCodeCanvas;
