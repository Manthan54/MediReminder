

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
  audio.volume = 1.0; // Maximum volume
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

// Keep sound playing for at least one minute or until interaction
let soundInterval: number | null = null;

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

  // Type-safe options that work with the Notification API
  const defaultOptions: NotificationOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    // Remove vibrate as it's causing TypeScript errors
    ...options,
    requireInteraction: true // Ensure notification stays until user interacts with it
  };

  try {
    // Only play sound if explicitly requested AND not on the auth page
    if (options.data?.playSound !== false && !window.location.pathname.includes('/auth')) {
      startContinuousSound();
    }
    
    // Create and return notification
    const notification = new Notification(title, defaultOptions);
    
    // Add click handler to stop sound and handle notification action
    notification.onclick = () => {
      window.focus();
      stopContinuousSound();
      notification.close();
      if (options.data?.url) {
        window.location.href = options.data.url;
      }
      // Handle accept action
      if (options.data?.onAccept) {
        options.data.onAccept();
      }
    };

    // Add close handler to stop sound
    notification.onclose = () => {
      stopContinuousSound();
    };
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Start playing sound continuously for one minute
export const startContinuousSound = () => {
  // Don't play sounds on the auth page
  if (window.location.pathname.includes('/auth')) {
    return;
  }
  
  // Clear any existing interval first
  stopContinuousSound();
  
  console.log("Starting continuous sound playback");
  
  // Play immediately first
  playNotificationSound();
  
  // Then set interval to play every 3 seconds for at least one minute
  soundInterval = window.setInterval(() => {
    playNotificationSound();
  }, 3000); // Play every 3 seconds
  
  // Stop after one minute if not stopped manually
  setTimeout(() => {
    stopContinuousSound();
  }, 60000); // 1 minute
};

// Stop the continuous sound
export const stopContinuousSound = () => {
  if (soundInterval) {
    console.log("Stopping continuous sound playback");
    clearInterval(soundInterval);
    soundInterval = null;
  }
};

export const playNotificationSound = () => {
  // Don't play sounds on the auth page
  if (window.location.pathname.includes('/auth')) {
    return;
  }
  
  try {
    console.log("Attempting to play notification sound");
    
    // Create a new audio instance each time to avoid issues with simultaneous playback
    const soundToPlay = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
    soundToPlay.volume = 1.0;
    
    // Force play - this creates a user gesture in many browsers
    const playPromise = soundToPlay.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Sound playing successfully");
        })
        .catch(err => {
          console.error('Error playing notification sound:', err);
          
          // Fallback: Try using the cached audio as backup
          notificationSound.currentTime = 0;
          notificationSound.play()
            .catch(fallbackErr => console.error('Fallback sound also failed:', fallbackErr));
        });
    }
  } catch (error) {
    console.error('Error in playNotificationSound function:', error);
  }
};

export const cancelScheduledNotification = (timeoutId: number): void => {
  window.clearTimeout(timeoutId);
};

