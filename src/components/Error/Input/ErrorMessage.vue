<script setup lang="ts">

defineProps<{ errors?: string[] }>();

</script>

<template>
  <div v-if="errors && errors.length" class="mb-2">
    <p v-for="error in errors" :key="error" class="text-red-500 text-sm italic">
      {{ error }}
    </p>
  </div>
</template>