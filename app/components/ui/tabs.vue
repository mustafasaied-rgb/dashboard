<template>
  <div
    ref="containerRef"
    :class="[
      'flex h-[68px] w-fit gap-[2px] rounded-3xl bg-[#F0F0F0] px-[14px] py-[13px] text-center text-xl font-normal not-italic leading-[105%] tracking-[0.2px] text-black backdrop-blur-[10px] transition-all'
    ]"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      @click="() => onTabChange(returnObject ? tab : isObject(tab) ? getTabValue(tab) : tab)"
      :class="[
        'relative flex h-full items-center text-nowrap rounded-xl border-none px-[20px] capitalize',
        isTabSelected(tab) && (selectedTabClass || 'bg-[#010101] text-white'),
        tabClass
      ]"
    >
      <slot name="tab" :tab="tab" :isSelected="isTabSelected(tab)">
        {{ getTabLabel(tab) }}
      </slot>
    </button>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    T = any,
    R extends boolean = true,
    LK extends string = 'label',
    VK extends string = 'value'
  "
>
import type { Ref } from 'vue'
import type { Classish } from '~/types/utils'

/** Element type of tabs (object stays object; primitives narrowed to string|number) */
type TabType = T extends object ? T : string | number

/** Value type extracted from a tab when returnObject=false */
type ValueOfTab<XT> = XT extends object ? (VK extends keyof XT ? XT[VK] : never) : XT

/** Props (discriminated by returnObject) */
interface BaseProps {
  tabs: TabType[]
  tabClass?: Classish
  selectedTabClass?: Classish
  labelKey?: LK
  valueKey?: VK
}
type PropsRTrue = BaseProps & { returnObject: true; modelValue: TabType | null }
type PropsRFalse = BaseProps & { returnObject?: false; modelValue: ValueOfTab<TabType> }
type Props = PropsRTrue | PropsRFalse

const props = withDefaults(defineProps<Props>(), {
  returnObject: true as const,
  labelKey: () => 'label' as LK,
  valueKey: () => 'value' as VK
})
// runtime default without touching the union typing
/** Strongly-typed slot */
defineSlots<{
  tab(p: { tab: TabType; isSelected: boolean }): any
}>()

const emits = defineEmits<
  | { (e: 'update:modelValue', value: TabType | null): void } // returnObject === true
  | { (e: 'update:modelValue', value: ValueOfTab<TabType>): void } // returnObject === false
>()

/** Utils */
const isObject = (d: unknown): d is Record<string, unknown> =>
  typeof d === 'object' && d !== null && Object.keys(d).length > 0

const getTabValue = (tab: TabType): any =>
  isObject(tab) ? (tab as any)[props.valueKey as string] : tab

const getTabLabel = (tab: TabType): string => {
  if (isObject(tab)) {
    const byLabel = (tab as any)[props.labelKey as string]
    if (byLabel != null) return String(byLabel)
    const byValue = (tab as any)[props.valueKey as string]
    if (byValue != null) return String(byValue)
    return ''
  }
  return String(tab)
}

const containerRef: Ref<HTMLDivElement | null> = ref(null)
const containerWidth = ref(0)

const onTabChange = (val: any) => {
  emits('update:modelValue', val)
}

const isTabSelected = (tab: TabType): boolean => {
  if (props.returnObject) {
    return getTabValue(tab) === getTabValue(props.modelValue as TabType)
  } else {
    return getTabValue(tab) === props.modelValue
  }
}
let resizeObserver: ResizeObserver | undefined
const updateWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

onMounted(() => {
  updateWidth()
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateWidth)
    if (containerRef.value) resizeObserver.observe(containerRef.value)
  }
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

defineExpose<TabsExpose>({ containerWidth })
</script>
<script lang="ts">
export type TabsExpose = {
  containerWidth: Ref<number>
}
</script>
