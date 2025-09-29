<template>
  <teleport to="body">
    <Tabs
      :tabs="tabs"
      v-bind="$attrs"
      :returnObject="false"
      ref="tabsRef"
      :class="[!isHovering && tabsClass]"
      :selectedTabClass="!isHovering && selectedTabClass"
      :modelValue="route.path"
      @update:modelValue="
        (val: string) => {
          navigateTo(val)
          isHovering = false
        }
      "
    >
      <template #tab="{ tab, isSelected }">
        <h2
          @mouseenter="
            !disableHoverOnTab && tab?.id == 'products-and-solutions'
              ? (isHovering = true)
              : (isHovering = false)
          "
          :class="[!isSelected && 'hover:text-[#1778FF]']"
        >
          {{ tab.label }}
        </h2>
        <span
          v-if="tab.isNew"
          class="absolute end-[7px] top-[7px] h-2 w-2 rounded-full bg-[#0ADF0A]"
        >
        </span>
      </template>
    </Tabs>
    <Transition
      appear
      :enter-active-class="'transition ease-out duration-150'"
      :enter-from-class="'opacity-0 -translate-y-2'"
      :enter-to-class="'opacity-100 translate-y-0'"
      :leave-active-class="'transition ease-in duration-150'"
      :leave-from-class="'opacity-100 translate-y-0'"
      :leave-to-class="'opacity-0 -translate-y-1'"
    >
      <div v-if="isHovering" class="fixed start-0 top-0 z-[50] flex h-[100vh] w-full flex-col">
        <div
          @mouseover="isHovering = true"
          @mouseleave="isHovering = false"
          class="h-[90vh] max-h-[900px] overflow-y-auto bg-white"
        >
          <BaseAppHeader
            class="!static"
            :desktopMenuWidth="tabsRef?.containerWidth"
            :showLeftLogo="true"
          >
            <template #languageSwitcher>
              <LanguageSwitcher />
            </template>
          </BaseAppHeader>
          <ProductsSection class="!pb-[74px] !pt-[60px]" />
        </div>
        <div class="backdrop flex-1 bg-blue-900/40"></div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import type { Tab } from '~/components/layout/app-header/AppHeader.vue'
import Tabs, { type TabsExpose } from '~/components/ui/tabs.vue'

withDefaults(
  defineProps<{
    tabs: Tab[]
    tabsClass?: string
    selectedTabClass?: string
  }>(),
  {
    tabsClass: '',
    selectedTabClass: ''
  }
)
const tabsRef = ref<TabsExpose | null>(null)
const route = useRoute()

const isHovering = ref(false)
const disableHoverOnTab = ref(false)
watch(isHovering, (val) => (document.body.style.overflow = val ? 'hidden' : ''))

let routeTimer: ReturnType<typeof setTimeout> | null = null
watch(
  route,
  () => {
    disableHoverOnTab.value = true
    isHovering.value = false
    if (routeTimer) {
      clearTimeout(routeTimer)
    }
    routeTimer = setTimeout(() => {
      disableHoverOnTab.value = false
      routeTimer = null
    }, 1000)
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(() => routeTimer && clearTimeout(routeTimer))

defineExpose({
  width: computed(() => tabsRef.value?.containerWidth)
})
</script>
<style scoped></style>
