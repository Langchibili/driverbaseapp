import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import CopyAndWhatsAppButtons from '@/components/Includes/CopyAndWhatsAppButtons';

export default function verificationSteps() {
    return (
    <>
    <UpAndBackButton/>
    <CopyAndWhatsAppButtons buttonText="Text Us On WhatsApp" info={<>To get your account verified, please send a whatsapp message to: <strong><span id="copyNumber">+260954816277</span></strong></>}/>
    </>
  )
}


