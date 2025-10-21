<template>
  <Dropdown ref="dropdownRef" placement="bottom-end" :offset="17" :panel-class="'w-[100px]'">
    <template #trigger="{ open }">
      <Button rounded variant="outline" size="icon" class="!bg-transparent">
        <GlobeIcon />
      </Button>
    </template>

    <template #default="{ closeFn }">
      <ul class="flex flex-col gap-1 border-gray-200 dark:border-gray-800">
        <li
          v-for="(item, index) in availableLocales"
          :key="index"
          @click="
            () => {
              switchLocale(item)
              closeFn()
            }
          "
        >
          <DropdownItem :is-selected="item.value == locale">
            {{ item.label }}
          </DropdownItem>
        </li>
      </ul>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
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
