import { Box, Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetCurrentOrder, selectCurrentOrder } from '../features/order/OrderSlice'
import { selectUserInfo } from '../features/user/UserSlice'
import { orderSuccessAnimation } from '../assets'
import Lottie from 'lottie-react'

export const OrderSuccessPage = () => {


    const navigate=useNavigate()
    const dispatch=useDispatch()
    const currentOrder=useSelector(selectCurrentOrder)
    const userDetails=useSelector(selectUserInfo)
    const {id}=useParams()

    const theme=useTheme()
    const is480=useMediaQuery(theme.breakpoints.down(480))

    useEffect(()=>{
        if(!currentOrder){
            navigate("/")
        }
    },[currentOrder])

  return (
    <Stack width={'100vw'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>

        <Stack component={Paper} boxShadow={is480?'none':""} rowGap={3} elevation={1} p={is480?1:4} justifyContent={'center'} alignItems={'center'}>

            <Box width={'10rem'} height={'7rem'}>
                <Lottie animationData={orderSuccessAnimation}></Lottie>
            </Box>

            <Stack mt={2} textAlign={'center'} justifyContent={'center'} alignItems={'center'} rowGap={1}>
                <Typography variant='h6' fontWeight={400}>Gửi đến {userDetails?.name}</Typography>
                <Typography variant='h5' >Đơn hàng #{currentOrder?._id} được xác nhận</Typography>
                <Typography variant='body2' color='text.secondary'>Cảm ơn đã ủng hộ ạ❤️</Typography>
            </Stack>

            <Button component={Link} to={'/orders'} onClick={()=>dispatch(resetCurrentOrder())} size={is480?"small":""}  variant='contained'>Kiểm tra trạng thái đơn hàng của bạn</Button>
        </Stack>

    </Stack>
  )
}
