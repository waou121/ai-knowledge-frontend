<template>
  <div class="app-shell">
    <RouterView v-if="route.meta.public" />
    <section v-else class="workspace">
      <SidebarNav />
      <main class="main-panel">
        <TopBar />
        <RouterView />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import SidebarNav from "./components/SidebarNav.vue";
import TopBar from "./components/TopBar.vue";
import { useKnowledgeStore } from "./stores/knowledge";

const store = useKnowledgeStore();
const route = useRoute();

onMounted(() => {
  if (store.loggedIn) {
    void store.loadLibraries();
  }
});
</script>
