<template>
  <div
    :class="[
      'app-container-small min-h-screen bg-[#465AE6] pb-[180px] pt-[--header-height] font-zarid text-white',
      'lg:pb-[163px]',
      '3xl:pb-[140px]'
    ]"
  >
    <div class="mt-[128px] flex flex-wrap items-start justify-between gap-y-[19px] lg:mt-[129px]">
      <h1
        :class="[
          'font-durke text-[48px] font-[500] leading-[120%] tracking-[0.48px]',
          '3xl:text-[70px] 3xl:font-[500] 3xl:leading-[120%] 3xl:tracking-[0.7px]'
        ]"
      >
        {{ $t('news') }} /
      </h1>
      <p
        :class="[
          'flex items-center justify-start gap-[47px] text-[30px] font-[600] leading-[110%] tracking-[0.3px] text-[#0ADF0A] lg:mt-[12px]',
          'lg:gap-10'
        ]"
      >
        <span>
          {{ $fd(newsListData[0]?.updated_at, 'll') }}
        </span>
        <span> {{ $fd(newsListData[0]?.updated_at, 'h:mm A') }} </span>
      </p>
    </div>
    <ClientOnly>
      <NewsList
        :class="['mt-[85px]', 'lg:mt-[143px]']"
        :listData="newsListData"
        :isLoadingMore="isLoadingMore"
        :totalPages="totalPages"
        :loadMore="loadMore"
        :currentPage="currentPage"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import NewsList from './_components/NewsList.vue'

definePageMeta({
  layoutProps: {
    isWhiteLogo: true,
    tabsClass: null,
    selectedTabClass: 'bg-[#465AE6] text-white'
  }
})
usePageHead()

const {
  rows: newsListData,
  loadMore,
  isLoadingMore,
  currentPage,
  totalPages
} = usePaginatedFetcher({
  service: getNews,
  isLoadMorePagination: true,
  defaultPerPage: 5
})
</script>
<style></style>
