
import React, { useState, useRef, useEffect } from 'react';
import { Patient, MedicalCategory } from '../types';
import { ChevronLeftIcon, PencilIcon, ShareIcon, PrinterIcon, CheckIcon, XIcon, DentalIcon, GeneralPracticeIcon, XRayIcon, FolderIcon, UploadIcon, GoogleDriveIcon, ExternalLinkIcon, PdfIcon, ImageIcon } from './icons/Icons';
import QRCodeCanvas from './QRCodeWithImage';
import GoogleDrivePickerModal from './GoogleDrivePickerModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../contexts/LanguageContext';

interface PatientProfileProps {
  patient: Patient;
  publicUrl: string;
  onBack: () => void;
  onUpdatePatient: (patientId: string, data: Partial<Omit<Patient, 'qrCodeData'>>) => void;
}

const categoryIconsById: { [key: string]: React.FC<{className?: string}> } = {
  'cat_gen': GeneralPracticeIcon,
  'cat_den': DentalIcon,
  'cat_xray': XRayIcon,
  'cat_lab': FolderIcon,
  'cat_rx': FolderIcon,
  'cat_spec': FolderIcon,
};

const CategoryCard: React.FC<{category: MedicalCategory}> = ({ category }) => {
    const { t } = useLanguage();
    const Icon = categoryIconsById[category.id] || FolderIcon;
    const hasLink = category.cloudLink && category.cloudLink.trim() !== '';

    const content = (
         <div className={`flex flex-col items-center justify-center text-center p-4 border rounded-lg transition-all duration-200 h-full ${hasLink ? 'bg-white shadow-sm hover:shadow-md hover:scale-105' : 'bg-slate-50 opacity-60'}`}>
            <div className={`p-3 rounded-full mb-3 ${hasLink ? 'bg-blue-100' : 'bg-slate-200'}`}>
                <Icon className={`h-8 w-8 ${hasLink ? 'text-blue-600' : 'text-slate-500'}`} />
            </div>
            <p className="font-semibold text-sm text-slate-700">{t(category.name as any)}</p>
        </div>
    );
    
    if (hasLink) {
        return (
            <a href={category.cloudLink} target="_blank" rel="noopener noreferrer" className="block h-full">
                {content}
            </a>
        );
    }

    return <div className="h-full">{content}</div>;
}


