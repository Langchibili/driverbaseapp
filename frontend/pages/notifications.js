// import styles from "@/styles/Home.module.css";
// import PushNotificationLayout from '@/components/Includes/PushNotificationLayout';
import React from "react";
import { requestNotificationPermission, getFCMToken, handleBackgroundNotification } from "@/components/Includes/firebase";
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import sendNotification, { getLoggedInUserData } from "@/Constants";

export default function Notifications() {
  return (
    <Notify/>
  );
}

class Notify extends React.Component{
   async componentDidMount(){
    const firebaseConfig = {
        apiKey: "AIzaSyA0Gp0e5DK84iozOnIfYBSSmtlZFZZByz8",
        authDomain: "driverbase-65205.firebaseapp.com",
        projectId: "driverbase-65205",
        storageBucket: "driverbase-65205.appspot.com",
        messagingSenderId: "452305251845",
        appId: "1:452305251845:web:e0b0da38a105f0ec8a366c",
        measurementId: "G-QK39TGPLYC"
      }
     
    const firebaseApp  = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    
        // Example usage in a Next.js component
        async function requestPermissionAndToken() {
            const permissionGranted = await requestNotificationPermission();
            if(permissionGranted) {
                 getFCMToken(); // if user has allowed notifications, then send it to the server
            }
        }
        await requestPermissionAndToken()
        const loggedInUser = await getLoggedInUserData()
        sendNotification('ok then','how you doing now?',loggedInUser.deviceId)
        // Call the function to handle push notifications when the app is in the background
       // handleBackgroundNotification(messaging);
    }
    render(){
        return<>allow notifications</>
    }
}