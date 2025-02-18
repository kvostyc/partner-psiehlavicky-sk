<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { InputText, Textarea, Button, Toast, Tabs, TabList, Tab, TabPanels, TabPanel, Dropdown, FileUpload, ProgressBar, Badge, MultiSelect, Chip, Select } from 'primevue';
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useProduct } from '@/composables/useProduct';
import ErrorMessage from '@/components/Error/Input/ErrorMessage.vue';
import { useShop } from '@/composables/useShop';
import { usePrimeVue } from 'primevue/config';
import { useProductTag } from '@/composables/useProductTags';
import { useProductDeliveryTimes } from '@/composables/useProductDeliveryTimes';
import Editor from 'primevue/editor';

const $primevue = usePrimeVue();

const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id);
const isEditMode = computed(() => !!productId.value);

const {
    loading,
    validationErrors,
    product,
    images,
    createProduct,
    updateProduct,
    publishProduct,
    fetchProductById,
    changeProductStatus,
    uploadImages,
    fetchImages,
    deleteImage,
    setMainImage,
} = useProduct();
const { productTags, fetchProductTags } = useProductTag();
const { shops, fetchShops } = useShop();
const { productDeliveryTimes, fetchProductDeliveryTimes } = useProductDeliveryTimes();

const pageTitle = computed(() => (isEditMode.value ? 'Upraviť produkt' : 'Vytvoriť produkt'));

const categories = ref([
    { name: 'Elektronika', id: 1 },
    { name: 'Oblečenie', id: 2 }
]);

const colors = ref([
    'Biela',
    'Čierna',
    'Zlatá',
    'Strieborná',
    'Bronzová',
]);

const sizes = ref([
    'Medium',
    'Large',
    'Extra Large',
]);

const value = ref('0');

