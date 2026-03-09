
import React, { useState, useCallback } from 'react';
import { extractMedicalRecord } from '../services/geminiService';
import { MedicalRecord } from '../types';
import { UploadIcon } from './icons/Icons';
import Spinner from './Spinner';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
}

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
           resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      base64: await base64EncodedDataPromise,
      mimeType: file.type
    };
};

const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose, onAddRecord }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
        const { base64, mimeType } = await fileToGenerativePart(file);
        const extractedData = await extractMedicalRecord(base64, mimeType);
        onAddRecord(extractedData);
        onClose();
        setFile(null);
        setPreview(null);
    } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, [file, onAddRecord, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Add New Medical Record</h2>
          <p className="text-sm text-slate-600 mb-6">Upload an image of a medical document, and our AI will automatically extract the relevant information.</p>
          
          <div className="space-y-4">
             <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                    {preview ? (
                        <img src={preview} alt="Document preview" className="max-h-48 rounded-md" />
                    ) : (
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <div className="flex text-sm text-slate-600">
                                <span className="text-blue-600">Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}
                </div>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex justify-end items-center space-x-4">
          {isLoading && <Spinner />}
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!file || isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
            {isLoading ? "Processing..." : "Process & Add Record"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordModal;