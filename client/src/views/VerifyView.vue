<script lang="ts">
import { defineComponent, ref } from "vue";
import MainNav from "@/components/MainNav.vue";
import { mdiHomeSearchOutline } from "@mdi/js";
import BaseIcon from "@/components/BaseIcon.vue";
import { useVerifyLand } from "@/composables/useVerifyLand";
import { Modal } from "flowbite-vue";
import AssetDetail from "@/components/AssetDetail.vue";

export default defineComponent({
  components: {
    Modal,
    MainNav,
    BaseIcon,
    AssetDetail,
  },
  setup() {
    const showMenu = ref<boolean>(false);
    const { landId, verify, isShowVerifyModal, closeVerifyModal, land } = useVerifyLand();
    console.log(land);
    return {
      land,
      landId,
      verify,
      showMenu,
      closeVerifyModal,
      isShowVerifyModal,
      mdiHomeSearchOutline,
    };
  },
});
</script>
<template>
  <section class="w-full px-6 pb-12 antialiased bg-white">
    <div class="mx-auto max-w-7xl">
      <MainNav />
      <section class="px-2 py-32 bg-white md:px-0">
        <div class="container mx-auto text-center sm:px-4">
          <h1
            class="text-4xl font-extrabold leading-10 tracking-tight text-indigo-600 sm:text-5xl sm:leading-none md:text-6xl xl:text-7xl"
          >
            <span class="block">Verifiy the owner of a</span>
            <span class="relative inline-block mt-3 text-indigo-600">land asset</span>
          </h1>
          <div
            data-rounded="rounded-full"
            class="relative flex items-center max-w-md mx-auto mt-12 overflow-hidden text-center rounded-full border"
          >
            <input
              type="text"
              name="email"
              v-model="landId"
              placeholder="Land ID"
              class="w-full h-12 px-6 py-2 font-medium text-indigo-800 focus:outline-none rounded-l-full"
              data-primary="indigo-800"
            />
            <div class="relative top-0 right-0 block">
              <button
                @click="verify"
                type="button"
                class="inline-flex items-center w-32 h-12 flex justify-center text-base font-bold leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent hover:bg-indigo-700 focus:outline-none active:bg-indigo-700"
                data-primary="indigo-600"
              >
                <BaseIcon :path="mdiHomeSearchOutline" />
                <span class="ml-1">Search</span>
              </button>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-500" data-primary="indigo-600">
            Provide land unique ID for owner verification.
          </div>
        </div>
      </section>
    </div>
    <Modal :size="'3xl'" v-if="isShowVerifyModal" @close="closeVerifyModal">
      <template #header> </template>
      <template #body>
        <AssetDetail :asset="land" />
      </template>
      <template #footer> </template>
    </Modal>
  </section>
</template>
<style></style>
