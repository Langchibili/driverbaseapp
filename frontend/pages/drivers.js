import React from 'react';
import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import ItemListAll from '@/components/Lists/ItemListAll';
import { api_url, getLoggedInUserData } from '@/Constants';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';


export default function drivers(props) {
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
        {data.loading? <><PageLoader /><ContentLoader text="DRIVERBASE"/></> : 
        <><UpAndBackButton/>
        <HtmlHead pageTitle='Drivers'/>
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                <div className="col-md-6">
                    <div className="row no-gutters">
                        <div className="col-xl-12" >
                        <ItemListAll
                            loggedInUserProfile={data.loggedInUserProfile}
                            itemsName ='users'
                            reqUrlPath={'/driver-profiles?populate=details,details.profile_thumbnail_image'}
                            api_url={api_url}
                            listType="drivers" />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        <HtmlFoot/></>}
        </>   
    )
}
