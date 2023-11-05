import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import CopyAndWhatsAppButtons from '@/components/Includes/CopyAndWhatsAppButtons';
import { Alert, Typography } from '@mui/material';
import HtmlHead from '@/components/Meta/HtmlHead';
import HtmlFoot from '@/components/Meta/HtmlFoot';

export default function Payments() {
    return (
        <>
        <HtmlHead pageTitle="Payments" />
        <div style={{width:'100%',textAlign:'center',padding:5}} id="top">
        <UpAndBackButton/>
        <div style={{width:'70px',margin:'5px auto 0 auto', padding:5,border:'1px solid lightgray'}}><strong style={{fontWeight:900,fontSize:'25px',color:'green',fontFamily:"Helvetica"}}>K10</strong></div>
        <h2 style={{marginTop:5,marginBottom:5}}><Typography component="lagend" sx={{fontWeight:'bold',textTransform:'uppercase'}}>A <strong style={{fontWeight:900,color:'green',fontFamily:"Helvetica"}}>K10</strong> fee has to be paid for any application to be listed. If you applied to any job, it will not be listed until the fee is paid.</Typography></h2>
    
        <div><a href='#whypayafee' style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green',fontWeight:600, borderRadius:4, color:'green'}}>Why Pay A Fee?</a></div>
        <div>
            <h3 style={{marginTop:5,marginBottom:5,opacity:0.7}}><Typography component="legend">(An optional amount of  <strong style={{fontWeight:600,color:'green',fontFamily:"Helvetica"}}>K15</strong> can be paid for any application to be listed among <strong style={{color:"crimson"}}>Recommended Drivers</strong>)</Typography></h3>
            <h3 style={{marginTop:5,marginBottom:10,opacity:0.7}}><Typography component="legend">(An optional amount of <strong style={{fontWeight:600,color:'green',fontFamily:"Helvetica"}}>K100</strong> can be paid to be a premimum user for a month. Meaning on all jobs posted that month, you will be listed among <strong style={{color:"crimson"}}>Recommended Drivers</strong> automatically without further payment)</Typography></h3>
        </div>
        <div><a href='#aboutrecommended'  style={{display:'inline-block', width:'50%', margin:'10px auto 0 auto', padding:5,border:'1px solid green', borderRadius:4, color:'green'}}>What Do You Mean Recommended?</a></div>
        {/* payments guidelines */}
        <h3 style={{marginTop:15,marginBottom:10,fontFamily:"Helvetica", color:"crimson"}}>How To Make A Payment</h3>

        <h3 style={{marginTop:10,marginBottom:5,fontFamily:"Helvetica"}}><Typography component="legend">Airtel Money Payments should strictly be made to this number: <strong style={{fontWeight:900,color:'green'}}>0975630500</strong></Typography></h3>
        <h3 style={{marginTop:10,marginBottom:5,fontFamily:"Helvetica"}}><Typography component="legend">Mtn Money Payments should strictly be made to this number: <strong style={{fontWeight:900,color:'green'}}>0966213952</strong></Typography></h3>
        <p style={{color:'blue',marginBottom:10,fontFamily:"Helvetica"}}><Typography component="legend">Follow the guidelines listed below for airtel money payments</Typography></p>
        <div style={{border:"1px solid lightgray",padding:5,marginBottom:10}}>
            <p style={{fontFamily:"Helvetica"}}>Step 1: ensure that you are using an airtel number</p>
            <p style={{fontFamily:"Helvetica"}}>Step 2: dial *115#</p>
            <p style={{fontFamily:"Helvetica"}}>Step 3: select option 1 : Send Money</p>
            <p style={{fontFamily:"Helvetica"}}>Step 4: select option 1 : Airtel Customers</p>
            <p style={{fontFamily:"Helvetica"}}>Step 5: select option 1 : Enter Number</p>
            <p style={{fontFamily:"Helvetica"}}>Step 6: enter the number provided: <strong style={{fontWeight:900,color:'green'}}>0975630500</strong></p>
            <p style={{fontFamily:"Helvetica"}}>Step 7: enter amount</p>
            <p style={{fontFamily:"Helvetica"}}>Step 8: make sure the name that comes up is: <strong style={{fontWeight:900,color:'green'}}>Goldwyn Zimba</strong></p>
            <p style={{fontFamily:"Helvetica",marginBottom:10}}>Step 9: then enter your pin to confirm</p>
        </div>
        <p style={{color:'blue',marginBottom:10,fontFamily:"Helvetica"}}><Typography component="legend">After making payments, you can come back to this page to text us</Typography></p>

        <div id="textusonwhatsapp" style={{maxWidth:500,margin:'0 auto',fontFamily:"Helvetica"}}><CopyAndWhatsAppButtons buttonText="Text Us On WhatsApp" info={<><></>To make sure we consider your payment, you must send a whatsapp message with proof to: <strong><span id="copyNumber">+260966213952</span></strong></>}/> 
        
        {/* you must send proof stuff */}
        <Alert severity='warning'><strong>You must send us a screenshot of the transaction, as proof of payment, otherwise we will not consider your payment.<br/> Along with proof of payment, send your <strong>username</strong>. And please note that any mistakes you make in your transactions, we are not responsible and we shall not refund.</strong></Alert></div>
        <div><a href='#validproof'  style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid forestgreen', borderRadius:4, color:'forestgreen'}}>But what is valid payment proof?</a></div>
        and
        <div><a href='#invalidproof'  style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid crimson', borderRadius:4, color:'crimson'}}>What is not valid payment proof?</a></div>
        
        {/* why we charge a fee? */}
        <div style={{border:"1px solid lightgray",padding:5,marginTop:10}} id="whypayafee">
                <h3 style={{marginTop:10,marginBottom:10,fontFamily:"Helvetica"}}>Why We Charge a Fee for Job Applications?</h3>
                
                <p style={{fontFamily:"Helvetica"}}>
                    We understand that you might have questions about why we charge a fee for job applications on our site. We want to assure you that this decision was made after careful consideration and for the benefit of both job applicants and employers.
                </p>
                <p style={{fontFamily:"Helvetica"}}>
                    <strong>1. Quality Assurance:</strong> Charging a small fee helps ensure that the applicants who apply are genuinely interested in the positions they are applying for. This reduces the number of spam or non-serious applications, making the job search process more efficient for everyone.
                </p>
                <p style={{fontFamily:"Helvetica"}}>
                    <strong>2. Investment in Your Success:</strong> We take your job search seriously and believe that the fee you pay is an investment in your career. It helps us maintain and improve our platform to provide you with better job opportunities and services.
                </p>
                <p style={{fontFamily:"Helvetica"}}>
                    <strong>3. Support for Employers:</strong> By charging a nominal fee, we can offer a more robust and effective platform for employers. This, in turn, attracts a wider range of job opportunities, giving you a better chance of finding the perfect job.
                </p>
                <p style={{fontFamily:"Helvetica"}}>
                    <strong>4. Fair and Equal Opportunity:</strong> Our goal is to provide equal opportunities to all applicants. Charging a fee ensures that everyone has access to the same application process, regardless of their financial situation.
                </p>
                <p style={{fontFamily:"Helvetica"}}>
                    <strong>5. Reducing Spam and Fraud:</strong> A small fee helps us deter potential scammers and those with malicious intentions from using our platform, making it safer for all users.
                </p>
                <p style={{fontFamily:"Helvetica"}}>
                    We appreciate your understanding and support in making our job platform the best it can be. If you have any questions or concerns, please don't hesitate to reach out to our customer support team. We're here to help and make your job search as effective as possible.
                </p>
                <p style={{fontFamily:"Helvetica",color:'green'}}>Thank you for choosing our platform to further your career.</p>
                <div><a href='#top'  style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green', borderRadius:4, color:'green'}}>Go Back Up</a></div>

            {/* more about  recommended driver listings*/}
                <h3 id='aboutrecommended' style={{marginTop:15,marginBottom:10,fontFamily:"Helvetica", color:"crimson"}}>About recommend driver listing.</h3>
                <p style={{fontFamily:"Helvetica"}}>
                    These are drivers listed with a recommendation tag, they have higher chances of getting employed.
                </p>
                <h4 style={{marginTop:10,marginBottom:10,fontFamily:"Helvetica", color:"crimson"}}>Example of a recomended driver listing.</h4>
                <div style={{maxWidth:'400px',margin:'0 auto'}}>
                    <img style={{width:'100%'}} src='/screenshot-of-recomended-drivers-listing.png' />
                </div>
                <div><a href='#top'  style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green', borderRadius:4, color:'green'}}>Go Back Up</a></div>
                
                {/* more about payment proofs */}
                <h3 id='validproof' style={{marginTop:15,marginBottom:10,fontFamily:"Helvetica", color:"crimson"}}>About What Are Valid And Invalid Payment Proofs</h3>
                <p style={{fontFamily:"Helvetica"}}>
                    We shall not enlist you until you provide eligible proof. With at least the AirtelMoney or Mtn Money Written on the proofs of payment screenshots.
                </p>
                <h4 style={{marginTop:10,marginBottom:10,fontFamily:"Helvetica", color:"forestgreen"}}>Examples Of Valid Proofs Below.</h4>
                <div style={{maxWidth:'400px',margin:'0 auto'}}>
                    <img style={{width:'100%',marginBottom:10}} src='/valid-proof-1.jpg' />
                    <img style={{width:'100%',marginBottom:10}} src='/valid-proof-2.jpeg' />
                    {/* <img style={{width:'100%',marginBottom:10}} src='/valid-proof-3.jpg' /> */}
                    <img style={{width:'100%',marginBottom:10}} src='/valid-proof-4.jpg' />
                    <img style={{width:'100%',marginBottom:10}} src='/valid-proof-5.jpeg' />
                </div>

                <h4 id='invalidproof' style={{marginTop:10,marginBottom:10,fontFamily:"Helvetica", color:"red"}}><strong>Examples Of invalid Proofs Below.</strong></h4>
                <div style={{maxWidth:'400px',margin:'0 auto'}}>
                    <img style={{width:'100%',marginBottom:10}} src='/invalid-proof-1.jpg' />
                    <img style={{width:'100%',marginBottom:10}} src='/invalid-proof-2.jpg' />
                    <img style={{width:'100%',marginBottom:10}} src='/invalid-proof-3.jpg' />
                </div>
            
                <div><a href='#top'  style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green', borderRadius:4, color:'green'}}>Go Back Up</a></div>
        
        
            {/* more about  points*/}
            <h3 style={{marginTop:15,marginBottom:10,fontFamily:"Helvetica", color:"crimson"}}>About points and how to buy them.</h3>
                <p style={{fontFamily:"Helvetica"}}>
                    Points can be used to <strong>Chat with others</strong> like <strong>A driver with a car owner</strong> and points can also be used to read reviews written about a user.
                </p>
                <h4 id='points' style={{marginTop:10,marginBottom:10,fontFamily:"Helvetica", color:"crimson"}}>But how do you buy points?</h4>
                <p style={{fontFamily:"Helvetica",paddingBottom:10}}>
                    Currently  <strong style={{color:'crimson'}}>2</strong> points cost <strong style={{color:'forestgreen'}}>K1</strong> and the same way you pay for applications is how you buy points. 
                    You make payments to the same numbers shown on top of this page, and then you send screenshots of proof of payment to the same number. 
                    And you tell us what your <strong>username</strong> is so that we grant you the points. 
                    To ensure that you do not miss important replies from other users, make sure you buy enough points before you chat with anyone
                </p>
                
                <div><a href='#textusonwhatsapp' style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green',fontWeight:600, borderRadius:4, color:'green'}}>Text Us The Payment Proof</a></div>
                <div><a href='#top'  style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green', borderRadius:4, color:'green'}}>Go Back Up</a></div>
                
        </div>
        </div>
        <HtmlFoot/>
    </>
  )
}

// if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
//     Notification.requestPermission()
//       .then(permission => {
//         if (permission === 'granted') {
//           return navigator.serviceWorker.ready;
//         }
//       })
//       .then(registration => {
//         if (registration) {
//           return registration.pushManager.getSubscription();
//         }
//       })
//       .then(subscription => {
//         // Check if a subscription exists; if not, you can subscribe the user
//         if (!subscription) {
//           return registration.pushManager.subscribe({ userVisibleOnly: true });
//         }
//       })
//       .then(newSubscription => {
//         // The newSubscription object now contains the notification token
//         console.log('Notification Token:', newSubscription.endpoint);
//       })
//       .catch(error => {
//         // An error occurred while getting the notification token
//       });
//   }
  
