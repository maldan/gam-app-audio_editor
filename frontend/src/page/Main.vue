<template>
  <div :class="$style.main">
    <div
      :class="$style.project"
      @click="router.push('/project/' + x.name)"
      v-for="x in mainStore.projectList"
      :key="x.name"
    >
      {{ x.name }}
    </div>
    <button @click="createProject">Add</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTrackStore } from '@/store/track';
import { useMainStore } from '@/store/main';
import router from '@/router';

// Stores
const trackStore = useTrackStore();
const mainStore = useMainStore();

// Vars

// Hooks
onMounted(async () => {
  await mainStore.getList();
});

// Methods
async function createProject() {
  const name = prompt('Name');
  if (!name) return;

  await mainStore.save(name, {});

  await router.push(`/project/${name}`);
}
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .project {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
