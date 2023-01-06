<script setup>
import Toggle from './components/Toggle.vue'

const props = defineProps({
    toggleValue: Boolean,
    newTask: [Object, String],
    showNewTasks: Boolean,
    tasks: Array,
    showCompletedTasks: Boolean,
    completedTasks: Array
})

const emit = defineEmits(['onDrop', 'startDrag', 'endDrag', 'dragOver', 'removeTask'])

const onDrop = () => {
    emit('onDrop')
}

const startDrag = () => {
    emit('startDrag')
}

const endDrag = () => {
    emit('endDrag')
}

const dragOver = () => {
    emit('dragOver')
}

const removeTask = () => {
    emit('removeTask')
}

</script>


<template>
    <div class="mb-auto flex flex-col items-center self-center md:w-1/2 w-11/12 py-3 pb-6 border rounded-lg shadow-lg bg-white mx-3">

        <form class="flex flex-col justify-center items-center py-3 mb-3 px-3 w-full">
            <div>
                <label class="text-xl">New task:</label>
                <input class="mx-2 border-gray-300 rounded-full border px-2" type="text" v-model="newTask">
                <input class="bg-red-600 w-10 rounded-full text-white h-10 shadow-md cursor-pointer transition ease-in-out hover:bg-white hover:text-red-600 hover:border-2 hover:border-red-600 hover:font-semibold" @click.prevent="saveTask" type="submit" value="Add">
            </div>
        </form>

        <Toggle class="mb-3" :toggleValue="toggleValue" @toggle="toggleTaskList"/>

        <div v-if="showNewTasks" class="w-full px-3" @drop="onDrop($event)" @dragenter.prevent>
            <div 
            v-for="task in tasks" :key="task.id" 
            class="h-10 flex justify-between items-center p-3 mx-3 first:mx-0 first:border-black first:border-2 first:h-20 first:font-bold border-t-0 border border-black bg-white" 
            :class="[tasks.indexOf(task) == 0 ? 'nextTask' : '', 'task']"
            draggable="true" 
            @click="task.showEditInput = true" 
            @dragstart="startDrag($event, task.id, tasks.indexOf(task))"
            @dragend="endDrag()"
            @dragover="dragOver($event, tasks.indexOf(task))">
            <div class="flex gap-x-3">
                <input v-model="task.done" type="checkbox">
                <p v-if="!task.showEditInput">{{task.content}}</p>
                <input
                ref="editField"
                v-on:focusout="task.showEditInput = false"
                v-on:keyup.enter="exitFocus"
                v-if="task.showEditInput"
                v-model="task.content"
                type="text"
                >
            </div>
            <img @click.prevent="removeTask(task)" class="w-6 cursor-pointer" src="./assets/delete-icon.png" alt="delete-icon">
            </div>
        </div>

        <div v-if="showCompletedTasks" class="w-screen px-3 md:w-full" @drop="onDrop($event)" @dragenter.prevent>
            <div
                v-for="task in completedTasks" :key="task.id"
                class="h-10 flex justify-between items-center p-3 mx-3 border-t-0 border border-black bg-white first:border"
                draggable="true" 
                @click="task.showEditInput = true"
                @dragstart="startDrag($event, task.id)" >
                <div class="flex gap-x-3">
                    <input v-model="task.done" type="checkbox">
                    <p v-if="!task.showEditInput">{{task.content}}</p>
                    <input
                    ref="editField"
                    v-on:focusout="task.showEditInput = false"
                    v-on:keyup.enter="exitFocus"
                    v-if="task.showEditInput"
                    v-model="task.content"
                    type="text" >
                </div>
                <img @click.prevent="removeTask(task)" class="w-6 cursor-pointer" src="./assets/delete-icon.png" alt="delete-icon">
            </div>
        </div>
    </div>
  
</template>

<style>

</style>