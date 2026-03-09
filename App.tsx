

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FamilyAccount, Patient, MedicalCategory, QrCodeInventoryItem } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';
import PublicRecordView from './components/PublicRecordView';
import Toast from './components/Toast';
import PrintableView from './components/PrintableView';
import { useLanguage } from './contexts/LanguageContext';
import AssignPrePrintedQR from './components/AssignPrePrintedQR';
import GenerateQrBatch from './components/GenerateQrBatch.tsx';
import { notifyAssignmentToServer, notifyBatchCreatedToServer } from './services/remoteInventoryApi';

const DEFAULT_CATEGORIES: Omit<MedicalCategory, 'cloudLink'>[] = [
    { id: 'cat_gen', name: 'category_general_practice' },
    { id: 'cat_den', name: 'category_dental' },
    { id: 'cat_xray', name: 'category_xrays' },
    { id: 'cat_lab', name: 'category_lab' },
    { id: 'cat_rx', name: 'category_rx' },
    { id: 'cat_spec', name: 'category_spec' },
];

const generatePublicDataJson = (patientData: Omit<Patient, 'id' | 'profileImageUrl' | 'qrCodeData'>): string => {
    const publicData = {
        name: patientData.name,
        dateOfBirth: patientData.dateOfBirth,
        bloodType: patientData.bloodType,
        medicalCategories: patientData.medicalCategories,
        cloudLink: patientData.cloudLink || '',
        allergies: patientData.allergies || [],
        currentMedications: patientData.currentMedications || [],
        lastVisitDate: patientData.lastVisitDate || '',
    };
    return JSON.stringify(publicData);
};

const generatePublicUrlForQRCode = (patient: Patient): string => {
    // PRIORITIZE direct link to cloud storage for fastest access.
    if (patient.cloudLink && patient.cloudLink.startsWith('http')) {
      return patient.cloudLink;
    }

    // Fallback to the app's public view if no main cloud link is set.
    if (!patient.qrCodeData) {
        return 'Error: No QR data available. Please update QR code.';
    }
    try {
        const encodedData = encodeURIComponent(patient.qrCodeData);
        
        // Robustly determine the base path for the URL.
        const path = window.location.pathname;
        const basePath = path.endsWith('/index.html') ? path.substring(0, path.lastIndexOf('/') + 1) : path;
        const publicUrl = `${window.location.origin}${basePath}#/view/${encodedData}`;
        
        if (publicUrl.length > 4000) { // A generous limit for QR codes
            console.error("Data is too large to be reliably encoded in a QR code.");
            return 'Error: Patient data is too large.';
        }

        return publicUrl;
    } catch (e) {
        console.error("Error generating public URL:", e);
        return 'Error: Could not generate QR code data.';
    }
};


