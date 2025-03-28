
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return false;
  }

  let permission = Notification.permission;
  
  // If permission hasn't been granted or denied
  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }
  
  return permission === 'granted';
};

// Create a notification sound
const createNotificationSound = () => {
  const audio = new Audio();
  audio.src = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'; // Using a free Google sound
  audio.load();
  return audio;
};

// Cache the audio object
const notificationSound = createNotificationSound();

export const scheduleNotification = (
  title: string,
  options: NotificationOptions,
  timeInMs: number
): number => {
  // Return a timeout ID that can be used to cancel the notification
  return window.setTimeout(() => {
    showNotification(title, options);
  }, timeInMs);
};

export const showNotification = (
  title: string,
  options: NotificationOptions = {}
): Notification | null => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    requestNotificationPermission(); // Try requesting permission again
    return null;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
    ...options,
  };

  try {
    // Play notification sound
    playNotificationSound();
    
    // Create and return notification
    const notification = new Notification(title, defaultOptions);
    
    // Add click handler
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.data?.url) {
        window.location.href = options.data.url;
      }
    };
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

export const playNotificationSound = () => {
  try {
    // Clone and play the sound to allow overlapping sounds
    if (!notificationSound.paused) notificationSound.pause();
    notificationSound.currentTime = 0;
    notificationSound.play()
      .catch(err => console.error('Error playing notification sound:', err));
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const cancelScheduledNotification = (timeoutId: number): void => {
  window.clearTimeout(timeoutId);
};
