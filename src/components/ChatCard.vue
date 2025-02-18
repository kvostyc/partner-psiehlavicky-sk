<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"
  >
    <h4 class="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">Chats</h4>

    <div>
      <template v-for="(chat, index) in chatData" :key="index">
        <RouterLink
          to="/"
          class="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
        >
          <div class="relative h-14 w-14 rounded-full">
            <img :src="chat.avatar" alt="User" />
            <span
              class="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white"
              :style="{ backgroundColor: chat.color }"
            ></span>
          </div>

          <div class="flex flex-1 items-center justify-between">
            <div>
              <h5 class="font-medium text-black dark:text-white">{{ chat.name }}</h5>
              <p>
                <span class="text-sm text-black dark:text-white">{{ chat.text }}</span>
                <span class="text-xs"> . {{ chat.time }} min</span>
              </p>
            </div>
            <div
              v-if="chat.textCount !== 0"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-primary"
            >
              <span class="text-sm font-medium text-white"> {{ chat.textCount }}</span>
            </div>
          </div>
        </RouterLink>
      </template>
    </div>
  </div>
</template>
