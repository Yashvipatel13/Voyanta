import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className = '',
  buttonClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value, label: opt.label || opt.value };
    }
    return { value: opt, label: opt };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 shadow-xs flex items-center justify-between gap-2 cursor-pointer transition-all duration-150 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 ${
          isOpen ? 'border-blue-600 ring-2 ring-blue-500/10' : ''
        } ${buttonClassName}`}
      >
        <span className={`truncate text-left ${selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3.5 py-2 text-xs sm:text-sm cursor-pointer flex items-center justify-between rounded-lg mx-1 transition-colors select-none ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
