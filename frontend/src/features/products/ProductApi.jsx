import { axiosi } from "../../config/axios";

export const addProduct=async(data)=>{
    try {
        const res=await axiosi.post('/products',data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const fetchProducts=async(filters)=>{

    let queryString=''

    if(filters.search){
  queryString += `search=${filters.search}&`
}


    if(filters.brand){
        filters.brand.map((brand)=>{
            queryString+=`brand=${brand}&`
        })
    }
    if(filters.category){
        filters.category.map((category)=>{
            queryString+=`category=${category}&`
        })
    }

    if(filters.pagination){
        queryString+=`page=${filters.pagination.page}&limit=${filters.pagination.limit}&`
    }

    if(filters.sort){
        queryString+=`sort=${filters.sort.sort}&order=${filters.sort.order}&`
    }

    if(filters.user){
        queryString+=`user=${filters.user}&`
    }
    
    try {
        const res=await axiosi.get(`/products?${queryString}`)
        const totalResults=await res.headers.get("X-Total-Count")
        return {data:res.data,totalResults:totalResults}
    } catch (error) {
        throw error.response.data
    }
}

export const fetchProductById=async(id)=>{
    try {
        const res=await axiosi.get(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const updateProductById = async ({ id, product }) => {
  const formData = new FormData()

  Object.keys(product).forEach((key) => {
    if (key === "images") {
      product.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img)
        } else {
          formData.append("oldImages", img)
        }
      })
    } else if (key === "thumbnail") {
      if (product.thumbnail instanceof File) {
        formData.append("thumbnail", product.thumbnail)
      } else {
        formData.append("oldThumbnail", product.thumbnail)
      }
    } else {
      formData.append(key, product[key])
    }
  })

  const res = await axiosi.patch(`/products/${id}`, formData)
  return res.data
}

export const undeleteProductById=async(id)=>{
    try {
        const res=await axiosi.patch(`/products/undelete/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteProductById=async(id)=>{
    try {
        const res=await axiosi.delete(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
