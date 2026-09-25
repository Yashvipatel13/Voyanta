import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sun, Tag, Compass, Sparkles, Check, CheckCheck, X, ChevronRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const NotificationDropdown = ({ setTab }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fallback demo notifications for guest mode
  const defaultGuestNotifications = [
    {
      id: 'demo-1',
      title: 'Voyanta Travel Engine Active ✨',
      message: 'Random Forest AI models are primed for 2026 trending routes and seasonal weather.',
      type: 'info',
      link: '#planner',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 'demo-2',
      title: 'Weather Advisory: Leh-Ladakh',
      message: 'Clear sky conditions reported for high-altitude passes with crisp morning temperatures.',
      type: 'weather',
      link: '#planner',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      id: 'demo-3',
      title: 'Seasonal Deal Alert',
      message: 'Up to 15% off-season savings detected on boutique stays in Himachal Pradesh.',
      type: 'budget',
      link: '#explore',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ];

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications(defaultGuestNotifications);
      setUnreadCount(defaultGuestNotifications.filter(n => !n.read).length);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.warn('Using local notifications fallback:', err);
      setNotifications(defaultGuestNotifications);
      setUnreadCount(defaultGuestNotifications.filter(n => !n.read).length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated]);

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    // Optimistic update
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, read: true } : item))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    if (isAuthenticated && !id.startsWith('demo-')) {
      try {
        await api.markNotificationRead(id);
      } catch (err) {
        console.error('Failed to mark notification read:', err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
    setUnreadCount(0);

    if (isAuthenticated) {
      try {
        await api.markAllNotificationsRead();
      } catch (err) {
        console.error('Failed to mark all notifications read:', err);
      }
    }
  };

  const handleItemClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link && setTab) {
      const tabTarget = notification.link.replace('#', '');
      setTab(tabTarget);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'weather':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'budget':
        return <Tag className="w-4 h-4 text-emerald-600" />;
      case 'reminder':
      case 'trip':
        return <Compass className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatTimeAgo = (dateStr) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        id="notification-bell-btn"
        aria-label="View notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Bell className="w-4 h-4" />
        
        {/* Unread Badge Indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-full">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">No notifications yet</p>
                <p className="text-xs text-slate-500">
                  You'll see real-time updates on weather, routes, and budget tips here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.read;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors relative group ${
                      isUnread ? 'bg-blue-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Icon container */}
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      {getNotificationIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={`text-xs truncate ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    {/* Unread Blue Dot Indicator */}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center"></span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Voyanta Real-time Alerts</span>
            <span className="text-blue-600 font-semibold flex items-center gap-0.5">
              Live updates active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
