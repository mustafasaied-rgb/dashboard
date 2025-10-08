<template>
  <div class="space-y-5 sm:space-y-6">
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <ComponentCard title="Default Avatar">
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <Avatar :src="avatarSrc" :size="size" v-for="size in sizes" :key="size" />
      </div>
    </ComponentCard>
    <ComponentCard title="Avatar with online indicator">
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <Avatar :src="avatarSrc" status="online" :size="size" v-for="size in sizes" :key="size" />
      </div>
    </ComponentCard>
    <ComponentCard title="Avatar with Offline indicator">
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <Avatar :src="avatarSrc" status="offline" :size="size" v-for="size in sizes" :key="size" />
      </div>
    </ComponentCard>
    <ComponentCard title="Avatar with busy indicator">
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <Avatar :src="avatarSrc" status="busy" :size="size" v-for="size in sizes" :key="size" />
      </div>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const
const avatarSrc = '/images/user/user-01.jpg'

const currentPageTitle = ref('Avatars')
</script>

<style></style>
