<template>
  <div class="flex min-h-screen flex-col overflow-x-hidden whitespace-pre-line bg-white font-zarid">
    <AppHeader
      :showLeftLogo="layoutProps?.showLeftLogo"
      :isWhiteLogo="layoutProps?.isWhiteLogo"
      :tabsClass="layoutProps?.tabsClass"
      :selectedTabClass="layoutProps?.selectedTabClass"
    />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter :showProductsSection="layoutProps?.showProductsSection ?? true" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const layoutProps = computed(() => {
  const meta = route.meta.layoutProps || {}
  return {
    showLeftLogo: true,
    isWhiteLogo: false,
    tabsClass: '!bg-white',
    selectedTabClass: '',
    showProductsSection: true,
    ...meta
  }
})
</script>
