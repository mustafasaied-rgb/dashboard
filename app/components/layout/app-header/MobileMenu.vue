<template>
  <button
    v-bind="$attrs"
    @click="isOpen = !isOpen"
    :class="[
      'm-0 flex h-[42px] w-[42px] place-items-center items-center justify-center rounded-xl bg-[#0000000D] p-0 backdrop-blur-[6px]',
      isWhiteLogo && '!bg-[#F0F0F0]'
    ]"
  >
    <MenuMobileIcon class="static !h-[8px] !w-[18px]" />
  </button>
  <teleport to="body">
    <section
      v-show="isOpen"
      class="fixed start-0 top-0 z-[100] flex h-[100vh] w-full flex-col overflow-y-auto bg-[#0D1667] pb-[66.8px] text-white"
    >
      <section
        :class="[
          'app-container navbar-dir z-[100] flex h-fit w-full items-center justify-between bg-transparent transition-colors duration-300',
          'pt-[38px]'
        ]"
      >
        <ClientOnly>
          <!-- Center Vision Logo -->
          <SaudiVision :isWhiteLogo="true" :showLeftLogo="false" class="mb-[10px] self-end" />
          <!-- Mobile Logo -->
          <div
            @click="
              () => {
                navigateTo('/')
                isOpen = false
              }
            "
            :class="['-mt-6 mb-0 block h-[55px] w-[106px]', 'lg:hidden']"
          >
            <BaseImg
              densities="x1 x2"
              format="webp"
              :src="settings?.logo_light"
              class="h-full w-full"
              :fallback="ASC_Logo_Main"
               alt="ASC Logo Main"
            />
          </div>
        </ClientOnly>

        <!-- Mobile Menu Button -->
        <button
          @click="isOpen = !isOpen"
          class="gird m-0 h-[42px] w-[42px] place-items-center rounded-xl bg-[#0000000D] p-0 backdrop-blur-[6px] lg:hidden"
        >
          <CloseIcon class="h-[42px] w-[42px]" />
        </button>
      </section>
      <div
        :class="['app-container mt-[81px] inline-flex w-fit flex-col items-stretch gap-y-[28px]']"
      >
        <h3
          v-for="tab in tabs"
          @click="
            () => {
              navigateTo(tab.value)
              isOpen = false
            }
          "
          :class="[
            'relative w-fit text-xl-heading font-[200] not-italic leading-[49.4px] tracking-[0.52px]'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.isNew"
            class="absolute end-[-8px] top-[0px] h-2 w-2 rounded-full bg-[#0ADF0A]"
          >
          </span>
        </h3>
      </div>
      <div class="app-container mt-[50px] !h-[68px]">
        <LanguageSwitcher
          class="!bg-[#333FB1]"
          tab-class="text-white"
          selected-tab-class="bg-white !text-black"
        />
      </div>
      <ProductsSection class="!pb-[114px] !pt-[110px] text-white" />
      <AppFooterSection1 themeColor="white" class="text-white" />
    </section>
  </teleport>
</template>

<script setup lang="ts">
const ASC_Logo_Main = '/Icons/ASC_Logo_Main.svg'
withDefaults(
  defineProps<{
    tabs: any[]
    isWhiteLogo?: boolean
  }>(),
  {
    isWhiteLogo: false
  }
)
const { settings } = useWebsiteSettings()

const isOpen = ref(false)
watch(isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
<style scoped></style>
