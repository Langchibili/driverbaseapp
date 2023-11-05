import HtmlHead from '../components/Meta/HtmlHead'
import HtmlFoot from '../components/Meta/HtmlFoot'
import Content from '@/components/Parts/Content'
import React from 'react';
import { api_url,getLoggedInUserData,getJwt } from '@/Constants';
import PageLoader from '@/components/Includes/PageLoader'
import ContentLoader from '@/components/Includes/ContentLoader'
import UpAndBackButton from '@/components/Includes/UpAndBackButton';

export default function Home() {
  const [data, setData] = React.useState({
    loading: true,
    loggedInUserProfile: null,
  }); // initializing state
  React.useEffect(() => {
     async function fetchData() {
        const loggedInUserProfile = await getLoggedInUserData();
        console.log(loggedInUserProfile)
        setData({
          loading: false,
          loggedInUserProfile: loggedInUserProfile || null
        });
    }
    fetchData();
  }, []);

  return (
    <>
     <UpAndBackButton/>
      <HtmlHead pageTitle='Homepage'/>
      {data.loading? <><PageLoader /><ContentLoader text="DRIVERBASE"/></> : 
      <Content 
            loggedInUserProfile={data.loggedInUserProfile}
            api_url={api_url}
            jwt={getJwt()}/>}
      <HtmlFoot/>
    </>
  )
}
