import axiosInstance from '@/axios'
import { ref } from 'vue'

interface ProductDeliveryTime {
  id?: number
  name: string
  identifier: string
  caption?: string
  color?: string
  bg_color?: string
  icon?: string
}

export function useProductDeliveryTimes() {
  const productDeliveryTime = ref<ProductDeliveryTime>({
    name: '',
    identifier: ''
  })

  const validationErrors = ref<Record<string, string[]>>({})
  const productDeliveryTimes = ref<ProductDeliveryTime[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProductDeliveryTimes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axiosInstance.get('/product-delivery-time')
      productDeliveryTimes.value = response.data;
      return response;
    } catch (err: any) {
      error.value = err.message || 'Chyba pri načítaní časov doručenia produktov'
    } finally {
      loading.value = false
    }
  }

  return {
    productDeliveryTime,
    productDeliveryTimes,
    validationErrors,
    loading,
    error,
    fetchProductDeliveryTimes
  }
}
