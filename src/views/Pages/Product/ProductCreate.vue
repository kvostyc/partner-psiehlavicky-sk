<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { InputText, Textarea, Button, Toast, Tabs, TabList, Tab, TabPanels, TabPanel, Dropdown, FileUpload, ProgressBar, Badge } from 'primevue';
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useProduct } from '@/composables/useProduct';
import ErrorMessage from '@/components/Error/Input/ErrorMessage.vue';
import { useShop } from '@/composables/useShop';
import { usePrimeVue } from 'primevue/config';

const $primevue = usePrimeVue();

const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id);
const isEditMode = computed(() => !!productId.value);

const {
    createProduct,
    updateProduct,
    fetchProductById,
    loading,
    validationErrors,
    product,
    changeProductStatus,
    images,
    uploadImages,
    fetchImages
} = useProduct();
const { shops, fetchShops } = useShop();

const pageTitle = computed(() => (isEditMode.value ? 'Upraviť produkt' : 'Vytvoriť produkt'));

const categories = ref([
    { name: 'Elektronika', id: 1 },
    { name: 'Oblečenie', id: 2 }
]);

const value = ref('1');

const submitForm = async () => {
    try {
        if (isEditMode.value) {
            await updateProduct(Number(productId.value));
        } else {
            const response = await createProduct(product.value);
            await nextTick();
            router.push(`/product/edit/${Number(response?.data.id)}`);
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

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref<FileList>();

const onRemoveTemplatingFile = (file: string, removeFileCallback: CallableFunction, index: number) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event: any) => {
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = (callback: CallableFunction) => {
    totalSizePercent.value = totalSize.value / 10;
    callback();
};

const formatSize = (bytes: number) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale?.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

const uploadProductFiles = async () => {
    await uploadImages(Number(productId.value), files.value);
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

onMounted(async () => {
    await fetchShops();
    if (isEditMode.value) {
        await fetchProductById(Number(productId.value));
        await fetchImages(Number(productId.value));
        files = images;
    }
});
</script>

<template>
    <DefaultLayout>
        <Toast />
        <form @submit.prevent="submitForm" class="space-y-6">
            <BreadcrumbDefault :pageTitle="pageTitle" />

            <div class="bg-gray-50 rounded-md py-10 px-6">
                <div class="flex flex-col text-center w-full mb-10">
                    <h1 class="sm:text-3xl text-2xl font-semibold title-font text-gray-900">{{ pageTitle }}</h1>
                    <p class="lg:w-2/3 mx-auto leading-relaxed text-sm text-gray-500">
                        Spravujte svoje produkty jednoducho a efektívne
                    </p>
                </div>

                <div class="flex justify-end items-center gap-2" v-if="isEditMode">
                    <Button v-if="!loading && product.product_status?.identifier != 'archived'" type="submit"
                        label="Archivovať produkt" severity="warn" size="small" outlined
                        v-on:click="changeStatus('archived')" :loading="loading" />
                    <Button v-if="!loading && product.product_status?.identifier != 'active'" type="submit"
                        label="Aktivovať produkt" severity="success" size="small" outlined
                        v-on:click="changeStatus('active')" :loading="loading" />
                </div>

                <hr class="mt-3 mb-5" />

                <Tabs v-model:value="value">
                    <TabList>
                        <Tab value="0">Základné nastavenia</Tab>
                        <Tab value="1" v-if="isEditMode">Multimédia</Tab>
                        <Tab value="2">Popis</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <div>
                                <h2 class="text-lg font-semibold text-gray-800 mb-3">Identifikátory</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label for="product_code" class="font-medium text-gray-700">Kód produktu</label>
                                        <InputText id="product_code" v-model="product.product_code"
                                            placeholder="Zadajte kód"
                                            :invalid="Array.isArray(validationErrors.product_code)" class="w-full" />

                                        <ErrorMessage :errors="validationErrors.product_code" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="ean" class="font-medium text-gray-700">EAN kód</label>
                                        <InputText id="ean" v-model="product.ean" placeholder="Zadajte EAN"
                                            class="w-full" :invalid="Array.isArray(validationErrors.ean)" />

                                        <ErrorMessage :errors="validationErrors.ean" />
                                    </div>
                                </div>
                            </div>

                            <!-- Sekcia: Základné informácie -->
                            <div>
                                <h2 class="text-lg font-semibold text-gray-800 mb-3">Základné informácie</h2>
                                <div class="flex flex-col gap-2">
                                    <label for="name" class="font-medium text-gray-700">Názov produktu</label>
                                    <InputText id="name" v-model="product.name" placeholder="Zadajte názov"
                                        class="w-full" :invalid="Array.isArray(validationErrors.name)" />

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
                                        <Dropdown id="shop_id" v-model="product.shop_id" :options="shops"
                                            placeholder="Vyber obchod" optionLabel="name" optionValue="id"
                                            class="w-full" :invalid="Array.isArray(validationErrors.shop_id)" />

                                        <ErrorMessage :errors="validationErrors.shop_id" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="category" class="font-medium text-gray-700">Kategória</label>
                                        <Dropdown id="category" v-model="product.category" :options="categories"
                                            optionLabel="name" optionValue="id" placeholder="Vyber kategóriu"
                                            class="w-full" />
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="1" v-if="isEditMode">
                            <div class="card">
                                <Toast />
                                <FileUpload name="demo[]" :multiple="true" accept="image/*" :maxFileSize="1000000"
                                    @select="onSelectedFiles">
                                    <template #header="{ chooseCallback, clearCallback, files }">
                                        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                            <div class="flex gap-2">
                                                <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined
                                                    severity="secondary"></Button>
                                                <Button @click="uploadEvent(uploadProductFiles)"
                                                    icon="pi pi-cloud-upload" rounded outlined severity="success"
                                                    :disabled="!files || files.length === 0"></Button>
                                                <Button @click="clearCallback()" icon="pi pi-times" rounded outlined
                                                    severity="danger" :disabled="!files || files.length === 0"></Button>
                                            </div>
                                            <ProgressBar :value="totalSizePercent" :showValue="false"
                                                class="md:w-20rem h-1 w-full md:ml-auto">
                                                <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                                            </ProgressBar>
                                        </div>
                                    </template>
                                    <template
                                        #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                                        <div class="flex flex-col gap-8 pt-4">
                                            <div v-if="files.length > 0">
                                                <h5>Pending</h5>
                                                <div class="flex flex-wrap gap-4">
                                                    <div v-for="(file, index) of files"
                                                        :key="file.name + file.type + file.size"
                                                        class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                                        <div>
                                                            <img role="presentation" :alt="file.name"
                                                                :src="file.objectURL" width="100" height="50" />
                                                        </div>
                                                        <span
                                                            class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                                                file.name }}</span>
                                                        <div>{{ formatSize(file.size) }}</div>
                                                        <Badge value="Pending" severity="warn" />
                                                        <Button icon="pi pi-times"
                                                            @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                                            outlined rounded severity="danger" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="uploadedFiles.length > 0">
                                                <h5>Completed</h5>
                                                <div class="flex flex-wrap gap-4">
                                                    <div v-for="(file, index) of uploadedFiles"
                                                        :key="file.name + file.type + file.size"
                                                        class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                                        <div>
                                                            <img role="presentation" :alt="file.name"
                                                                :src="file.objectURL" width="100" height="50" />
                                                        </div>
                                                        <span
                                                            class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                                                file.name }}</span>
                                                        <div>{{ formatSize(file.size) }}</div>
                                                        <Badge value="Completed" class="mt-4" severity="success" />
                                                        <Button icon="pi pi-times"
                                                            @click="removeUploadedFileCallback(index)" outlined rounded
                                                            severity="danger" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #empty>
                                        <div class="flex items-center justify-center flex-col">
                                            <i
                                                class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                                            <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                                        </div>
                                    </template>
                                </FileUpload>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">

                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <!-- Akcie -->
                <div class="flex justify-end gap-3 mt-5">
                    <Button type="submit" label="Zrušiť" severity="secondary" outlined
                        v-on:click="router.push({ name: 'products.index' })"></Button>
                    <Button type="submit" label="Uložiť produkt" severity="primary" :loading="loading"></Button>
                </div>
            </div>
        </form>

    </DefaultLayout>
</template>