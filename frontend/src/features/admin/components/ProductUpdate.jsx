import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProductByIdAsync,resetProductUpdateStatus, selectProductUpdateStatus, selectSelectedProduct, updateProductByIdAsync } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'

export const ProductUpdate = () => {

    const {register,handleSubmit,watch,formState: { errors }} = useForm()

    const {id}=useParams()
    const dispatch=useDispatch()
    const selectedProduct=useSelector(selectSelectedProduct)
    const brands=useSelector(selectBrands)
    const categories=useSelector(selectCategories)
    const productUpdateStatus=useSelector(selectProductUpdateStatus)
    const navigate=useNavigate()
    const theme=useTheme()
    const is1100=useMediaQuery(theme.breakpoints.down(1100))
    const is480=useMediaQuery(theme.breakpoints.down(480))


    useEffect(()=>{
        if(id){
            dispatch(fetchProductByIdAsync(id))
        }
    },[id])

    useEffect(()=>{
        if(productUpdateStatus==='fullfilled'){
            toast.success("Đã cập nhật sản phẩm")
            navigate("/admin/dashboard")
        }
        else if(productUpdateStatus==='rejected'){
            toast.error("Lỗi khi cập nhật sản phẩm, vui lòng thử lại sau")
        }
    },[productUpdateStatus])

    useEffect(()=>{
        return ()=>{
            dispatch(clearSelectedProduct())
            dispatch(resetProductUpdateStatus())
        }
    },[])

    const handleProductUpdate=(data)=>{
          const productUpdate = {
    id: selectedProduct._id,
    product: {
      title: data.title,
      brand: data.brand,
      category: data.category,
      description: data.description,
      price: data.price,
      stockQuantity: data.stockQuantity,

      
      thumbnail: data.thumbnail?.[0] || selectedProduct.thumbnail,

      
      images: [
        data.image0?.[0] || selectedProduct.images[0],
        data.image1?.[0] || selectedProduct.images[1],
        data.image2?.[0] || selectedProduct.images[2],
        data.image3?.[0] || selectedProduct.images[3],
      ].filter(Boolean)
    }
  }
        delete productUpdate?.image0
        delete productUpdate?.image1
        delete productUpdate?.image2
        delete productUpdate?.image3

        dispatch(updateProductByIdAsync(productUpdate))
    }


  return (
    <Stack p={'0 16px'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} >
        
        {
            selectedProduct &&
        
        <Stack width={is1100?"100%":"60rem"} rowGap={4} mt={is480?4:6} mb={6} component={'form'} noValidate onSubmit={handleSubmit(handleProductUpdate)}> 
            
           
            <Stack rowGap={3}>
                <Stack>
                    <Typography variant='h6' fontWeight={400} gutterBottom>Tên sản phẩm</Typography>
                    <TextField {...register("title",{required:'Bắt buộc', value: selectedProduct.title})}/>

                </Stack> 

                <Stack flexDirection={'row'} >

                    <FormControl fullWidth>
                        <InputLabel id="brand-selection">Thương hiệu</InputLabel>
                        <Select defaultValue={selectedProduct.brand._id} {...register("brand",{required:"Bắt buộc"})} labelId="brand-selection" label="Brand">
                            
                            {
                                brands.map((brand)=>(
                                    <MenuItem value={brand._id}>{brand.name}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>


                    <FormControl fullWidth>
                        <InputLabel id="category-selection">Loại sản phẩm</InputLabel>
                        <Select defaultValue={selectedProduct.category._id} {...register("category",{required:"Bắt buộc"})} labelId="category-selection" label="Category">
                            
                            {
                                categories.map((category)=>(
                                    <MenuItem value={category._id}>{category.name}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>

                </Stack>


                <Stack>
                    <Typography variant='h6' fontWeight={400}  gutterBottom>Mô tả sản phẩm</Typography>
                    <TextField multiline rows={4} {...register("description",{required:"Bắt buộc",value:selectedProduct.description})}/>
                </Stack>

                <Stack flexDirection={'row'}>
                    <Stack flex={1}>
                        <Typography variant='h6' fontWeight={400}  gutterBottom>Giá sản phẩm</Typography>
                        <TextField type='number' {...register("price",{required:"Bắt buộc",value:selectedProduct.price})}/>
                    </Stack>
                </Stack>

                <Stack>
                    <Typography variant='h6'  fontWeight={400} gutterBottom>Số lượng sản phẩm</Typography>
                    <TextField type='number' {...register("stockQuantity",{required:"Bắt buộc",value:selectedProduct.stockQuantity})}/>
                </Stack>
                <Stack>
                    <Typography variant='h6'  fontWeight={400} gutterBottom>Thumbnail sản phẩm</Typography>
                    <TextField
type="file"
inputProps={{ accept: "image/*" }}
{...register("thumbnail")}
/>
                </Stack>

       <Stack>
  <Typography variant='h6' fontWeight={400} gutterBottom>
    Ảnh sản phẩm
  </Typography>

  <Stack rowGap={2}>
<TextField type="file" {...register("image0")} />
<TextField type="file" {...register("image1")} />
<TextField type="file" {...register("image2")} />
<TextField type="file" {...register("image3")} />

  </Stack>
</Stack>


            </Stack>


            
            <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={is480?1:2}>
                <Button size={is480?'medium':'large'} variant='contained' type='submit'>Cập nhật</Button>
                <Button size={is480?'medium':'large'} variant='outlined' color='error' component={Link} to={'/admin/dashboard'}>Hủy</Button>
            </Stack>


        </Stack>
        }

    </Stack>
  )
}
