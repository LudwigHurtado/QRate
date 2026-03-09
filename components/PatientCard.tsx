
import React from 'react';
import { Patient } from '../types';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect }) => {
  const getAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div
      onClick={() => onSelect(patient.id)}
      className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      <img src={patient.profileImageUrl} alt={patient.name} className="h-20 w-20 rounded-full object-cover" />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800">{patient.name}</h3>
        <p className="text-sm text-slate-500">Age: {getAge(patient.dateOfBirth)}</p>
        <p className="text-sm text-slate-500">Blood Type: {patient.bloodType}</p>
      </div>
    </div>
  );
};

export default PatientCard;
