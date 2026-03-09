
import React from 'react';
import { Patient } from '../types';
import QRCodeCanvas from './QRCodeWithImage';
import { LogoIcon } from './icons/LogoIcon';
import { 
    DentalIcon, 
    GeneralPracticeIcon, 
    XRayIcon, 
    FolderIcon 
} from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface PrintableViewProps {
    patient: Patient;
    publicUrl: string;
}

const categoryIconsById: { [key: string]: React.FC<{className?: string}> } = {
  'cat_gen': GeneralPracticeIcon,
  'cat_den': DentalIcon,
  'cat_xray': XRayIcon,
  'cat_lab': FolderIcon,
  'cat_rx': FolderIcon,
  'cat_spec': FolderIcon,
};

const WalletCard: React.FC<PrintableViewProps> = ({ patient, publicUrl }) => {
    const { t } = useLanguage();
    return (
        <div className="w-[2.5in]">
            {/* Top Part: Patient Info */}
            <div className="p-2 border-2 border-black flex flex-col items-center text-center bg-white">
                <img 
                    src={patient.profileImageUrl} 
                    alt={patient.name} 
                    className="h-16 w-16 rounded-full object-cover mb-2" 
                />
                <h2 className="text-lg font-bold leading-tight">{patient.name}</h2>
                <p className="text-xs text-gray-800 mt-1">
                    {t('dob')}: {patient.dateOfBirth} | {t('bloodType')}: <span className="font-bold">{patient.bloodType}</span>
                </p>
            </div>

            {/* Bottom Part: QR Code */}
            <div className="p-2 border-2 border-black border-t-0 flex flex-col items-center text-center bg-white">
                <h3 className="text-sm font-bold">{t('patientQRCode')}</h3>
                <div className="bg-white">
                    {patient.customQrCodeImageUrl ? (
                        <img src={patient.customQrCodeImageUrl} alt="QR Code" style={{ width: 96, height: 96, objectFit: 'contain' }} />
                    ) : (
                        <QRCodeCanvas data={publicUrl} size={96} />
                    )}
                </div>
            </div>
        </div>
    );
};


const PrintableView: React.FC<PrintableViewProps> = ({ patient, publicUrl }) => {
    const { t } = useLanguage();
    
    return (
        <div className="font-sans text-black bg-white">
            <style>{`
                @media print {
                    @page {
                        size: letter portrait;
                        margin: 0.25in;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .avoid-break {
                        page-break-inside: avoid;
                    }
                }
            `}</style>
            <div id="printable-summary-page" className="w-full h-full p-2 border-2 border-black">
                {/* Header */}
                <header className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
                    <div className="flex items-center gap-3">
                        <LogoIcon className="h-10 w-10 text-black" />
                        <div>
                            <h1 className="text-2xl font-bold">{t('patientSummary')}</h1>
                        </div>
                    </div>
                     <p className="text-xs text-gray-600">{t('generatedOn')} {new Date().toLocaleDateString()}</p>
                </header>

                {/* Patient Information & Main QR Code Section */}
                <section className="flex justify-between items-start mb-4 pb-4 border-b-2 border-black">
                    <div className="flex items-center gap-4">
                         <img src={patient.profileImageUrl} alt={patient.name} className="h-28 w-28 rounded-full object-cover border-2 border-black flex-shrink-0" />
                        <div>
                            <h2 className="text-3xl font-bold">{patient.name}</h2>
                            <p className="text-md text-gray-800 mt-1"><strong>{t('dob')}:</strong> {patient.dateOfBirth}</p>
                            <p className="text-md text-gray-800"><strong>{t('bloodType')}:</strong> <span className="font-extrabold text-xl">{patient.bloodType}</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-1 rounded-sm border-2 border-black">
                             {patient.customQrCodeImageUrl ? (
                                 <img src={patient.customQrCodeImageUrl} alt="QR Code" style={{ width: 140, height: 140, objectFit: 'contain' }} />
                             ) : (
                                 <QRCodeCanvas data={publicUrl} size={140} />
                             )}
                        </div>
                        <p className="text-xs font-bold mt-1 max-w-[140px]">{t('scanForFullRecord')}</p>
                    </div>
                </section>
                
                {/* Categories Grid Section */}
                <main className="avoid-break">
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">
                        {t('directFolderAccess')}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {patient.medicalCategories.map((category) => {
                            const Icon = categoryIconsById[category.id] || FolderIcon;
                            const hasLink = category.cloudLink && category.cloudLink.trim() !== '';

                            return (
                                <div key={category.id} className={`p-2 border-2 ${hasLink ? 'border-black' : 'border-gray-300 border-dashed'} flex flex-col items-center text-center`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon className={`h-5 w-5 ${hasLink ? 'text-black' : 'text-gray-500'}`} />
                                      <p className="font-bold text-sm text-center h-10 flex items-center justify-center">{t(category.name as any)}</p>
                                    </div>
                                    
                                    {hasLink ? (
                                        <div className="flex flex-col items-center">
                                            <div className="bg-white p-1 rounded-sm">
                                                <QRCodeCanvas data={category.cloudLink!} size={90} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full h-[98px]">
                                            <p className="font-semibold text-xs">{t('noLinkProvided')}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>
                
                 {/* Wallet ID Card Section */}
                <section className="mt-4 pt-4 border-t-2 border-black avoid-break">
                    <div className="text-center mb-2">
                        <p className="text-sm font-semibold">{t('emergencyIdDesc')}</p>
                    </div>
                    <div className="flex justify-around gap-2">
                        <WalletCard patient={patient} publicUrl={publicUrl} />
                        <WalletCard patient={patient} publicUrl={publicUrl} />
                        <WalletCard patient={patient} publicUrl={publicUrl} />
                    </div>
                </section>

                <footer className="text-center text-xs text-gray-500 mt-4 pt-2 border-t border-gray-400">
                    {t('printableFooter')}
                </footer>
            </div>
        </div>
    );
};

export default PrintableView;