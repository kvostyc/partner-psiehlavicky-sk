<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableOne from '@/components/Tables/TableOne.vue';
import axiosInstance from '@/axios';

interface Shop {
  id: number;
  name: string;
  visitors?: number;
  revenues?: string;
}

const pageTitle = ref('Shops');
const shops = ref<Shop[]>([]);

const getShops = async () => {
  try {
    const response = await axiosInstance.get<Shop[]>('/shop');
    shops.value = response.data;
  } catch (error) {
    console.error('Chyba pri načítaní obchodov:', error);
  }
};

const viewShop = (shop: Shop) => {
  console.log('Zobraziť shop:', shop);
};

const editShop = (shop: Shop) => {
  console.log('Editovať shop:', shop);
};

const deleteShop = (shop: Shop) => {
  if (confirm(`Naozaj chceš odstrániť obchod "${shop.name}"?`)) {
    shops.value = shops.value.filter(s => s.id !== shop.id);
  }
};

onMounted(getShops);
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    
    <TableOne 
      :items="shops" 
      @view="viewShop" 
      @edit="editShop" 
      @delete="deleteShop" 
    />
  </DefaultLayout>
</template>
