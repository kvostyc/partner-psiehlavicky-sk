<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableOne from '@/components/Tables/TableOne.vue';
import axiosInstance from '@/axios';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();

interface Product {
  id: number;
  name: string;
  product_code: string;
  ean: string;
  free_description: string;
  shop_id: number;
  created_at: string;
  updated_at: string;
}

const pageTitle = ref('Moje produkty');
const products = ref<Product[]>([]);

const getProducts = async () => {
  try {
    const response = await axiosInstance.get<{ data: Product[] }>('/product');
    products.value = response.data.data; 
  } catch (error) {
    console.error('Chyba pri načítaní produktov:', error);
    $toast.error('Pri načítaní produktov sa vyskytla chyba.');
  }
};

const viewProduct = (product: Product) => {
  console.log('Zobraziť produkt:', product);
};

const editProduct = (product: Product) => {
  console.log('Editovať produkt:', product);
};

const deleteProduct = (product: Product) => {
  if (confirm(`Naozaj chceš odstrániť produkt "${product.name}"?`)) {
    products.value = products.value.filter(p => p.id !== product.id);

    $toast.success('Produkt bol úspešne vymazaný.');
  }
};

onMounted(getProducts);
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <TableOne title="Zoznam vaších produktov" :items="products" @view="viewProduct" @edit="editProduct"
      @delete="deleteProduct" />
  </DefaultLayout>
</template>