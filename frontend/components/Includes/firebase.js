import { api_url, getJwt, getLoggedInUserData, getUserFromUid, serverKey, vapidKey } from '@/Constants';
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
export const getFCMToken = async (customjwt=null,uid=null) => {
    const firebaseApp  = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    let loggedInUser,jwt
    if(customjwt === null) { // this means a user is using a different browser
        jwt = getJwt()
        loggedInUser = await getLoggedInUserData()
    }
    else{ // this means a user is logged in
        jwt = getJwt(customjwt)
        loggedInUser = await getUserFromUid(uid)
    }
    if ('Notification' in window) {
        if (Notification.permission === 'denied') {
            if(loggedInUser.deviceId === null) return null
            if(loggedInUser.deviceId === undefined) return null
            return loggedInUser.deviceId
         } 
        return await getToken(messaging,{vapidKey: vapidKey}).then(async (currentToken) => {
            if (currentToken) {
                if(currentToken === null) {
                    if(loggedInUser.deviceId === null) return null
                    if(loggedInUser.deviceId === undefined) return null
                    return loggedInUser.deviceId
                }
                if(loggedInUser.deviceId === null) { // means no token even exists tp userid
                    fetch(api_url+'/users/'+loggedInUser.id, { // send token to the backend and attach it to current logged in user
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
                        },
                        body: JSON.stringify({deviceId:currentToken})
                      })
                      
                      const deviceIds = await fetch(api_url+'/device-id',{
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${jwt}`
                        }
                      }).then(response => response.json())
                        .then(data => data)
                        .catch(error => console.error(error))
                        deviceIds.data.attributes.deviceIds.push(currentToken) // add new device id
                    
                      fetch(api_url+'/device-id', { // send tokens to the backend and attach it to current logged in user
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
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
                            'Authorization': `Bearer ${jwt}`
                        },
                        body: JSON.stringify({deviceId:currentToken})
                      }) // otherwise set the token to the new one
    
                      const deviceIds = await fetch(api_url+'/device-id',{
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${jwt}`
                        }
                      }).then(response => response.json())
                        .then(data => data)
                        .catch(error => console.error(error))
                        deviceIds.data.attributes.deviceIds.push(currentToken) // add new device id
                    
                      fetch(api_url+'/device-id', { // send tokens to the backend and attach it to current logged in user
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
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
               
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                requestNotificationPermission()
                if(loggedInUser.deviceId === null) return null
                if(loggedInUser.deviceId === undefined) return null
                return loggedInUser.deviceId
            }
          }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                requestNotificationPermission()
                if(loggedInUser.deviceId === null) return null
                if(loggedInUser.deviceId === undefined) return null
                return loggedInUser.deviceId
            // ...
          });
    }
    else{
        if(loggedInUser.deviceId === null) return null
        if(loggedInUser.deviceId === undefined) return null
        return loggedInUser.deviceId
    }
}

// Handle push notifications when the app is in the background
// export const handleBackgroundNotification = () => {
  
// };


 //   messaging.onBackgroundMessage((payload) => {
            //     // Customize how push notifications are displayed when the app is in the background
            //     const notificationOptions = {
            //       body: payload.notification.body,
            //     };
            
            //     self.registration.showNotification(payload.notification.title, notificationOptions);
            //   })
          // ...