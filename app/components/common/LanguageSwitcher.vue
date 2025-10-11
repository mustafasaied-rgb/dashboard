<template>
  <ClientOnly>
    <Tabs
      :dir="'ltr'"
      :tabs="availableLocales"
      :modelValue="mapped[locale]"
      @update:model-value="switchLocale"
      v-bind="$attrs"
      :class="['gap-[8.35px]', tabsClass]"
      :tab-class="['!px-[10px]', tabClass]"
      :selectedTabClass="selectedTabClass"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Classish } from '~/types/utils'
withDefaults(
  defineProps<{
    tabsClass?: Classish
    tabClass?: Classish
    selectedTabClass?: Classish
  }>(),
  {
    tabsClass: '',
    selectedTabClass: ''
  }
)

const { locale, locales, setLocale } = useI18n()
const isTransitioning = ref(false)
const transitionDirection = ref('fade')

const mapped = {
  en: { label: 'Eng', value: 'en' },
  ar: { label: 'عربى', value: 'ar' }
} as const

const availableLocales = computed(() => {
  return locales.value.map((i) => mapped[i.code])
})
type SelectedLcoale = typeof availableLocales extends ComputedRef<Array<infer I>> ? I : never
const switchLocale = async (newLocale: SelectedLcoale | null) => {
  if (!newLocale) return
  if (newLocale.value === locale.value) return
  const currentLocaleIndex = availableLocales.value.findIndex((l) => l.value === locale.value)
  const newLocaleIndex = availableLocales.value.findIndex((l) => l.value === newLocale.value)
  transitionDirection.value = newLocaleIndex > currentLocaleIndex ? 'slide-left' : 'slide-right'
  isTransitioning.value = true
  await nextTick()
  // await new Promise((resolve) => setTimeout(resolve, 1000))
  await setLocale(newLocale.value)
  isTransitioning.value = false
}

useHead({
  htmlAttrs: {
    dir: computed(() => locales.value.find((l) => l.code === locale.value)?.dir || 'ltr'),
    lang: computed(() => locale.value),
    class: computed(() => (isTransitioning.value ? 'transition-active' : ''))
  }
})
</script>
