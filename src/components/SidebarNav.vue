<template>
  <aside class="sidebar">
    <div class="sidebar-head">
      <div class="brand-mark small">K</div>
      <div>
        <strong>Knowledge AI</strong>
        <span>Vue3 前端项目</span>
      </div>
    </div>

    <el-button type="primary" class="full" @click="newChat">新建会话</el-button>

    <nav class="view-tabs" aria-label="工作区导航">
      <RouterLink v-for="tab in tabs" :key="tab.path" class="tab-btn" :to="tab.path">
        {{ tab.label }}
      </RouterLink>
    </nav>

    <div class="sidebar-section">
      <div class="section-title">当前会话</div>
      <div class="conversation-list">
        <button
          v-for="conversation in store.conversations"
          :key="conversation.id"
          class="conversation-item"
          :class="{ 'is-active': conversation.id === store.activeConversationId }"
          @click="store.selectConversation(conversation.id)"
        >
          <strong>{{ conversation.title }}</strong>
          <span>{{ conversation.updatedAt }} · {{ libraryName(conversation.libraryId) }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useKnowledgeStore } from "../stores/knowledge";

const router = useRouter();
const store = useKnowledgeStore();

const tabs = [
  { path: "/chat", label: "问答" },
  { path: "/library", label: "知识库" },
  { path: "/dashboard", label: "看板" },
];

function libraryName(libraryId: string) {
  return store.libraries.find((library) => library.id === libraryId)?.name ?? "未知知识库";
}

async function newChat() {
  store.createConversation();
  await router.push("/chat");
}
</script>
