import React, { useMemo, useState } from 'react';
import { QrCodeInventoryItem } from '../types';
import { ChevronLeftIcon, QrCodeIcon, PdfIcon, CheckIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GenerateQrBatchProps {
  qrInventory: QrCodeInventoryItem[];
  onBack: () => void;
  onAddBatchRecords: (records: QrCodeInventoryItem[]) => void;
}

const padNumber = (num: number, size = 6): string => {
  return String(num).padStart(size, '0');
};

const buildToken = (prefix: string, batchName: string, serial: number): string => {
  return `${prefix}-${batchName}-${padNumber(serial)}`;
};

const BatchQrCanvas: React.FC<{ value: string; size?: number }> = ({ value, size = 120 }) => {
  const canvasId = `batch-qr-${value}`;

  React.useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;

    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).catch(err => {
      console.error('Failed to generate batch QR code', err);
    });
  }, [canvasId, size, value]);

  return <canvas id={canvasId} className="w-24 h-24" />;
};

const GenerateQrBatch: React.FC<GenerateQrBatchProps> = ({ qrInventory, onBack, onAddBatchRecords }) => {
  const { t } = useLanguage();

  const [prefix, setPrefix] = useState('QR');
  const [batchName, setBatchName] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [startNumber, setStartNumber] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastBatchRecords, setLastBatchRecords] = useState<QrCodeInventoryItem[]>([]);

  const existingTokens = useMemo(() => new Set(qrInventory.map(r => r.token)), [qrInventory]);

  const pageChunks = useMemo(() => {
    const size = 20;
    const chunks: QrCodeInventoryItem[][] = [];
    for (let i = 0; i < lastBatchRecords.length; i += size) {
      chunks.push(lastBatchRecords.slice(i, i + size));
    }
    return chunks;
  }, [lastBatchRecords]);

  const validateBatchInput = (qty: number, name: string, start: number) => {
    if (qty < 1 || qty > 10000) {
      throw new Error(t('generateBatchValidationErrorQuantity'));
    }
    if (!name.trim()) {
      throw new Error(t('generateBatchValidationErrorBatchName'));
    }
    if (start < 1) {
      throw new Error(t('generateBatchValidationErrorStartNumber'));
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity || '0');
    const start = Number(startNumber || '0');

    try {
      validateBatchInput(qty, batchName, start);
    } catch (err: any) {
      alert(err.message || String(err));
      return;
    }

    const createdAt = new Date().toISOString();
    const newRecords: QrCodeInventoryItem[] = [];

    for (let i = 0; i < qty; i++) {
      const serialNumber = start + i;
      const token = buildToken(prefix, batchName.trim(), serialNumber);

      if (existingTokens.has(token)) {
        alert(t('generateBatchValidationErrorDuplicate', { token }));
        return;
      }

      const id =
        (crypto as any)?.randomUUID?.() ??
        `qr_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      newRecords.push({
        id,
        token,
        batchName: batchName.trim(),
        serialNumber,
        qrValue: token,
        status: 'unassigned',
        memberId: undefined,
        batchId: batchName.trim(),
        createdAt,
        assignedAt: undefined,
        assignedBy: undefined,
        notes: undefined,
      });
    }

    setIsGenerating(true);
    onAddBatchRecords(newRecords);
    setLastBatchRecords(newRecords);
    setIsGenerating(false);
  };

  const handleExportPdf = async () => {
    if (!lastBatchRecords.length) {
      alert(t('generateBatchNoRecordsForPdf'));
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      for (let pageIndex = 0; pageIndex < pageChunks.length; pageIndex++) {
        const element = document.getElementById(`batch-print-page-${pageIndex}`);
        if (!element) continue;

        // Render at 2x for better quality
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        if (pageIndex > 0) {
          pdf.addPage();
        }

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const y = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
      }

      const safeBatchName =
        (batchName || lastBatchRecords[0].batchName || 'batch').replace(/\s/g, '_');
      pdf.save(`QRate_QR_${safeBatchName}.pdf`);
    } catch (error) {
      console.error('Error generating batch PDF:', error);
      alert(t('generateBatchPdfError'));
    } finally {
      setIsExporting(false);
    }
  };

  const lastBatchSummary = useMemo(() => {
    if (!lastBatchRecords.length) return null;
    const count = lastBatchRecords.length.toString();
    const firstToken = lastBatchRecords[0].token;
    const lastToken = lastBatchRecords[lastBatchRecords.length - 1].token;
    return t('generateBatchLastBatchSummary', { count, firstToken, lastToken });
  }, [lastBatchRecords, t]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          {t('backToDashboard')}
        </button>
      </div>

      <div className="px-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <QrCodeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {t('generateBatchTitle')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('generateBatchSubtitle')}
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 md:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {t('generateBatchPrefixLabel')}
                    </label>
                    <input
                      type="text"
                      value={prefix}
                      onChange={e => setPrefix(e.target.value.toUpperCase())}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {t('generateBatchBatchNameLabel')}
                    </label>
                    <input
                      type="text"
                      value={batchName}
                      onChange={e => setBatchName(e.target.value.toUpperCase())}
                      placeholder="MAR26A"
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {t('generateBatchQuantityLabel')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {t('generateBatchStartNumberLabel')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={startNumber}
                      onChange={e => setStartNumber(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-blue-400"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <CheckIcon className="h-5 w-5" />
                  )}
                  {t('generateBatchGenerateButton')}
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExporting || !lastBatchRecords.length}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:bg-red-400"
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <PdfIcon className="h-5 w-5" />
                  )}
                  {t('generateBatchExportPdfButton')}
                </button>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  {t('generateBatchLastBatchTitle')}
                </h3>
                {lastBatchSummary ? (
                  <p className="text-xs text-slate-600">{lastBatchSummary}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    {t('generateBatchLastBatchNone')}
                  </p>
                )}
              </div>
            </aside>
          </form>
        </div>
      </div>

      {/* Hidden print layout for PDF export: 4 columns × 5 rows per page */}
      <div
        id="batch-print-root"
        style={{ position: 'absolute', left: '-10000px', top: 0, opacity: 0, pointerEvents: 'none' }}
      >
        {pageChunks.map((page, pageIndex) => (
          <div
            key={pageIndex}
            id={`batch-print-page-${pageIndex}`}
            className="w-[800px] h-[1100px] p-8 grid grid-cols-4 gap-x-6 gap-y-6 bg-white"
          >
            {page.map(record => (
              <div
                key={record.id}
                className="flex flex-col items-center justify-center border border-slate-300 rounded-md p-2"
              >
                <BatchQrCanvas value={record.qrValue || record.token} size={120} />
                <div className="mt-2 text-[10px] text-center text-slate-800">
                  <div className="font-semibold">{record.token}</div>
                  <div>Batch: {record.batchName}</div>
                  <div>Status: {record.status}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateQrBatch;

