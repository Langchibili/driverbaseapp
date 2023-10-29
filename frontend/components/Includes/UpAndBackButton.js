import React from "react";
import { useRouter } from 'next/router'
import Fab from '@mui/material/Fab';
import { Stack } from "@mui/material";
import Link from "next/link";
import { ArrowBackOutlined, ArrowUpward, Home, HomeOutlined } from "@mui/icons-material";
import LogoArea from "../Parts/LogoArea";
 
export default function UpAndBackButton() {
  const router = useRouter()
  const { inApp,homePath } = router.query;
  
  return (
       <Stack sx={{ position: 'fixed', zIndex:1, bottom: 16, right: 16 }}>
            {/*<Fab sx={{ marginBottom: 1 }} size="small"  aria-label="add" onClick={()=> router.push('/')}>
                <HomeOutlined color="secondary"/>
              </Fab>*/}
            <Link href='/'>
                <Fab size="small" aria-label="arrow">
                    <Home color="secondary"/>
                </Fab>
            </Link>
            <Fab sx={{ marginTop: 0.5}} size="small"  aria-label="add" onClick={()=> router.back()}>
                <ArrowBackOutlined color="secondary"/>
            </Fab>
            {/* <Link href='#'>
                <Fab size="small" aria-label="arrow">
                    <ArrowUpward  color="secondary"/>
                </Fab>
            </Link> */}
        </Stack>
  )
}

