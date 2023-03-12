<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span class="inline-flex justify-center items-center w-6 h-6 mr-2">
          <BaseIcon :path="mdiHomeSilo" />
        </span>
        <h1 class="text-2xl leading-tight">Assets</h1>
      </div>
    </section>
    <div class="rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex">
      <div class="flex-1">
        <table>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Plot coordinate</th>
              <th>State</th>
              <th>City</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-b-0 lg:w-6 before:hidden"></td>
              <td data-label="Name">Hello</td>
              <td data-label="Company">Hi</td>
              <td data-label="City">city</td>
              <td data-label="Progress" class="lg:w-32"></td>
              <td data-label="Created" class="lg:w-1 whitespace-nowrap">
                <small class="text-gray-500 dark:text-slate-400" :title="'klk'"
                  >hjhj</small
                >
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSilo } from "@mdi/js";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
  },

  setup() {
    return { mdiHomeSilo };
  },
});
</script>
