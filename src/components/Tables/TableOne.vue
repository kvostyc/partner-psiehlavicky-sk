<script setup lang="ts">
import { useLoadingStore } from '@/stores/loadingStore';
import { defineProps, defineEmits, computed } from 'vue';

interface TableItem {
  id: number;
  [key: string]: any;
}

const props = defineProps<{
  title: string;
  items: TableItem[];
}>();

const emit = defineEmits(['edit', 'delete', 'view']);

const columns = computed(() => {
  if (props.items.length === 0) return [];
  return Object.keys(props.items[0]).filter(key => key !== 'id');
});

const loadingStore = useLoadingStore();
</script>

<template>
  <div class="bg-gray-50 px-20 py-10 rounded-md" v-if="!loadingStore.isLoading">
    <div class="flex flex-col text-center w-full mb-10">
      <h1 class="sm:text-3xl text-2xl font-semibold title-font text-gray-900">{{ title }}</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-sm text-gray-500">
        Spravujte svoje produkty jednoducho a efektívne
      </p>
    </div>
    <div class="w-full mx-auto overflow-auto">
      <table class="table-auto w-full text-left whitespace-no-wrap border-collapse border border-gray-200">
        <!-- Hlavička tabuľky -->
        <thead>
          <tr class="bg-gray-100">
            <th v-for="col in columns" :key="col"
              class="px-4 py-3 text-sm font-medium text-gray-900 border border-gray-200">
              {{ col }}
            </th>
            <th class="px-4 py-3 text-sm font-medium text-gray-900 border border-gray-200 text-center">Akcie</th>
          </tr>
        </thead>
        <!-- Telo tabuľky -->
        <tbody>
          <tr v-for="(item, index) in props.items" :key="index" class="hover:bg-gray-50 transition">
            <td v-for="col in columns" :key="col" class="border border-gray-200 px-4 py-3 text-gray-900">
              {{ item[col] }}
            </td>
            <!-- Akcie -->
            <td class="border border-gray-200 px-4 py-3 text-center space-x-3">
              <button @click="emit('view', item)" class="text-blue-500 hover:text-blue-700 transition">👁</button>
              <button @click="emit('edit', item)" class="text-yellow-500 hover:text-yellow-700 transition">✏</button>
              <button @click="emit('delete', item)" class="text-red-500 hover:text-red-700 transition">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex pl-4 mt-6 w-full mx-auto">
      <button
        class="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded transition">
        Pridať
      </button>
    </div>
  </div>
</template>
