<script setup>
    import { ref, onMounted } from 'vue'

    const buttonText = ref('Start')

    onMounted(() => {
        if(localStorage.getItem('Work Counter') > 0) {
            buttonText.value = 'Back to Work!'
        }
    })

    const emit = defineEmits(['show-timer'])

</script>

<template>
    <section class="container flex flex-col justify-center items-center h-96 mt-10 gap-14 ">
        <img @click="$emit('open-help-popup')" class="absolute w-8 top-0 right-0 m-3 cursor-pointer" src="../assets/help-icon.png" alt="">
        <h1 class="text-6xl">Pomogoat</h1>
        <h1 class="text-4xl">🐐</h1>
        <button class="transition ease-in-out hover:bg-red-500 hover:text-white hover:border-2 hover:border-white bg-white rounded-full h-20 font-semibold text-2xl shadow-md text-red-700"
                :class="{'w-20' : (buttonText == 'Start'),  'w-40' : (buttonText == 'Back to Work!')}"
                @click.prevent="emit('show-timer')">{{buttonText}}</button>
    </section>
</template>

