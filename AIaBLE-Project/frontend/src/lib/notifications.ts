export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export function addNotification(title: string, message: string) {
  if (typeof window === 'undefined') return;
  const notif: Notification = {
    id: Date.now().toString(),
    title,
    message,
    createdAt: Date.now(),
    read: false,
  };
  
  const saved = JSON.parse(localStorage.getItem('aiable_notifications') || '[]');
  const updated = [notif, ...saved].slice(0, 50); // keep last 50
  localStorage.setItem('aiable_notifications', JSON.stringify(updated));
  
  window.dispatchEvent(new CustomEvent('aiable_notification', { detail: notif }));
}

export function getNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('aiable_notifications') || '[]');
}

export function markAllAsRead() {
  if (typeof window === 'undefined') return;
  const saved = getNotifications();
  const updated = saved.map(n => ({ ...n, read: true }));
  localStorage.setItem('aiable_notifications', JSON.stringify(updated));
  window.dispatchEvent(new Event('aiable_notifications_read'));
}