const MOCK_DATA: FamilyAccount = {
  id: 'fam_123',
  familyName: 'Quispe Family',
  patients: [
    {
      id: 'pat_001',
      name: 'Dad (Carlos Quispe)',
      dateOfBirth: '1978-05-20',
      bloodType: 'O+',
      profileImageUrl: 'https://images.pexels.com/photos/4270088/pexels-photo-4270088.jpeg?auto=compress&cs=tinysrgb&w=300',
      cloudLink: 'https://drive.google.com/drive/u/0/folders/1JU3vtNjaOb9_TpRpka96xLemSkz8xmTU',
      medicalCategories: [
         { id: 'cat_gen', name: 'category_general_practice', cloudLink: 'https://drive.google.com/drive/u/0/folders/1JU3vtNjaOb9_TpRpka96xLemSkz8xmTU' },
         { id: 'cat_den', name: 'category_dental', cloudLink: '' },
         { id: 'cat_xray', name: 'category_xrays', cloudLink: 'https://drive.google.com/drive/u/0/folders/1JU3vtNjaOb9_TpRpka96xLemSkz8xmTU' },
         { id: 'cat_lab', name: 'category_lab', cloudLink: '' },
         { id: 'cat_rx', name: 'category_rx', cloudLink: '' },
         { id: 'cat_spec', name: 'category_spec', cloudLink: '' },
      ],
      qrCodeData: "{\"name\":\"Dad (Carlos Quispe)\",\"dateOfBirth\":\"1978-05-20\",\"bloodType\":\"O+\",\"medicalCategories\":[{\"id\":\"cat_gen\",\"name\":\"category_general_practice\",\"cloudLink\":\"https://drive.google.com/drive/u/0/folders/1JU3vtNjaOb9_TpRpka96xLemSkz8xmTU\"},{\"id\":\"cat_den\",\"name\":\"category_dental\",\"cloudLink\":\"\"},{\"id\":\"cat_xray\",\"name\":\"category_xrays\",\"cloudLink\":\"https://drive.google.com/drive/u/0/folders/1JU3vtNjaOb9_TpRpka96xLemSkz8xmTU\"},{\"id\":\"cat_lab\",\"name\":\"category_lab\",\"cloudLink\":\"\"},{\"id\":\"cat_rx\",\"name\":\"category_rx\",\"cloudLink\":\"\"},{\"id\":\"cat_spec\",\"name\":\"category_spec\",\"cloudLink\":\"\"}],\"cloudLink\":\"https://drive.google.com/drive/u/0/folders/1JU3vtNjaOb9_TpRpka96xLemSkz8xmTU\"}",
      allergies: ['Penicillin', 'Aspirin'],
      currentMedications: ['Lisinopril 10mg', 'Metformin 500mg'],
      lastVisitDate: '2024-05-15',
    },
     {
      id: 'pat_002',
      name: 'Mom (Maria Flores)',
      dateOfBirth: '1982-11-10',
      bloodType: 'A+',
      profileImageUrl: 'https://images.pexels.com/photos/5407054/pexels-photo-5407054.jpeg?auto=compress&cs=tinysrgb&w=300',
      medicalCategories: DEFAULT_CATEGORIES.map(cat => ({...cat, cloudLink: ''})),
      qrCodeData: "{\"name\":\"Mom (Maria Flores)\",\"dateOfBirth\":\"1982-11-10\",\"bloodType\":\"A+\",\"medicalCategories\":[{\"id\":\"cat_gen\",\"name\":\"category_general_practice\",\"cloudLink\":\"\"},{\"id\":\"cat_den\",\"name\":\"category_dental\",\"cloudLink\":\"\"},{\"id\":\"cat_xray\",\"name\":\"category_xrays\",\"cloudLink\":\"\"},{\"id\":\"cat_lab\",\"name\":\"category_lab\",\"cloudLink\":\"\"},{\"id\":\"cat_rx\",\"name\":\"category_rx\",\"cloudLink\":\"\"},{\"id\":\"cat_spec\",\"name\":\"category_spec\",\"cloudLink\":\"\"}],\"cloudLink\":\"\"}",
      allergies: [],
      currentMedications: [],
    },
    {
      id: 'pat_003',
      name: 'Son (Mateo Quispe)',
      dateOfBirth: '2010-02-15',
      bloodType: 'B+',
      profileImageUrl: 'https://images.pexels.com/photos/5997992/pexels-photo-5997992.jpeg?auto=compress&cs=tinysrgb&w=300',
      medicalCategories: DEFAULT_CATEGORIES.map(cat => ({...cat, cloudLink: ''})),
      qrCodeData: "{\"name\":\"Son (Mateo Quispe)\",\"dateOfBirth\":\"2010-02-15\",\"bloodType\":\"B+\",\"medicalCategories\":[{\"id\":\"cat_gen\",\"name\":\"category_general_practice\",\"cloudLink\":\"\"},{\"id\":\"cat_den\",\"name\":\"category_dental\",\"cloudLink\":\"\"},{\"id\":\"cat_xray\",\"name\":\"category_xrays\",\"cloudLink\":\"\"},{\"id\":\"cat_lab\",\"name\":\"category_lab\",\"cloudLink\":\"\"},{\"id\":\"cat_rx\",\"name\":\"category_rx\",\"cloudLink\":\"\"},{\"id\":\"cat_spec\",\"name\":\"category_spec\",\"cloudLink\":\"\"}],\"cloudLink\":\"\"}"
    },
    {
      id: 'pat_004',
      name: 'Daughter (Sofia Quispe)',
      dateOfBirth: '2014-09-01',
      bloodType: 'O-',
      profileImageUrl: 'https://images.pexels.com/photos/4145703/pexels-photo-4145703.jpeg?auto=compress&cs=tinysrgb&w=300',
      medicalCategories: DEFAULT_CATEGORIES.map(cat => ({...cat, cloudLink: ''})),
      qrCodeData: "{\"name\":\"Daughter (Sofia Quispe)\",\"dateOfBirth\":\"2014-09-01\",\"bloodType\":\"O-\",\"medicalCategories\":[{\"id\":\"cat_gen\",\"name\":\"category_general_practice\",\"cloudLink\":\"\"},{\"id\":\"cat_den\",\"name\":\"category_dental\",\"cloudLink\":\"\"},{\"id\":\"cat_xray\",\"name\":\"category_xrays\",\"cloudLink\":\"\"},{\"id\":\"cat_lab\",\"name\":\"category_lab\",\"cloudLink\":\"\"},{\"id\":\"cat_rx\",\"name\":\"category_rx\",\"cloudLink\":\"\"},{\"id\":\"cat_spec\",\"name\":\"category_spec\",\"cloudLink\":\"\"}],\"cloudLink\":\"\"}"
    },
    {
      id: 'pat_005',
      name: 'Grandma (Elena Quispe)',
      dateOfBirth: '1954-03-15',
      bloodType: 'A-',
      profileImageUrl: 'https://images.pexels.com/photos/3766209/pexels-photo-3766209.jpeg?auto=compress&cs=tinysrgb&w=300',
      medicalCategories: DEFAULT_CATEGORIES.map(cat => ({...cat, cloudLink: ''})),
      qrCodeData: "{\"name\":\"Grandma (Elena Quispe)\",\"dateOfBirth\":\"1954-03-15\",\"bloodType\":\"A-\",\"medicalCategories\":[{\"id\":\"cat_gen\",\"name\":\"category_general_practice\",\"cloudLink\":\"\"},{\"id\":\"cat_den\",\"name\":\"category_dental\",\"cloudLink\":\"\"},{\"id\":\"cat_xray\",\"name\":\"category_xrays\",\"cloudLink\":\"\"},{\"id\":\"cat_lab\",\"name\":\"category_lab\",\"cloudLink\":\"\"},{\"id\":\"cat_rx\",\"name\":\"category_rx\",\"cloudLink\":\"\"},{\"id\":\"cat_spec\",\"name\":\"category_spec\",\"cloudLink\":\"\"}],\"cloudLink\":\"\"}"
    }
  ]
};

