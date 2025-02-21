<script setup lang="ts">
import type { Message } from 'ollama';
import { marked } from "marked";

const props = defineProps<{
    message: Message,
}>();

</script>

<template>
    <div 
        :class="['message-container', message.role]"
    >
        <span 
            :class="['speech-bubble', message.role]"
            v-html="marked(props.message.content)"
        >
        </span>
    </div>
</template>

<style scoped>

.message-container {
    display: flex;
    padding: 10px;
}

p {
    border: 1px solid red;
}

.message-container:last-child {
    .speech-bubble {
        margin-bottom: 20px;
    }
}

.message-container.assistant {
    justify-content: flex-start;
}

.message-container.user {
    justify-content: flex-end;
}

.speech-bubble {
    position: relative;
    display: inline-block;
    word-wrap: break-word;
    text-align: left;

    border-radius: 10px;
    padding: 0 15px;

    p {
        background-color: red;
    }
}

.speech-bubble.assistant {
    background-color: lightgray;
}

.speech-bubble.assistant:after {
    content: '';
    position: absolute;
    left: -12px;
    bottom: 5px;

    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-bottom-color: lightgray;

    z-index: -1;
}


.speech-bubble.user {
    background-color: lightyellow;
    border: 1px solid lightgray;
}

.speech-bubble.user:before {
    content: '';
    position: absolute;
    right: -14px;
    bottom: 4px;

    width: 0;
    height: 0;
    border: 21px solid transparent;
    border-bottom-color: lightgray;

    z-index: -1;
}

.speech-bubble.user:after {
    content: '';
    position: absolute;
    right: -12px;
    bottom: 5px;

    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-bottom-color: lightyellow;
}

</style>
