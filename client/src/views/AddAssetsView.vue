<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black mr-3"
        >
          <BaseIcon :path="mdiHomeGroupPlus" />
        </span>
        <h1 class="text-2xl leading-tight">Register a New Asset</h1>
      </div>
    </section>
    <div class="rounded-2xl flex-col bg-white flex shadow">
      <div class="flex-1 p-6">
        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">Location</label>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label class="block font-bold mb-2">Latitude</label>
              <div class="relative">
                <input
                  v-model="data.lat"
                  type="text"
                  placeholder="Latitude"
                  class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800 pl-10"
                /><span
                  class="inline-flex justify-center items-center w-10 h-12 absolute top-0 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
                  ><BaseIcon :path="mdiMapMarker" />
                </span>
              </div>
            </div>
            <div>
              <label class="block font-bold mb-2">Longitude</label>
              <div class="relative">
                <input
                  v-model="data.long"
                  type="text"
                  placeholder="Longitude"
                  class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800 pl-10"
                /><span
                  class="inline-flex justify-center items-center w-10 h-12 absolute top-0 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
                  ><BaseIcon :path="mdiMapMarker" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="mb-6 last:mb-0 relative">
            <label class="block font-bold mb-2">City</label>
            <div class="relative">
              <input
                v-model="data.city"
                placeholder="City"
                type="text"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400 mt-1"></div>
          </div>
          <div class="mb-6 last:mb-0 relative">
            <label class="block font-bold mb-2">LGA</label>
            <div class="relative">
              <input
                v-model="data.lga"
                placeholder="Local Government Area"
                type="text"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400 mt-1"></div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="mb-6 last:mb-0 relative">
            <label class="block font-bold mb-2">Length (feet)</label>
            <div class="relative">
              <input
                v-model="data.lth"
                placeholder="Length"
                type="number"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400 mt-1"></div>
          </div>
          <div class="mb-6 last:mb-0 relative">
            <label class="block font-bold mb-2">Breadth (feet)</label>
            <div class="">
              <div class="relative">
                <input
                  v-model="data.breadth"
                  placeholder="breadth"
                  type="number"
                  class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
                />
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400 mt-1"></div>
          </div>
        </div>

        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">Surveyor no.</label>
          <div class="">
            <div class="relative">
              <input
                v-model="data.surveyor_no"
                placeholder="Surveyor Identification no."
                type="tel"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
        <hr />

        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">Ownership Type</label>
          <div class="">
            <div class="relative">
              <select
                v-model="data.ownership_type"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              >
                <option value="family">Family</option>
                <option value="private">Private</option>
                <option value="family">Individual</option>
              </select>
            </div>
          </div>
        </div>
        <hr class="my-6 -mx-6 dark:border-slate-800 border-t border-gray-100" />

        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">Supporting Documents</label>
          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-stretch justify-start relative">
              <label class="inline-flex">
                <BaseButton
                  as="a"
                  :class="'btn-primary'"
                  :icon-size="24"
                  :label="'Surveyor Deeds'"
                  :icon="mdiUpload"
                />
                <input
                  @input="(event) => handleUpload(event, 'deeds')"
                  type="file"
                  accept="image/*, .pdf"
                  class="absolute top-0 left-0 w-full h-full opacity-0 outline-none cursor-pointer -z-1"
                />
              </label>
              <div
                class="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-gray-200 border rounded-r"
                v-if="files.deeds"
              >
                <span class="text-ellipsis line-clamp-1">
                  {{ files.deeds.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6 last:mb-0 flex justify-end">
          <BaseButton
            as="button"
            label="Submit For Approval"
            class="btn-primary"
            @click="submitAsset"
          />
        </div>
      </div>
    </div>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeGroupPlus, mdiMapMarker, mdiUpload } from "@mdi/js";
import { defineComponent, ref } from "vue";
import { useWeb3Store } from "@/stores/web3";
import { useUIStore } from "@/stores/ui";
import router from "@/router";

type UploadedFiles = {
  [index: string]: {
    data: string | ArrayBuffer | null;
    name: string;
  };
};

type AssetData = {
  [index: string]: string | number | UploadedFiles;
};

export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
    BaseButton,
  },

  setup() {
    const data = ref<AssetData>({});
    const files = ref<UploadedFiles>({});
    const { registerLand } = useWeb3Store();
    const { showAlert } = useUIStore();

    const handleUpload = (event: Event, fileName: string) => {
      const value =
        (event.target as HTMLInputElement).files ||
        (event as InputEvent).dataTransfer?.files;
      if (value) {
        const reader = new FileReader();
        reader.readAsDataURL(value[0]);
        reader.onloadend = () => {
          files.value[fileName] = { data: reader.result, name: fileName };
        };
      }
    };

    const submitAsset = async () => {
      data.value.files = Object.assign({}, files.value);
      try {
        if (formIsValid()) {
          await registerLand(Object.assign({}, data.value));
        }
      } catch (error) {
        showAlert({ type: "danger", message: "Error registering new asset" });
      }
    };

    const formIsValid = (): boolean => {
      let valid = true;
      if (!data.value.breadth || data.value.breadth.toString().length < 1) {
        valid = false;
      }

      if (!data.value.city || data.value.city.toString().length < 1) {
        valid = false;
      }

      if (!data.value.lat || data.value.lat.toString().length < 1) {
        valid = false;
      }

      if (!data.value.lth || data.value.lth.toString().length < 1) {
        valid = false;
      }

      if (!data.value.lga || data.value.lga.toString().length < 1) {
        valid = false;
      }

      if (!data.value.surveyor_no || data.value.surveyor_no.toString().length < 1) {
        valid = false;
      }

      if (!data.value.ownership_type || data.value.ownership_type.toString().length < 1) {
        valid = false;
      }

      return valid;
    };

    return {
      mdiHomeGroupPlus,
      mdiMapMarker,
      mdiUpload,
      data,
      files,
      handleUpload,
      submitAsset,
    };
  },
});
</script>
