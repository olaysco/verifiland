<template>
  <AuthContainer>
    <div class="w-full bg-white lg:w-6/12 xl:w-5/12">
      <div
        class="flex flex-col items-start justify-start w-full h-full p-10 lg:p-16 xl:p-24"
      >
        <NotificationBar :color="Color.danger" :icon="mdiAlertCircle" v-if="error">
          <template #right>
            <span> {{ error }}</span>
          </template>
        </NotificationBar>
        <h4 class="w-full text-3xl font-bold">Signin</h4>
        <p class="text-sm text-gray-500">
          or, if you don't have an account
          <router-link to="signup" class="text-blue-600 underline" data-primary="blue-600"
            >sign up</router-link
          >
        </p>
        <div class="relative w-full mt-10 space-y-8">
          <div class="relative">
            <label class="font-medium text-gray-900">Email</label>
            <input
              type="text"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              v-model="username"
              placeholder="Enter Your Email Address"
            />
          </div>
          <div class="relative">
            <label class="font-medium text-gray-900">Password</label>
            <input
              type="password"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              v-model="password"
              placeholder="Password"
            />
          </div>
          <div class="relative">
            <button
              @click="loginUser"
              class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-blue-700 ease"
              data-primary="blue-600"
              data-rounded="rounded-lg"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </AuthContainer>
</template>

<script lang="ts">
import AuthContainer from "@/components/AuthContainer.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { mdiAlertCircle } from "@mdi/js";
import { storeToRefs } from "pinia";
import { defineComponent, ref } from "vue";
import { Color } from "@/stores/types";
export default defineComponent({
  components: {
    AuthContainer,
    NotificationBar,
  },

  setup() {
    const error = ref<string>("");
    const username = ref<string>("");
    const password = ref<string>("");
    const { user, loading } = storeToRefs(useUserStore());

    const { login } = useUserStore();
    const loginUser = () => {
      if (username.value && password.value) {
        login(username.value, password.value)
          .then(() => {
            //redirect to dashboad
            //show success alert
            router.push("/assets");
          })
          .catch((err) => {
            error.value = err?.message;
          });
      }
    };

    return {
      Color,
      error,
      loginUser,
      username,
      password,
      mdiAlertCircle,
    };
  },

  login() {},
});
</script>
