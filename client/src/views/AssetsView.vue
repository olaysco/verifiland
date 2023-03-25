<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiHomeSilo" />
        </span>
        <h1 class="text-2xl leading-tight">Assets</h1>
      </div>
    </section>
    <div class="rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex">
      <div class="flex-1">
        <table v-if="assets.length > 0" class="shadow">
          <thead>
            <tr>
              <th />
              <th>Land ID</th>
              <th>Plot coordinate</th>
              <th>State</th>
              <th>City</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(asset, i) in assets" :key="`${i}_asset`">
              <td class="border-b-0 lg:w-6 before:hidden"></td>
              <td data-label="land_id">{{ asset.land_id }}</td>
              <td data-label="Company">{{ asset.lat }} {{ asset.long }}</td>
              <td data-label="City">{{ asset.city }}</td>
              <td data-label="lga">{{ asset.lga }}</td>
              <td data-label="Created" class="lg:w-1 whitespace-nowrap">
                <small class="text-gray-500 dark:text-slate-400">{{
                  new Date(asset.created_at).toDateString()
                }}</small>
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <a href="#" @click.prevent="showModal(i)"
                  ><BaseIcon :path="mdiDotsVertical"
                /></a>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="flex flex-col justify-center items-center h-screen">
            <BaseIcon :path="mdiHomeSilo" class="text-gray-300" />
            <h2 class="mt-2 mb-4 text-lg font-medium text-gray-900">No assets</h2>
            <p class="text-sm text-gray-500 mb-6">
              You currently do not have any registered assets.
            </p>
            <BaseButton
              as="router-link"
              label="Register Asset"
              class="btn-primary"
              :to="'/add-assets'"
            />
          </div>
        </div>
      </div>
    </div>

    <Modal :size="'xl'" v-if="isShowModal" @close="closeModal">
      <template #header> </template>
      <template #body>
        <table>
          <tr v-if="modalAsset.files.deeds">
            <th>Supporting Document (Deeds)</th>
            <td>
              <a href="#" @click.prevent="openFile(modalAsset.files.deeds)"
                >Click to Open <BaseIcon :path="mdiDownload" />
              </a>
            </td>
          </tr>
          <tr>
            <th>Approval Status</th>
            <td>
              <span
                :class="[
                  'p-2 rounded text-xs',
                  !modalAsset.is_govt_approved ? 'bg-yellow-300' : 'bg-green-600',
                ]"
                v-text="modalAsset.is_govt_approved ? 'Approved' : 'Pending Approval'"
              ></span>
            </td>
          </tr>
        </table>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <button
            @click="closeModal"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Close
          </button>
        </div>
      </template>
    </Modal>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSilo, mdiDotsVertical, mdiDownload } from "@mdi/js";
import { defineComponent, ref } from "vue";
import { useWeb3Store } from "@/stores/web3";
import { storeToRefs } from "pinia";
import BaseButton from "@/components/BaseButton.vue";
import { Modal } from "flowbite-vue";
export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
    BaseButton,
    Modal,
  },

  setup() {
    const { assets } = storeToRefs(useWeb3Store());
    const modalAsset = ref<{ [index: string]: any }>({});
    const isShowModal = ref(false);

    function closeModal() {
      isShowModal.value = false;
    }
    function showModal(index: number) {
      //@ts-ignore
      modalAsset.value = assets.value[index];
      isShowModal.value = true;
    }

    async function openFile(file: any) {
      const base64 = await fetch(file.data);
      window.open(`data:application/octet-stream;${file.data}`);
      console.log(base64);
    }
    return {
      mdiHomeSilo,
      assets,
      mdiDotsVertical,
      isShowModal,
      closeModal,
      showModal,
      modalAsset,
      mdiDownload,
      openFile,
    };
  },
  async mounted() {
    await useWeb3Store().getOwnedLands();
  },
});
</script>
