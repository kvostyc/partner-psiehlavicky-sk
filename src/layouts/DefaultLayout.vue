<script setup lang="ts">
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue';
import HeaderArea from '@/components/Header/HeaderArea.vue';
import SidebarArea from '@/components/Sidebar/SidebarArea.vue';
import LoadingOverlay from '@/components/Loadings/LoadingOverlay.vue';
import Pusher from 'pusher-js';
import { useToast } from "primevue/usetoast";
import { Avatar, Toast } from 'primevue';

const app = getCurrentInstance();
const toast = useToast();
const lastMessage = ref<{ title: string; message: string; url?: string } | null>(null);

const pusher = app?.appContext.config.globalProperties.$pusher ?? new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

let channel: Pusher.Channel;

const showNotification = (title: string, message: string, url?: string) => {
    lastMessage.value = { title, message, url };
    toast.add({
        severity: 'info',
        summary: title,
        detail: message,
        group: 'bc',
        life: 10000,
    });
};

onMounted(() => {
    channel = pusher.subscribe('admin');

    channel.bind('message', (data: any) => {
        console.log("Prijatá správa:", data);
        if (data && data.title && data.message) {
            showNotification(data.title, data.message, data.url);
        }
    });
});

onUnmounted(() => {
    if (channel) {
        pusher.unsubscribe('admin');
    }
});
</script>

<template>
  <LoadingOverlay />
  
  <!-- PrimeVue Toast -->
  <Toast position="bottom-center" group="bc">
    <template #message="slotProps">
      <div class="flex flex-col items-start flex-auto">
        <div class="flex items-center gap-2">
          <Avatar image="https://psiehlavicky.sk/images/logos/icon_winter.png" shape="circle" />
          <span class="font-bold text-lg">{{ slotProps.message.summary }}</span>
        </div>
        <div class="mt-2">
          <span v-if="slotProps.message.detail">{{ slotProps.message.detail }}</span>
          <a v-if="lastMessage?.url" :href="lastMessage.url" target="_blank" class="text-blue-500 underline ml-2">
            Zobraziť viac
          </a>
        </div>
      </div>
    </template>
  </Toast>

  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- ===== Header Start ===== -->
      <HeaderArea />
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <slot></slot>
        </div>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>
