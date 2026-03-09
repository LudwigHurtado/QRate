
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Define translations directly in the file
const translations = {
  en: {
    // Header
    slogan: "Your health, in a scan.",
    // Dashboard
    familyMembers: "Family Members",
    addMember: "Add Member",
    googleDriveBackup: "Google Drive Backup",
    savingChanges: "Saving changes...",
    allChangesSaved: "All changes saved to Drive",
    backupFailed: "Backup failed",
    lastBackup: "Last backup:",
    openDrive: "Open Drive",
    restore: "Restore",
    signedIn: "Signed In",
    signOut: "Sign Out",
    connectToGoogle: "Connect to Google Drive",
    noFamilyMembers: "No family members yet",
    getStarted: "Get started by adding your own family member, or load a demo set.",
    addNewMember: "Add New Member",
    loadDemoData: "Load Demo Data",
    // AddPatientModal
    addNewFamilyMember: "Add New Family Member",
    fullName: "Full Name",
    dateOfBirth: "Date of Birth",
    bloodType: "Blood Type",
    profilePhoto: "Profile Photo",
    upload: "Upload",
    cancel: "Cancel",
    // PatientProfile
    backToDashboard: "Back to Dashboard",
    changePhoto: "Change Photo",
    mainCloudLink: "Main Cloud Storage Link",
    allergies: "Allergies",
    currentMedications: "Current Medications",
    lastVisitDate: "Last Visit Date",
    separateWithCommas: "Separate with commas.",
    changeQRCode: "Change QR Code",
    uploadQRCode: "Upload QR Code",
    useGeneratedQRCode: "Use Generated QR Code",
    dob: "DOB",
    viewMainCloud: "View Main Cloud Storage",
    patientQRCode: "Patient QR Code",
    qrScanInstruction: "Healthcare providers can scan this code to access the patient's medical records instantly.",
    share: "Share",
    files: "Files",
    print: "Print",
    pdf: "PDF",
    generating: "Generating...",
    editMedicalFolders: "Edit Medical Folders",
    editFoldersInstruction: "Paste the public share link for each cloud storage folder (e.g., Google Drive, Dropbox). For doctor access, set folder permissions to \"Anyone with the link\".",
    browse: "Browse",
    saveAllChanges: "Save All Changes",
    medicalSummary: "Medical Summary",
    noneReported: "None reported",
    notRecorded: "Not recorded",
    medicalFolders: "Medical Folders",
    scanFor: "Scan for {categoryName}",
    // Public View
    patientNotFound: "Patient Not Found",
    patientNotFoundDesc: "The requested patient record does not exist or the link is invalid.",
    redirecting: "Redirecting to Medical Records...",
    redirectingDesc: "You are being redirected to the patient's main document folder.",
    clickHere: "please click here",
    secureRecord: "QRate Secure Record",
    keyMedicalInfo: "Key Medical Information",
    lastKnownVisit: "Last Known Visit",
    noMainFolder: "No main document folder is linked for this patient. Click a category below to view specific records.",
    noRecordsLinked: "No medical records have been linked for this patient.",
    // Toasts (App.tsx)
    profileSavedAndUpdate: "Profile saved and QR code updated with new information.",
    profileUpdated: "Patient profile updated!",
    noBackupFound: "No backup found to restore.",
    confirmRestore: "Are you sure? This will overwrite your current local data with the data from your last backup.",
    restoredSuccess: "Data successfully restored!",
    confirmDemo: "This will replace any existing data with the demo family. Are you sure?",
    demoLoaded: "Demo data loaded!",
    // PrintableView
    patientSummary: "QRate Patient Summary",
    generatedOn: "Generated on:",
    scanForFullRecord: "Scan for Full Digital Record",
    directFolderAccess: "Direct Folder Access",
    noLinkProvided: "No Link Provided",
    printableFooter: "This document may contain sensitive personal health information. Please handle it with care and store it securely.",
    emergencyId: "QRate Emergency ID",
    emergencyIdDesc: "Instructions: Cut out the cards below, fold in half, and laminate. Keep in your wallet for emergencies.",
    nameLabel: "Name",
    scanForFullInfo: "Scan for full records, allergies, & medications.",
    // Medical Categories
    category_general_practice: "General Practice",
    category_dental: "Dental",
    category_xrays: "X-Rays & Imaging",
    category_lab: "Lab Results",
    category_rx: "Prescriptions",
    category_spec: "Specialist Reports",
  },
  es: {
    // Header
    slogan: "Tu salud, en un escaneo.",
    // Dashboard
    familyMembers: "Miembros de la Familia",
    addMember: "Añadir Miembro",
    googleDriveBackup: "Copia de Seguridad de Google Drive",
    savingChanges: "Guardando cambios...",
    allChangesSaved: "Todos los cambios guardados en Drive",
    backupFailed: "Falló la copia de seguridad",
    lastBackup: "Última copia:",
    openDrive: "Abrir Drive",
    restore: "Restaurar",
    signedIn: "Sesión Iniciada",
    signOut: "Cerrar Sesión",
    connectToGoogle: "Conectar a Google Drive",
    noFamilyMembers: "Aún no hay miembros en la familia",
    getStarted: "Comienza añadiendo un miembro de tu familia, o carga datos de demostración.",
    addNewMember: "Añadir Nuevo Miembro",
    loadDemoData: "Cargar Datos de Muestra",
    // AddPatientModal
    addNewFamilyMember: "Añadir Nuevo Miembro",
    fullName: "Nombre Completo",
    dateOfBirth: "Fecha de Nacimiento",
    bloodType: "Tipo de Sangre",
    profilePhoto: "Foto de Perfil",
    upload: "Subir",
    cancel: "Cancelar",
    // PatientProfile
    backToDashboard: "Volver al Panel",
    changePhoto: "Cambiar Foto",
    mainCloudLink: "Enlace Principal de Almacenamiento",
    allergies: "Alergias",
    currentMedications: "Medicamentos Actuales",
    lastVisitDate: "Fecha de Última Visita",
    separateWithCommas: "Separar con comas.",
    changeQRCode: "Cambiar Código QR",
    uploadQRCode: "Subir Código QR",
    useGeneratedQRCode: "Usar Código QR Generado",
    dob: "Fecha de Nac.",
    viewMainCloud: "Ver Almacenamiento Principal",
    patientQRCode: "Código QR del Paciente",
    qrScanInstruction: "Los proveedores de salud pueden escanear este código para acceder a los registros médicos del paciente al instante.",
    share: "Compartir",
    files: "Archivos",
    print: "Imprimir",
    pdf: "PDF",
    generating: "Generando...",
    editMedicalFolders: "Editar Carpetas Médicas",
    editFoldersInstruction: "Pega el enlace público para compartir de cada carpeta (ej. Google Drive, Dropbox). Para el acceso de los doctores, establece los permisos de la carpeta a \"Cualquier persona con el enlace\".",
    browse: "Buscar",
    saveAllChanges: "Guardar Todos los Cambios",
    medicalSummary: "Resumen Médico",
    noneReported: "Ninguna reportada",
    notRecorded: "No registrado",
    medicalFolders: "Carpetas Médicas",
    scanFor: "Escanear para {categoryName}",
    // Public View
    patientNotFound: "Paciente no Encontrado",
    patientNotFoundDesc: "El registro del paciente solicitado no existe o el enlace no es válido.",
    redirecting: "Redirigiendo a los Registros Médicos...",
    redirectingDesc: "Estás siendo redirigido a la carpeta principal de documentos del paciente.",
    clickHere: "por favor, haz clic aquí",
    secureRecord: "Registro Seguro QRate",
    keyMedicalInfo: "Información Médica Clave",
    lastKnownVisit: "Última Visita Conocida",
    noMainFolder: "No hay una carpeta de documentos principal vinculada para este paciente. Haz clic en una categoría para ver registros específicos.",
    noRecordsLinked: "No se han vinculado registros médicos para este paciente.",
    // Toasts (App.tsx)
    profileSavedAndUpdate: "Perfil guardado y código QR actualizado con nueva información.",
    profileUpdated: "¡Perfil del paciente actualizado!",
    noBackupFound: "No se encontró una copia de seguridad para restaurar.",
    confirmRestore: "¿Estás seguro? Esto sobrescribirá tus datos locales actuales con los de tu última copia de seguridad.",
    restoredSuccess: "¡Datos restaurados con éxito!",
    confirmDemo: "¿Estás seguro? Esto reemplazará los datos existentes con la familia de demostración.",
    demoLoaded: "¡Datos de demostración cargados!",
    // PrintableView
    patientSummary: "Resumen del Paciente QRate",
    generatedOn: "Generado el:",
    scanForFullRecord: "Escanear para Registro Digital Completo",
    directFolderAccess: "Acceso Directo a Carpetas",
    noLinkProvided: "No se Proporcionó Enlace",
    printableFooter: "Este documento puede contener información de salud personal y sensible. Por favor, manéjelo con cuidado y guárdelo de forma segura.",
    emergencyId: "ID de Emergencia QRate",
    emergencyIdDesc: "Instrucciones: Recorte las tarjetas de abajo, dóblelas por la mitad y lamínelas. Guárdelas en su cartera para emergencias.",
    nameLabel: "Nombre",
    scanForFullInfo: "Escanear para registros, alergias y medicamentos.",
    // Medical Categories
    category_general_practice: "Medicina General",
    category_dental: "Dental",
    category_xrays: "Rayos X e Imágenes",
    category_lab: "Resultados de Laboratorio",
    category_rx: "Recetas Médicas",
    category_spec: "Informes de Especialistas",
  }
};

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en, replacements?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: keyof typeof translations.en, replacements?: { [key: string]: string }) => {
    let text = (translations[language] && translations[language][key]) || translations.en[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            text = text.replace(`{${rKey}}`, replacements[rKey]);
        });
    }
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
