<script setup lang="ts">

import { onMounted } from 'vue';
import { ChatView, SessionNavigator, ToolBar } from './components';
import { useDataStore } from './components/stores/useDataStore';

const dataStore = useDataStore();

onMounted(dataStore.loadSessions);

</script>

<template>
  <div class="app-container">
    <header>
      header
    </header>

    <aside id="aside-left">
      <ToolBar
        @createSession="dataStore.createSession"
      >
      </ToolBar>
      <SessionNavigator 
        :sessions="dataStore.sessions"
        :selectedSession="dataStore.selectedSession"
        @selectSession="dataStore.selectSession"
      >
      </SessionNavigator>
    </aside>

    <main>
      <ChatView 
        :session="dataStore.selectedSession!"
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
