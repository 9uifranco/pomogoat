<script setup>
    defineProps({
        popupActive: {
            type: Boolean,
            default: false
        },
        popupType: {
            type: String
        }
    })

    const emit = defineEmits(['close-popup', 'confirm'])

    function selectConfirm() {
        emit('close-popup')
        emit('confirm', true)
    }

    function selectDecline() {
        emit('close-popup')
        emit('confirm', false)
    }

</script>

<template>
    <Teleport to="body">
        <div v-show="popupActive" class="font-Jost fixed w-full bg-black bg-opacity-30 h-full top-0 left-0 flex justify-center px-8 z-20">
            <div v-if="popupActive" class="p-4 bg-white self-center max-w-screen-md md:w-fit w-screen text-center flex flex-col justify-between rounded gap-3">
                <slot />
                <div v-if="popupType == 'confirm'">
                    <button @click="selectConfirm" class="popup-btn">Yes</button>
                    <button @click="selectDecline" class="popup-btn">No</button>
                </div>
                <div v-if="popupType == 'alert'">
                    <button @click="emit('close-popup')" class="popup-btn">Ok</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="postcss" scoped>
    .popup-btn {
        @apply bg-pomogoat-primary text-white py-2 w-20 mx-1 rounded self-center hover:bg-red-600 transition
    }

</style>