<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface TableItem {
  id: number;
  name: string;
  visitors?: number;
  revenues?: string;
  sales?: number;
  conversion?: number;
}

const props = defineProps<{
  items: TableItem[];
}>();

const emit = defineEmits(['edit', 'delete', 'view']);
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
    <h4 class="mb-6 text-xl font-semibold text-black">Shops</h4>

    <div class="flex flex-col">
      <div class="grid grid-cols-4 bg-gray-200">
        <div class="p-2.5 xl:p-5">
          <h5 class="text-sm font-medium uppercase">Názov</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase">Návštevníci</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase">Obrat</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase">Akcie</h5>
        </div>
      </div>

      <div
        v-for="(item, key) in props.items"
        :key="key"
        class="grid grid-cols-4 border-b border-stroke"
      >
        <div class="flex items-center gap-3 p-2.5 xl:p-5">
          <p class="text-black">{{ item.name }}</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black">{{ item.visitors || '-' }}K</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-meta-3">${{ item.revenues || '0' }}</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5 space-x-3">
          <button @click="emit('view', item)" class="text-blue-500 hover:underline">👁 Zobraziť</button>
          <button @click="emit('edit', item)" class="text-yellow-500 hover:underline">✏ Upraviť</button>
          <button @click="emit('delete', item)" class="text-red-500 hover:underline">🗑 Odstrániť</button>
        </div>
      </div>
    </div>
  </div>
</template>
