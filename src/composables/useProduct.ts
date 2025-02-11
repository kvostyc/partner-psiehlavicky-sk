import axiosInstance from '@/axios';
import { ref } from 'vue';

interface Product {
    id?: number;
    name: string;
    product_code: string;
    ean: string;
    free_description: string;
    shop_id: number | null;
    category: string | null;
    tags: [];
    product_status: ProductStatus;
    product_status_id: number | null;
    created_at?: string;
    updated_at?: string;
}

interface ProductStatus {
    name: string;
    identifier: string;
}

export function useProduct() {
    const product = ref<Product>({
        name: '',
        product_code: '',
        ean: '',
        free_description: '',
        shop_id: null,
        category: null,
        tags: [],
        product_status:
        {
            name: '',
            identifier: '',
        },
        product_status_id: null,
    });

    const validationErrors = ref<Record<string, string[]>>({});
    const products = ref<Product[]>([]);
    const images = ref<string[]>([]); // URL obrázkov produktu
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchProducts = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/product');
            products.value = response.data.data;
        } catch (err: any) {
            error.value = err.message || 'Chyba pri načítaní produktov';
        } finally {
            loading.value = false;
        }
    };

    const fetchProductById = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/product/${id}`);
            product.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Chyba pri načítaní produktu';
        } finally {
            loading.value = false;
        }
    };

    const createProduct = async (productData: Product) => {
        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        try {
            return await axiosInstance.post('/product', productData);
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                validationErrors.value = err.response.data.errors;
            } else {
                error.value = err.message || 'Chyba pri vytváraní produktu';
            }
        } finally {
            loading.value = false;
        }
    };

    const updateProduct = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            return await axiosInstance.put(`/product/${id}`, product.value);
        } catch (err: any) {
            error.value = err.message || 'Chyba pri aktualizácii produktu';
        } finally {
            loading.value = false;
        }
    };

    const deleteProduct = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            await axiosInstance.delete(`/product/${id}`);
            products.value = products.value.filter(p => p.id !== id);
        } catch (err: any) {
            error.value = err.message || 'Chyba pri mazaní produktu';
        } finally {
            loading.value = false;
        }
    };

    const changeProductStatus = async (id: number, status_identifier: string) => {
        loading.value = true;
        error.value = null;
        try {
            return await axiosInstance.post(`change-product-status`, {
                productStatusIdentifier: status_identifier,
                productId: id,
            });
        } catch (err: any) {
            error.value = err.message || 'Chyba pri zmene stavu produktu';
        } finally {
            loading.value = false;
        }
    };

    const fetchImages = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/product/${id}/images`);
            images.value = response.data;

            return response;
        } catch (err: any) {
            error.value = err.message || 'Chyba pri načítaní obrázkov';
        } finally {
            loading.value = false;
        }
    };

    const uploadImages = async (id: number, files: FileList) => {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('files[]', file);
            });

            formData.append('product_id', id.toString());

            return await axiosInstance.post(`/product/${id}/images`, formData);
        } catch (err: any) {
            error.value = err.message || 'Chyba pri nahrávaní obrázkov';
        } finally {
            loading.value = false;
        }
    };

    return {
        product,
        products,
        images,
        loading,
        error,
        validationErrors,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        changeProductStatus,
        fetchImages,
        uploadImages,
    };
}