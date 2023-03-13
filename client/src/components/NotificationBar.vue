<script lang="ts" setup>
import type { PropType } from "vue";
import { ref, computed, useSlots } from "vue";
import { mdiClose } from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import type { Color } from "@/stores/types";
const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  outline: Boolean,
  color: {
    type: String as PropType<Color>,
    required: true,
  },
});
const componentClass = computed(() => {
  const colors = { danger: "bg-red-600 text-white" };

  return colors[props.color];
});
const isDismissed = ref(false);
const dismiss = () => {
  isDismissed.value = true;
};
const slots = useSlots();
const hasRightSlot = computed(() => slots.right);
</script>

<template>
  <div
    v-if="!isDismissed"
    :class="componentClass"
    class="px-3 py-6 md:py-3 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 w-full text-sm"
  >
    <div class="flex">
      <div class="flex flex-col md:flex-row items-center">
        <BaseIcon
          v-if="icon"
          :path="icon"
          w="w-10 md:w-5"
          h="h-10 md:h-5"
          size="24"
          class="md:mr-2"
        />
        <span class="text-center md:text-left md:py-2"><slot /></span>
      </div>
      <slot v-if="hasRightSlot" name="right" />
      <BaseButton
        v-else
        :icon="mdiClose"
        small
        rounded-full
        color="white"
        @click="dismiss"
      />
    </div>
  </div>
</template>
