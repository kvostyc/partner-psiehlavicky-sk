<script setup lang="ts">
const props = defineProps(['subtitle', 'title', 'customClasses'])
</script>

<template>
  <!-- ====== Forms Section Start -->
  <div class="flex min-h-screen items-center justify-center"> 
    <div
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-3xl"
    >
      <div class="flex flex-wrap items-center">
        <div class="w-full border-stroke dark:border-strokedark">
          <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span class="mb-1.5 block font-medium">{{ props.subtitle }}</span>
            <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              {{ props.title }}
            </h2>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ====== Forms Section End -->
</template>
