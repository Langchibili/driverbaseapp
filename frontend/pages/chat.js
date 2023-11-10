import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import React from 'react';
import { useRouter } from 'next/router';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import HtmlHead from '@/components/Meta/HtmlHead';
import HtmlFoot from '@/components/Meta/HtmlFoot';
import ChatHome from '@/components/ChatApp/ChatHome';
import { getLoggedInUserWithChatData } from '@/Constants';


export default function Chat() {
    const router = useRouter();
    let { uid } = router.query
    const [data, setData] = React.useState({ loading: true, loggedInUserProfile: null });
    
    React.useEffect(() => {
      if (uid && uid !== undefined) {
        async function fetchData() {
          const loggedInUserProfile = await getLoggedInUserWithChatData() 
          setData({ loading: false, loggedInUserProfile: loggedInUserProfile });
        }
        fetchData();
      }
    }, [uid]);
    if(data.loading  || data.loggedInUserProfile === null) {
        return (<><PageLoader /> <HtmlHead pageTitle='Chat'/><ContentLoader text='loading chat...'/><HtmlFoot/> </>)
    }
    if(data.loggedInUserProfile === 'logged-out') { 
      window.location = '/login' // you should re-log in
      return
    }
    // uid !== 0 because if a user opens chat app without setting a uid, then user has not selected a chat
    uid = parseInt(uid) // has to be a number not a string as in, 0 not '0'
    return ( <html lang="en" dir="ltr" className="group" data-theme-color="green" data-mode="dark"><div style={{maxWidth:'800px',margin:'0 auto'}}><ChatHome loggedInUserProfile={data.loggedInUserProfile} uid={uid} chatSelected={uid !== 0}/></div></html>
  )
}
