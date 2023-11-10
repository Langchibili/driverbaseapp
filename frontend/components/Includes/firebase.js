// pushNotification.js

import { api_url, getJwt, getLoggedInUserData } from '@/Constants';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from "firebase/messaging";

// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0Gp0e5DK84iozOnIfYBSSmtlZFZZByz8",
    authDomain: "driverbase-65205.firebaseapp.com",
    projectId: "driverbase-65205",
    storageBucket: "driverbase-65205.appspot.com",
    messagingSenderId: "452305251845",
    appId: "1:452305251845:web:e0b0da38a105f0ec8a366c",
    measurementId: "G-QK39TGPLYC"
  }



// Request permission to receive push notifications
export const requestNotificationPermission = async () => {
  try {
    await Notification.requestPermission();
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get the current FCM token
export const getFCMToken = async () => {
    const firebaseApp  = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    const loggedInUser = await getLoggedInUserData()
    await getToken(messaging,{vapidKey: 'BPmgbPwPQNl52hz_UQkmlpqlBUo_0R76Zo2VeiNvkgB1m-UuAG30lwoXBF9ZUikFzEDSMTFV1UwVdJZ4SeKV6VA'}).then((currentToken) => {
        if (currentToken) {
            fetch(api_url+'/users/'+loggedInUser.id, { // send token to the backend and attach it to current logged in user
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getJwt()}`
                },
                body: JSON.stringify({deviceId:currentToken})
              })
            //   messaging.onBackgroundMessage((payload) => {
            //     // Customize how push notifications are displayed when the app is in the background
            //     const notificationOptions = {
            //       body: payload.notification.body,
            //     };
            
            //     self.registration.showNotification(payload.notification.title, notificationOptions);
            //   })
          // ...
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
};

// Handle push notifications when the app is in the background
// export const handleBackgroundNotification = () => {
  
// };
