

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
  | { type: 'ASSIGN_QR' };
type ToastState = { message: string, type: 'success' | 'error' } | null;
type BackupStatus = 'idle' | 'saving' | 'saved' | 'error';

const App: React.FC = () => {
  const [account, setAccount] = useLocalStorage<FamilyAccount>('qrate-account', EMPTY_ACCOUNT);
  const [backupAccount, setBackupAccount] = useLocalStorage<FamilyAccount | null>('qrate-account-backup', null);
  const [lastBackup, setLastBackup] = useLocalStorage<string | null>('qrate-last-backup', null);
  const [isSignedIn, setIsSignedIn] = useLocalStorage('qrate-signed-in', false);
  const [qrInventory, setQrInventory] = useLocalStorage<QrCodeInventoryItem[]>('qrate-qr-inventory', []);

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
    } else if (hash.startsWith('#/assign')) {
        setCurrentView({ type: 'ASSIGN_QR' });
    } else if (hash.startsWith('#/profile/')) {
        const patientId = hash.substring('#/profile/'.length);
        setCurrentView({ type: 'PROFILE', patientId });
    } else {
      setCurrentView({ type: 'DASHBOARD' });
    }
  }, []);

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

    // Enforce "one active QR per member" rule by inactivating any existing token on this patient.
    const patient = account.patients.find(p => p.id === patientId);
    const updatedPatients = account.patients.map(p => {
        if (p.id !== patientId) return p;
        const updated: Patient = { ...p, qrToken: trimmedToken };
        return updated;
    });

    const nowIso = new Date().toISOString();

    const updatedInventory = qrInventory.map(item => {
        // If this QR was previously assigned to some member and it's being reused for another,
        // mark the old record as replaced.
        if (item.token === trimmedToken && item.memberId && item.memberId !== patientId && item.status === 'assigned') {
            return { ...item, status: 'replaced', notes: item.notes || 'Reassigned to another member' };
        }

        // If this QR was assigned to this same member, just keep it as-is.
        if (item.token === trimmedToken && item.memberId === patientId && item.status === 'assigned') {
            return item;
        }

        // If this patient previously had another active token, inactivate that QR record.
        if (patient?.qrToken && item.token === patient.qrToken && item.status === 'assigned' && item.memberId === patientId && patient.qrToken !== trimmedToken) {
            return { ...item, status: 'inactive', notes: item.notes || 'Replaced by a new QR token' };
        }

        return item;
    });

    const hasExistingForToken = updatedInventory.some(item => item.token === trimmedToken);

    const finalInventory = hasExistingForToken
        ? updatedInventory.map(item => {
            if (item.token !== trimmedToken) return item;
            return {
                ...item,
                status: 'assigned',
                memberId: patientId,
                assignedAt: nowIso,
                assignedBy: assignedBy || item.assignedBy,
            };
        })
        : [
            ...updatedInventory,
            {
                id: `qr_${Date.now()}`,
                token: trimmedToken,
                status: 'assigned',
                memberId: patientId,
                createdAt: nowIso,
                assignedAt: nowIso,
                assignedBy: assignedBy,
            } as QrCodeInventoryItem,
        ];

    setAccount({ ...account, patients: updatedPatients });
    setQrInventory(finalInventory);
    setToast({ message: 'QR assigned successfully.', type: 'success' });
  };

  const handleAssignPrePrintedQrToExisting = (patientId: string, token: string, assignedBy?: string) => {
    assignTokenToPatient(patientId, token, assignedBy);
  };

  const handleAssignPrePrintedQrToNew = (patientData: Omit<Patient, 'id' | 'medicalCategories' | 'qrCodeData'>, token: string, assignedBy?: string) => {
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
        qrToken: token.trim(),
    };
    const updatedAccount = { ...account, patients: [...account.patients, newPatient] };
    setAccount(updatedAccount);

    const nowIso = new Date().toISOString();
    const hasExistingForToken = qrInventory.some(item => item.token === token.trim());
    const updatedInventory = hasExistingForToken
        ? qrInventory.map(item => {
            if (item.token !== token.trim()) return item;
            return {
                ...item,
                status: 'assigned',
                memberId: newPatient.id,
                assignedAt: nowIso,
                assignedBy: assignedBy || item.assignedBy,
            };
        })
        : [
            ...qrInventory,
            {
                id: `qr_${Date.now()}`,
                token: token.trim(),
                status: 'assigned',
                memberId: newPatient.id,
                createdAt: nowIso,
                assignedAt: nowIso,
                assignedBy: assignedBy,
            } as QrCodeInventoryItem,
        ];

    setQrInventory(updatedInventory);
    setToast({ message: 'QR assigned and new member created.', type: 'success' });
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
