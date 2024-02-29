import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import HtmlHead from '@/components/Meta/HtmlHead';
import HtmlFoot from '@/components/Meta/HtmlFoot';
import CopyAndWhatsAppButtons from '@/components/Includes/CopyAndWhatsAppButtons';
import { Phone, PhoneAndroid } from '@mui/icons-material';
import { Button } from '@mui/material';
import Link from 'next/link';
import { PhoneCallback } from '@material-ui/icons';


export default function AdLanding() {
    const router = useRouter();
    const [loading,setLoading] = useState(true)
    let { cname,cnum } = router.query
     
    React.useEffect(() => {
      if (cname !== null && cname !== undefined) {
        setLoading(false);
      }
    }, [cname]);
    if(loading) {
         return (<><PageLoader /> <HtmlHead pageTitle='AdLanding'/><ContentLoader text='loading information...'/><HtmlFoot/> </>)
    }
    return <div style={{textAlign:'center'}}>
        <CopyAndWhatsAppButtons buttonText={"Text "+cname+" On WhatsApp" } info={<>Contact {cname}: <strong><span id="copyNumber">{cnum}</span></strong></>}/>
        <Button><Link href={'tel://'+cnum}><Phone />{" Call "+cname}</Link></Button>
        </div>

  
}
