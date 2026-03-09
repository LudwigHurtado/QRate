
import React, { useState } from 'react';
import { Patient } from '../types';
import PatientCard from './PatientCard';
import { PlusIcon, UserIcon, GoogleLoginIcon, CloudDownloadIcon, LogoutIcon, CheckIcon, XIcon, AppleIcon, MailIcon, GoogleDriveIcon, SparklesIcon } from './icons/Icons';
import AddPatientModal from './AddPatientModal';
import EmailSignInModal from './EmailSignInModal';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (patient: Omit<Patient, 'id' | 'medicalCategories' | 'qrCodeData'>) => void;
  isSignedIn: boolean;
  isBusy: boolean;
  lastBackup: string | null;
  backupStatus: 'idle' | 'saving' | 'saved' | 'error';
  onSignIn: () => void;
  onSignOut: () => void;
  onRestore: () => void;
  onLoadDemoData: () => void;
}

const DriveManager: React.FC<Pick<DashboardProps, 'isBusy' | 'lastBackup' | 'backupStatus' | 'onRestore'>> =
 ({ isBusy, lastBackup, backupStatus, onRestore }) => {
    const { t } = useLanguage();
    
    const StatusIndicator: React.FC = () => {
        switch (backupStatus) {
            case 'saving':
                return (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>{t('savingChanges')}</span>
                    </div>
                );
            case 'saved':
                return (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <CheckIcon className="h-5 w-5" />
                        <span>{t('allChangesSaved')}</span>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                        <XIcon className="h-5 w-5" />
                        <span>{t('backupFailed')}</span>
                    </div>
                );
            case 'idle':
            default:
                 return (
                    <p className="text-xs text-slate-500">
                        {lastBackup ? `${t('lastBackup')} ${new Date(lastBackup).toLocaleString()}` : 'Your data will be backed up automatically.'}
                    </p>
                );
        }
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                    <GoogleDriveIcon className="h-8 w-8 text-slate-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-slate-800">{t('googleDriveBackup')}</p>
                        <StatusIndicator />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                     <button
                        onClick={() => window.open('https://drive.google.com/', '_blank')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-sm border border-slate-300 shadow-sm"
                        aria-label="Open Google Drive in a new tab"
                    >
                       <GoogleDriveIcon className="h-5 w-5 text-[#1DA561]"/>
                       <span className="hidden sm:inline">{t('openDrive')}</span>
                    </button>
                     <button onClick={onRestore} disabled={isBusy} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm disabled:bg-slate-400">
                       <CloudDownloadIcon className="h-5 w-5"/>
                       <span className="hidden sm:inline">{t('restore')}</span>
                    </button>
                </div>
            </div>
        </div>
    )
 }
 
 const AuthControls: React.FC<Pick<DashboardProps, 'isSignedIn' | 'onSignIn' | 'onSignOut'> & { onEmailClick: () => void }> = ({ isSignedIn, onSignIn, onSignOut, onEmailClick }) => {
     const { t } = useLanguage();
     
     if (isSignedIn) {
         return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <GoogleLoginIcon className="h-6 w-6" />
                    <span className="text-sm font-medium text-slate-600 hidden sm:inline pr-2">{t('signedIn')}</span>
                </div>
                <button
                    onClick={onSignOut}
                    className="inline-flex items-center justify-center rounded-md border border-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <LogoutIcon className="h-5 w-5 sm:mr-2 text-slate-500" />
                    <span className="hidden sm:inline">{t('signOut')}</span>
                </button>
            </div>
         )
     }

     return (
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <button onClick={onSignIn} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-sm border border-slate-300 shadow-sm font-medium">
                <GoogleLoginIcon className="h-5 w-5"/>
                <span>{t('connectToGoogle')}</span>
            </button>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md border border-slate-200">
                 <button onClick={() => alert('Apple Sign-in coming soon!')} title="Sign in with Apple" className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition-colors">
                    <AppleIcon className="h-5 w-5"/>
                </button>
                 <button onClick={onEmailClick} title="Sign in with Email" className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition-colors">
                    <MailIcon className="h-5 w-5"/>
                </button>
            </div>
        </div>
     );
 };


const Dashboard: React.FC<DashboardProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { patients, onSelectPatient, onAddPatient, isSignedIn, onLoadDemoData } = props;
  const { t } = useLanguage();

  const handleEmailSignIn = (email: string) => {
    console.log(`Simulating sign-in for: ${email}`);
    props.onSignIn();
    setIsEmailModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-800">{t('familyMembers')}</h2>
            <div className="flex items-center gap-3">
                <AuthControls {...props} onEmailClick={() => setIsEmailModalOpen(true)} />
                 <div className="h-8 w-px bg-slate-200"></div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-10"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('addMember')}
                </button>
            </div>
        </div>
        
        <div className="mb-8">
             {isSignedIn && <DriveManager {...props} />}
        </div>

        {patients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map(patient => (
                    <PatientCard key={patient.id} patient={patient} onSelect={onSelectPatient} />
                ))}
            </div>
        ) : (
            <div className="text-center bg-white rounded-lg shadow-md p-12 border-2 border-dashed border-slate-300">
                <UserIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium text-slate-900">{t('noFamilyMembers')}</h3>
                <p className="mt-1 text-sm text-slate-500">{t('getStarted')}</p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                         <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {t('addNewMember')}
                    </button>
                    <button
                        onClick={onLoadDemoData}
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                         <SparklesIcon className="-ml-1 mr-2 h-5 w-5 text-yellow-500" aria-hidden="true" />
                        {t('loadDemoData')}
                    </button>
                </div>
            </div>
        )}
      </div>
      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPatient={onAddPatient} />
      <EmailSignInModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSignIn={handleEmailSignIn}
      />
    </div>
  );
};

export default Dashboard;
