import axiosInstance from '@/axios';
import { ref } from 'vue';

interface Shop {
    id: number;
    name: string;
    visitors?: number;
    revenues?: string;
}

export function useShop() {
    const shop = ref<Shop>({
        id: 0,
        name: '',
        visitors: 0,
        revenues: '',
    });

    const validationErrors = ref<Record<string, string[]>>({});
    const shops = ref<Shop[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchShops = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/shop');
            shops.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Chyba pri načítaní obchodov';
        } finally {
            loading.value = false;
        }
    };

    const fetchShopById = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/shop/${id}`);
            shop.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Chyba pri načítaní obchodu';
        } finally {
            loading.value = false;
        }
    };

    const createShop = async (shopData: Omit<Shop, 'id'>) => {
        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        try {
            return await axiosInstance.post('/shop', shopData);
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                return validationErrors.value = err.response.data.errors;
            } else {
                return error.value = err.message || 'Chyba pri vytváraní obchodu';
            }
        } finally {
            loading.value = false;
        }
    };

    const updateShop = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            await axiosInstance.put(`/shop/${id}`, shop.value);
        } catch (err: any) {
            error.value = err.message || 'Chyba pri aktualizácii obchodu';
        } finally {
            loading.value = false;
        }
    };

    const deleteShop = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            await axiosInstance.delete(`/shop/${id}`);
            shops.value = shops.value.filter(s => s.id !== id);
        } catch (err: any) {
            error.value = err.message || 'Chyba pri mazaní obchodu';
        } finally {
            loading.value = false;
        }
    };

    return {
        shop,
        shops,
        loading,
        error,
        validationErrors,
        fetchShops,
        fetchShopById,
        createShop,
        updateShop,
        deleteShop,
    };
}