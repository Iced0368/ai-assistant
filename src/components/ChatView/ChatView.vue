<script setup lang="ts">

import { ref } from 'vue'; 

import type { ChatSession } from '../../models';
import ChatMessage from './ChatMessage.vue';
import { useDataStore } from '../stores/useDataStore';

const props = defineProps<{
  session: ChatSession,
}>();

const inputValue = ref("");
const containerRef = ref<HTMLElement | null>(null);

const autoScroll = ref(false);

const dataStore = useDataStore();

const scrollToBottom = () => {
  containerRef.value?.scrollTo({ top: containerRef.value.scrollHeight, behavior: "smooth" });
};

const handleInput = (input: string) => {
  if (input) {
    autoScroll.value = true;
    dataStore.chatToSession(props.session, input, () => { autoScroll.value && scrollToBottom()})
      .then(() => autoScroll.value = false);
    inputValue.value = "";
  }
}

</script>

<template>
  <div 
    ref="containerRef" 
    class="chatview-container"
    @wheel="autoScroll=false"
  >
    <div class="messages-container">
      <ChatMessage 
        v-for="message in session?.messages" 
        :message="message"
        :key="`${session.id}_chat${message.id}`"
      />
    </div>
    <div class="chat-input-container">
      <input 
        type="text" 
        placeholder="마이크를 사용해 말하거나 직접 입력하세요."
        v-model="inputValue"
        @keydown.enter="handleInput(inputValue)"
      >
      <button @click="handleInput(inputValue)"></button>
    </div>
  </div>
</template>

<style scoped>

.chatview-container {
  width: 100%;
  border: 1px solid skyblue;
  overflow-y: scroll;
}

.messages-container {
  min-height: calc(100% - 70px);
  max-width: 800px;
  border: 1px solid purple;
  padding: 10px 30px;
  margin: 0 auto;
}

.chat-input-container {
  display: flex;
  position: sticky;
  height: 50px;
  left: 0;
  bottom: 10px;

  background-color: white;
  border: 1px solid lightgray;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin: 10px 10px;
  padding: 5px;

  column-gap: 5px;

  input {
    width: 100%;
    height: 100%;
    padding: 0 10px;

    font-size: 1rem;

    outline: none;
    border: none;
  }

  button {
    aspect-ratio: 1 / 1;
    background-color: gray;
    color: white;
  }

  button:hover {
    background-color: black;
  }
}

</style>
