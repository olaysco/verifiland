<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiHomeSwitch" />
        </span>
        <h1 class="text-2xl leading-tight">Transfer Assets</h1>
      </div>
    </section>
    <Alert type="warning" class="mb-2"
      >Please make sure to double-check all details before submitting as this action
      cannot be undone.</Alert
    >
    <div class="shadow rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex">
      <div class="flex-1 p-6">
        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">Land ID</label>
          <div class="">
            <div class="relative">
              <select
                v-model="data.land_id"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              >
                <option value="">-- Select Land --</option>
                <option
                  v-for="(asset, i) in assets"
                  :key="`${i}_asset`"
                  :value="asset.land_id"
                >
                  {{ asset.land_id }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">New Owner Address</label>
          <div class="">
            <div class="relative">
              <input
                placeholder="Addressof the new owner"
                type="text"
                v-model="data.new_owner"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Ensure the Address is correct public address of the person you want to
              transfer the land to.
            </div>
          </div>
        </div>
        <div class="mb-6 last:mb-0 flex justify-end">
          <BaseButton
            as="button"
            label="Submit For Approval"
            class="btn-primary"
            @click="submitTransferRequest"
          />
        </div>
      </div>
    </div>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSwitch } from "@mdi/js";
import { defineComponent, ref } from "vue";
import { useWeb3Store } from "@/stores/web3";
import type { TransferData } from "@/stores/web3";
import { storeToRefs } from "pinia";
import { Alert } from "flowbite-vue";

export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
    BaseButton,
    Alert,
  },

  setup() {
    const data = ref<TransferData>({ land_id: "", new_owner: "" });
    const { createTransferRequest } = useWeb3Store();
    const { assets, transferredLands } = storeToRefs(useWeb3Store());
    const submitTransferRequest = async () => {
      try {
        if (formIsValid()) {
          //call the createTransferRequest
          await createTransferRequest(data.value);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const formIsValid = () => {
      let error: { [index: string]: string } = {};
      if (data.value.land_id.length < 1) {
        error.land_id = "Invalid land ID";
      }
      if (data.value.new_owner.length < 1) {
        error.new_owner = "Invalid new owner address";
      }

      return Object.keys(error).length < 1;
    };

    return { mdiHomeSwitch, assets, data, submitTransferRequest, transferredLands };
  },
  async mounted() {
    await useWeb3Store().getOwnedLands();
    await useWeb3Store().getTransferredLands();
  },
});
</script>
