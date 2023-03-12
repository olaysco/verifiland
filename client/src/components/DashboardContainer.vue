<script lang="ts">
import { defineComponent, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import AsideMenu from "@/components/AsideMenu.vue";
import FooterBar from "@/components/FooterBar.vue";

export default defineComponent({
  components: {
    NavBar,
    AsideMenu,
    FooterBar,
  },

  setup() {
    const isAsideMobileExpanded = ref(false);
    const isAsideLgActive = ref(false);

    return { isAsideMobileExpanded, isAsideLgActive };
  },
});
</script>

<template>
  <div>
    <div
      :class="['xl:pl-60', { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar @menu-toggled="() => (isAsideMobileExpanded = !isAsideMobileExpanded)">
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        @aside-mobile-close-click="() => (isAsideMobileExpanded = false)"
      />
      <section class="p-6 xl:max-w-6xl xl:mx-auto">
        <slot />
      </section>
      <FooterBar> Get more with </FooterBar>
    </div>
  </div>
</template>
