<template>
  <div class="flex flex-col gap-[59px] lg:gap-[73px]">
    <NuxtLink
      v-for="(item, index) in listData"
      :to="`/news/${item.slug}`"
      class="group hover:cursor-pointer"
    >
      <h4
        :class="[
          'transition-colors group-hover:text-[#0ADF0A]',
          'text-[30px] font-[600] leading-[110%] tracking-[0.3px]'
        ]"
      >
        {{ $fd(item.updated_at, 'll') }}
      </h4>
      <p
        :class="[
          'mt-[8px] text-[30px] font-[400] leading-[110%] transition-colors group-hover:text-[#0ADF0A]',
          'lg:mt-[7px] lg:text-[40px] lg:font-[300] lg:leading-[102%] lg:tracking-[0.4px]',
          'xl:mt-[6px] xl:text-xl-heading xl:font-[200] xl:leading-[95%] xl:tracking-[0.52px]'
        ]"
      >
        {{ item?.[`title_${locale}`] }}
      </p>
      <BaseImg
        densities="x1 x2"
        format="webp"
        v-if="item?.image?.webp"
        :src="item?.image?.webp"
        :placeholder="item?.image?.avif"
        class="mt-[24px] aspect-[180/103] w-[279.623px] self-end rounded-[10px] object-cover lg:mt-[42px] lg:aspect-[7/4] lg:w-[280px]"
        :alt="`video`"
        loading="lazy"
      />
      <div
        :class="[
          'mt-[56px] flex w-full max-w-[308px] items-center justify-start overflow-x-hidden text-[20px] font-[300] leading-[110%] tracking-[19.8px] text-[#0ADF0A] group-last-of-type:hidden',
          'lg:mt-[72px] lg:max-w-[75%] lg:text-[24px]',
          'xl:mt-[88px] xl:max-w-full xl:text-[30px]'
        ]"
      >
        #####################
      </div>
    </NuxtLink>
    <BaseButton
      :isStyled="false"
      :disabled="isLoadingMore"
      :isLoading="isLoadingMore"
      v-if="isLoadingMore || (currentPage != totalPages && listData?.length)"
      @click="loadMore"
      :loadarProps="{
        color: '#0ADF0A',
        size: 26
      }"
      :class="[
        'relative mx-auto mt-[28px] self-center text-[22px] font-[500] leading-[120%] tracking-[0.22px] text-[#0ADF0A] transition-all hover:opacity-80',
        'font-durke lg:mt-[43px] xl:text-[28px] xl:tracking-[0.28px]'
      ]"
    >
      <SlashSvg />
      <span class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
        {{ $t('more_news') }}
      </span>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { NewsItem } from '~/services/news.service'
withDefaults(
  defineProps<{
    listData: NewsItem[]
    isLoadingMore: boolean
    totalPages: number
    currentPage: number
    loadMore: (...args: any) => void
  }>(),
  {
    listData: () => []
  }
)
const { locale } = useI18n()
</script>
<style></style>
