
import React from 'react';

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15V9a2 2 0 0 1 2-2h2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 9v6a2 2 0 0 1-2 2h-2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h2a2 2 0 0 1 2 2v2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H7a2 2 0 0 1-2-2v-2" />
    </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
    </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0021.5 5.5V3.935m-18 0A2.5 2.5 0 015.5 2h.09M18.5 2h.09a2.5 2.5 0 012.41 1.935M21 11h2.945" />
    </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

export const PrinterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m8 0v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5m8 0h-8" />
  </svg>
);

export const GoogleDriveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.05 6.29999L14.28 15.05L16.2 18.51L23.94 6.32999C23.98 6.22999 24 6.12999 24 6.01999C24 5.46999 23.55 5.01999 23 5.01999H9.2L12.06 10.08L19.05 6.29999Z" />
        <path d="M7.05005 5.02002L14.28 15.05L11.85 19.14C11.72 19.38 11.45 19.52 11.16 19.52H2.99005C2.44005 19.52 1.99005 19.07 1.99005 18.52L4.85005 13.45L7.05005 5.02002Z" />
        <path d="M8.22003 4.48001L4.85003 10.43L7.71003 15.49L12.06 8.00001L10.15 4.51001C9.88003 4.02001 9.25003 3.82001 8.74003 4.08001C8.52003 4.19001 8.34003 4.33001 8.22003 4.48001Z" />
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const GoogleLoginIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.021,44,30.032,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export const CloudUploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

export const CloudDownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m-4-4l4 4 4-4" />
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const DentalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.8 21.6a2.5 2.5 0 0 0 3.9 0l1.1-1.6a1 1 0 0 1 .8-.4h1.9a2 2 0 0 0 2-2v-2.5a1 1 0 0 1 .5-.8l1.6-1.1a2.5 2.5 0 0 0 0-3.9l-1.6-1.1a1 1 0 0 1-.5-.8V5.5a2 2 0 0 0-2-2h-1.9a1 1 0 0 1-.8-.4l-1.1-1.6a2.5 2.5 0 0 0-3.9 0l-1.1 1.6a1 1 0 0 1-.8.4H5.5a2 2 0 0 0-2 2v2.5a1 1 0 0 1-.5.8l-1.6 1.1a2.5 2.5 0 0 0 0 3.9l1.6 1.1a1 1 0 0 1 .5.8v2.5a2 2 0 0 0 2 2h1.9a1 1 0 0 1 .8.4Z"/>
    <path d="M15.5 13.5a3.5 3.5 0 0 0-7 0"/>
  </svg>
);

export const GeneralPracticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export const XRayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14.5 2-3.5 3.5 2 2L15 6l3 3 2-2-3.5-3.5Z"/>
    <path d="m19 7.5-5 5"/>
    <path d="m9 12-5 5"/>
    <path d="m14.5 17.5-5-5"/>
    <path d="M9 10.5 4.5 6"/>
    <path d="m20 12-1.5 1.5"/>
    <path d="m4.5 19.5-2-2"/>
    <path d="M2.5 17.5 7 13l2 2-4.5 4.5Z"/>
  </svg>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
  </svg>
);

export const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.47,11.51a4.26,4.26,0,0,1-1.33-3.23,4.13,4.13,0,0,1,1.54-3.32,4.6,4.6,0,0,0-3.69-2C12.1,2.9,11.23,4.4,11.23,6a5,5,0,0,0,1.75,3.77,5.32,5.32,0,0,0-1.54,4.2,5.63,5.63,0,0,0,4.2,4.45,1,1,0,0,0,.3,0,4.55,4.55,0,0,0,3.82-2.34A4.3,4.3,0,0,1,17.47,11.51Z" />
        <path d="M12.44,4.21a4.52,4.52,0,0,0-2.82,4.32A4.27,4.27,0,0,0,11,11.72a4.34,4.34,0,0,0,2.69-1.28A4.13,4.13,0,0,1,12.44,4.21Z" />
    </svg>
);

export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export const PdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.5 11.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5V9H8c.83 0 1.5.67 1.5 1.5v1zm-2 0h-1v-1h1v1zm4.5-1.5c0-.83.67-1.5 1.5-1.5h1.5v6H14v-2h-1.5c-.83 0-1.5-.67-1.5-1.5v-1zm2 0h-1v-1h1v1zm3-3.5H18v6h1.5v-2H21V9h-1.5V7.5z" />
    </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-9l2-2 2 2m-2 10l2 2 2-2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 3l-2 2-2-2m2 10l-2 2-2-2m-3-10l-2 2 2 2m2 10l2-2 2 2" />
  </svg>
);

export const USAFlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 60 30" width="40" height="20">
        <rect width="60" height="30" fill="#bf0a30"/>
        <rect y="3.33" width="60" height="3.33" fill="#fff"/>
        <rect y="10" width="60" height="3.33" fill="#fff"/>
        <rect y="16.66" width="60" height="3.33" fill="#fff"/>
        <rect y="23.33" width="60" height="3.33" fill="#fff"/>
        <rect width="26" height="16" fill="#002868"/>
        <g fill="#fff">
            <circle cx="3" cy="3" r="1"/> <circle cx="8" cy="3" r="1"/> <circle cx="13" cy="3" r="1"/> <circle cx="18" cy="3" r="1"/> <circle cx="23" cy="3" r="1"/>
            <circle cx="5.5" cy="5.5" r="1"/> <circle cx="10.5" cy="5.5" r="1"/> <circle cx="15.5" cy="5.5" r="1"/> <circle cx="20.5" cy="5.5" r="1"/>
             <circle cx="3" cy="8" r="1"/> <circle cx="8" cy="8" r="1"/> <circle cx="13" cy="8" r="1"/> <circle cx="18" cy="8" r="1"/> <circle cx="23" cy="8" r="1"/>
            <circle cx="5.5" cy="10.5" r="1"/> <circle cx="10.5" cy="10.5" r="1"/> <circle cx="15.5" cy="10.5" r="1"/> <circle cx="20.5" cy="10.5" r="1"/>
            <circle cx="3" cy="13" r="1"/> <circle cx="8" cy="13" r="1"/> <circle cx="13" cy="13" r="1"/> <circle cx="18" cy="13" r="1"/> <circle cx="23" cy="13" r="1"/>
        </g>
    </svg>
);

export const MexicoFlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 60 30" width="40" height="20">
        <rect width="20" height="30" fill="#006847"/>
        <rect x="20" width="20" height="30" fill="#fff"/>
        <rect x="40" width="20" height="30" fill="#ce1126"/>
        <circle cx="30" cy="15" r="4.5" fill="#B8860B" />
        <path d="M28 15 L32 15 L30 12 Z" fill="#654321"/>
    </svg>
);
