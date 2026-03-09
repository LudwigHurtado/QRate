import React, { useEffect, useRef, useState } from 'react';
import { Patient, QrCodeInventoryItem } from '../types';
import { ChevronLeftIcon, QrCodeIcon, UploadIcon, UserIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface AssignPrePrintedQRProps {
  patients: Patient[];
  qrInventory: QrCodeInventoryItem[];
  onBack: () => void;
  onAssignToExisting: (patientId: string, token: string, assignedBy?: string) => void;
  onCreateAndAssign: (
    patientData: Omit<Patient, 'id' | 'medicalCategories' | 'qrCodeData'>,
    token: string,
    assignedBy?: string
  ) => void;
}

type Mode = 'existing' | 'new';

const AssignPrePrintedQR: React.FC<AssignPrePrintedQRProps> = ({
  patients,
  qrInventory,
  onBack,
  onAssignToExisting,
  onCreateAndAssign,
}) => {
  const { t } = useLanguage();
  const [token, setToken] = useState('');
  const [mode, setMode] = useState<Mode>('existing');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [assignedBy, setAssignedBy] = useState('');

  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newBloodType, setNewBloodType] = useState('A+');
  const [newImage, setNewImage] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const canUseCameraScan =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    // BarcodeDetector is not available in all browsers
    // we check for presence and gracefully fall back to manual entry.
    'BarcodeDetector' in window;

  const stopScan = () => {
    setIsScanning(false);
    setScanError(null);
    if (scanIntervalRef.current !== null) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    const video = videoRef.current;
    if (video && video.srcObject instanceof MediaStream) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const startScan = async () => {
    if (!canUseCameraScan) {
      setScanError(t('cameraNotSupported'));
      return;
    }
    try {
      setScanError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      video.srcObject = stream;
      await video.play();

      const BarcodeDetectorCtor = (window as any).BarcodeDetector;
      const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });

      const captureFrame = async () => {
        if (!videoRef.current || videoRef.current.readyState !== HTMLVideoElement.HAVE_ENOUGH_DATA) {
          return;
        }
        const width = videoRef.current.videoWidth || 640;
        const height = videoRef.current.videoHeight || 480;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        try {
          const barcodes = await detector.detect(canvas);
          if (barcodes && barcodes.length > 0) {
            const value = (barcodes[0] as any).rawValue || '';
            if (value) {
              setToken(value.trim());
              stopScan();
            }
          }
        } catch (err) {
          console.error('QR detect error', err);
        }
      };

      setIsScanning(true);
      scanIntervalRef.current = window.setInterval(captureFrame, 700);
    } catch (err) {
      console.error('Could not start camera', err);
      setScanError(t('cameraPermissionDenied'));
      stopScan();
    }
  };

  useEffect(() => {
    return () => {
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      alert(t('assignQrEnterToken'));
      return;
    }

    if (mode === 'existing') {
      if (!selectedPatientId) {
        alert(t('assignQrSelectMember'));
        return;
      }
      onAssignToExisting(selectedPatientId, trimmedToken, assignedBy || undefined);
      setToken('');
    } else {
      if (!newName || !newDob) {
        alert(t('assignQrFillNewMember'));
        return;
      }
      onCreateAndAssign(
        {
          name: newName,
          dateOfBirth: newDob,
          bloodType: newBloodType,
          profileImageUrl: newImage || `https://i.pravatar.cc/150?u=${Date.now()}`,
        },
        trimmedToken,
        assignedBy || undefined
      );
      setToken('');
      setNewName('');
      setNewDob('');
      setNewBloodType('A+');
      setNewImage(null);
      setMode('existing');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const assignedCount = qrInventory.filter(q => q.status === 'assigned').length;
  const unassignedCount = qrInventory.filter(q => q.status === 'unassigned').length;

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
                {t('assignPrePrintedQrTitle')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('assignPrePrintedQrSubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 md:p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    {t('assignQrStep1')}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {t('assignQrStep1Desc')}
                  </p>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      {t('assignQrTokenLabel')}
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      placeholder="QR-8F2A19XK"
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        type="button"
                        onClick={isScanning ? stopScan : startScan}
                        disabled={!canUseCameraScan}
                        className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-xs font-medium ${
                          canUseCameraScan
                            ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        }`}
                        title={canUseCameraScan ? undefined : t('cameraNotSupported')}
                      >
                        <QrCodeIcon className="h-4 w-4" />
                        {isScanning ? t('stopCameraScan') : t('assignQrScanWithCamera')}
                      </button>
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-400 cursor-not-allowed"
                        title={t('comingSoon')}
                      >
                        <UploadIcon className="h-4 w-4" />
                        {t('assignQrUploadImage')}
                      </button>
                    </div>
                    {isScanning && (
                      <div className="mt-4 rounded-lg border border-slate-300 bg-black/90 p-2 flex flex-col items-center">
                        <video
                          ref={videoRef}
                          className="w-full max-w-xs rounded-md border border-slate-700"
                          playsInline
                          muted
                        />
                        <p className="mt-2 text-[11px] text-slate-200 text-center">
                          {t('cameraScanHint')}
                        </p>
                      </div>
                    )}
                    {scanError && (
                      <p className="mt-2 text-xs text-red-600">
                        {scanError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {t('assignQrStep2')}
                    </h3>
                    <div className="inline-flex rounded-md border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() => setMode('existing')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-l-md ${
                          mode === 'existing'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t('assignQrExistingMember')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('new')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-r-md ${
                          mode === 'new'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t('assignQrNewMember')}
                      </button>
                    </div>
                  </div>

                  {mode === 'existing' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('assignQrSelectLabel')}
                        </label>
                        <select
                          value={selectedPatientId}
                          onChange={e => setSelectedPatientId(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">{t('assignQrSelectPlaceholder')}</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.dateOfBirth ? `(${p.dateOfBirth})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      {selectedPatientId && (
                        <p className="text-xs text-slate-500">
                          {t('assignQrExistingHint')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white">
                          {newImage ? (
                            <img
                              src={newImage}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-full w-full text-slate-300" />
                          )}
                        </span>
                        <label className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-xs leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          {t('upload')}
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          {t('fullName')}
                        </label>
                        <input
                          type="text"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            {t('dateOfBirth')}
                          </label>
                          <input
                            type="date"
                            value={newDob}
                            onChange={e => setNewDob(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            {t('bloodType')}
                          </label>
                          <select
                            value={newBloodType}
                            onChange={e => setNewBloodType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                              <option key={bt} value={bt}>
                                {bt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        {t('assignQrSoldByLabel')}
                      </label>
                      <input
                        type="text"
                        value={assignedBy}
                        onChange={e => setAssignedBy(e.target.value)}
                        placeholder={t('assignQrSoldByPlaceholder')}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors text-sm font-medium"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {t('assignQrPrimaryCta')}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <aside className="space-y-4">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  {t('assignQrInventorySummary')}
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  {t('assignQrInventorySummaryDesc')}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('assignQrAssignedCount')}</span>
                    <span className="font-semibold text-slate-900">{assignedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('assignQrUnassignedCount')}</span>
                    <span className="font-semibold text-slate-900">{unassignedCount}</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-xs text-blue-900 space-y-2">
                <p className="font-semibold">
                  {t('assignQrTipTitle')}
                </p>
                <p>{t('assignQrTipBody')}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPrePrintedQR;

