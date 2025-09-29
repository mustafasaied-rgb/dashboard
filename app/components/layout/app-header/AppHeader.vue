<template>
  <BaseAppHeader
    :showLeftLogo="showLeftLogo"
    :isWhiteLogo="isWhiteLogo"
    :tabs="tabs"
    :desktopMenuWidth="desktopMenuRef?.width"
  >
    <template #languageSwitcher>
      <LanguageSwitcher :tabsClass="tabsClass" :selectedTabClass="selectedTabClass" />
    </template>
    <template #desktopMenu="{ floatingClass }">
      <ClientOnly>
        <DesktopMenu
          ref="desktopMenuRef"
          :tabs="tabs"
          :class="[floatingClass, 'navbar-dir']"
          :tabsClass="tabsClass"
          :selectedTabClass="selectedTabClass"
        />
      </ClientOnly>
    </template>
    <template #mobileMenu="{ floatingClass }">
      <ClientOnly>
        <MobileMenu :class="floatingClass" :isWhiteLogo="isWhiteLogo" :tabs="tabs" />
      </ClientOnly>
    </template>
  </BaseAppHeader>
</template>

<script setup lang="ts">
import DesktopMenu from '~/components/layout/app-header/DesktopMenu.vue'
type DesktopMenuInstance = InstanceType<typeof DesktopMenu>
defineProps({
  showLeftLogo: { type: Boolean, default: true },
  isWhiteLogo: { type: Boolean, default: false },
  tabsClass: { type: String, default: '' },
  selectedTabClass: { type: String, default: '' }
} as const)
const desktopMenuRef = ref<DesktopMenuInstance | null>(null)
const { pages } = usePages()
const route = useRoute()
const { locale } = useI18n()
const tabs = computed(() =>
  pages.value
    .filter((page) => page.slug != 'home' && page.type != 'other')
    .map((page) => ({
      id: page.slug,
      label: page?.[`title_${locale.value}`],
      value: `/${page.slug}`,
      isNew: page.slug == 'news' && route.path != '/news'
    }))
)
export type Tab = typeof tabs extends ComputedRef<Array<infer I>> ? I : never
</script>
