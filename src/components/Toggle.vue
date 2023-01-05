
<script setup>
    const props = defineProps({
        toggleValue: {
            type: Boolean,
            default: true
        }
    })

    const emit = defineEmits(['toggle'])

    const toggle = () => {
        console.log(props.toggleValue)
        emit('toggle')
    }

</script>

<template>
    <div @click="toggle" class="flex items-center gap-3 cursor-pointer ">
        <p class="w-24 text-center" :class="{'font-bold text-xl transition-all' : !toggleValue}">Next Tasks</p>
        <div class="flex items-center bg-red-500 rounded-full w-14 h-8 p-1 transition-colors"
            :class="{'bg-red-500' : toggleValue}"
        >
            <div class="h-6 w-6 rounded-full shadow-md transform bg-white transition-transform"
                :class="{'translate-x-6 ' : toggleValue}">
            </div>
        </div>
        <p class="w-24 text-center" :class="{'font-bold text-xl transition-all' : toggleValue}">Completed</p>
    </div>
</template>

<style>

</style>