import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Image as ImageIcon, Link as LinkIcon, Trash2, Check, Sparkles } from 'lucide-react';

const PRESET_AVATARS = [
  {
    id: 'traveler-1',
    label: 'Mountain Hiker',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-2',
    label: 'Voyager',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-3',
    label: 'Photographer',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-4',
    label: 'Adventurer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-5',
    label: 'Explorer',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-6',
    label: 'Nature Lover',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-7',
    label: 'City Nomad',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'traveler-8',
    label: 'Backpacker',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=400&q=80'
  }
];

export const AvatarModal = ({ isOpen, onClose, currentAvatar, userName, onSave }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Compress image to canvas data URL (400x400 max, lightweight JPEG)
  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, WEBP).');
      return;
    }
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewUrl(dataUrl);
      };
      img.onerror = () => {
        setErrorMsg('Could not process this image file.');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => setErrorMsg('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setPreviewUrl(customUrlInput.trim());
    setErrorMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      await onSave(previewUrl || null);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save profile photo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPreviewUrl('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Change Profile Photo</h3>
              <p className="text-xs text-slate-500">Update your traveler avatar across Voyanta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Avatar Preview */}
          <div className="flex items-center justify-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md border-2 border-white">
                  {userName?.[0]?.toUpperCase() || 'T'}
                </div>
              )}

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="Remove custom photo"
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1 text-left">
              <p className="font-bold text-sm text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">
                {previewUrl ? 'Custom photo selected' : 'Default initial avatar'}
              </p>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 mt-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset to default letter</span>
                </button>
              )}
            </div>
          </div>

          {/* Source Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'preset'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Photos</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Tab 1: Upload from device */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, or WEBP (automatically optimized)
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Curated Traveler Avatars */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose from verified traveler avatars:
              </p>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = previewUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPreviewUrl(preset.url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Paste URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Direct Web Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Preview
                </button>
              </div>
            </form>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
