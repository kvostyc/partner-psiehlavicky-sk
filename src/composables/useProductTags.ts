import axiosInstance from '@/axios';
import { ref } from 'vue';

interface ProductTag {
    id?: number;
    name: string;
    identifier: string;
    caption?: string;
    icon?: string;
    color?: string;
}

export function useProductTag() {
    const productTag = ref<ProductTag>({
        name: '',
        identifier: '',
    });

    const validationErrors = ref<Record<string, string[]>>({});
    const productTags = ref<ProductTag[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchProductTags = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/product-tag');
            productTags.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Chyba pri načítaní tagov produktov';
        } finally {
            loading.value = false;
        }
    };

    return {
        productTag,
        productTags,
        validationErrors,
        fetchProductTags,
    };
}