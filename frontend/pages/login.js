import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import LoginForm from '@/components/Forms/LoginForm';
import { api_url } from '@/Constants';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';


export default function login(props) {
    return (<>
        <HtmlHead pageTitle='Login'/>
        <UpAndBackButton/>
        <div className="authincation h-100 m-1">
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                <div className="col-md-6">
                    <div className="authincation-content">
                    <div className="row no-gutters">
                        <div className="col-xl-12" >
                           <LoginForm api_url={api_url}/>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        <HtmlFoot/>
        </>)
}
