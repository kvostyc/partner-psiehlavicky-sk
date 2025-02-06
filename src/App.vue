<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore';

const userStore = useUserStore();

onMounted(() => {
  userStore.getUser();
});
</script>

<template>
  <RouterView />
</template>
