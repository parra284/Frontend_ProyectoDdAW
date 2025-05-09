import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from './firebaseConfig';

export const initializeMessaging = () => {
  const messaging = getMessaging(firebaseApp);

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    alert(`Notification: ${payload.notification.title} - ${payload.notification.body}`);
  });
};
