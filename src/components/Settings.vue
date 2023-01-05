<script setup>
    const props = defineProps({
        workCounter: [Number, String],
        breakCounter: [Number, String],
        cycleCounter: [Number, String],
        workDurationPrettyTime: [Number, String],
        shortBreakDurationPrettyTime: [Number, String],
        longBreakDurationPrettyTime: [Number, String],
        sprints: [Number, String]
    })

    const emit = defineEmits([
        'decrease-counter',
        'increase-counter',
        'toggle-pause',
        'reset-timer',
        'reset-progress'
    ])

</script>

<template>
    <form class="flex flex-col items-center shadow-lg z-10">
        <h1 class="font-bold pt-3 text-3xl">Settings</h1>
         
        <div class="flex flex-col py-3 mt-3 w-full items-center px-10">
            <button class="w-full transition ease-in-out hover:bg-red-500 hover:text-white hover:border-2 hover:border-white bg-white rounded-full h-16 font-semibold text-md shadow-md text-red-700" @click.prevent="emit('toggle-pause')">Pause/Run Timer</button>
            <div class="flex justify-between w-full py-3">
                <button class="transition ease-in-out hover:bg-red-500 hover:text-white hover:border-2 hover:border-white bg-white rounded-full px-2 h-12 font-semibold text-md shadow-md text-red-700" @click.prevent="emit('reset-timer')">Reset Timer</button>
                <button class="transition ease-in-out hover:bg-red-500 hover:text-white hover:border-2 hover:border-white bg-white rounded-full px-2 h-12 font-semibold text-md shadow-md text-red-700" @click.prevent="emit('reset-progress')">Reset Progress</button>
            </div>
            
        </div>

        <div class="py-3">
            <p>You did {{breakCounter}} work sprints in this cycle</p>
            <p>You have {{(sprints - breakCounter - 1)}} short breaks left in this cycle</p>
            <p>You have completed {{cycleCounter}} full cycles</p>
        </div>
        
        <div class="py-3">
            <div class="flex justify-between w-64">
                <label>Work Sprint Duration: </label>
                <div class="flex w-24 justify-between">
                    <button @click.prevent="emit('decrease-counter', 'workDuration')" class="settings-btn">-</button>
                    {{workDurationPrettyTime}}
                    <button @click.prevent="emit('increase-counter', 'workDuration')" class="settings-btn">+</button>
                </div>
            </div>

            <div class="flex justify-between w-64">
                <label>Short Break Duration: </label>
                <div class="flex w-24 justify-between">
                    <button @click.prevent="emit('decrease-counter', 'shortBreakDuration')" class="settings-btn">-</button>
                    {{shortBreakDurationPrettyTime}}
                    <button @click.prevent="emit('increase-counter', 'shortBreakDuration')" class="settings-btn">+</button>
                </div>
            </div>

            <div class="flex justify-between w-64">
                <label>Long Break Duration: </label>
                <div class="flex w-24 justify-between">
                    <button @click.prevent="emit('decrease-counter', 'longBreakDuration')" class="settings-btn">-</button>
                    {{longBreakDurationPrettyTime}}
                    <button @click.prevent="emit('increase-counter', 'longBreakDuration')" class="settings-btn">+</button>
                </div>
            </div>

            <div class="flex justify-between w-64">
                <label>Work sprints per cycle: </label>
                <div class="flex items-center w-24 justify-between">
                    <button @click.prevent="emit('decrease-counter', 'sprints')" class="settings-btn">-</button>
                    {{sprints}}
                    <button @click.prevent="emit('increase-counter', 'sprints')" class="settings-btn">+</button>
                </div>
            </div>
            
        </div>
        
        <div class="flex flex-col items-center text-sm px-3 py-3 ">
            <p>Changes will be applied on next sprint.</p>
            <p>For instant apply, please reset the timer manually.</p>
        </div>
        
    </form>
</template>

<style lang="postcss" scoped>

    .settings-btn {
        @apply flex items-center justify-center w-5 h-5 rounded-full bg-white text-xl hover:font-bold
    }
</style>