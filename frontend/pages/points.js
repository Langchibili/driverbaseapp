import React from 'react';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import CopyAndWhatsAppButtons from '@/components/Includes/CopyAndWhatsAppButtons';

export default function Points() {
    return (
    <>
    <UpAndBackButton/>
    <div style={{width:'100%',textAlign:'center',padding:5}}>
        <p style={{fontFamily:"Helvetica"}}>
            Points can be used to <strong>Chat with others</strong> like <strong>A driver with a car owner</strong> and points can also be used to read reviews written about a user.
        </p>
        <div><a href='/payments#points' style={{display:'block', width:'50%',margin:'5px auto 0 auto', padding:5,border:'1px solid green',fontWeight:600, borderRadius:4, color:'green'}}>How Do I Buy Points?</a></div>
    </div>
    </>
  )
}
