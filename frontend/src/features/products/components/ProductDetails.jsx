import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { 
    clearSelectedProduct, 
    fetchProductByIdAsync, 
    resetProductFetchStatus, 
    selectProductFetchStatus, 
    selectSelectedProduct 
} from '../ProductSlice'
import { 
    Box, Checkbox, Rating, Stack, Typography, useMediaQuery, 
    Button, useTheme, MobileStepper 
} from '@mui/material'
import { 
    addToCartAsync, 
    resetCartItemAddStatus, 
    selectCartItemAddStatus, 
    selectCartItems 
} from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { 
    fetchReviewsByProductIdAsync, 
    resetReviewFetchStatus, 
    selectReviewFetchStatus, 
    selectReviews 
} from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { toast } from 'react-toastify'
import { MotionConfig, motion } from 'framer-motion'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import Favorite from '@mui/icons-material/Favorite'
import { 
    createWishlistItemAsync, 
    deleteWishlistItemByIdAsync, 
    resetWishlistItemAddStatus, 
    resetWishlistItemDeleteStatus, 
    selectWishlistItemAddStatus, 
    selectWishlistItemDeleteStatus, 
    selectWishlistItems 
} from '../../wishlist/WishlistSlice'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'
import { getImageUrl } from '../../../utils/imageUrl'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItems = useSelector(selectCartItems)
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const [quantity, setQuantity] = useState(1)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    
    const reviews = useSelector(selectReviews)
    const theme = useTheme()
    
    // Media Queries cho tính tương thích di động
    const is1420 = useMediaQuery(theme.breakpoints.down(1420))
    const is990 = useMediaQuery(theme.breakpoints.down(990))
    const is840 = useMediaQuery(theme.breakpoints.down(840))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const is387 = useMediaQuery(theme.breakpoints.down(387))
    const is340 = useMediaQuery(theme.breakpoints.down(340))

    const wishlistItems = useSelector(selectWishlistItems)
    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)

    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 ? Math.ceil(totalReviewRating / totalReviews) : 0

    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)
    
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    }, [id, dispatch])

    
    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') toast.success("Đã thêm vào giỏ hàng")
        else if (cartItemAddStatus === 'rejected') toast.error('Lỗi khi thêm vào giỏ hàng')
    }, [cartItemAddStatus])

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') toast.success("Đã thêm vào yêu thích")
    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') toast.success("Đã xóa khỏi yêu thích")
    }, [wishlistItemDeleteStatus])

    
    useEffect(() => {
        return () => {
            dispatch(clearSelectedProduct())
            dispatch(resetProductFetchStatus())
            dispatch(resetReviewFetchStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetWishlistItemAddStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [dispatch])

    const handleAddToCart = () => {
        const item = { user: loggedInUser._id, product: id, quantity }
        dispatch(addToCartAsync(item))
        setQuantity(1)
    }

    const handleDecreaseQty = () => { quantity > 1 && setQuantity(quantity - 1) }
    const handleIncreaseQty = () => {
        if (quantity < 20 && quantity < (product?.stockQuantity || 0)) setQuantity(quantity + 1)
    }

    const handleAddRemoveFromWishlist = (e) => {
        if (e.target.checked) {
            dispatch(createWishlistItemAsync({ user: loggedInUser?._id, product: id }))
        } else {
            const index = wishlistItems.findIndex((item) => item.product._id === id)
            if(index !== -1) dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
        }
    }

    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = product?.images?.length || 0;

    const handleStepChange = (step) => setActiveStep(step);

    return (
        <>
            {!(productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') && (
                <Stack sx={{ justifyContent: 'center', alignItems: 'center', mb: '2rem', mt: is840? 2 : 5 }}>
                    {(productFetchStatus === 'pending' || reviewFetchStatus === 'pending') ? (
                        <Stack width={'25rem'} height={'calc(100vh - 8rem)'} justifyContent={'center'} alignItems={'center'}>
                            <Lottie animationData={loadingAnimation} />
                        </Stack>
                    ) : (
                        <Stack>
                            
                            <Stack 
                                width={is480 ? "100%" : is1420 ? "95vw" : '88rem'} 
                                p={is480 ? 2 : 0} 
                                flexDirection={is840 ? "column" : "row"} 
                                columnGap={is990 ? "2rem" : "5rem"}
                                rowGap={5}
                            >
                               
                                <Stack sx={{ flexDirection: "row", columnGap: "2.5rem", flex: 1 }}>
                                    {!is1420 && (
                                        <Stack sx={{ display: "flex", rowGap: '1.5rem', maxHeight: "500px", overflowY: "auto" }}>
                                            {product?.images.map((image, index) => (
                                                <Box 
                                                    key={index}
                                                    component={motion.div}
                                                    whileHover={{ scale: 1.05 }} 
                                                    sx={{ width: "100px", cursor: "pointer", border: selectedImageIndex === index ? '2px solid black' : '1px solid #ddd' }} 
                                                    onClick={() => setSelectedImageIndex(index)}
                                                >
                                                    <img style={{ width: "100%", aspectRatio: '1/1', objectFit: "contain" }} src={getImageUrl(image)} alt="thumb" />
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                    
                                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        {is1420 ? (
                                            <Box sx={{ width: '100%', maxWidth: '500px' }}>
                                                <AutoPlaySwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
                                                    {product?.images.map((image, index) => (
                                                        <div key={index}>
                                                            <img style={{ width: "100%", aspectRatio: '1/1', objectFit: "contain" }} src={getImageUrl(image)} alt="product" />
                                                        </div>
                                                    ))}
                                                </AutoPlaySwipeableViews>
                                                <MobileStepper 
                                                    steps={maxSteps} 
                                                    position="static" 
                                                    activeStep={activeStep} 
                                                    nextButton={<Button size="small" onClick={() => setActiveStep(s => s+1)} disabled={activeStep === maxSteps - 1}>Tiếp <KeyboardArrowRight /></Button>} 
                                                    backButton={<Button size="small" onClick={() => setActiveStep(s => s-1)} disabled={activeStep === 0}><KeyboardArrowLeft /> Quay lại</Button>} 
                                                />
                                            </Box>
                                        ) : (
                                            <img style={{ width: "100%", maxWidth: "500px", aspectRatio: "1/1", objectFit: "contain" }} src={getImageUrl(product?.images[selectedImageIndex])} alt="main" />
                                        )}
                                    </Box>
                                </Stack>

                                
                                <Stack rowGap={"1.5rem"} sx={{ flex: 1 }}>
                                    <Stack rowGap={".5rem"}>
                                        <Typography variant='h4' fontWeight={600}>{product?.title}</Typography>
                                        
                                        
                                        <Stack flexDirection="row" alignItems="center" columnGap={1}>
                                            <Rating value={averageRating} readOnly precision={0.5} />
                                            <Typography variant="body2" color="text.secondary">
                                                ({totalReviews === 0 ? "Chưa có đánh giá" : `${totalReviews} Reviews`})
                                            </Typography>
                                        </Stack>

                                        
                                        <Box mt={1}>
                                            <Typography 
                                                fontWeight={500} 
                                                sx={{ 
                                                    color: product?.stockQuantity <= 10 ? "error.main" : "success.main",
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}
                                            >
                                                ● {product?.stockQuantity <= 10 ? `Chỉ còn ${product?.stockQuantity} sản phẩm` : "Tình trạng: Còn hàng"}
                                            </Typography>
                                        </Box>

                                        <Typography variant='h5' sx={{ mt: 2, fontWeight: 700, color: 'primary.main' }}>
                                            ${product?.price}
                                        </Typography>
                                    </Stack>

                                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {product?.description}
                                    </Typography>
                                    
                                    <hr style={{ border: '0.5px solid #eee', width: '100%' }} />

                                   
                                    {!loggedInUser?.isAdmin && (
                                        <Stack rowGap={3}>
                                            <Stack flexDirection={"row"} alignItems="center" columnGap={is387 ? 1 : 3}>
                                                
                                                <Stack flexDirection={'row'} alignItems={'center'} sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 0.5 }}>
                                                    <Button onClick={handleDecreaseQty} sx={{ minWidth: '40px', color: 'black' }}>-</Button>
                                                    <Typography sx={{ px: 2, fontWeight: 600 }}>{quantity}</Typography>
                                                    <Button onClick={handleIncreaseQty} sx={{ minWidth: '40px', color: 'black' }}>+</Button>
                                                </Stack>
                                                
                                               
                                                {isProductAlreadyInCart ? (
                                                    <Button variant='contained' size="large" sx={{ bgcolor: 'black', '&:hover': {bgcolor: '#333'} }} onClick={() => navigate("/cart")}>Vào giỏ hàng</Button>
                                                ) : (
                                                    <Button 
                                                        component={motion.button}
                                                        whileHover={{ scale: 1.02 }}
                                                        variant='contained' 
                                                        size="large"
                                                        disabled={product?.stockQuantity <= 0}
                                                        sx={{ bgcolor: 'black', '&:hover': {bgcolor: '#333'} }} 
                                                        onClick={handleAddToCart}
                                                    >
                                                        Thêm vào giỏ
                                                    </Button>
                                                )}

                                               
                                                <Checkbox 
                                                    checked={isProductAlreadyinWishlist} 
                                                    onChange={handleAddRemoveFromWishlist} 
                                                    icon={<FavoriteBorder />} 
                                                    checkedIcon={<Favorite sx={{ color: 'red' }} />} 
                                                />
                                            </Stack>
                                        </Stack>
                                    )}

                                   
                                    <Stack sx={{ border: "1px solid #eee", borderRadius: "12px", bgcolor: '#fafafa' }}>
                                        <Stack p={2} flexDirection={'row'} alignItems={"center"} columnGap={2}>
                                            <LocalShippingOutlinedIcon color="action" />
                                            <Box>
                                                <Typography fontWeight={600} variant="body2">Miễn phí giao hàng</Typography>
                                                <Typography variant='caption' color="text.secondary">Áp dụng cho mọi đơn hàng được mua</Typography>
                                            </Box>
                                        </Stack>
                                        <Box sx={{ height: '1px', bgcolor: '#eee' }} />
                                        <Stack p={2} flexDirection={'row'} alignItems={"center"} columnGap={2}>
                                            <CachedOutlinedIcon color="action" />
                                            <Box>
                                                <Typography fontWeight={600} variant="body2">Chính sách bảo hành</Typography>
                                                <Typography variant='caption' color="text.secondary">Đổi trả trong 30 ngày nếu có vấn đề về sản phẩm</Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>

                           
                            <Box mt={8} width={is1420 ? "95vw" : '88rem'}>
                                <Reviews productId={id} averageRating={averageRating} />
                            </Box>
                        </Stack>
                    )}
                </Stack>
            )}
        </>
    )
}