import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import {
  deleteProductByIdAsync,
  fetchProductsAsync,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
  undeleteProductByIdAsync,
} from '../../products/ProductSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { ProductBanner } from '../../products/components/ProductBanner'
import { ITEMS_PER_PAGE } from '../../../constants'
import { banner1, banner2, banner3, banner4 } from '../../../assets'

const sortOptions = [
  { name: 'Giá: từ thấp đến cao', sort: 'price', order: 'asc' },
  { name: 'Giá: từ cao đến thấp', sort: 'price', order: 'desc' },
]

const bannerImages = [banner1, banner3, banner2, banner4]

export const AdminDashBoard = () => {
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState(null)
  const [page, setPage] = useState(1)

  const dispatch = useDispatch()
  const theme = useTheme()

  const brands = useSelector(selectBrands)
  const categories = useSelector(selectCategories)
  const products = useSelector(selectProducts)
  const totalResults = useSelector(selectProductTotalResults)
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)

  const is500 = useMediaQuery(theme.breakpoints.down(500))
  const is600 = useMediaQuery(theme.breakpoints.down(600))
  const is700 = useMediaQuery(theme.breakpoints.down(700))
  const is800 = useMediaQuery(theme.breakpoints.down(800))
  const is1200 = useMediaQuery(theme.breakpoints.down(1200))
  const is488 = useMediaQuery(theme.breakpoints.down(488))

  useEffect(() => {
    setPage(1)
  }, [totalResults])

  useEffect(() => {
    dispatch(
      fetchProductsAsync({
        ...filters,
        pagination: { page, limit: ITEMS_PER_PAGE },
        sort,
      })
    )
  }, [filters, sort, page])

  const handleBrandFilters = (e) => {
    const set = new Set(filters.brand)
    e.target.checked ? set.add(e.target.value) : set.delete(e.target.value)
    setFilters({ ...filters, brand: [...set] })
  }

  const handleCategoryFilters = (e) => {
    const set = new Set(filters.category)
    e.target.checked ? set.add(e.target.value) : set.delete(e.target.value)
    setFilters({ ...filters, category: [...set] })
  }

  const handleFilterClose = () => dispatch(toggleFilters())
  const handleDelete = (id) => dispatch(deleteProductByIdAsync(id))
  const handleUnDelete = (id) => dispatch(undeleteProductByIdAsync(id))

  return (
    <>

      <motion.div
        style={{
          position: 'fixed',
          backgroundColor: '#fff',
          height: '100vh',
          padding: '1rem',
          overflowY: 'auto',
          width: is500 ? '100vw' : '30rem',
          zIndex: 500,
        }}
        variants={{ show: { left: 0 }, hide: { left: -500 } }}
        initial="hide"
        animate={isProductFilterOpen ? 'show' : 'hide'}
      >
        <Stack mb={6}>
          <Typography variant="h4">Bộ lọc sản phẩm</Typography>

          <IconButton
            onClick={handleFilterClose}
            sx={{ position: 'absolute', top: 15, right: 15 }}
          >
            <ClearIcon />
          </IconButton>

          <Stack mt={2}>
            <Accordion>
              <AccordionSummary expandIcon={<AddIcon />}>
                <Typography>Thương hiệu</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <FormGroup onChange={handleBrandFilters}>
                  {brands?.map((b) => (
                    <FormControlLabel
                      key={b._id}
                      sx={{ ml: 1 }}
                      control={<Checkbox />}
                      label={b.name}
                      value={b._id}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          </Stack>

          <Stack mt={2}>
            <Accordion>
              <AccordionSummary expandIcon={<AddIcon />}>
                <Typography>Danh mục</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <FormGroup onChange={handleCategoryFilters}>
                  {categories?.map((c) => (
                    <FormControlLabel
                      key={c._id}
                      sx={{ ml: 1 }}
                      control={<Checkbox />}
                      label={c.name}
                      value={c._id}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </motion.div>

      
      <Stack rowGap={5} mb="3rem">
        
        {!is600 && (
          <Stack sx={{ width: '100%', height: is800 ? 300 : is1200 ? 400 : 500 }}>
            <ProductBanner images={bannerImages} />
          </Stack>
        )}

      
        <Stack direction="row" justifyContent="flex-end" mr="2rem">
          <Stack width="12rem">
            <FormControl fullWidth>
              <InputLabel>Sắp xếp theo thứ tự</InputLabel>
              <Select
                variant="standard"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value={null}>Reset</MenuItem>
                {sortOptions.map((o) => (
                  <MenuItem key={o.name} value={o}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        
        <Grid gap={is700 ? 1 : 2} container justifyContent="center">
          {products.map((p) => (
            <Stack key={p._id}>
              <ProductCard
                id={p._id}
                title={p.title}
                thumbnail={p.thumbnail}
                brand={p.brand.name}
                price={p.price}
                isAdminCard
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                gap={1}
                px={2}
                mt={1}
              >
                <Button
                  component={Link}
                  to={`/admin/product-update/${p._id}`}
                  variant="contained"
                  size="small"
                >
                  Cập nhật
                </Button>
                {p.isDeleted ? (
                  <Button
                    onClick={() => handleUnDelete(p._id)}
                    variant="outlined"
                    color="error"
                    size="small"
                  >
                    Bỏ xoá
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleDelete(p._id)}
                    variant="outlined"
                    color="error"
                    size="small"
                  >
                    Xoá
                  </Button>
                )}
              </Stack>
            </Stack>
          ))}
        </Grid>

        
        <Stack alignSelf={is488?'center':'flex-end'} mr={is488?0:5} rowGap={2} p={is488?1:0}>
                                <Pagination size={is488?'medium':'large'} page={page}  onChange={(e,page)=>setPage(page)} count={Math.ceil(totalResults/ITEMS_PER_PAGE)} variant="outlined" shape="rounded" />
                                <Typography textAlign={'center'}>Từ trang {(page-1)*ITEMS_PER_PAGE+1} đến {page*ITEMS_PER_PAGE>totalResults?totalResults:page*ITEMS_PER_PAGE} có {totalResults} sản phẩm</Typography>
                            </Stack>
      </Stack>
    </>
  )
}