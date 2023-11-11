import { api_url, getJwt, getLoggedInUserData, serverKey, vapidKey } from '@/Constants';
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
//   try {
//     await Notification.requestPermission();
//     return true;
//   } catch (error) {
//     console.error('Error requesting notification permission:', error);
//     return false;
//   }
// Check if the browser supports the Notification API
if ('Notification' in window) {
    // Check if the current permission is denied
    if (Notification.permission === 'denied') {
       return false
      // Handle the case where notifications are denied
    } 
    else if (Notification.permission === 'granted') {
       return true
      // Handle the case where notifications are already granted
    } 
    else {
      // Request permission for notifications
      return await Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            return true
          // Handle the case where permission is granted
        } else {
            return false
          // Handle the case where permission is denied
        }
      })
    }
  } else {
      return false
    // Handle the case where the Notification API is not supported
  }
  
}

// Get the current FCM token
export const getFCMToken = async () => {
    const firebaseApp  = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    const loggedInUser = await getLoggedInUserData()
    await getToken(messaging,{vapidKey: vapidKey}).then(async (currentToken) => {
        if (currentToken) {
            if(currentToken === null) return null 
            if(loggedInUser.deviceId === null) { // means no token even exists tp userid
                fetch(api_url+'/users/'+loggedInUser.id, { // send token to the backend and attach it to current logged in user
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getJwt()}`
                    },
                    body: JSON.stringify({deviceId:currentToken})
                  })
                  
                  const deviceIds = await fetch(api_url+'/device-id',{
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${getJwt()}`
                    }
                  }).then(response => response.json())
                    .then(data => data)
                    .catch(error => console.error(error))
                    deviceIds.data.attributes.deviceIds.push(currentToken) // add new device id
                
                  fetch(api_url+'/device-id', { // send tokens to the backend and attach it to current logged in user
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getJwt()}`
                    },
                    body: JSON.stringify({data:{deviceIds:deviceIds.data.attributes.deviceIds}})
                  })

                  if(loggedInUser.type === "driver"){ // only drivers can subscribe to newjob notifications
                    fetch('https://iid.googleapis.com/iid/v1/' + currentToken + '/rel/topics/newjob', {
                        method: 'POST',
                        headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'key='+serverKey
                        }),
                     })
                  }
                  
                  return currentToken
            }
            else{
                if(currentToken === loggedInUser.deviceId) return currentToken // means no need updating token, it's the same
                fetch(api_url+'/users/'+loggedInUser.id, { // send token to the backend and attach it to current logged in user
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getJwt()}`
                    },
                    body: JSON.stringify({deviceId:currentToken})
                  }) // otherwise set the token to the new one

                  const deviceIds = await fetch(api_url+'/device-id',{
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${getJwt()}`
                    }
                  }).then(response => response.json())
                    .then(data => data)
                    .catch(error => console.error(error))
                    deviceIds.data.attributes.deviceIds.push(currentToken) // add new device id
                
                  fetch(api_url+'/device-id', { // send tokens to the backend and attach it to current logged in user
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getJwt()}`
                    },
                    body: JSON.stringify({data:{deviceIds:deviceIds.data.attributes.deviceIds}})
                  })
                  if(loggedInUser.type === "driver"){ // only drivers can subscribe to newjob notifications
                    fetch('https://iid.googleapis.com/iid/v1/' + currentToken + '/rel/topics/newjob', {
                        method: 'POST',
                        headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'key='+serverKey
                        }),
                     })
                  }
                  
            }
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
