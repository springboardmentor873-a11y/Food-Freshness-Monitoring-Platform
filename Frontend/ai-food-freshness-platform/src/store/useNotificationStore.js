import { create } from 'zustand';
import { MOCK_NOTIFICATIONS } from '../constants/mockData';

export const useNotificationStore = create((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false })),
    })),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          id: 'notif-' + Date.now(),
          timestamp: 'Just now',
          unread: true,
          ...notif,
        },
        ...state.notifications,
      ],
    })),

  clearAll: () => set({ notifications: [] }),
}));
