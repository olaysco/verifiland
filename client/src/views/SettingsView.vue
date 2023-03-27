<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiHomeSilo" />
        </span>
        <h1 class="text-2xl leading-tight">Settings</h1>
      </div>
    </section>
    <div class="shadow rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex">
      <div class="flex-1">
        <tabs v-model="activeTab" class="p-5">
          <tab name="admin" title="Admin" v-if="registry">
            <div>
              <div class="mb-6 last:mb-0">
                <label class="block font-bold mb-2"
                  >Synchronize Admin access on contract</label
                >
                <div class="">
                  <div class="relative">
                    <input
                      placeholder="Your Address"
                      type="text"
                      v-model="data.address"
                      class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    The adress will be granted admin aaccess on the contract.
                  </div>
                </div>
              </div>
              <div class="mb-6 last:mb-0 flex justify-end">
                <BaseButton
                  as="button"
                  label="Sync Admin Access"
                  class="btn-primary"
                  @click="reqAdminAccess"
                />
              </div>
            </div>
          </tab>
          <tab name="profile" title="Profile"> Profile </tab>
        </tabs>
      </div>
    </div>
  </DashboardContainer>
</template>

<script lang="ts">
import { Tabs, Tab } from "flowbite-vue";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSilo, mdiDotsVertical } from "@mdi/js";
import { defineComponent, ref } from "vue";
import { useWeb3Store } from "@/stores/web3";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
export default defineComponent({
  components: {
    DashboardContainer,
    BaseButton,
    BaseIcon,
    Tabs,
    Tab,
  },

  setup() {
    const data = ref({ address: "" });
    const { assets, account } = storeToRefs(useWeb3Store());
    const { addAdmin } = useWeb3Store();
    const activeTab = ref("admin");
    const registry = ref(false);
    const { isAdmin } = useUserStore();
    registry.value = isAdmin();
    console.log(account);

    async function reqAdminAccess() {
      if (data.value.address.length > 0) {
        await addAdmin(data.value.address);
      }
    }

    return {
      mdiHomeSilo,
      assets,
      mdiDotsVertical,
      data,
      registry,
      activeTab,
      reqAdminAccess,
      account,
    };
  },
  async mounted() {
    await useWeb3Store().getWeb3();
    await useWeb3Store().getContract();
  },
});
</script>
