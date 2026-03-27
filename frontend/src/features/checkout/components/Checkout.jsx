import { Stack, TextField, Typography, Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery } from '@mui/material'
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
import { motion } from 'framer-motion'

export const Checkout = () => {

    const status = ''
    const addresses = useSelector(selectAddresses) || [] // Đảm bảo không lỗi nếu chưa có địa chỉ
    const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD')
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const addressStatus = useSelector(selectAddressStatus)
    const navigate = useNavigate()
    const cartItems = useSelector(selectCartItems)
    const orderStatus = useSelector(selectOrderStatus)
    const currentOrder = useSelector(selectCurrentOrder)
    const orderTotal = cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    // 🛠️ Logic mới cho Khách vãng lai: Lưu địa chỉ nhập tay vào state tạm thời
    const [guestAddress, setGuestAddress] = useState(null);

    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            reset()
        }
        else if (addressStatus === 'rejected') {
            alert('Lỗi thêm địa chỉ')
        }
    }, [addressStatus])

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            // Nếu là thành viên thì reset giỏ hàng trên DB, nếu là khách thì xóa LocalStorage
            if (loggedInUser) {
                dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            } else {
                localStorage.removeItem('guestCart')
            }
            navigate(`/order-success/${currentOrder?._id}`)
        }
    }, [currentOrder])

    const handleAddAddress = (data) => {
        if (loggedInUser) {
            const address = { ...data, user: loggedInUser._id }
            dispatch(addAddressAsync(address))
        } else {
            // Đối với khách: Chỉ lưu vào state để dùng cho đơn hàng này, không lưu vào DB
            setGuestAddress(data);
            alert("Đã xác nhận thông tin giao hàng!");
        }
    }

    const handleCreateOrder = () => {
        // Ưu tiên địa chỉ chọn từ list (User) hoặc địa chỉ vừa nhập (Guest)
        const finalAddress = loggedInUser ? selectedAddress : guestAddress;

        if (!finalAddress) {
            return alert("Vui lòng nhập địa chỉ và bấm 'Xác nhận/Thêm địa chỉ' trước khi thanh toán!");
        }

        const order = {
            user: loggedInUser ? loggedInUser._id : null, // Bảo mật: Khách vãng lai gửi null
            item: cartItems,
            address: finalAddress,
            paymentMode: selectedPaymentMethod,
            total: orderTotal + SHIPPING
        }
        dispatch(createOrderAsync(order))
    }

    return (
        <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

            <Stack rowGap={4}>

                <Stack flexDirection={'row'} columnGap={is480 ? 0.3 : 1} alignItems={'center'}>
                    <motion.div whileHover={{ x: -5 }}>
                        <IconButton component={Link} to={"/cart"}><ArrowBackIcon fontSize={is480 ? "medium" : 'large'} /></IconButton>
                    </motion.div>
                    <Typography variant='h4'>Thông tin giao hàng</Typography>
                </Stack>

                {/* Form nhập địa chỉ */}
                <Stack component={'form'} noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack>
                        <Typography gutterBottom>Người nhận / Nơi nhận</Typography>
                        <TextField placeholder='Họ tên hoặc Tên công ty...' {...register("type", { required: true })} />
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Đường</Typography>
                        <TextField {...register("street", { required: true })} />
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Quốc gia</Typography>
                        <TextField {...register("country", { required: true })} defaultValue="Việt Nam" />
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Số điện thoại</Typography>
                        <TextField type='number' {...register("phoneNumber", { required: true })} />
                    </Stack>

                    <Stack flexDirection={'row'}>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Thành phố</Typography>
                            <TextField {...register("city", { required: true })} />
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Mã Bưu Chính</Typography>
                            <TextField type='number' {...register("postalCode", { required: true })} />
                        </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
                        <LoadingButton loading={addressStatus === 'pending'} type='submit' variant='contained'>
                            {loggedInUser ? "Thêm địa chỉ" : "Xác nhận địa chỉ"}
                        </LoadingButton>
                        <Button color='error' variant='outlined' onClick={() => reset()}>Reset</Button>
                    </Stack>
                </Stack>

                {/* Hiển thị địa chỉ có sẵn chỉ dành cho User đã đăng nhập */}
                {loggedInUser && addresses.length > 0 && (
                    <Stack rowGap={3}>
                        <Stack>
                            <Typography variant='h6'>Địa chỉ đã lưu</Typography>
                            <Typography variant='body2' color={'text.secondary'}>Chọn từ danh sách của bạn</Typography>
                        </Stack>

                        <Grid container gap={2} width={is900 ? "auto" : '50rem'} justifyContent={'flex-start'} alignContent={'flex-start'}>
                            {addresses.map((address, index) => (
                                <FormControl key={address._id || index}>
                                    <Stack p={2} width={is480 ? '100%' : '20rem'} height={is480 ? 'auto' : '15rem'} rowGap={2} component={Paper} elevation={1}>
                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                            <Radio checked={selectedAddress === address} name='addressRadioGroup' onChange={() => setSelectedAddress(address)} />
                                            <Typography fontWeight={600}>{address.type}</Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography>{address.street}</Typography>
                                            <Typography>{address.city}, {address.country}</Typography>
                                            <Typography>{address.phoneNumber}</Typography>
                                        </Stack>
                                    </Stack>
                                </FormControl>
                            ))}
                        </Grid>
                    </Stack>
                )}

                <Stack rowGap={3}>
                    <Stack>
                        <Typography variant='h6'>Phương thức thanh toán</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Hãy chọn 1 phương thức thanh toán</Typography>
                    </Stack>

                    <Stack rowGap={2}>
                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value="COD" name='paymentMethod' checked={selectedPaymentMethod === 'COD'} onChange={() => setSelectedPaymentMethod('COD')} />
                            <Typography>Tiền mặt (COD)</Typography>
                        </Stack>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value="CARD" name='paymentMethod' checked={selectedPaymentMethod === 'CARD'} onChange={() => setSelectedPaymentMethod('CARD')} />
                            <Typography>Thẻ ngân hàng (CARD)</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Stack width={is900 ? '100%' : 'auto'} alignItems={is900 ? 'flex-start' : ''}>
                <Typography variant='h4'>Đơn hàng</Typography>
                <Cart checkout={true} />
                <LoadingButton fullWidth loading={orderStatus === 'pending'} variant='contained' onClick={handleCreateOrder} size='large'>
                    Thanh toán đơn hàng
                </LoadingButton>
            </Stack>

        </Stack>
    )
}