import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import Alert from '@mui/material/Alert'; 
export default function Search() {
    return (
    <>
    <UpAndBackButton/>
    <Alert severity="info">this page is under construction, 
    it will be released on next app update.
     Try to visit the drivers, jobs and car owners pages to find the user or job you are looking for</Alert>
    </>
  )
}