import { Box, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Stack } from '@mui/material'
import React from 'react'
import { vaalogo } from '../../assets';
import SendIcon from '@mui/icons-material/Send';
import { MotionConfig, motion } from 'framer-motion';
import { Link } from 'react-router-dom';



export const Footer = () => {

    const theme=useTheme()
    const is700=useMediaQuery(theme.breakpoints.down(700))

    const labelStyles={
        fontWeight:300,
        cursor:'pointer'
    }

  return (
   <Stack sx={{backgroundColor:theme.palette.primary.main,paddingTop:"3rem",paddingLeft:is700?"1rem":"3rem",paddingRight:is700?"1rem":"3rem",paddingBottom:"1.5rem",rowGap:"5rem",color:theme.palette.primary.light,justifyContent:"space-around"}}> 
 
  <Stack flexDirection={'row'} rowGap={'1rem'} justifyContent={is700?"":'space-around'} flexWrap={'wrap'}> 
    <Stack rowGap={'1rem'} padding={'1rem'}> 
      <Typography variant='h6' fontSize={'1.5rem'}>Team</Typography> 
      <Typography variant='h6'>Nhóm 2 Thực Tập Tốt Nghiệp</Typography> 
      <Typography sx={labelStyles}>Lê Đức Bảo</Typography> 
      <Typography sx={labelStyles}>Lê Hồng Quân</Typography> 
      <Typography sx={labelStyles}>Nguyễn Quốc Huy</Typography> 
    </Stack> 

    <Stack rowGap={'1rem'} padding={'1rem'}> 
      <Typography variant='h6'>Support</Typography> 
      <Typography sx={labelStyles}>GV. Thầy Lê Mạnh Hùng</Typography> 
    </Stack> 

  <Stack rowGap={'1rem'} padding={'1rem'}>
  <Stack flexDirection={'row'} columnGap={'.5rem'}>
    <Box width={'420px'} height={'120px'}>
      <img
        src={vaalogo}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        alt="VAA Logo"
      />
    </Box>
  </Stack>
</Stack>

  </Stack> 

  
  <Stack alignSelf={"center"}> 
    <Typography color={'GrayText'}>&copy; BQH Store {new Date().getFullYear()}. All right reserved</Typography> 
  </Stack> 
</Stack>

  )
}