const submitForm = async () => {
    try {
        if (isEditMode.value) {
            await updateProduct(Number(productId.value));
        } else {
            const response = await createProduct(product.value);
            if (response) {
                await nextTick();
                router.push(`/product/edit/${Number(response?.data.id)}`);
            }
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
        await changeProductStatus(Number(productId.value), identifier)
        await fetchProductById(Number(productId.value));
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
const files = ref([]);
const uploadedFiles = ref([]);

const onRemoveTemplatingFile = (file: any, removeFileCallback: CallableFunction, index: number) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event: any) => {
    files.value = event.files;
    files.value.forEach((file: any) => {
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

    if (sizes) {
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    }
    return null;
};

const uploadProductFiles = async () => {
    await uploadImages(Number(productId.value), files.value);
    await fetchImages(Number(productId.value));
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const deleteProductImage = async (index: any) => {
    await deleteImage(Number(productId.value), Number(index));
    await fetchImages(Number(productId.value));
};

const setMainProductImage = async (index: any) => {
    await setMainImage(Number(productId.value), index);
    await fetchImages(Number(productId.value));
};

onMounted(async () => {
    await fetchShops();
    await fetchProductTags();
    await fetchProductDeliveryTimes();

    if (isEditMode.value) {
        await fetchProductById(Number(productId.value));
        const response = await fetchImages(Number(productId.value));
        uploadedFiles.value = response?.data;
    }
});
</script>

<template>
    <DefaultLayout>
        <Toast />
        <form @submit.prevent="submitForm" class="space-y-6">
            <BreadcrumbDefault :pageTitle="pageTitle" />

            <div class="bg-gray-50 rounded-md py-10 px-6 min-w-[1000px]">
                <div class="flex flex-col text-center w-full mb-10">
                    <h1 class="sm:text-3xl text-2xl font-semibold title-font text-gray-900">{{ pageTitle }}</h1>
                    <p class="lg:w-2/3 mx-auto leading-relaxed text-sm text-gray-500">
                        Spravujte svoje produkty jednoducho a efektívne
                    </p>
                </div>

                <div class="w-full border rounded-md p-2" v-cloak>
                    <div class="flex justify-between items-center gap-2">
                        <div class="flex items-center justify-center gap-2">
                            <Button
                                v-if="!loading && product.product_status?.identifier != 'archived' && product.external_id"
                                type="submit" label="Archivovať produkt" severity="warn" size="small"
                                v-on:click="changeStatus('archived')" :loading="loading" />
                            <Button
                                v-if="!loading && product.product_status?.identifier != 'active' && product.external_id"
                                type="submit" label="Aktivovať produkt" severity="success" size="small"
                                v-on:click="changeStatus('active')" :loading="loading" />
                        </div>
                        <div class="flex items-center justify-center gap-2">
                            <Button type="submit" label="Uložiť koncept" severity="primary" :outlined="true"
                                size="small" :loading="loading" />

                            <template v-if="isEditMode">
                                <Button v-if="!loading && product.external_id" type="submit" label="Publikovať zmeny"
                                    severity="success" size="small" v-on:click="updateProduct(Number(productId), true)"
                                    :loading="loading" />
                            </template>

                            <Button v-if="!loading && !product.external_id && productId" type="submit"
                                label="Publikovať produkt" severity="success" size="small"
                                v-on:click="publishProduct(Number(productId))" :loading="loading" />
                        </div>
                    </div>
                    <div class="w-full flex justify-end mt-2" v-cloak>
                        <template v-if="product.external_id">
                            <Chip size="small">
                                <div class="flex gap-1 justify-center items-center">
                                    <i class="pi pi-id-card"></i>
                                    <b>External (shop) ID: </b>
                                    <span>
                                        {{ product.external_id }}
                                    </span>
                                </div>
                            </Chip>
                        </template>
                        <template v-if="!product.external_id">
                            <Chip size="small">
                                <div class="flex gap-1 justify-center items-center">
                                    <i class="pi pi-id-card"></i>
                                    <b>External (shop) ID: </b>
                                    <span>
                                        nepriradené
                                    </span>
                                </div>
                            </Chip>
                        </template>
                    </div>
                </div>

                <hr class="mt-3 mb-5" />

                <Tabs v-model:value="value">
                    <TabList>
                        <Tab value="0">Základné nastavenia</Tab>
                        <Tab value="1" v-if="isEditMode">Multimédia</Tab>
                        <Tab value="2">Popis</Tab>
                        <Tab value="3">Skladová dostupnosť</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <!-- Sekcia: Základné informácie -->
                            <div class="mt-5 mb-2">
                                <h2 class="text-xl font-semibold text-gray-800 mb-2">Základné informácie</h2>
                                <div class="flex flex-col gap-2">
                                    <label for="name" class="font-medium text-gray-700">Názov produktu</label>
                                    <InputText id="name" v-model="product.name" placeholder="Zadajte názov"
                                        class="w-full" :invalid="Array.isArray(validationErrors.name)" />

                                    <ErrorMessage :errors="validationErrors.name" />
                                </div>
                            </div>
                            <div class="mt-5 mb-2">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label for="name" class="font-medium text-gray-700">Cena</label>
                                        <InputText id="name" v-model="product.price" placeholder="Zadajte názov"
                                            class="w-full" :invalid="Array.isArray(validationErrors.price)" />
                                        <ErrorMessage :errors="validationErrors.price" />
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 mb-2">
                                <h2 class="text-xl font-semibold text-gray-800 mb-2">Identifikátory</h2>
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

                            <!-- Sekcia: Kategorizácia -->
                            <div class="mt-5 mb-2">
                                <h2 class="text-xl font-semibold text-gray-800 mb-2">Kategorizácia</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label for="category" class="font-medium text-gray-700">Kategória</label>
                                        <Dropdown id="category" v-model="product.category" :options="categories"
                                            optionLabel="name" optionValue="id" placeholder="Vyber kategóriu"
                                            class="w-full" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="category" class="font-medium text-gray-700">Tagy</label>
                                        <MultiSelect v-model="product.tags" :options="productTags" optionLabel="name"
                                            optionValue="id" filter placeholder="Select Tags" :maxSelectedLabels="3"
                                            class="w-full" />
                                    </div>
                                </div>
                            </div>

                            <!-- Sekcia: Variant -->
                            <div class="mt-5 mb-2">
                                <h2 class="text-xl font-semibold text-gray-800 mb-2">Variant</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label for="category" class="font-medium text-gray-700">Farba</label>
                                        <Select v-model="product.color" :options="colors"
                                            :invalid="Array.isArray(validationErrors.color)" placeholder="Select a City"
                                            class="w-full" />
                                        <ErrorMessage :errors="validationErrors.color" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="category" class="font-medium text-gray-700">Veľkosť</label>
                                        <Select v-model="product.size" :options="sizes"
                                            :invalid="Array.isArray(validationErrors.size)" placeholder="Select a City"
                                            class="w-full" />
                                        <ErrorMessage :errors="validationErrors.size" />
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 mb-2">
                                <h2 class="text-xl font-semibold text-gray-800 mb-2">Obchod</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label for="shop_id" class="font-medium text-gray-700">Priradené ku
                                            obchodu</label>
                                        <Dropdown id="shop_id" v-model="product.shop_id" :options="shops"
                                            placeholder="Vyber obchod" optionLabel="name" optionValue="id"
                                            class="w-full" :invalid="Array.isArray(validationErrors.shop_id)" />

                                        <ErrorMessage :errors="validationErrors.shop_id" />
                                    </div>
                                </div>
                            </div>

                        </TabPanel>
                        <TabPanel value="1" v-if="isEditMode">
                            <div class="card">
                                <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 my-5 border p-2 rounded-lg"
                                    v-if="images.length > 0">
                                    <div v-for="(image, index) of images" :key="index" class="relative">
                                        <div class="absolute top-0 right-0 flex gap-2">
                                            <Button v-if="!image.main" @click="setMainProductImage(image.id)"
                                                icon="pi pi-thumbtack" rounded size="small" outlined
                                                style="cursor: pointer;" severity="warn"></Button>
                                            <Button @click="deleteProductImage(image.id)" icon="pi pi-times" rounded
                                                size="small" outlined style="cursor: pointer;"
                                                severity="danger"></Button>
                                        </div>
                                        <img :src="image.url" v-bind:key="index">
                                    </div>
                                </div>
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
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="free_description" class="font-medium text-gray-700">Krátky popis pod názvom
                                    produktu</label>
                                <Editor id="free_description" v-model="product.free_description"
                                    editorStyle="height: 150px" placeholder="Krátky popis" class="w-full" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="free_description" class="font-medium text-gray-700">Dlhý popis</label>
                                <Editor id="free_description" editorStyle="height: 300px" placeholder="Dlhý popis"
                                    class="w-full" />
                            </div>
                        </TabPanel>
                        <TabPanel value="3">
                            <Select v-model="product.product_delivery_time_id" :options="productDeliveryTimes"
                                defaultValue="Neurčené" optionLabel="name" optionValue="id"
                                :invalid="Array.isArray(validationErrors.product_delivery_time_id)"
                                placeholder="Select a delivery time" class="w-full" />
                            <ErrorMessage :errors="validationErrors.product_delivery_time_id" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </form>

    </DefaultLayout>
</template>