<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { InputText, Textarea, Dropdown, Button, Toast } from 'primevue';
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useProduct } from '@/composables/useProduct';
import ErrorMessage from '@/components/Error/Input/ErrorMessage.vue';
import { useShop } from '@/composables/useShop';

const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id);
const isEditMode = computed(() => !!productId.value);

const { createProduct, updateProduct, fetchProductById, loading, validationErrors, product, changeProductStatus } = useProduct();
const { shops, fetchShops } = useShop();

const pageTitle = computed(() => (isEditMode.value ? 'Upraviť produkt' : 'Vytvoriť produkt'));

const categories = ref([
    { name: 'Elektronika', id: 1 },
    { name: 'Oblečenie', id: 2 }
]);

const submitForm = async () => {
    try {
        if (isEditMode.value) {
            await updateProduct(Number(productId.value));
        } else {
            await createProduct(product.value);
        }

        if (Object.keys(validationErrors.value).length > 0) {
            toast.add({
                severity: 'warn',
                summary: 'Upozornenie',
                detail: 'Niektoré polia sú nesprávne vyplnené.',
                life: 5000
            });
            return;
        }

        toast.add({
            severity: 'success',
            summary: 'Úspech',
            detail: 'Produkt úspešne uložený.',
            life: 5000
        });

        router.push({ "name": "products.index" });
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Chyba',
            detail: 'Vyskytla sa chyba pri ukladaní produktu.',
            life: 5000
        });
    }
};

const changeStatus = async (identifier: string) => {
    try {
        changeProductStatus(Number(productId.value), identifier)
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Chyba',
            detail: 'Vyskytla sa chyba pri ukladaní produktu.',
            life: 5000
        });
    }
};

onMounted(async () => {
    await fetchShops();
    if (isEditMode.value) {
        await fetchProductById(Number(productId.value));
    }
});
</script>

<template>
    <DefaultLayout>
        <Toast />
        <BreadcrumbDefault :pageTitle="pageTitle" />

        <div class="bg-gray-50 rounded-md py-10 px-6">
            <div class="flex flex-col text-center w-full mb-10">
                <h1 class="sm:text-3xl text-2xl font-semibold title-font text-gray-900">{{ pageTitle }}</h1>
                <p class="lg:w-2/3 mx-auto leading-relaxed text-sm text-gray-500">
                    Spravujte svoje produkty jednoducho a efektívne
                </p>
            </div>

            <div class="flex justify-end items-center" v-if="isEditMode">
                <Button type="submit" label="Archivovať produkt" severity="warn" size="small" outlined v-on:click="changeStatus('archived')"
                    :loading="loading" />
            </div>

            <hr class="mt-3 mb-5" />

            <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Sekcia: Identifikátory -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Identifikátory</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="product_code" class="font-medium text-gray-700">Kód produktu</label>
                            <InputText id="product_code" v-model="product.product_code" placeholder="Zadajte kód"
                                :invalid="Array.isArray(validationErrors.product_code)" class="w-full" />

                            <ErrorMessage :errors="validationErrors.product_code" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="ean" class="font-medium text-gray-700">EAN kód</label>
                            <InputText id="ean" v-model="product.ean" placeholder="Zadajte EAN" class="w-full"
                                :invalid="Array.isArray(validationErrors.ean)" />

                            <ErrorMessage :errors="validationErrors.ean" />
                        </div>
                    </div>
                </div>

                <!-- Sekcia: Základné informácie -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Základné informácie</h2>
                    <div class="flex flex-col gap-2">
                        <label for="name" class="font-medium text-gray-700">Názov produktu</label>
                        <InputText id="name" v-model="product.name" placeholder="Zadajte názov" class="w-full"
                            :invalid="Array.isArray(validationErrors.name)" />

                        <ErrorMessage :errors="validationErrors.name" />
                    </div>
                    <div class="flex flex-col gap-2 mt-4">
                        <label for="free_description" class="font-medium text-gray-700">Popis</label>
                        <Textarea id="free_description" v-model="product.free_description" rows="3"
                            placeholder="Krátky popis" class="w-full" />
                    </div>
                </div>

                <!-- Sekcia: Kategorizácia -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Kategorizácia</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="shop_id" class="font-medium text-gray-700">Obchod</label>
                            <Dropdown id="shop_id" v-model="product.shop_id" :options="shops" placeholder="Vyber obchod"
                                optionLabel="name" optionValue="id" class="w-full"
                                :invalid="Array.isArray(validationErrors.shop_id)" />

                            <ErrorMessage :errors="validationErrors.shop_id" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="category" class="font-medium text-gray-700">Kategória</label>
                            <Dropdown id="category" v-model="product.category" :options="categories" optionLabel="name"
                                optionValue="id" placeholder="Vyber kategóriu" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Akcie -->
                <div class="flex justify-end gap-3">
                    <Button type="reset" label="Zrušiť" severity="secondary" outlined />
                    <Button type="submit" label="Uložiť produkt" severity="primary" :loading="loading" />
                </div>
            </form>
        </div>
    </DefaultLayout>
</template>