import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getFCMToken, requestNotificationPermission } from "./components/Includes/firebase";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const fakeStr1 = 'kahs3lahebblo2uwb00an~va5lwi_ad_fgaljdj'; // security stuff
export const fakeStr2 ='klahewi_ad_fgalloanv;;aitalkjfajhsbbluwba==hn3vajd5j=+;'
  
 /*localhost: */ export const environment = 'local'
 ///*liveserver: */ export const environment = 'live'
 // /*testserver: */ export const environment = 'test'

 let apiurl, backendUrl, socketurl, clienturl
 if(environment === 'local'){
   /*localhost: */  apiurl = 'http://localhost:1337/api'
 }
 else if(environment === 'live'){
   /*liveserver: */ apiurl = 'https://api.driverbase.app/api' // for production's sake
 }
 else if(environment === 'test'){
  /*testserver: */  apiurl = 'https://testapi.driverbase.app/api' // the api to be used when deployed to the test site
 }
 else{
    /*liveserver: */ apiurl = 'https://api.driverbase.app/api' // for production's sake
 }

 // for removing the api part when handling /uploads and the like
 if(environment === 'local'){
  /*localhost: */  backendUrl = apiurl.replace('http://localhost:1337/api','http://localhost:1337')
 }
 else if(environment === 'live'){
  /*liveserver: */ backendUrl =  apiurl.replace('driverbase.app/api','driverbase.app') // for production's sake
 }
 else if(environment === 'test'){
  /*testserver: */ backendUrl =  apiurl.replace('testapi.driverbase.app/api','testapi.driverbase.app') // the api to be used when deployed to the test site
 }
 else{
  /*liveserver: */ backendUrl =  apiurl.replace('driverbase.app/api','driverbase.app') // for production's sake
 }


if(environment === 'local'){
  /*localhost: */  socketurl = 'http://localhost:3002'
}
else if(environment === 'live'){
  /*liveserver: */ socketurl = 'https://socket.driverbase.app' // for production's sake
}
else if(environment === 'test'){
 /*testserver: */  socketurl = 'https://testsocket.driverbase.app' // the api to be used when deployed to the test site
}
else{
   /*liveserver: */ socketurl = 'https://socket.driverbase.app' // for production's sake
}


if(environment === 'local'){
  /*localhost: */  clienturl = 'http://localhost:3000'
}
else if(environment === 'live'){
  /*liveserver: */ clienturl = 'https://driverbase.app' // for production's sake
}
else if(environment === 'test'){
 /*testserver: */  clienturl = 'https://test.driverbase.app' // the api to be used when deployed to the test site
}
else{
   /*liveserver: */ clienturl = 'https://driverbase.app' // for production's sake
}


// export the urls
export let api_url = apiurl
export let backEndUrl = backendUrl
export let socketUrl = socketurl
export let clientUrl = clienturl

// firebase stuff
export const vapidKey = 'BPmgbPwPQNl52hz_UQkmlpqlBUo_0R76Zo2VeiNvkgB1m-UuAG30lwoXBF9ZUikFzEDSMTFV1UwVdJZ4SeKV6VA'
export const serverKey = 'AAAAaU9-bgU:APA91bEFdjOkan1oW6YSRNu2CxjF0pRzFijJ5-nMymQCzeK_uNJ8kMsfyU1rXalWzaZLOZehN3O6YybXybj6wQz74_lelww-RT3mpG1ubcBZKMilVvECeeBZxiEnTtm4ZozAPqlAWRje'

export function getJwt(customjwt=null){
    userHasConnection() // check the internet connection
    if(customjwt === null || customjwt === undefined){
      let jwt = localStorage.getItem('jwt')
      if(jwt === undefined || jwt === null){
          localStorage.setItem('jwt','o')
          return null
      }
      else{
          if(jwt === 'o'){
            return null
          }
          jwt = localStorage.jwt.split(fakeStr1)[1]
          return jwt.split(fakeStr2)[0]
      }
    }
    else{
      let jwt = customjwt.split(fakeStr1)[1]
      return jwt.split(fakeStr2)[0]
    }
} 

export const driver_populate_url = 'populate=driverProfile,driverProfile.details,driverProfile.details.address,driverProfile.details.profile_cover_image,driverProfile.details.profile_thumbnail_image,driverProfile.driving_license_front,driverProfile.drivers_license_back,driverProfile.driving_certificate_front,driverProfile.driving_certificate_back,driverProfile.nrc_front,driverProfile.nrc_back'
export const driver_populate_with_chat_url = 'populate=chatRooms,chatRooms.participants,driverProfile,driverProfile.details,driverProfile.details.address,driverProfile.details.profile_cover_image,driverProfile.details.profile_thumbnail_image,driverProfile.driving_license_front,driverProfile.drivers_license_back,driverProfile.driving_certificate_front,driverProfile.driving_certificate_back,driverProfile.nrc_front,driverProfile.nrc_back'
export const minimal_driver_populate_url = 'populate=driverProfile,driverProfile.details,driverProfile.details.profile_thumbnail_image'
export const car_owner_populate_url = 'populate=carOwnerProfile,carOwnerProfile.details,carOwnerProfile.details.address,carOwnerProfile.details.profile_cover_image,carOwnerProfile.details.profile_thumbnail_image'
export const car_owner_populate__with_chat_url = 'populate=chatRooms,chatRooms.participants,carOwnerProfile,carOwnerProfile.details,carOwnerProfile.details.address,carOwnerProfile.details.profile_cover_image,carOwnerProfile.details.profile_thumbnail_image'
export const minimal_car_owner_populate_url = '?populate=details,details.profile_thumbnail_image'

