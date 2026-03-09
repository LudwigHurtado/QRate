
import React from 'react';
import { GoogleDriveIcon, XIcon, PdfIcon, ImageIcon, DocumentTextIcon } from './icons/Icons';

interface GoogleDrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (fileUrl: string) => void;
}

const MOCK_FILES = [
  { name: 'Lab_Results_Oct2023.pdf', type: 'pdf', url: 'https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZaB123/view?usp=sharing' },
  { name: 'X-Ray_Scan_L-Spine.jpg', type: 'image', url: 'https://drive.google.com/file/d/2bCdEfGhIjKlMnOpQrStUvWxYzA1234b/view?usp=sharing' },
  { name: 'Consultation_Notes_Dr_Anya.pdf', type: 'pdf', url: 'https://drive.google.com/file/d/3cDeFgHiJkLmNoPqRsTuVwXyZaB1234c/view?usp=sharing' },
  { name: 'Prescription_Details.txt', type: 'doc', url: 'https://drive.google.com/file/d/4dEfGhIjKlMnOpQrStUvWxYzA1234b/view?usp=sharing' },
  { name: 'Dental_Imaging_2024.jpg', type: 'image', url: 'https://drive.google.com/file/d/5eFgHiJkLmNoPqRsTuVwXyZaB1234e/view?usp=sharing' },
];

const FileIcon: React.FC<{type: string}> = ({ type }) => {
    switch (type) {
        case 'pdf': return <PdfIcon className="h-6 w-6 text-red-600 flex-shrink-0" />;
        case 'image': return <ImageIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />;
        default: return <DocumentTextIcon className="h-6 w-6 text-slate-500 flex-shrink-0" />;
    }
}

const GoogleDrivePickerModal: React.FC<GoogleDrivePickerModalProps> = ({ isOpen, onClose, onFileSelect }) => {
  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onFileSelect(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col m-4">
        <header className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GoogleDriveIcon className="h-6 w-6 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">Select a file from Google Drive</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
            <XIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {MOCK_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => handleSelect(file.url)}
                className="w-full flex items-center gap-4 p-3 rounded-md hover:bg-slate-100 text-left transition-colors"
              >
                <FileIcon type={file.type} />
                <span className="text-sm font-medium text-slate-700">{file.name}</span>
              </button>
            ))}
          </div>
        </main>

        <footer className="p-4 bg-slate-50 border-t flex justify-end items-center space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors text-sm font-medium">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default GoogleDrivePickerModal;
