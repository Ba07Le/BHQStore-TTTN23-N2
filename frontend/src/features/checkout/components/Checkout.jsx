import { Stack, TextField, Typography ,Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING } from '../../../constants'
import {motion} from 'framer-motion'


export const Checkout = () => {

    const status=''
    const addresses=useSelector(selectAddresses)
    const [selectedAddress,setSelectedAddress]=useState(addresses[0])
    const [selectedPaymentMethod,setSelectedPaymentMethod]=useState('cash')
    const { register, handleSubmit, watch, reset,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const loggedInUser=useSelector(selectLoggedInUser)
    const addressStatus=useSelector(selectAddressStatus)
    const navigate=useNavigate()
    const cartItems=useSelector(selectCartItems)
    const orderStatus=useSelector(selectOrderStatus)
    const currentOrder=useSelector(selectCurrentOrder)
    const orderTotal=cartItems.reduce((acc,item)=>(item.product.price*item.quantity)+acc,0)
    const theme=useTheme()
    const is900=useMediaQuery(theme.breakpoints.down(900))
    const is480=useMediaQuery(theme.breakpoints.down(480))
    
    useEffect(()=>{
        if(addressStatus==='fulfilled'){
            reset()
        }
        else if(addressStatus==='rejected'){
            alert('Lỗi thêm địa chỉ')
        }
    },[addressStatus])

    useEffect(()=>{
        if(currentOrder && currentOrder?._id){
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    },[currentOrder])
    
    const handleAddAddress=(data)=>{
        const address={...data,user:loggedInUser._id}
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder=()=>{
        const order={user:loggedInUser._id,item:cartItems,address:selectedAddress,paymentMode:selectedPaymentMethod,total:orderTotal+SHIPPING}
        dispatch(createOrderAsync(order))
    }

  return (
    <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

         
        <Stack rowGap={4}>

             
            <Stack flexDirection={'row'} columnGap={is480?0.3:1} alignItems={'center'}>
                <motion.div  whileHover={{x:-5}}>
                    <IconButton component={Link} to={"/cart"}><ArrowBackIcon fontSize={is480?"medium":'large'}/></IconButton>
                </motion.div>
                <Typography variant='h4'>Thông tin giao hàng</Typography>
            </Stack>

             
            <Stack component={'form'} noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack>
                        <Typography  gutterBottom>Nơi nhận</Typography>
                        <TextField placeholder='Nhà, Văn phòng, Công ty,...' {...register("type",{required:true})}/>
                    </Stack>


                    <Stack>
                        <Typography gutterBottom>Đường</Typography>
                        <TextField {...register("street",{required:true})}/>
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Quốc gia</Typography>
                        <TextField {...register("country",{required:true})}/>
                    </Stack>

                    <Stack>
                        <Typography  gutterBottom>Số điện thoại</Typography>
                        <TextField type='number' {...register("phoneNumber",{required:true})}/>
                    </Stack>

                    <Stack flexDirection={'row'}>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Thành phố</Typography>
                            <TextField  {...register("city",{required:true})}/>
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Mã Bưu Chính</Typography>
                            <TextField type='number' {...register("postalCode",{required:true})}/>
                        </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
                        <LoadingButton loading={status==='pending'} type='submit' variant='contained'>Thêm địa chỉ</LoadingButton>
                        <Button color='error' variant='outlined' onClick={()=>reset()}>Reset</Button>
                    </Stack>
            </Stack>

             
            <Stack rowGap={3}>

                <Stack>
                    <Typography variant='h6'>Địa chỉ</Typography>
                    <Typography variant='body2' color={'text.secondary'}>Chọn địa chỉ có sẵn</Typography>
                </Stack>

                <Grid container gap={2} width={is900?"auto":'50rem'} justifyContent={'flex-start'} alignContent={'flex-start'}>
                        {
                            addresses.map((address,index)=>(
                                <FormControl item >
                                    <Stack key={address._id} p={is480?2:2} width={is480?'100%':'20rem'} height={is480?'auto':'15rem'}  rowGap={2} component={is480?Paper:Paper} elevation={1}>

                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                            <Radio checked={selectedAddress===address} name='addressRadioGroup' value={selectedAddress} onChange={(e)=>setSelectedAddress(addresses[index])}/>
                                            <Typography>{address.type}</Typography>
                                        </Stack>

                                         
                                        <Stack>
                                            <Typography>{address.street}</Typography>
                                            <Typography>{address.state}, {address.city}, {address.country}, {address.postalCode}</Typography>
                                            <Typography>{address.phoneNumber}</Typography>
                                        </Stack>
                                    </Stack>
                                </FormControl>
                            ))
                        }
                </Grid>

            </Stack>
            
           
            <Stack rowGap={3}>

                    <Stack>
                        <Typography variant='h6'>Phương thức thanh toán</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Hãy chọn 1 phương thức thanh toán</Typography>
                    </Stack>
                    
                    <Stack rowGap={2}>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod==='COD'} onChange={()=>setSelectedPaymentMethod('COD')}/>
                            <Typography>Tiền mặt</Typography>
                        </Stack>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod==='CARD'} onChange={()=>setSelectedPaymentMethod('CARD')}/>
                            <Typography>Card</Typography>
                        </Stack>

                    </Stack>


            </Stack>
        </Stack>

         
        <Stack  width={is900?'100%':'auto'} alignItems={is900?'flex-start':''}>
            <Typography variant='h4'>Đơn hàng</Typography>
            <Cart checkout={true}/>
            <LoadingButton fullWidth loading={orderStatus==='pending'} variant='contained' onClick={handleCreateOrder} size='large'>Thanh toán đơn hàng</LoadingButton>
        </Stack>

    </Stack>
  )
}