async function userHasConnection(){
  const checkConnection = await fetch(api_url+'/featured-users',{
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if(!checkConnection.ok){
     alert('You seem to have an internet connection problem, this app requires an internet connection. So this screen shall continue reloading until an active connection is set.')
     window.location = ''
    return
  }
}

export async function getLoggedInUserData(populateExtension={carOwnerProfile: '', driverProfile: ''}){
    if(getJwt() === null) return 'logged-out' // you are looged out
    let url
    const user = await fetch(api_url+'/users/me',{
      headers: {
        'Authorization': `Bearer ${getJwt()}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
    if(user === undefined) return 'logged-out' // means couldn't connect well, so leave u logged out
    if('error' in user) return 'logged-out' //it means you are looged out
      //.catch(error => return 'logged-out')
     // get user first to check type, coz we don't know whether user is a driver or car owner
    if(user.type === 'driver') url = api_url+'/users/me/?'+driver_populate_url+populateExtension.driverProfile
    if(user.type === 'car-owner') url = api_url+'/users/me/?populate=carOwnerProfile,carOwnerProfile.details,carOwnerProfile.details.address,carOwnerProfile.details.profile_cover_image,carOwnerProfile.details.profile_thumbnail_image'+populateExtension.carOwnerProfile
    
    return await fetch(url,{
      headers: {
        'Authorization': `Bearer ${getJwt()}`,
        'Content-Type': 'application/json'
      }
     }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
  }


  export async function getLoggedInUserWithChatData(){
    if(getJwt() === null) return 'logged-out' // you are looged out
    let url
    const user = await fetch(api_url+'/users/me',{
      headers: {
        'Authorization': `Bearer ${getJwt()}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
    if(user === undefined) return 'logged-out' // means couldn't connect well, so leave u logged out
    if('error' in user) return 'logged-out' //it means you are looged out
      //.catch(error => return 'logged-out')
     // get user first to check type, coz we don't know whether user is a driver or car owner
    if(user.type === 'driver') url = api_url+'/users/me/?'+driver_populate_with_chat_url
    if(user.type === 'car-owner') url = api_url+'/users/me/?'+car_owner_populate__with_chat_url
    
    return await fetch(url,{
      headers: {
        'Authorization': `Bearer ${getJwt()}`,
        'Content-Type': 'application/json'
      }
     }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
  }

  
  export const getUserProfileUid = async (uid)=>{
    let url
    const user = await fetch(api_url+'/users/'+uid,{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    if(user === undefined) return 'not-found' // means couldn't connect well, so leave u logged out
    if('error' in user) return 'not-found' //it means you are looged out
    //.catch(error => return 'logged-out')
    // get user first to check type, coz we don't know whether user is a driver or car owner
    if(user.type === 'driver') url = api_url+'/users/'+uid+'/?'+driver_populate_url
    if(user.type === 'car-owner') url = api_url+'/users/'+uid+'/?'+car_owner_populate_url
    
    const profile =  await fetch(url,{
      headers: {
        'Content-Type': 'application/json'
      }
     }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
      
    if(profile === undefined) return 'no-profile'
    if('error' in profile) return 'no-profile'
    if(user.type === 'driver'){
      if(profile.driverProfile === undefined) return 'no-profile'
      if(profile.driverProfile === null) return 'no-profile'
      if(profile.driverProfile.details === undefined) return 'no-profile'
      if(profile.driverProfile.details === null) return 'no-profile'
    }
    if(user.type === 'car-owner'){
      if(profile.carOwnerProfile === undefined) return 'no-profile'
      if(profile.carOwnerProfile === null) return 'no-profile'
      if(profile.carOwnerProfile.details === undefined) return 'no-profile'
      if(profile.carOwnerProfile.details === null) return 'no-profile'
    }
    return profile  
 } 
  
 export async function getUserFromUid(uid){
    const user = await fetch(api_url+'/users/'+uid,{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    if(user === undefined) return 'not-found' // means couldn't connect well, so leave u logged out
    if(user === null) return 'not-found' // means couldn't connect well, so leave u logged out
    if('error' in user) return 'not-found' //it means you are looged out
    return user
  }

  export const imageUrlFormat = (image,formatWanted)=>{
    if(image === undefined || image === null) return '/uploads/default-profile.png' 
    
    if(formatWanted === 'original'){
      return image.url
    }
    if(image.hasOwnProperty('formats')){
       if(image.formats.hasOwnProperty(formatWanted)){
        return image.formats[formatWanted].url
       }
    }
    if(!image.url){
        if(formatWanted === 'cover'){
          return '/uploads/no-cover-photo.jpg'
        }
        return '/uploads/default-profile.png' 
    }
    return image.url
  }

  export const textHasPhoneNumber = (text)=>{
    // Regular expression to match sequences of digits that are 8 characters or longer
    const phoneNumberRegex = /[0-9]{8,}/;
    // Use the test method to check if the text contains a phone number
    return phoneNumberRegex.test(text);
  }

  export const textHasEmailAddress = (text)=> {
    // Regular expression to match email addresses
    const emailRegex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/;
    // Use the test method to check if the text contains an email address
    return emailRegex.test(text);
  }

  export function emitEvent(socket,eventType, data){ // an even emitting function for sockets
    socket.emit(eventType, data)
  } 

export async function sendNotification(title,body,target,publish_status="publish",type="single",payload="",topic="newjob",image="https://driverbase.app/DriverBaseTransparentBackground.png"){
  const targetType = type === "single"? "tokens" : "topics"
  let targetDevice,uid,notificationObject 
  if(type === "single"){ 
      uid = target  // means the target parameter is a user's id
      const user = await getUserFromUid(uid)
      console.log('the other one',user)
      if(user === 'not-found') return
      targetDevice = user.deviceId

      notificationObject =  {
        data: {
            title: title,
            body: body,
            image: image,
            payload: payload,
            targetType: targetType,
            target: targetDevice
        }
    }
  }
  else{ // means u wanna broadcast the message
    const response = await fetch(api_url+'/device-id',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getJwt()}`
      }
    }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
      const deviceIds = response.data.attributes.deviceIds // get available devices
      
    notificationObject =  {
        data:{
            title: title,
            body: body,
            image: image,
            payload: payload,
            targetType: 'topics',
            target: topic
         }
     }
  }
  

  if(publish_status !== "publish") notificationObject.data.publishedAt = null  // means it's a draft
  fetch(api_url+'/strapi-plugin-fcm/fcm-notifications', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getJwt()}`
    },
    body: JSON.stringify(notificationObject)
  })
}

  
const firebaseConfig = {
  apiKey: "AIzaSyA0Gp0e5DK84iozOnIfYBSSmtlZFZZByz8",
  authDomain: "driverbase-65205.firebaseapp.com",
  projectId: "driverbase-65205",
  storageBucket: "driverbase-65205.appspot.com",
  messagingSenderId: "452305251845",
  appId: "1:452305251845:web:e0b0da38a105f0ec8a366c",
  measurementId: "G-QK39TGPLYC"
}
// Example usage in a Next.js component
export async function requestNotificationPermissionAndToken() {
  const permissionGranted = await requestNotificationPermission();
  if(permissionGranted) {
       return getFCMToken(); // if user has allowed notifications, then send it to the server
  }
}

// // Initialize Firebase
// export function pushNotifications(){
// Notification.requestPermission().then((permission) => {
//   const firebaseApp  = initializeApp(firebaseConfig);

//   const messaging = getMessaging(firebaseApp);
//   if (permission === 'granted') {
//     console.log('Notification permission granted.');
//     // TODO(developer): Retrieve a registration token for use with FCM.
//     // In many cases once an app has been granted notification permission,
//     // it should update its UI reflecting this.
//     return resetUI(messaging);
//   } else {
//     console.log('Unable to get permission to notify.');
//   }
// })
// // Add the public key generated from the console here.
// //getToken(messaging, {vapidKey: "BPmgbPwPQNl52hz_UQkmlpqlBUo_0R76Zo2VeiNvkgB1m-UuAG30lwoXBF9ZUikFzEDSMTFV1UwVdJZ4SeKV6VA"});
 
// function resetUI(messaging) {
//   //clearMessages();
//  // showToken('loading...');
//   // Get registration token. Initially this makes a network call, once retrieved
//   // subsequent calls to getToken will return from cache.
//   getToken({vapidKey: 'BPmgbPwPQNl52hz_UQkmlpqlBUo_0R76Zo2VeiNvkgB1m-UuAG30lwoXBF9ZUikFzEDSMTFV1UwVdJZ4SeKV6VA'}).then((currentToken) => {
//     if (currentToken) {
//       return currentToken
//       // sendTokenToServer(currentToken);
//       // updateUIForPushEnabled(currentToken);
//     } else {
//       // Show permission request.
//       console.log('No registration token available. Request permission to generate one.');
//       // Show permission UI.
//       // updateUIForPushPermissionRequired();
//       // setTokenSentToServer(false);
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // showToken('Error retrieving registration token. ', err);
//     // setTokenSentToServer(false);
//   });
// }

// }