const EMPTY_ACCOUNT: FamilyAccount = {
  id: `fam_${Date.now()}`,
  familyName: 'My Family',
  patients: [],
};

type View =
  | { type: 'DASHBOARD' }
  | { type: 'PROFILE'; patientId: string }
  | { type: 'PUBLIC'; patientData: Patient | null }
  | { type: 'ASSIGN_QR' }
  | { type: 'GENERATE_QR_BATCH' };
type ToastState = { message: string, type: 'success' | 'error' } | null;
type BackupStatus = 'idle' | 'saving' | 'saved' | 'error';

const App: React.FC = () => {
  const [account, setAccount] = useLocalStorage<FamilyAccount>('qrate-account', EMPTY_ACCOUNT);
  const [backupAccount, setBackupAccount] = useLocalStorage<FamilyAccount | null>('qrate-account-backup', null);
  const [lastBackup, setLastBackup] = useLocalStorage<string | null>('qrate-last-backup', null);
  const [isSignedIn, setIsSignedIn] = useLocalStorage('qrate-signed-in', false);
  const [qrInventory, setQrInventory] = useLocalStorage<QrCodeInventoryItem[]>('qrate-qr-inventory', []);
  const [isAdmin, setIsAdmin] = useLocalStorage('qrate-admin', false);

  const [currentView, setCurrentView] = useState<View>({ type: 'DASHBOARD' });
  const [isBusy, setIsBusy] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>('idle');
  const { t } = useLanguage();


  const handleHashChange = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/view/')) {
        const encodedData = hash.substring('#/view/'.length);
        try {
            const jsonData = decodeURIComponent(encodedData);
            const parsedData = JSON.parse(jsonData) as Omit<Patient, 'id' | 'profileImageUrl' | 'qrCodeData'>;
            
            // Reconstruct a Patient object for the view component.
            const patientForView: Patient = {
                ...parsedData,
                id: 'public_view_id', // Dummy ID, not used in public view
                profileImageUrl: '', // Not needed for public view
                qrCodeData: '', // Not needed for public view
            };
            setCurrentView({ type: 'PUBLIC', patientData: patientForView });
        } catch (e) {
            console.error("Failed to parse patient data from URL:", e);
            setCurrentView({ type: 'PUBLIC', patientData: null });
        }
    } else if (hash.startsWith('#/qr-batch')) {
        if (isAdmin) {
          setCurrentView({ type: 'GENERATE_QR_BATCH' });
        } else {
          setCurrentView({ type: 'DASHBOARD' });
          window.location.hash = '#/';
          setToast({ message: t('adminAccessRequired'), type: 'error' });
        }
    } else if (hash.startsWith('#/assign')) {
        if (isAdmin) {
          setCurrentView({ type: 'ASSIGN_QR' });
        } else {
          setCurrentView({ type: 'DASHBOARD' });
          window.location.hash = '#/';
          setToast({ message: t('adminAccessRequired'), type: 'error' });
        }
    } else if (hash.startsWith('#/profile/')) {
        const patientId = hash.substring('#/profile/'.length);
        setCurrentView({ type: 'PROFILE', patientId });
    } else {
      setCurrentView({ type: 'DASHBOARD' });
    }
  }, [isAdmin, t]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);
  
  // --- Automatic Backup Logic ---
  useEffect(() => {
    if (!isSignedIn) {
        return;
    }
    // Don't backup if there's no change from the backup
    if(JSON.stringify(account) === JSON.stringify(backupAccount)) {
        return;
    }

    setBackupStatus('saving');
    
    // Debounce the backup call
    const handler = setTimeout(() => {
        setBackupAccount(account);
        const backupTime = new Date().toISOString();
        setLastBackup(backupTime);
        setBackupStatus('saved');
        
        // Reset status to idle after a while
        setTimeout(() => setBackupStatus('idle'), 3000);
    }, 2000); // 2 seconds after the last change

    return () => {
        clearTimeout(handler);
    };
  }, [account, isSignedIn, backupAccount, setBackupAccount, setLastBackup]);


  const handleSelectPatient = (patientId: string) => {
    window.location.hash = `#/profile/${patientId}`;
  };

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };
  
  const handleOpenAssignQr = () => {
    window.location.hash = '#/assign';
  };

  const handleOpenGenerateBatch = () => {
    window.location.hash = '#/qr-batch';
  };

  const handleAdminLogin = () => {
    const pin = window.prompt(t('adminEnterPinPrompt'));
    if (!pin) return;
    if (pin === '2468') {
      setIsAdmin(true);
      setToast({ message: t('adminModeEnabled'), type: 'success' });
    } else {
      setToast({ message: t('adminInvalidPin'), type: 'error' });
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setToast({ message: t('adminModeDisabled'), type: 'success' });
  };
  
  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'medicalCategories' | 'qrCodeData'>) => {
    const medicalCategories = DEFAULT_CATEGORIES.map(cat => ({ ...cat, cloudLink: '' }));
    const newPatientData = {
      ...patientData,
      medicalCategories,
      cloudLink: '',
      allergies: [],
      currentMedications: [],
      lastVisitDate: '',
    };
    const newPatient: Patient = {
        ...patientData,
        id: `pat_${Date.now()}`,
        medicalCategories: newPatientData.medicalCategories,
        allergies: newPatientData.allergies,
        currentMedications: newPatientData.currentMedications,
        lastVisitDate: newPatientData.lastVisitDate,
        qrCodeData: generatePublicDataJson(newPatientData),
    };
    setAccount({...account, patients: [...account.patients, newPatient]});
  };
  
  const handleUpdatePatient = (patientId: string, updatedData: Partial<Omit<Patient, 'qrCodeData'>>) => {
    let qrCodeWasUpdated = false;
    const updatedPatients = account.patients.map(p => {
        if (p.id === patientId) {
            const updatedPatient = { ...p, ...updatedData };
            // Automatically update the QR code data to keep it in sync
            const newQrJson = generatePublicDataJson(updatedPatient);
            // Check if the QR data actually changed
            if (p.qrCodeData !== newQrJson) {
                qrCodeWasUpdated = true;
            }
            return { ...updatedPatient, qrCodeData: newQrJson };
        }
        return p;
    });
    setAccount({ ...account, patients: updatedPatients });
    
    const message = qrCodeWasUpdated 
        ? t('profileSavedAndUpdate')
        : t('profileUpdated');
    setToast({ message: message, type: 'success' });
  };

  const assignTokenToPatient = (patientId: string, token: string, assignedBy?: string) => {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
        return;
    }

    const record = qrInventory.find(item => item.token === trimmedToken);

    if (!record) {
        setToast({ message: t('qrTokenNotFound'), type: 'error' });
        return;
    }

    if (record.status !== 'unassigned') {
        setToast({ message: t('qrTokenAlreadyAssigned'), type: 'error' });
        return;
    }

    const nowIso = new Date().toISOString();

    const updatedInventory = qrInventory.map(item => {
        // Inactivate any other active QR currently linked to this member.
        if (item.memberId === patientId && item.status === 'assigned' && item.token !== trimmedToken) {
            return { ...item, status: 'inactive' as const };
        }

        if (item.token === trimmedToken) {
            return {
                ...item,
                status: 'assigned' as const,
                memberId: patientId,
                assignedAt: nowIso,
                assignedBy: assignedBy ?? null,
            };
        }

        return item;
    });

    const updatedPatients = account.patients.map(p => {
        if (p.id !== patientId) return p;
        const updated: Patient = { ...p, qrToken: trimmedToken };
        return updated;
    });

    setAccount({ ...account, patients: updatedPatients });
    setQrInventory(updatedInventory);
    notifyAssignmentToServer({
      token: trimmedToken,
      memberId: patientId,
      assignedBy: assignedBy ?? null,
      assignedAt: nowIso,
    });
    setToast({ message: t('assignQrSuccessExisting'), type: 'success' });
  };

  const handleAssignPrePrintedQrToExisting = (patientId: string, token: string, assignedBy?: string) => {
    assignTokenToPatient(patientId, token, assignedBy);
  };

  const handleAssignPrePrintedQrToNew = (patientData: Omit<Patient, 'id' | 'medicalCategories' | 'qrCodeData'>, token: string, assignedBy?: string) => {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      return;
    }

    const record = qrInventory.find(item => item.token === trimmedToken);

    if (!record) {
        setToast({ message: t('qrTokenNotFound'), type: 'error' });
        return;
    }

    if (record.status !== 'unassigned') {
        setToast({ message: t('qrTokenAlreadyAssigned'), type: 'error' });
        return;
    }

    const medicalCategories = DEFAULT_CATEGORIES.map(cat => ({ ...cat, cloudLink: '' }));
    const basePatient = {
      ...patientData,
      medicalCategories,
      cloudLink: '',
      allergies: [],
      currentMedications: [],
      lastVisitDate: '',
    };
    const newPatient: Patient = {
      ...patientData,
      id: `pat_${Date.now()}`,
      medicalCategories: basePatient.medicalCategories,
      allergies: basePatient.allergies,
      currentMedications: basePatient.currentMedications,
      lastVisitDate: basePatient.lastVisitDate,
      qrCodeData: generatePublicDataJson(basePatient),
      qrToken: trimmedToken,
    };
    const updatedAccount = { ...account, patients: [...account.patients, newPatient] };
    setAccount(updatedAccount);

    const nowIso = new Date().toISOString();
    const updatedInventory = qrInventory.map(item => {
      if (item.token === trimmedToken) {
        return {
          ...item,
          status: 'assigned' as const,
          memberId: newPatient.id,
          assignedAt: nowIso,
          assignedBy: assignedBy ?? null,
        };
      }
      return item;
    });

    setQrInventory(updatedInventory);
    notifyAssignmentToServer({
      token: trimmedToken,
      memberId: newPatient.id,
      assignedBy: assignedBy ?? null,
      assignedAt: nowIso,
    });
    setToast({ message: t('assignQrSuccessNew'), type: 'success' });
  };

  const handleAddBatchRecords = (records: QrCodeInventoryItem[]) => {
    if (!records.length) return;
    const next = [...qrInventory, ...records];
    setQrInventory(next);
    notifyBatchCreatedToServer({ records });
  };

  // --- Manual Restore Logic ---
  const handleRestore = () => {
    if (!backupAccount) {
        setToast({ message: t('noBackupFound'), type: 'error' });
        return;
    }
     if (window.confirm(t('confirmRestore'))) {
        setIsBusy(true);
        // Simulate API call
        setTimeout(() => {
            setAccount(backupAccount);
            setIsBusy(false);
            setToast({ message: t('restoredSuccess'), type: 'success' });
        }, 1500);
    }
  }
  
  const handleLoadDemoData = () => {
    if (account.patients.length > 0 && !window.confirm(t('confirmDemo'))) {
      return;
    }
    setAccount(MOCK_DATA);
    setToast({ message: t('demoLoaded'), type: 'success' });
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'DASHBOARD':
        return (
            <div className="print:hidden">
                <Header />
                <main>
                    <Dashboard 
                        patients={account.patients} 
                        onSelectPatient={handleSelectPatient} 
                        onAddPatient={handleAddPatient}
                        onOpenAssignPrePrintedQR={handleOpenAssignQr}
                        onOpenGenerateQrBatch={handleOpenGenerateBatch}
                        isAdmin={!!isAdmin}
                        onAdminLogin={handleAdminLogin}
                        onAdminLogout={handleAdminLogout}
                        isSignedIn={isSignedIn}
                        isBusy={isBusy}
                        lastBackup={lastBackup}
                        backupStatus={backupStatus}
                        onSignIn={() => setIsSignedIn(true)}
                        onSignOut={() => setIsSignedIn(false)}
                        onRestore={handleRestore}
                        onLoadDemoData={handleLoadDemoData}
                    />
                </main>
            </div>
        );
      case 'PROFILE':
        const patientForProfile = account.patients.find(p => p.id === currentView.patientId);
        if (!patientForProfile) {
            handleBackToDashboard();
            return null;
        }

        const publicUrl = generatePublicUrlForQRCode(patientForProfile);

        return (
            <>
                <div className="print:hidden">
                    <Header />
                    <main>
                        <PatientProfile 
                          patient={patientForProfile} 
                          publicUrl={publicUrl}
                          onBack={handleBackToDashboard} 
                          onUpdatePatient={handleUpdatePatient}
                        />
                    </main>
                </div>
                <div id="printable-area" className="hidden print:block">
                    <PrintableView patient={patientForProfile} publicUrl={publicUrl} />
                </div>
            </>
        );
      case 'PUBLIC':
        return <PublicRecordView patient={currentView.patientData} />;
      case 'ASSIGN_QR':
        return (
          <div className="print:hidden">
            <Header />
            <main>
              <AssignPrePrintedQR
                patients={account.patients}
                qrInventory={qrInventory}
                onBack={handleBackToDashboard}
                onAssignToExisting={handleAssignPrePrintedQrToExisting}
                onCreateAndAssign={handleAssignPrePrintedQrToNew}
              />
            </main>
          </div>
        );
      case 'GENERATE_QR_BATCH':
        return (
          <div className="print:hidden">
            <Header />
            <main>
              <GenerateQrBatch
                qrInventory={qrInventory}
                onBack={handleBackToDashboard}
                onAddBatchRecords={handleAddBatchRecords}
              />
            </main>
          </div>
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
        {renderContent()}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
