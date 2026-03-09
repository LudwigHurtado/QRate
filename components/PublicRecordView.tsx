

import React, { useEffect } from 'react';
import { Patient, MedicalCategory } from '../types';
// Fix: Corrected the import path for LogoIcon. It is exported from './icons/LogoIcon', not './icons/Icons'.
import { LogoIcon } from './icons/LogoIcon';
import { DentalIcon, GeneralPracticeIcon, XRayIcon, FolderIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface PublicRecordViewProps {
  patient: Patient | null;
}

const categoryIconsById: { [key:string]: React.FC<{className?: string}> } = {
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
         <div className={`flex flex-col items-center justify-center text-center p-4 border rounded-lg transition-all duration-200 ${hasLink ? 'bg-white shadow-sm hover:shadow-md hover:scale-105' : 'bg-slate-200 opacity-70 cursor-not-allowed'}`}>
            <div className={`p-4 rounded-full mb-3 ${hasLink ? 'bg-blue-100' : 'bg-slate-300'}`}>
                <Icon className={`h-10 w-10 ${hasLink ? 'text-blue-600' : 'text-slate-500'}`} />
            </div>
            <p className="font-semibold text-slate-800">{t(category.name as any)}</p>
        </div>
    );
    
    if (hasLink) {
        return (
            <a href={category.cloudLink} target="_blank" rel="noopener noreferrer" className="block">
                {content}
            </a>
        );
    }

    return <div title="No records available for this category">{content}</div>;
}


const PublicRecordView: React.FC<PublicRecordViewProps> = ({ patient }) => {
  const { t } = useLanguage();

  useEffect(() => {
    // If a patient exists and has a primary cloud link, redirect immediately.
    // This provides the fastest possible access for medical personnel in an emergency.
    if (patient?.cloudLink) {
      window.location.href = patient.cloudLink;
    }
  }, [patient]);


  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 p-4">
        <LogoIcon className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">{t('patientNotFound')}</h1>
        <p className="text-slate-600 mt-2">{t('patientNotFoundDesc')}</p>
      </div>
    );
  }
  
  // If a redirect is scheduled, show a loading/redirecting state.
  if (patient.cloudLink) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 p-4 text-center">
        <LogoIcon className="h-16 w-16 text-blue-500 animate-pulse mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">{t('redirecting')}</h1>
        <p className="text-slate-600 mt-2">
          {t('redirectingDesc')}
        </p>
        <p className="text-sm text-slate-500 mt-4">
            If you are not redirected automatically, <a href={patient.cloudLink} className="text-blue-600 underline" rel="noopener noreferrer">{t('clickHere')}</a>.
        </p>
      </div>
    );
  }

  // This view is the fallback if NO main cloudLink is set.
  // It allows access to individual category folders.
  return (
    <div className="bg-slate-100 min-h-screen">
        <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto py-4 px-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <LogoIcon className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-semibold text-slate-700">{t('secureRecord')}</span>
                </div>
                <div className="text-right">
                    <p className="font-bold text-slate-800 text-lg">{patient.name}</p>
                    <p className="text-sm text-slate-500">{t('dob')}: {patient.dateOfBirth} | {t('bloodType')}: {patient.bloodType}</p>
                </div>
            </div>
        </header>
        <main className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">{t('keyMedicalInfo')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-base">
                    <div>
                        <h3 className="font-semibold text-slate-500 uppercase text-sm tracking-wider">{t('allergies')}</h3>
                        <p className="mt-1 font-medium text-slate-900">{patient.allergies?.join(', ') || t('noneReported')}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-500 uppercase text-sm tracking-wider">{t('currentMedications')}</h3>
                        <p className="mt-1 font-medium text-slate-900">{patient.currentMedications?.join(', ') || t('noneReported')}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-500 uppercase text-sm tracking-wider">{t('lastKnownVisit')}</h3>
                        <p className="mt-1 font-medium text-slate-900">{patient.lastVisitDate || t('notRecorded')}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('medicalFolders')}</h2>
            <p className="text-slate-600 mb-6">{t('noMainFolder')}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {patient.medicalCategories.map(category => (
                   <CategoryCard key={category.id} category={category} />
               ))}
            </div>

            {patient.medicalCategories.every(c => !c.cloudLink) && (
              <div className="text-center py-12 px-6 bg-white rounded-lg shadow-md mt-6">
                <FolderIcon className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-3 font-medium text-slate-700">{t('noRecordsLinked')}</p>
              </div>
            )}
        </main>
    </div>
  );
};

export default PublicRecordView;
