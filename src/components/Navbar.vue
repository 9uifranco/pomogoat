<script setup>

const props = defineProps({
    showTimer: Boolean,
    isPaused: Boolean
})

const emit = defineEmits(['showHome', 'openSettings'])

const showHome = () => {
    emit('showHome')
}

const openSettings = () => {
    emit('openSettings')
}

</script>

<template>
    <div>
        <div v-if="!showTimer" class="absolute navbar">
            <img @click="$emit('open-help-popup')" class="w-8 cursor-pointer" src="../assets/help-icon.png" alt="help-icon">
            <img @click="openSettings" class="w-6 md:mx-5 cursor-pointer" src="../assets/settings-icon.png" alt="settings-icon">
        </div>

        <div v-else class="fixed navbar border-b border-black">
            <img @click="showHome" class="w-6 cursor-pointer" src="../assets/home-icon.png" alt="home-icon">
            <h1 class="text-3xl">🐐 Pomogoat</h1>
            <img v-if="!isPaused" @click="$emit('toggle-pause')" class="w-6 md:mx-5 cursor-pointer" src="../assets/pause-icon.png" alt="pause-icon">
            <img v-else @click="$emit('toggle-pause')" class="w-6 md:mx-5 cursor-pointer" src="../assets/play-icon.png" alt="play-icon">
        </div>

    </div>
</template>

<style lang="postcss" scoped>

    .navbar {
        @apply h-16 w-screen bg-pomogoat-primary flex justify-between items-center p-3
    }

</style>