<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useToast } from 'vue-toast-notification';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import { AutoComplete } from 'primevue';
import { useProduct } from '@/composables/useProduct';
import router from '@/router';

const $toast = useToast();

const pageTitle = ref('Moje produkty');
const value = ref("");

const { products, fetchProducts, loading } = useProduct();

const searchResults = ref<Product[]>([]);

interface Product {
  id?: number;
  name: string;
  product_code: string;
  ean: string;
  free_description: string;
  shop_id: number | null;
  category: string | null;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

const search = (event: any) => {
  searchResults.value = [...Array(10).keys()].map((item) => ({
    id: item,
    name: event.query + '-' + item,
    product_code: '',
    ean: '',
    free_description: '',
    shop_id: null,
    category: null,
    tags: [],
  }));
};

const getSeverity = (param: string) => {
  return param;
};

const editProduct = (productId: number) => {
  router.push(`/product/edit/${productId}`);
};

onMounted(async () => {
  try {
    await fetchProducts();
  } catch (error) {
    $toast.error("Vyskytla sa chyba pri načítavaní produktov.");
  }
});
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="bg-gray-50 rounded-md py-10">
      <div class="flex flex-col text-center w-full mb-10">
        <h1 class="sm:text-3xl text-2xl font-semibold title-font text-gray-900">Zoznam vaších produktov</h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-sm text-gray-500">
          Spravujte svoje produkty jednoducho a efektívne
        </p>
      </div>
      <DataTable :value="products" tableStyle="min-width: 50rem">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex gap-4 items-center">
              <div class="flex flex-col gap-2">
                <label for="ean" class="font-medium text-gray-700">Hľadať</label>
                <AutoComplete v-model="value" size="small" inputId="search_label" :suggestions="searchResults"
                  @complete="search" variant="filled" field="name" optionLabel="name" />
              </div>
            </div>
            <div class="flex gap-2">
              <Button label="Refresh" icon="pi pi-refresh" rounded raised @click="fetchProducts"
                :loading="loading"></Button>
              <Button label="Vytvoriť produkt" icon="pi pi-plus" rounded raised :loading="loading" as="router-link"
                to="/product/create"></Button>
            </div>
          </div>
        </template>
        <Column field="name" header="Name"></Column>
        <Column field="ean" header="Ean"></Column>
        <Column header="Image">
          <template #body="slotProps">
            <img :src="`https://placehold.co/400`" :alt="slotProps.data.image" class="w-24 rounded" />
          </template>
        </Column>
        <Column field="category" header="Category"></Column>
        <Column field="rating" header="Reviews">
          <template #body="slotProps">
            <Rating :modelValue="slotProps.data.ean" readonly />
          </template>
        </Column>
        <Column header="Status">
          <template #body="">
            <Tag :value="'aktívny'" :severity="getSeverity('test')" />
          </template>
        </Column>
        <Column header="Akcie">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" label="Upraviť" @click="editProduct(slotProps.data.id)" />
              <Button icon="pi pi-pencil" label="Upraviť" @click="editProduct(slotProps.data.id)" />
            </div>
          </template>
        </Column>
        <template #footer> Celkovo načítaných {{ products ? products.length : 0 }} produktov. </template>
      </DataTable>
      <Paginator :rows="3" :totalRecords="products ? products.length : 0" :rowsPerPageOptions="[3, 20, 30]"></Paginator>
    </div>
  </DefaultLayout>
</template>