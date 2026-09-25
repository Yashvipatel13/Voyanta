import React from 'react';
import { X, ShieldCheck, FileText, BookOpen, HelpCircle, Info, Sparkles } from 'lucide-react';

export const InfoModal = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  const contentMap = {
    about: {
      title: 'About Voyanta',
      icon: Info,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong className="text-slate-900">Voyanta</strong> is an intelligent travel planning platform engineered to replace generic, rigid itineraries with dynamic, vibe-personalized journeys.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Core Architecture
            </h4>
            <p className="text-xs text-slate-700">
              Powered by an ensemble Random Forest machine learning classifier evaluating 7 aesthetic vibe dimensions, live weather adaptation, and real-time 4-pillar budget calculations.
            </p>
          </div>
          <p>
            Designed with Apple-level simplicity and clean shadcn/ui components for modern travelers worldwide.
          </p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>Last updated: September 2026</p>
          <p>
            At Voyanta, we respect your privacy and are committed to protecting your personal data. We do not sell your travel habits, location history, or preference vectors to third parties.
          </p>
          <h4 className="font-bold text-slate-900 pt-1">Data We Collect</h4>
          <p>
            Your account email, name, travel preferences, and saved itineraries are securely encrypted and stored using industry standard bcrypt and JWT tokens.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>Last updated: September 2026</p>
          <p>
            By using Voyanta, you agree to these terms. Voyanta provides AI-assisted travel recommendations, estimated budgets, and smart weather adaptations for informational travel planning purposes.
          </p>
          <p>
            Actual transportation schedules, flight tickets, hotel reservations, and weather conditions may vary according to third-party providers.
          </p>
        </div>
      )
    },
    guides: {
      title: 'Travel Guides & Curated Spots',
      icon: BookOpen,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Explore our in-depth destination itineraries covering 24 premier regions across India:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>Leh-Ladakh:</strong> High mountain passes and ancient monasteries.</li>
            <li><strong>Coorg (Kodagu):</strong> Coffee estates, rolling hills and misty waterfalls.</li>
            <li><strong>Goa:</strong> Portuguese heritage, beaches, and night markets.</li>
            <li><strong>Rishikesh:</strong> Ganges river aarti, cliff rafting, and yoga ashrams.</li>
            <li><strong>Spiti Valley:</strong> Cliffside monasteries and starry Himalayan skies.</li>
          </ul>
        </div>
      )
    },
    blog: {
      title: 'Voyanta Travel Blog',
      icon: BookOpen,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase">Featured Article • 2026</span>
            <h4 className="text-sm font-bold text-slate-900">How Random Forest Machine Learning Picks Your Perfect Vibe</h4>
            <p className="text-xs text-slate-500">Discover the mathematical decision trees behind personalized travel matching.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase">Travel Tips</span>
            <h4 className="text-sm font-bold text-slate-900">Smart Rainy-Day Alternatives in the Himalayas</h4>
            <p className="text-xs text-slate-500">How to seamlessly adapt outdoor itineraries into enriching indoor cultural experiences.</p>
          </div>
        </div>
      )
    },
    help: {
      title: 'Help & Support',
      icon: HelpCircle,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>Need assistance with planning your trip or managing your account?</p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-semibold text-slate-800">Email Support</p>
            <p className="text-xs text-blue-600">support@voyanta.com</p>
          </div>
          <p className="text-xs text-slate-400">Our travel support team is available 24/7 to assist with your itineraries.</p>
        </div>
      )
    }
  };

  const modal = contentMap[type] || contentMap.about;
  const Icon = modal.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{modal.title}</h3>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {modal.content}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
