<script setup lang="ts">

const emit = defineEmits();

</script>

<template>
    <div class="toolbar-container">
        <button>사이드바 닫기</button>
        <button>내용 검색</button>
        <button @click="emit('createSession')">새 채팅</button>
    </div>
</template>

<style scoped>

.toolbar-container {
    display: flex;

    button {
        border: 1px solid black;
    }
}

</style>