<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const pageTitle = ref('Products')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-242.5">
      <BreadcrumbDefault :pageTitle="pageTitle" />
      
      test
    </div>
  </DefaultLayout>
</template>
