import React, { useState } from 'react';
import { MailIcon, XIcon } from './icons/Icons';

interface EmailSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string) => void;
}

const EmailSignInModal: React.FC<EmailSignInModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    onSignIn(email);
  };
  
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-sm m-4">
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-slate-800">Sign in with Email</h2>
             <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <XIcon className="h-6 w-6" />
             </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                <MailIcon className="h-5 w-5"/>
                Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailSignInModal;
