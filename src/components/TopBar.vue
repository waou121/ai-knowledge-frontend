<template>
  <header class="topbar">
    <div>
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>
    <div class="topbar-actions">
      <el-select v-model="store.activeLibraryId" aria-label="选择知识库" class="library-select">
        <el-option v-for="library in store.libraries" :key="library.id" :label="library.name" :value="library.id" />
      </el-select>
      <el-button @click="logout">退出</el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useKnowledgeStore } from "../stores/knowledge";

const route = useRoute();
const router = useRouter();
const store = useKnowledgeStore();

const title = computed(() => {
  if (route.path === "/library") return "知识库管理";
  if (route.path === "/dashboard") return "数据看板";
  return "智能问答";
});

const subtitle = computed(() => {
  if (route.path === "/library") {
    return `${store.currentLibrary.docs.length} 个文档 · ${store.chunkCount} 个片段`;
  }
  if (route.path === "/dashboard") return "问答、命中率与知识库使用情况";
  return `当前知识库：${store.currentLibrary.name}`;
});

async function logout() {
  store.logout();
  await router.push("/login");
}
</script>
