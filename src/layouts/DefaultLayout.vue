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
const lastMessage = ref<string | null>(null);

const pusher = app?.appContext.config.globalProperties.$pusher ?? new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

let channel: Pusher.Channel;

const showNotification = (message: string) => {
    lastMessage.value = message;
    toast.add({
        severity: 'info',
        summary: message,
        group: 'bc'
    });
};

onMounted(() => {
    channel = pusher.subscribe('admin');

    channel.bind('message', (data: any) => {
        console.log("Prijatá správa:", data);
        if (data && data.message) {
            showNotification(data.message);
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
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
          <span class="font-bold">Systémová notifikácia</span>
        </div>
        <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
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
