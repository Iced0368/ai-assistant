<script setup lang="ts">

import { ref } from 'vue';
import { ChatSession } from './models';
import { ChatView, SessionNavigator } from './components';
import ToolBar from './components/sidebar/ToolBar.vue';

const nullSession = new ChatSession("새 대화");

const sessions = ref<ChatSession[]>([nullSession]);
const selectedSession = ref<ChatSession>(nullSession);

const createSession = () => {
  const newSession = new ChatSession("새 대화");
  sessions.value.push(newSession);
  selectedSession.value = newSession;
}

const selectSession = (sessionId: string) => {
  console.log(sessionId)
  selectedSession.value = sessions.value.find(session => session.id === sessionId)!;
}

</script>

<template>
  <div class="app-container">
    <header>
      header
    </header>

    <aside id="aside-left">
      <ToolBar
        @createSession="createSession"
      >
      </ToolBar>
      <SessionNavigator 
        :sessions="sessions"
        :selectedSession="selectedSession"
        @selectSession="selectSession"
      >
      </SessionNavigator>
    </aside>

    <main>
      <ChatView 
        :session="selectedSession"
      >
      </ChatView>
    </main>

    <footer>
      footer
    </footer>
  </div>

</template>

<style scoped>

.app-container {
  display: grid;
  grid-template-rows: 50px auto 50px;
  grid-template-columns: 250px auto;

  width: 100%;
  height: 100%;
  border: 1px solid red;
}

header {
  grid-row: 1 / 2;
  grid-column: 2 / 3;

  border: 1px solid blue;
}

aside#aside-left {
  grid-row: 1 / 4;
  grid-column: 1 / 2;

  border: 1px solid green;
}

main {
  display: flex;
  justify-content: center;
  grid-row: 2 / 3;
  grid-column: 2 / 3;

  border: 1px solid green;
  overflow-x: hidden;
}

footer {
  grid-row: 3 / 4;
  grid-column: 2 / 3;

  border: 1px solid blue;
}

</style>
