<script setup lang="ts">

import { useDataStore } from '../stores/useDataStore';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { sessions, selectedSession } = storeToRefs(dataStore);

const emit = defineEmits();

</script>

<template>
    <nav class="nav-container">
        <ul>
            <li
                v-for="session in sessions"
                :class="[selectedSession.id === session.id ? 'selected' : '']"
                :key="`${session.sessionId}_nav`"
                @click="emit('selectSession', session.id)"
            >
                {{ session.name }}
            </li>
        </ul>
    </nav>
</template>

<style scoped>

.nav-container {
    li {
        display: flex;
        justify-content: center;
        align-items: center;

        height: 50px;
        border: 1px solid gray;
        cursor: pointer;

        background-color: white;
    }

    li:hover {
        background-color: lightgray;
    }

    li.selected {
        background-color: gray;
    }
}

</style>