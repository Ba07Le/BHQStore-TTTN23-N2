import * as React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Menu,
  Avatar,
  Tooltip,
  MenuItem,
  Badge,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selectUserInfo } from '../../user/UserSlice'
import { selectCartItems } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { selectWishlistItems } from '../../wishlist/WishlistSlice'
import {
  selectProductIsFilterOpen,
  toggleFilters,
} from '../../products/ProductSlice'

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [search, setSearch] = React.useState('')

  const userInfo = useSelector(selectUserInfo)
  const cartItems = useSelector(selectCartItems)
  const wishlistItems = useSelector(selectWishlistItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget)
  const handleCloseUserMenu = () => setAnchorElUser(null)

  /* 🔑 KHÁC NHAU CHỈ Ở MENU ITEMS */
  const menuItems = loggedInUser?.isAdmin
    ? [
        { label: 'Trang chủ', to: '/' },
        { label: 'Thêm sản phẩm', to: '/admin/add-product' },
        { label: 'Quản lý đơn hàng', to: '/admin/orders' },
        { label: 'Đăng xuất', to: '/logout' },
      ]
    : [
        { label: 'Trang chủ', to: '/' },
        { label: 'Profile', to: '/profile' },
        { label: 'Đơn hàng của tôi', to: '/orders' },
        { label: 'Đăng xuất', to: '/logout' },
      ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        height: 64,                 // ⚠️ CỐ ĐỊNH CHIỀU CAO
        justifyContent: 'center',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '64px !important', // ⚠️ TRÁNH BỊ ĐẨY CAO
          px: 2,
        }}
      >
        {/* LEFT */}
        <Stack direction="row" alignItems="center" spacing={2} flex={1}>
          {isProductList && (
            <IconButton
              onClick={() => dispatch(toggleFilters())}
              sx={{
                bgcolor: isProductFilterOpen ? 'grey.200' : 'transparent',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontSize: '1.1rem',
            }}
          >
            BHQ<span style={{ color: '#1976d2' }}>Store</span>
          </Typography>

          {!isMobile && (
            <TextField
              size="small"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search.trim()) {
                  navigate(`/products?search=${search}`)
                }
              }}
              sx={{ width: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>

        {/* RIGHT */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Badge badgeContent={wishlistItems?.length} color="error">
            <IconButton component={Link} to="/wishlist">
              <FavoriteBorderIcon />
            </IconButton>
          </Badge>

          <Badge badgeContent={cartItems?.length} color="error">
            <IconButton onClick={() => navigate('/cart')}>
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </Badge>

          <Tooltip title="Tài khoản">
            <IconButton onClick={handleOpenUserMenu}>
              <Avatar sx={{ width: 36, height: 36 }}>
                {userInfo?.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* MENU USER / ADMIN (CHUNG UI) */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
          },
        }}
      >
        <Box px={2} py={1}>
          <Typography fontWeight={600}>{userInfo?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {loggedInUser?.isAdmin ? 'Admin' : 'Khách hàng'}
          </Typography>
        </Box>

        <Divider />

        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            component={Link}
            to={item.to}
            onClick={handleCloseUserMenu}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  )
}