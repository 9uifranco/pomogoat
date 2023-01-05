<script setup>

    const props = defineProps({
        showTimer: Boolean,
        showStartButton: Boolean,
        currentActivity: String,
        workDuration: [Number, String],
        workDurationPrettyTime: [Number, String],
        timer: [Number, String],
        timerPrettyTime: [Number, String],
        calculateProgress: [Number, String],
        goatEmojis: String,
        sprints: [Number, String],
        breakCounter: [Number, String]
    })

</script>

<template>
  <div v-if="showTimer" class="flex flex-col justify-between items-center container h-96 gap-5 mt-10 pt-20 py-10">
        <h1 class="text-7xl">{{showStartButton ? workDurationPrettyTime : (currentActivity == "Waiting for start") ? timer : timerPrettyTime}}</h1>
        <h3 class="text-xl">{{
            (currentActivity == "work") ? "Do your task!" :
            (currentActivity == "short break") ? "Take a short break!" :
            (currentActivity == "long break") ? "Take a long break!":
            "Are you ready?"}}
        </h3>
        <div class="mr-7 w-72 h-10">
            <div :style="[(calculateProgress < 0) ? { left: '0%' } : { left: calculateProgress + '%' }]" class=" goat-position w-fit relative text-xl ">
                🐐
            </div>
            <div class="relative h-10 w-full">
                <div class="relative border-gray-300 border-b-4 mt-1 top-2.5"></div>
                <div :style="{ width: (calculateProgress + 5) + '%' }" class="relative border-black border-b-4 top-1.5"></div>
                <span :style="{ backgroundColor: 'black' }" class="absolute bg-gray-300 dot top-0 bottom-10"></span>
                <span v-for="sprint in parseFloat(sprints)" :key="sprint" :style="[(sprint <= parseFloat(breakCounter)) ? { left: ((sprint/parseFloat(sprints))*100) + '%', backgroundColor: 'black'} : { left: ((sprint/parseFloat(sprints))*100) + '%'}]" class="absolute bg-gray-300 dot top-0 bottom-10"></span>
            </div>
        </div>
        <div class="flex">
            <p>{{goatEmojis}}</p>
        </div>
      <button class="bg-white rounded-full w-24 h-16 font-semibold text-lg shadow-md text-red-700 transition ease-in-out hover:bg-red-500 hover:text-white hover:border-2 hover:border-white" v-if="showStartButton" @click="$emit('start-timer')">Let's go!</button>
    </div>
</template>

<style scoped>
.goat-position {
    transform:scale(-1, 1);
}

.dot {
  	height: 25px;
    width: 25px;
    border-radius: 50%;
}
</style>