import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import { addProductAsync, resetProductAddStatus, selectProductAddStatus } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'

export const AddProduct = () => {

  const {register, handleSubmit, reset, formState: { errors }} = useForm()

  const dispatch = useDispatch()
  const brands = useSelector(selectBrands)
  const categories = useSelector(selectCategories)
  const productAddStatus = useSelector(selectProductAddStatus)
  const navigate = useNavigate()
  const theme = useTheme()
  const is1100 = useMediaQuery(theme.breakpoints.down(1100))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(()=>{
    if(productAddStatus==='fullfilled'){
      reset()
      toast.success("Sản phẩm mới đã được thêm")
      navigate("/admin/dashboard")
    }
    else if(productAddStatus==='rejected'){
      toast.error("Lỗi khi thêm sản phẩm, vui lòng thử lại sau")
    }
  },[productAddStatus])

  useEffect(()=>{
    return ()=>{
      dispatch(resetProductAddStatus())
    }
  },[])

const handleAddProduct = (data) => {
  const formData = new FormData()

  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("price", data.price)
  formData.append("stockQuantity", data.stockQuantity)
  formData.append("brand", data.brand)
  formData.append("category", data.category)

  // thumbnail
  formData.append("thumbnail", data.thumbnail[0])

  // images
  formData.append("images", data.image0[0])
  formData.append("images", data.image1[0])
  formData.append("images", data.image2[0])
  formData.append("images", data.image3[0])

  dispatch(addProductAsync(formData))
}


  return (
    <Stack p={'0 16px'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} >
      <Stack width={is1100?"100%":"60rem"} rowGap={4} mt={is480?4:6} mb={6} component={'form'} noValidate onSubmit={handleSubmit(handleAddProduct)}> 
        
       
        <Stack rowGap={3}>
          
          
          <Stack>
            <Typography variant='h6' fontWeight={400} gutterBottom>Tên sản phẩm</Typography>
            <TextField 
              {...register("title",{required:'Bắt buộc'})}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Stack> 

          
          <Stack flexDirection={'row'} columnGap={2} >

            <FormControl fullWidth error={!!errors.brand}>
              <InputLabel id="brand-selection">Thương hiệu</InputLabel>
              <Select 
                labelId="brand-selection" 
                label="Thương hiệu"
                defaultValue=""
                {...register("brand",{required:"Bắt buộc"})}
              >
                {brands.map((brand)=>(
                  <MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {errors.brand?.message}
              </Typography>
            </FormControl>

            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-selection">Loại sản phẩm</InputLabel>
              <Select 
                labelId="category-selection" 
                label="Loại sản phẩm"
                defaultValue=""
                {...register("category",{required:"Bắt buộc"})}
              >
                {categories.map((category)=>(
                  <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {errors.category?.message}
              </Typography>
            </FormControl>

          </Stack>

         
          <Stack>
            <Typography variant='h6' fontWeight={400} gutterBottom>Mô tả</Typography>
            <TextField 
              multiline 
              rows={4} 
              {...register("description",{required:"Bắt buộc"})}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Stack>

        
          <Stack>
            <Typography variant='h6' fontWeight={400} gutterBottom>Giá sản phẩm</Typography>
            <TextField 
              type='number' 
              {...register("price",{required:"Bắt buộc"})}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Stack>

         
          <Stack>
            <Typography variant='h6' fontWeight={400} gutterBottom>Số lượng hàng</Typography>
            <TextField 
              type='number' 
              {...register("stockQuantity",{required:"Bắt buộc"})}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity?.message}
            />
          </Stack>

      
          <Stack>
            <Typography variant='h6' fontWeight={400} gutterBottom>Thumbnail sản phẩm</Typography>
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              {...register("thumbnail", { required: "Bắt buộc" })}
              error={!!errors.thumbnail}
              helperText={errors.thumbnail?.message}
            />
          </Stack>

         
          <Stack>
            <Typography variant='h6' fontWeight={400} gutterBottom>Ảnh sản phẩm</Typography>
            <Stack rowGap={2}>
              {["image0","image1","image2","image3"].map((img,idx)=>(
                <TextField
                  key={idx}
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  {...register(img, { required: "Bắt buộc" })}
                  error={!!errors[img]}
                  helperText={errors[img]?.message}
                />
              ))}
            </Stack>
          </Stack>

        </Stack>

        
        <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={is480?1:2}>
          <Button size={is480?'medium':'large'} variant='contained' type='submit'>
            Thêm sản phẩm
          </Button>
          <Button size={is480?'medium':'large'} variant='outlined' color='error' component={Link} to={'/admin/dashboard'}>
            Hủy
          </Button>
        </Stack>

      </Stack>
    </Stack>
  )
}
