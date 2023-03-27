<script lang="ts" setup>
import {
  mdiHomeSwitchOutline,
  mdiClose,
  mdiHomeSilo,
  mdiHomeGroupPlus,
  mdiHomeAccount,
  mdiCog,
} from "@mdi/js";
import { computed } from "vue";
import BaseIcon from "@/components/BaseIcon.vue";
import { useUserStore } from "@/stores/user";
defineProps({
  isAsideMobileExpanded: Boolean,
  isAsideLgActive: Boolean,
});
const emit = defineEmits(["menu-click", "aside-mobile-close-click"]);

const { isAdmin } = useUserStore();

const asideMobileCloseClick = (event: any) => {
  emit("aside-mobile-close-click", event);
};
</script>

<template>
  <aside
    id="aside"
    class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden lg:flex"
    :class="[isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0']"
  >
    <div
      class="bg-white lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"
    >
      <div class="flex flex-row h-14 items-center justify-between dark:bg-slate-900">
        <div class="text-center flex-1 md:text-left md:pl-6 lg:text-center xl:pl-0">
          <router-link to="/"><b class="font-black">verifiland.</b></router-link>
        </div>
        <button
          class="hidden md:inline-block lg:hidden p-3"
          @click.prevent="asideMobileCloseClick"
        >
          <BaseIcon :path="mdiClose" />
        </button>
      </div>

      <div class="aside-scrollbars-light flex-1 overflow-y-auto overflow-x-hidden">
        <ul>
          <li>
            <router-link
              aria-current="page"
              to="/assets"
              v-slot="{ isExactActive }"
              class="flex cursor-pointer py-3 text-indigo-800 hover:text-black"
              ><span
                class="inline-flex justify-center items-center w-16 h-6 flex-none"
                :class="[isExactActive ? 'text-black' : '']"
              >
                <BaseIcon :path="mdiHomeSilo" size="24" /> </span
              ><span
                class="grow text-ellipsis line-clamp-1 pr-12"
                :class="[isExactActive ? 'text-black' : '']"
                >Assets</span
              ></router-link
            >
            <router-link
              v-if="!isAdmin()"
              aria-current="page"
              to="/add-assets"
              v-slot="{ isExactActive }"
              class="flex cursor-pointer py-3 text-indigo-800 hover:text-black"
              ><span
                class="inline-flex justify-center items-center w-16 h-6 flex-none"
                :class="[isExactActive ? 'text-black' : '']"
              >
                <BaseIcon :path="mdiHomeGroupPlus" size="24" /> </span
              ><span
                class="grow text-ellipsis line-clamp-1 pr-12"
                :class="[isExactActive ? 'text-black' : '']"
                >Add Assets</span
              ></router-link
            >
            <router-link
              aria-current="page"
              to="/transfer-list"
              v-slot="{ isExactActive }"
              class="flex cursor-pointer py-3 text-indigo-800 hover:text-black"
              ><span
                class="inline-flex justify-center items-center w-16 h-6 flex-none"
                :class="[isExactActive ? 'font-bold text-black' : '']"
              >
                <BaseIcon :path="mdiHomeAccount" size="24" /> </span
              ><span
                class="grow text-ellipsis line-clamp-1 pr-12"
                :class="[isExactActive ? 'font-bold text-black' : '']"
                >Transfers</span
              ></router-link
            >
            <router-link
              v-if="!isAdmin()"
              aria-current="page"
              to="/transfer-assets"
              v-slot="{ isExactActive }"
              class="flex cursor-pointer py-3 text-indigo-800 hover:text-black"
              ><span
                class="inline-flex justify-center items-center w-16 h-6 flex-none"
                :class="[isExactActive ? 'text-black' : '']"
              >
                <BaseIcon :path="mdiHomeSwitchOutline" size="24" /> </span
              ><span
                class="grow text-ellipsis line-clamp-1 pr-12"
                :class="[isExactActive ? 'text-black' : '']"
                >New Transfer</span
              ></router-link
            >
            <router-link
              v-if="isAdmin()"
              aria-current="page"
              to="/settings"
              v-slot="{ isExactActive }"
              class="flex cursor-pointer py-3 text-indigo-800 hover:text-black"
              ><span
                class="inline-flex justify-center items-center w-16 h-6 flex-none"
                :class="[isExactActive ? 'text-black' : '']"
              >
                <BaseIcon :path="mdiCog" size="24" /> </span
              ><span
                class="grow text-ellipsis line-clamp-1 pr-12"
                :class="[isExactActive ? 'text-black' : '']"
                >Settings</span
              ></router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>
