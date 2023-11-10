importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyA0Gp0e5DK84iozOnIfYBSSmtlZFZZByz8",
    authDomain: "driverbase-65205.firebaseapp.com",
    projectId: "driverbase-65205",
    storageBucket: "driverbase-65205.appspot.com",
    messagingSenderId: "452305251845",
    appId: "1:452305251845:web:e0b0da38a105f0ec8a366c",
    measurementId: "G-QK39TGPLYC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize how push notifications are displayed when the app is in the background
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(payload.notification.title, notificationOptions);
});

// messaging.onBackgroundMessage((payload) => {
//     console.log(
//       '[firebase-messaging-sw.js] Received background message ',
//       payload
//     );
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/firebase-logo.png'
//     };
  
//     self.registration.showNotification(notificationTitle, notificationOptions);
//   });