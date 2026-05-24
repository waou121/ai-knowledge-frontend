<template>
  <section class="view-grid">
    <div class="chat-panel">
      <div ref="messagesRef" class="messages">
        <article v-for="(message, index) in store.currentConversation.messages" :key="index" class="message" :class="message.role">
          <div class="bubble">{{ message.content }}</div>
          <div class="message-meta">{{ message.role === "user" ? "我" : "AI 助手" }}</div>
        </article>
      </div>
      <el-form class="composer" @submit.prevent>
        <el-input
          v-model="question"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="输入关于文档、实验流程或数据分析的问题"
          @keydown.ctrl.enter.prevent="submit"
        />
        <el-button type="primary" class="send-btn" :loading="store.isStreaming" @click="submit">
          {{ store.isStreaming ? "生成中" : "发送" }}
        </el-button>
      </el-form>
    </div>

    <aside class="reference-panel">
      <div class="panel-head">
        <h3>引用来源</h3>
        <el-button size="small" :disabled="store.isStreaming" @click="store.regenerateAnswer">重新生成</el-button>
      </div>
      <div class="reference-list">
        <el-card v-for="item in store.references" :key="item.title" class="reference-card" shadow="never">
          <button type="button">{{ item.title }}</button>
          <p>{{ item.source }}</p>
          <p><el-tag>{{ item.tag }}</el-tag></p>
        </el-card>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useKnowledgeStore } from "../stores/knowledge";

const store = useKnowledgeStore();
const question = ref("");
const messagesRef = ref<HTMLElement | null>(null);

function submit() {
  const value = question.value.trim();
  if (!value) {
    ElMessage.warning("请输入问题");
    return;
  }
  void store.submitQuestion(value);
  question.value = "";
}

watch(
  () => store.currentConversation.messages.map((message) => message.content).join("|"),
  async () => {
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  },
);
</script>
