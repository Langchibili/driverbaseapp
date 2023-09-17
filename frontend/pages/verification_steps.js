import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import React from 'react';
import Alert from '@mui/material/Alert'; 

export default function verificationSteps() {
    return (
    <>
    <UpAndBackButton/>
    <Alert severity="info"> steps to verify account page is under construction, it will be released on next app update</Alert>
    </>
  )
}