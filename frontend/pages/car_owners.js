import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import ItemListAll from '@/components/Lists/ItemListAll';
import { api_url,getJwt } from '@/Constants';
import { useRouter } from 'next/router';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';


export default function car_owners(props) {
    
    return (
        <>
        <HtmlHead pageTitle='CarOwners'/>
        <UpAndBackButton/>
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                <div className="col-md-6">
                    <div className="row no-gutters">
                        <div className="col-xl-12" >
                        <ItemListAll
                            reqUrlPath={'/car-owner-profiles?populate=details,details.profile_thumbnail_image'}
                            itemsName='users'
                            listType='car-owners'
                            api_url={api_url}/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        <HtmlFoot/>
        </>   
    )
}
