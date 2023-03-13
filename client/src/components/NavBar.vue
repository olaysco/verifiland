<script lang="ts" setup>
import BaseIcon from "@/components/BaseIcon.vue";
import { useUserStore } from "@/stores/user";
import { mdiLogout, mdiMenu } from "@mdi/js";
import { ref } from "vue";

const emit = defineEmits(["menu-toggled"]);

const menuToggled = (event: any) => {
  emit("menu-toggled", event);
};

const { logout } = useUserStore();
</script>
<template>
  <nav
    class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800 xl:pl-60"
  >
    <div class="flex lg:items-stretch xl:max-w-6xl xl:mx-auto">
      <div class="flex flex-1 items-stretch h-14">
        <div
          class="md:flex lg:hidden text-indigo-600 hover:text-black py-2 px-3 items-center cursor-pointer dark:text-white dark:hover:text-slate-400"
        >
          <span
            class="inline-flex justify-center items-center w-6 h-6"
            @click.prevent="() => menuToggled"
          >
            <BaseIcon :path="mdiMenu" />
          </span>
        </div>
      </div>
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible absolute w-screen top-14 left-0 bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800 hidden"
      >
        <div
          class="block lg:flex items-center relative cursor-pointer text-indigo-600 dark:text-white dark:hover:text-slate-400 hover:text-black lg:py-2 lg:px-3"
        >
          <div
            class="flex items-center bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0"
          >
            <div class="w-6 h-6 mr-3 inline-flex">
              <img
                src="https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&amp;options[accessoriesChance]=93"
                alt="John Doe"
                class="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
              />
            </div>
            <span class="px-2 transition-colors">John Doe</span>
          </div>
        </div>
        <div
          class="block lg:flex items-center relative cursor-pointer text-indigo-600 dark:text-white dark:hover:text-slate-400 hover:text-black py-2 px-3 lg:w-16 lg:justify-center"
        >
          <a class="flex items-center" @click.prevent="logout">
            <span
              class="inline-flex justify-center items-center w-6 h-6 transition-colors"
            >
              <BaseIcon :path="mdiLogout" /> </span
            ><span class="px-2 transition-colors lg:hidden">Log out</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