const PatientProfile: React.FC<PatientProfileProps> = ({ patient, publicUrl, onBack, onUpdatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(patient.name);
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(patient.dateOfBirth);
  const [editedBloodType, setEditedBloodType] = useState(patient.bloodType);
  const [editedCloudLink, setEditedCloudLink] = useState(patient.cloudLink || '');
  const [editedCategories, setEditedCategories] = useState<MedicalCategory[]>(JSON.parse(JSON.stringify(patient.medicalCategories)));
  const [editedAllergies, setEditedAllergies] = useState<string>(patient.allergies?.join(', ') || '');
  const [editedCurrentMedications, setEditedCurrentMedications] = useState<string>(patient.currentMedications?.join(', ') || '');
  const [editedLastVisitDate, setEditedLastVisitDate] = useState<string>(patient.lastVisitDate || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCodeInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [drivePickerState, setDrivePickerState] = useState<{isOpen: boolean; categoryIndex: number | null}>({ isOpen: false, categoryIndex: null });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { t } = useLanguage();

  // This effect synchronizes the component's internal state with the `patient` prop.
  // This is crucial for ensuring that after a save, the local state reflects the newly updated data.
  useEffect(() => {
    setEditedName(patient.name);
    setEditedDateOfBirth(patient.dateOfBirth);
    setEditedBloodType(patient.bloodType);
    setEditedCloudLink(patient.cloudLink || '');
    setEditedCategories(JSON.parse(JSON.stringify(patient.medicalCategories)));
    setEditedAllergies(patient.allergies?.join(', ') || '');
    setEditedCurrentMedications(patient.currentMedications?.join(', ') || '');
    setEditedLastVisitDate(patient.lastVisitDate || '');
  }, [patient]);

  const handleSave = () => {
    if (!editedName.trim()) {
        alert("Patient name cannot be empty.");
        return;
    }
    onUpdatePatient(patient.id, {
        name: editedName,
        dateOfBirth: editedDateOfBirth,
        bloodType: editedBloodType,
        cloudLink: editedCloudLink,
        medicalCategories: editedCategories,
        allergies: editedAllergies.split(',').map(s => s.trim()).filter(Boolean),
        currentMedications: editedCurrentMedications.split(',').map(s => s.trim()).filter(Boolean),
        lastVisitDate: editedLastVisitDate,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // The useEffect will now handle resetting the state from the `patient` prop
  };

  const handleShare = async () => {
      if (!publicUrl.startsWith('http')) {
        alert(`Cannot share due to an error: ${publicUrl}`);
        return;
      }
      const shareData = {
        title: `Medical Record for ${patient.name}`,
        text: `Access the secure medical records for ${patient.name} via this link.`,
        url: publicUrl,
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(publicUrl);
          alert('Link copied to clipboard!');
        }
      } catch (err) {
        console.error('Share failed:', err);
        alert('Could not share. Link copied to clipboard instead.');
        await navigator.clipboard.writeText(publicUrl);
      }
  };
  
  const handleCategoryLinkChange = (index: number, value: string) => {
    const updatedCategories = [...editedCategories];
    updatedCategories[index].cloudLink = value;
    setEditedCategories(updatedCategories);
  };
  
  const handleDriveFileSelect = (fileUrl: string) => {
    if (drivePickerState.categoryIndex !== null) {
      handleCategoryLinkChange(drivePickerState.categoryIndex, fileUrl);
    }
  };

  const handleDownloadPdf = async () => {
    const printableArea = document.getElementById('printable-area');
    const summaryPage = document.getElementById('printable-summary-page');

    if (!printableArea || !summaryPage) {
        alert('Error: Could not find printable content.');
        return;
    }

    setIsGeneratingPdf(true);
    try {
        // Temporarily make the parent container visible for capture
        printableArea.style.display = 'block';
        window.scrollTo(0, 0);

        const canvas = await html2canvas(summaryPage, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        // Hide the container again
        printableArea.style.display = '';

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const canvasAspectRatio = canvas.width / canvas.height;
        const imgHeight = (pdfWidth - 10) / canvasAspectRatio;

        pdf.addImage(imgData, 'PNG', 5, 5, pdfWidth - 10, imgHeight);
        pdf.save(`${patient.name.replace(/\s/g, '_')}_Medical_Record.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert('An error occurred while generating the PDF.');
    } finally {
        setIsGeneratingPdf(false);
        printableArea.style.display = '';
    }
  };

  // --- Image Upload Logic ---
  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdatePatient(patient.id, { profileImageUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleQrCodeUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdatePatient(patient.id, { customQrCodeImageUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
  };

  const handleQrCodeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleQrCodeUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };


  return (
    <>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-800 mb-4">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          {t('backToDashboard')}
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile & QR Code */}
          <div className="md:col-span-1 flex flex-col items-center text-center">
             <div 
                className="relative group w-32 h-32 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                />
                <img src={patient.profileImageUrl} alt={patient.name} className={`h-32 w-32 rounded-full object-cover mb-4 ring-4 ring-blue-100 transition-all ${isDragging ? 'ring-blue-500 scale-105' : 'group-hover:ring-blue-200'}`} />
                 <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center text-white opacity-0 ${isDragging ? 'opacity-100' : 'group-hover:opacity-100'} transition-opacity`}>
                    {isDragging ? (
                        <UploadIcon className="h-8 w-8"/>
                    ) : (
                        <>
                            <UploadIcon className="h-6 w-6"/>
                            <span className="text-xs mt-1 font-semibold">{t('changePhoto')}</span>
                        </>
                    )}
                </div>
            </div>
            
            {isEditing ? (
                 <div className="w-full max-w-sm mt-2 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 text-left">{t('fullName')}</label>
                        <input type="text" id="name" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-slate-700 text-left">{t('dateOfBirth')}</label>
                            <input type="date" id="dob" value={editedDateOfBirth} onChange={(e) => setEditedDateOfBirth(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="bloodType" className="block text-sm font-medium text-slate-700 text-left">{t('bloodType')}</label>
                            <select id="bloodType" value={editedBloodType} onChange={(e) => setEditedBloodType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="cloudlink" className="block text-sm font-medium text-slate-700 text-left">{t('mainCloudLink')}</label>
                        <input type="url" id="cloudlink" value={editedCloudLink} onChange={(e) => setEditedCloudLink(e.target.value)} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="border-t pt-4 space-y-4">
                        <div>
                            <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 text-left">{t('allergies')}</label>
                            <input type="text" id="allergies" value={editedAllergies} onChange={(e) => setEditedAllergies(e.target.value)} placeholder="e.g., Penicillin, Aspirin" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <p className="text-xs text-slate-500 mt-1">{t('separateWithCommas')}</p>
                        </div>
                        <div>
                            <label htmlFor="medications" className="block text-sm font-medium text-slate-700 text-left">{t('currentMedications')}</label>
                            <input type="text" id="medications" value={editedCurrentMedications} onChange={(e) => setEditedCurrentMedications(e.target.value)} placeholder="e.g., Lisinopril 10mg" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <p className="text-xs text-slate-500 mt-1">{t('separateWithCommas')}</p>
                        </div>
                        <div>
                            <label htmlFor="lastvisit" className="block text-sm font-medium text-slate-700 text-left">{t('lastVisitDate')}</label>
                            <input type="date" id="lastvisit" value={editedLastVisitDate} onChange={(e) => setEditedLastVisitDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-2 mt-4">
                        <h2 className="text-3xl font-bold text-slate-900">{patient.name}</h2>
                        <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><PencilIcon className="h-5 w-5" /></button>
                    </div>
                    <p className="text-slate-500">{t('dob')}: {patient.dateOfBirth} | {t('bloodType')}: {patient.bloodType}</p>
                    {patient.cloudLink && (
                        <a href={patient.cloudLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                            <FolderIcon className="h-5 w-5" />
                            <span>{t('viewMainCloud')}</span>
                        </a>
                    )}
                </>
            )}
            
            <div className="mt-8 bg-slate-50 p-4 rounded-lg w-full max-w-xs">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('patientQRCode')}</h3>

              <div className="flex flex-col items-center">
                <div className="relative group w-48 h-48 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-slate-200 overflow-hidden">
                    {patient.customQrCodeImageUrl ? (
                        <img src={patient.customQrCodeImageUrl} alt="Custom QR Code" className="w-full h-full object-contain" />
                    ) : (
                        <QRCodeCanvas key={publicUrl} data={publicUrl} size={180} />
                    )}
                    
                    <button 
                        onClick={() => qrCodeInputRef.current?.click()}
                        className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title={patient.customQrCodeImageUrl ? t('changeQRCode') : t('uploadQRCode')}
                    >
                        <UploadIcon className="h-8 w-8" />
                        <span className="text-xs mt-1 font-semibold">{patient.customQrCodeImageUrl ? t('changeQRCode') : t('uploadQRCode')}</span>
                    </button>
                    <input type="file" ref={qrCodeInputRef} onChange={handleQrCodeFileSelect} className="hidden" accept="image/*" />
                </div>
                
                {patient.customQrCodeImageUrl && (
                    <button 
                        onClick={() => onUpdatePatient(patient.id, { customQrCodeImageUrl: undefined })}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                        {t('useGeneratedQRCode')}
                    </button>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-3">{t('qrScanInstruction')}</p>
               <div className="mt-4 grid grid-cols-2 gap-2">
                    <button 
                        onClick={handleShare} 
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                        <ShareIcon className="h-5 w-5"/> {t('share')}
                    </button>
                    <button 
                        onClick={() => {
                            if (publicUrl.startsWith('http')) {
                                window.open(publicUrl, '_blank');
                            } else {
                                alert(`Cannot open files due to an error: ${publicUrl}`);
                            }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-sm border border-slate-300"
                        title="Open the public record files in a new tab"
                    >
                        <ExternalLinkIcon className="h-5 w-5"/> {t('files')}
                    </button>
                    <button 
                        onClick={() => window.print()} 
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm">
                        <PrinterIcon className="h-5 w-5"/> {t('print')}
                    </button>
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={isGeneratingPdf}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:bg-red-400">
                        {isGeneratingPdf ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <PdfIcon className="h-5 w-5"/>
                        )}
                        {isGeneratingPdf ? t('generating') : t('pdf')}
                    </button>
               </div>
            </div>
          </div>
          
          {/* Right Column: Medical Categories */}
          <div className="md:col-span-2">
            {isEditing ? (
                 <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{t('editMedicalFolders')}</h3>
                        <p className="text-sm text-slate-500 mt-1">{t('editFoldersInstruction')}</p>
                    </div>
                    <div className="space-y-4">
                        {editedCategories.map((category, index) => (
                            <div key={category.id}>
                                <label htmlFor={`category-${category.id}`} className="block text-sm font-medium text-slate-700 mb-1">{t(category.name as any)}</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="url" 
                                        id={`category-${category.id}`} 
                                        value={category.cloudLink}
                                        onChange={(e) => handleCategoryLinkChange(index, e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setDrivePickerState({ isOpen: true, categoryIndex: index })}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-sm border border-slate-300 shadow-sm"
                                        aria-label={`Browse Google Drive for ${t(category.name as any)}`}
                                    >
                                        <GoogleDriveIcon className="h-5 w-5"/>
                                        <span className="hidden sm:inline">{t('browse')}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-start space-x-3 pt-4 border-t">
                        <button onClick={handleSave} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"><CheckIcon className="h-5 w-5 mr-1.5"/>{t('saveAllChanges')}</button>
                        <button onClick={handleCancelEdit} className="inline-flex items-center px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"><XIcon className="h-5 w-5 mr-1.5"/>{t('cancel')}</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-3">{t('medicalSummary')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-slate-600">{t('allergies')}</h4>
                                <p className="text-slate-800">{patient.allergies?.join(', ') || t('noneReported')}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-600">{t('currentMedications')}</h4>
                                <p className="text-slate-800">{patient.currentMedications?.join(', ') || t('noneReported')}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-600">{t('lastVisitDate')}</h4>
                                <p className="text-slate-800">{patient.lastVisitDate || t('notRecorded')}</p>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('medicalFolders')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                        {patient.medicalCategories.map(category => (
                             <div key={category.id} className="flex flex-col items-center text-center">
                                <div className="w-full">
                                    <CategoryCard category={category} />
                                </div>
                                {category.cloudLink && (
                                <div className="mt-3 text-center">
                                    <p className="text-xs text-slate-500 mb-1 font-semibold">{t('scanFor', { categoryName: t(category.name as any) })}</p>
                                    <div className="p-1 bg-white rounded-md shadow-md inline-block">
                                    <QRCodeCanvas data={category.cloudLink} size={80} />
                                    </div>
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <GoogleDrivePickerModal 
        isOpen={drivePickerState.isOpen}
        onClose={() => setDrivePickerState({ isOpen: false, categoryIndex: null })}
        onFileSelect={handleDriveFileSelect}
    />
    </>
  );
};

export default PatientProfile;
