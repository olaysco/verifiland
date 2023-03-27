<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiHomeSwitch" />
        </span>
        <h1 class="text-2xl leading-tight">Transferred Assets List</h1>
      </div>
    </section>
    <div class="shadow rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex">
      <div class="flex-1">
        <div v-if="transferredLands.length > 0">
          <table class="table shadow">
            <thead>
              <tr class="text-xs">
                <th>Land ID</th>
                <th>Transfer Address</th>
                <th>Owner Approval</th>
                <th>Registry Approval</th>
                <th>Logged Date</th>
                <th>Approved Date</th>
                <th v-if="canApprove()"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(asset, i) in transferredLands" :key="`${i}_asset_trans`">
                <td>{{ asset.land_id }}</td>
                <td>{{ asset.new_owner }}</td>
                <td>
                  <span
                    :class="[
                      'p-2 rounded text-xs text-white',
                      !asset.owner_approved ? 'bg-yellow-300' : 'bg-green-600',
                    ]"
                    v-text="asset.owner_approved ? 'Approved' : 'Pending Approval'"
                  ></span>
                </td>
                <td>
                  <span
                    :class="[
                      'p-2 rounded text-xs text-white',
                      !asset.govt_approved ? 'bg-yellow-300' : 'bg-green-600',
                    ]"
                    v-text="asset.govt_approved ? 'Approved' : 'Pending'"
                  ></span>
                </td>
                <td>
                  <small class="text-gray-500 dark:text-slate-400">{{
                    new Date(asset.created_at).toDateString()
                  }}</small>
                </td>
                <td>
                  <small
                    class="text-gray-500 dark:text-slate-400"
                    v-if="asset.approved_at && asset.approved_at.length > 0"
                    >{{ new Date(asset.approved_at).toDateString() }}</small
                  >
                </td>
                <td v-if="canApprove()">
                  <a href="#" @click.prevent="showModal(i)"
                    ><BaseIcon :path="mdiDotsVertical"
                  /></a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <div class="flex flex-col justify-center items-center h-screen">
            <BaseIcon :path="mdiHomeSwitch" class="text-gray-300" />
            <h2 class="mt-2 mb-4 text-lg font-medium text-gray-900">No assets</h2>
            <p class="text-sm text-gray-500 mb-6">No asset has been transferred.</p>
            <BaseButton
              as="router-link"
              label="Transfer Asset"
              class="btn-primary"
              :to="'/transfer-assets'"
            />
          </div>
        </div>
      </div>
    </div>
    <Modal :size="'5xl'" v-if="isShowModal" @close="closeModal">
      <template #header> </template>
      <template #body>
        <table>
          <tr>
            <th>From Address</th>
            <td class="text-right">{{ modalAsset.current_owner }}</td>
          </tr>
          <tr>
            <th>To Address</th>
            <td class="text-right">{{ modalAsset.new_owner }}</td>
          </tr>
          <tr>
            <th>Land Registry Approval Status</th>
            <td class="text-right">
              <span
                :class="[
                  'p-2 rounded text-xs text-white',
                  !modalAsset.govt_approved ? 'bg-yellow-300' : 'bg-green-600',
                ]"
                v-text="modalAsset.govt_approved ? 'Approved' : 'Pending Approval'"
              ></span>
            </td>
          </tr>
        </table>
      </template>
      <template #footer>
        <div class="flex" :class="canApprove() ? 'justify-between' : 'justify-end'">
          <button
            @click="closeModal"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Close
          </button>
          <button
            v-if="canApprove()"
            @click="approve"
            type="button"
            class="mr-2 text-indigo-600 border-2 hover:border-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Approve
          </button>
        </div>
      </template>
    </Modal>
  </DashboardContainer>
</template>

<script lang="ts">
import { Modal } from "flowbite-vue";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSwitch, mdiDotsVertical } from "@mdi/js";
import { defineComponent, ref } from "vue";
import { useWeb3Store } from "@/stores/web3";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  components: {
    DashboardContainer,
    BaseButton,
    BaseIcon,
    Modal,
  },

  setup() {
    const isShowModal = ref(false);
    const { isAdmin } = useUserStore();
    const modalAsset = ref<{ [index: string]: any }>({});
    const { transferredLands, landOwnerIds } = storeToRefs(useWeb3Store());
    const { approveTransferRequest } = useWeb3Store();

    function showModal(index: number) {
      //@ts-ignore
      modalAsset.value = transferredLands.value[index];
      isShowModal.value = true;
    }

    function closeModal() {
      isShowModal.value = false;
    }

    function canApprove(): boolean {
      return isAdmin() && !modalAsset.value.govt_approved;
    }

    async function approve() {
      if (!isAdmin()) {
        return;
      }

      await approveTransferRequest(
        modalAsset.value.land_id,
        modalAsset.value.current_owner
      );
      await useWeb3Store().getAllLands();
      await useWeb3Store().getAllTransferredLands();
      closeModal();
    }

    return {
      mdiHomeSwitch,
      transferredLands,
      isAdmin,
      canApprove,
      mdiDotsVertical,
      showModal,
      closeModal,
      approve,
      modalAsset,
      isShowModal,
    };
  },
  async mounted() {
    const getTransferrredLands = async () => {
      if (useUserStore().isAdmin()) {
        await useWeb3Store().getAllLands();
        return await useWeb3Store().getAllTransferredLands();
      }
      await useWeb3Store().getTransferredLands();
    };

    getTransferrredLands();
  },
});
</script>
