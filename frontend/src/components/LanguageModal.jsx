import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const LanguageModal = ({ forceShow = false, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    // Check for google translate cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const lang = googtrans.split('/').pop();
      setSelectedLang(lang);
    } else {
        // If no cookie, default to 'en'
        setSelectedLang('en');
    }

    const hasSeenModal = localStorage.getItem('hasSeenLanguageModal');
    if (!hasSeenModal || forceShow) {
      setShowModal(true);
    }
    
    // Force remove google banner if it appears
    const removeBanner = () => {
        const banner = document.querySelector('.goog-te-banner-frame');
        if(banner) {
            banner.style.display = 'none';
        }
        document.body.style.top = '0px';
    };
    
    // Run periodically to ensure it stays hidden
    const intervalId = setInterval(removeBanner, 1000);
    
    return () => clearInterval(intervalId);
  }, [forceShow]);

  const handleClose = () => {
    setShowModal(false);
    localStorage.setItem('hasSeenLanguageModal', 'true');
    if (onClose) onClose();
  };

  const changeLanguage = (langCode) => {
    // Set Google Translate Cookie
    // Cookie format: googtrans=/source/target
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`; // Fallback

    localStorage.setItem('hasSeenLanguageModal', 'true');
    setSelectedLang(langCode);
    
    // Reload page to apply translation
    window.location.reload();
  };

  if (!showModal) return null;

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'bn', name: 'Bangla', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Choose Language</h2>
          {forceShow && (
            <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>
        
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedLang === lang.code 
                  ? 'bg-primary-50 text-primary-700 font-bold' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg">{lang.native}</span>
                <span className="text-xs text-gray-500 uppercase">{lang.name}</span>
              </div>
              {selectedLang === lang.code && (
                <div className="bg-green-500 text-white p-1 rounded-full">
                  <Check size={16} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
