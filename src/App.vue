<script setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import Navbar from './components/Navbar.vue'
  import Home from './components/Home.vue'
  import Settings from './components/Settings.vue'
  import About from './components/About.vue'
  import Popup from './components/Popup.vue'
  import Timer from './components/Timer.vue'
  import Tasks from './components/Tasks.vue'

  // REFS

  // refs for options

  const workDuration = ref(1500)
  const workDurationPrettyTime = ref()
  const shortBreakDuration = ref(300)
  const shortBreakDurationPrettyTime = ref()
  const longBreakDuration = ref(900)
  const longBreakDurationPrettyTime = ref()
  const sprints = ref(4)

  const timerPrettyTime = ref()

  // ref for show a goat emoji for each completed cycle

  const goatEmojis = ref('')

  // refs for tasks

  const newTask = ref('')
  const tasks = ref([])
  const completedTasks = ref([])
  const deleteTask = ref(null)

  // refs for reorder task list

  const _el = ref(null)
  const _index = ref(null)
  const _index2 = ref(null)

  // refs for popups

  const popupType = ref(null)

  const popupAddTaskActive = ref(null)
  const popupTaskDoneActive = ref(null)
  const popupDeleteTaskActive = ref(null)
  const popupResetProgressActive = ref(null)
  const popupResetTimerActive = ref(null)
  const popupMoreTasksActive = ref(null)  
  const popupHelpActive = ref(null)

  // booleans ref to control what to show

  const showNewTasks = ref(true)
  const showCompletedTasks = ref(false)
  const showSettings = ref(false)
  const showTimer = ref(false)
  const toggleValue = ref(false)

  // ref for audio

  const audio = ref(null)
  audio.value = new Audio('https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3')
  audio.value.load()

  // REACTIVE (STATE)

  const state = reactive({
    timer: 3,
    currentActivity: "Waiting for start",
    workCounter: 0,
    breakCounter: 0,
    cycleCounter: 0,
    onBreak: true,
    isPaused: false,
    showStartButton: true
  })

  // method for show time in min:sec format

  const changeTimeFormat = (timer) => {
    let time = timer / 60
    let minutes = parseInt(time)

    let min = minutes.toString();
    
    let seconds = Math.round((time - minutes) * 60)

    let sec = seconds.toString();
    while (sec.length < 2) sec = "0" + sec;
    
    return min+":"+sec
  }

  workDurationPrettyTime.value = changeTimeFormat(workDuration.value)
  shortBreakDurationPrettyTime.value = changeTimeFormat(shortBreakDuration.value)
  longBreakDurationPrettyTime.value = changeTimeFormat(longBreakDuration.value)
  timerPrettyTime.value = changeTimeFormat(state.timer)

  // computed for calculate the value of progress bar

  const calculateProgress = computed(() => {
    if(state.currentActivity == 'work') {
      return ((((workDuration.value - state.timer)/workDuration.value)*((1/sprints.value)*100)) + (state.breakCounter/sprints.value)*100)
    } else
    return (state.breakCounter/sprints.value)*100
  })

  // audio reload function
  
  audio.value.onended = function() {
    audio.value.load() // ready to play again
  };

  // timer function

  const runTimer = () => {
    if(!state.onBreak){
      state.currentActivity = "work"
      state.workCounter++
    }
    let interval = setInterval(() => {
      if(!state.isPaused){
        state.timer--
        if(state.timer == 0) {
          audio.value.play()
          audio.value.onended
          if(state.onBreak) {
            state.onBreak = !state.onBreak // set to false
            state.currentActivity = "work"
            state.timer = workDuration.value
          }
          else {
            state.onBreak = !state.onBreak // set to true
            state.breakCounter++
            if(state.breakCounter == sprints.value) {
              state.breakCounter = 0
              state.currentActivity = "long break"
              state.cycleCounter++
              state.timer = longBreakDuration.value
            } else {
              state.currentActivity = "short break"
              state.timer = shortBreakDuration.value
            }
          }
          clearInterval(interval)
          runTimer()
        }
      }
    }, 1000)
  }

  // control timer

  const togglePause = () => {
    state.isPaused = !state.isPaused
  }

  const startTimer = () => {
    if(!tasks.value[0]){
      toggleAddTaskPopup()
      return
    }
    state.isPaused = false
    hideStartButton()
    runTimer()
  }

  const resetAll = () => {
    state.timer = 3
    state.currentActivity = "Waiting for start"
    state.workCounter = 0
    state.breakCounter = 0
    state.cycleCounter = 0
    state.onBreak = true
  }

  // When work sprint has finished, ask if user have completed the task

  watch(
    () => state.onBreak,
    (onBreak, isPaused) => {
      if(onBreak && showTimer.value) { // not in home page
        state.isPaused = true
        toggleTaskDonePopup()
      }
    }
  )

  watch(
    () => state.timer,
    (timer) => {
      if(workDuration.value < timer)
        state.timer = workDuration.value // kinda fix goat position when user is changing work duration
      timerPrettyTime.value = changeTimeFormat(timer)
    }
  )

  // Watch cycle counter and show a goat emoji for each completed cycle

  watch(
    () => state.cycleCounter,
    (cycleCounter) => {
      goatEmojis.value = ''
      for(let i=0; i < cycleCounter; i++) {
        goatEmojis.value = goatEmojis.value + '🐐'
      }
    }
  )

  // Watchers for managing local storage

  // For refs

  watch(workDuration, (newVal) => {
    localStorage.setItem('Work Duration', newVal)
    workDurationPrettyTime.value = changeTimeFormat(workDuration.value)
  })

  watch(shortBreakDuration, (newVal) => {
    localStorage.setItem('Short Break Duration', newVal)
    shortBreakDurationPrettyTime.value = changeTimeFormat(shortBreakDuration.value)
  })

  watch(longBreakDuration, (newVal) => {
    localStorage.setItem('Long Break Duration', newVal)
    longBreakDurationPrettyTime.value = changeTimeFormat(longBreakDuration.value)
  })

  watch(sprints, (newVal) => {
    localStorage.setItem('Sprints', newVal)
  })

  watch(toggleValue, () => {
    if(toggleValue.value) {
      openCompletedTasks()
    }
    else {
      openNewTasks()
    }
  })

  // For reactives (state)

  watch(
    () => state.cycleCounter,
    (cycleCounter) => {
      localStorage.setItem('Cycle Counter', cycleCounter)
  })

  watch(
    () => state.workCounter,
    (workCounter) => {
      localStorage.setItem('Work Counter', workCounter)
  })

  watch(
    () => state.breakCounter,
    (breakCounter) => {
      localStorage.setItem('Break Counter', breakCounter)
  })

  // On mounted gets everything from local storage

  onMounted(() => {
    workDuration.value = localStorage.getItem('Work Duration') || 1500
    shortBreakDuration.value = parseFloat(localStorage.getItem('Short Break Duration') || 300)
    longBreakDuration.value = localStorage.getItem('Long Break Duration') || 900
    sprints.value = localStorage.getItem('Sprints') || 4
    state.cycleCounter = localStorage.getItem('Cycle Counter') || '0'
    state.workCounter = localStorage.getItem('Work Counter') || '0'
    state.breakCounter = localStorage.getItem('Break Counter') || '0'
    tasks.value = JSON.parse(localStorage.getItem('tasks')) || []
    completedTasks.value = JSON.parse(localStorage.getItem('completed tasks')) || []
  })

  // CONTROLLING VIEW:

  // task list

  const toggleTaskList = () => {
    toggleValue.value = !toggleValue.value
  }

  const openNewTasks = () => {
    showCompletedTasks.value = false;
    showNewTasks.value = true;
  }

  const openCompletedTasks = () => {
    showNewTasks.value = false;
    showCompletedTasks.value = true;
  }

  const hideStartButton = () => {
    state.showStartButton = false
  }

  const openSettings = () => {
    showSettings.value = !showSettings.value
  }

  const closeSettings = () => {
    showSettings.value = false
  }

  const showHome = () => {
    showSettings.value = false
    state.isPaused = true
    showTimer.value = false
  }

  const startResumeButton = () => {
    closeSettings()
    if(!tasks.value[0]) {
      toggleAddTaskPopup()
      return
    }
    else {
      showTimer.value = true
      state.isPaused = false
    }
  }

  const resetTimer = () => {
    toggleResetTimerPopup()
  }
  
  const resetProgress = () => {
    toggleResetProgressPopup()
  }

  // Tasks methods

  const saveTask = () => {
    if(newTask.value.trim() === '') {
      return
    }
    
    tasks.value.push({
      content: newTask.value,
      done: false,
      id: Date.now(),
      showEditInput: false
    })

    newTask.value = ''

    console.log('Tasks: ', tasks.value)
  }

  const removeTask = task => {
    toggleDeleteTaskPopup()
    deleteTask.value = task
  }

  const markAsDone = task => {
    var taskDone = task
    tasks.value = tasks.value.filter(t => t !== task)

    taskDone.done = true
    completedTasks.value.push(taskDone)

    if(tasks.value.length == 0) {
      state.isPaused = true
      toggleMoreTasksPopup()
    }

  }

  const markAsNotDone = task => {
    task.done = false
    tasks.value.push(task)
    completedTasks.value = completedTasks.value.filter(t => t !== task)
  }

  const startDrag = (event, id, index) => {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('taskID', id)
    _el.value = event.target
    _index.value = index
  }

  const onDrop = (event, id) => {
    const taskID = event.dataTransfer.getData('taskID')
    const task = tasks.value.find((task) => task.id == taskID)
    const completedTask = completedTasks.value.find((task) => task.id == taskID)
    if(completedTask) {
      markAsNotDone(completedTask)
    }
    if(task) {
      markAsDone(task)
    }
  }

  const dragOver = (event, index) => {
    if(_index.value != index){
      _index2.value = index
    }
    if(isBefore(_el.value, event.target)) {
      event.target.parentNode.insertBefore(_el.value, event.target)
    }
    else {
      event.target.parentNode.insertBefore(_el.value, event.target.nextSibling)
    }
  }

  const isBefore = (el1, el2) => {
    if(el1.parentNode === el2.parentNode)
      for(var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
        if(cur === el2)
          return true
    return false
  }

  const endDrag = () => {
    reorderTaskList(_index.value, _index2.value)
  }

  const reorderTaskList = (grabbedIndex, droppedIndex) => {
    const task = tasks.value[grabbedIndex]
    tasks.value.splice(grabbedIndex, 1)
    tasks.value.splice(droppedIndex, 0, task)
  }

  watch(tasks, newValue => {
    localStorage.setItem('tasks', JSON.stringify(newValue))
    newValue.forEach(element => {
      if(element.done) {
        markAsDone(element)
      }
    })
  }, { deep: true })

  watch(completedTasks, newValue => {
    localStorage.setItem('completed tasks', JSON.stringify(newValue))
    newValue.forEach(element => {
      if(!element.done) {
        markAsNotDone(element)
      }
    });
  }, { deep: true })

  // toggle popup methods

  const toggleAddTaskPopup = () => {
    popupAddTaskActive.value = !popupAddTaskActive.value
  }

  const toggleDeleteTaskPopup = () => {
    popupDeleteTaskActive.value = !popupDeleteTaskActive.value
  }

  const toggleTaskDonePopup = () => {
    popupTaskDoneActive.value = !popupTaskDoneActive.value
  }

  const toggleResetProgressPopup = () => {
    popupResetProgressActive.value = !popupResetProgressActive.value
  }

  const toggleResetTimerPopup = () => {
    popupResetTimerActive.value = !popupResetTimerActive.value
  }

  const toggleMoreTasksPopup = () => {
    popupMoreTasksActive.value = !popupMoreTasksActive.value
  }

  const toggleHelpPopup = () => {
    popupHelpActive.value = !popupHelpActive.value
  }

  // confirm methods

  const confirmDeleteTask = (option) => {
    if(option) {
      if(!deleteTask.value.done) {
        tasks.value = tasks.value.filter(t => t !== deleteTask.value)
        if(tasks.value.length == 0) {
          state.isPaused = true
          toggleMoreTasksPopup()
        }
      }
      else
        completedTasks.value = completedTasks.value.filter(t => t !== deleteTask.value)
    }
    
    deleteTask.value = null
  }

  const confirmTaskDone = (option) => {
    if(option) {
      markAsDone(tasks.value[0])
    }
    state.isPaused = false
  }

  const confirmResetProgress = (option) => {
    if(option) {
      state.workCounter = 1
      state.breakCounter = 0
      state.cycleCounter = 0
    }
  }

  const confirmResetTimer = (option) => {
    if(option) {
      if(state.currentActivity == "work") {
        state.timer = workDuration.value
      }
      if(state.currentActivity == "short break") {
        state.timer = shortBreakDuration.value
      }
      if(state.currentActivity == "long break") {
        state.timer = longBreakDuration.value
      }
    }
  }

  const confirmMoreTasks = (option) => {
    showSettings.value = false
    showTimer.value = false
    state.isPaused = true
    if(option) {
      toggleAddTaskPopup()    
    }
    else {
      resetAll()
    }
  }

  // increase/decrease methods used in settings

  const increaseCounter = (whichOne) => {
    if(whichOne == 'workDuration')
      increaseDuration(workDuration)
    if(whichOne == 'shortBreakDuration')
      increaseDuration(shortBreakDuration)
    if(whichOne == 'longBreakDuration')
      increaseDuration(longBreakDuration)
    if(whichOne == 'sprints')
      increaseSprints()
  }
  
  const increaseDuration = (ref) => {
    if(ref.value == 3600) {
      return
    }
    ref.value = parseFloat(ref.value) + 60
    confirmResetTimer(true)
  }

  const increaseSprints = () => {
    if(sprints.value == 5) {
      return
    }
    sprints.value++
    confirmResetProgress(true)
  }

  const decreaseCounter = (whichOne) => {
    if(whichOne == 'workDuration')
      decreaseDuration(workDuration)
    if(whichOne == 'shortBreakDuration')
      decreaseDuration(shortBreakDuration)
    if(whichOne == 'longBreakDuration')
      decreaseDuration(longBreakDuration)  
    if(whichOne == 'sprints')
      decreaseSprints()
  }

  const decreaseDuration = (ref) => {
    if(ref.value == 60) {
      return
    }
    ref.value = parseFloat(ref.value) - 60
    confirmResetTimer(true)
  }

  const decreaseSprints = () => {
    if(sprints.value == 2) {
      return
    }
    sprints.value--
    confirmResetProgress(true)
  }

</script>

<template>

  <div class="flex flex-col font-Jost min-h-screen bg-pomogoat-primary">

    <!-- Popups -->

    <Popup @close-popup="toggleAddTaskPopup()" :popupActive="popupAddTaskActive" :popupType="'alert'">
      <h1 class="font-bold"> Add a task! </h1>
    </Popup>

    <Popup @close-popup="toggleDeleteTaskPopup()" @confirm="confirmDeleteTask" :popupActive="popupDeleteTaskActive" :popupType="'confirm'">
      <h1 class="font-bold"> Are you sure you want to delete this task?</h1>
    </Popup>

    <Popup @close-popup="toggleTaskDonePopup()" @confirm="confirmTaskDone" :popupActive="popupTaskDoneActive" :popupType="'confirm'">
      <h1 class="font-bold"> Have you finished the task "{{tasks[0].content}}"?</h1>
    </Popup>

    <Popup @close-popup="toggleResetProgressPopup()" @confirm="confirmResetProgress" :popupActive="popupResetProgressActive" :popupType="'confirm'">
      <h1 class="font-bold"> Your progress will reset. Are you sure?</h1>
    </Popup>

    <Popup @close-popup="toggleResetTimerPopup()" @confirm="confirmResetTimer" :popupActive="popupResetTimerActive" :popupType="'confirm'">
      <h1 class="font-bold"> The timer will reset. Are you sure?</h1>
    </Popup>

    <Popup @close-popup="toggleMoreTasksPopup()" @confirm="confirmMoreTasks" :popupActive="popupMoreTasksActive" :popupType="'confirm'">
      <h1 class="font-bold"> Do you have more tasks to do?</h1>
    </Popup>

    <Popup @close-popup="toggleHelpPopup()" :popupActive="popupHelpActive" :popup-type="'alert'">
      <h1 class="text-xl font-semibold">How it works</h1>
      <p class="text-left w-80 pl-2"><span class="font-bold">1. &nbsp;</span> Add your tasks. Order by priority. First task in the list is your next task. Drag and drop to reorder.</p>
      <p class="text-left w-80 pl-2"><span class="font-bold">2. &nbsp;</span> By default, each cycle has 4 work sprints (25 minutes) and 3 short breaks (5 minutes) till long break (15 minutes). You can customize these options and check your progress at Settings.</p>
      <p class="text-left w-80 pl-2"><span class="font-bold">3. &nbsp;</span> Start the timer when you're ready. Focus on doing your task while timer is running. On break, do something different than your work.</p>
      <p class="text-left w-80 pl-2"><span class="font-bold">4. &nbsp;</span> The system forces you to have at least one item on your task list. Every time you finish a work sprint it will be asked if you have finished your current task. If you confirm, the task will be moved to the "Completed" list. If you decline, the task will remain on the "Next Tasks" list. </p>
      <p class="text-left w-80 pl-2"><span class="font-bold">5. &nbsp;</span> You are the 🐐 (Greatest Of All Time)</p>
    </Popup>

    <!-- Nav Bar -->

    <Navbar
      :showTimer="showTimer"
      :isPaused="state.isPaused"
      @open-help-popup="toggleHelpPopup"
      @showHome="showHome"
      @openSettings="openSettings"
      @toggle-pause="togglePause"
    />

    <!-- Home Component -->

    <Home
      v-if="!showTimer"
      @show-timer="startResumeButton"
      @open-help-popup="toggleHelpPopup"
    />

    <!-- Settings -->

    <Settings v-if="showSettings"
      class="fixed top-0 right-0 bg-pomogoat-primary border-black border border-t-0 border-r-0"
      :workCounter="state.workCounter"
      :breakCounter="state.breakCounter"
      :cycleCounter="state.cycleCounter"
      :workDurationPrettyTime="workDurationPrettyTime"
      :shortBreakDurationPrettyTime="shortBreakDurationPrettyTime"
      :longBreakDurationPrettyTime="longBreakDurationPrettyTime"
      :sprints="sprints"
      @decrease-counter="decreaseCounter"
      @increase-counter="increaseCounter"
      @reset-timer="resetTimer"
      @reset-progress="resetProgress"
      @close-settings="closeSettings"
    />

    <!-- Timer -->

    <Timer
      :showTimer="showTimer"
      :showStartButton="state.showStartButton"
      :currentActivity="state.currentActivity"
      :workDuration="workDuration"
      :workDurationPrettyTime="workDurationPrettyTime"
      :timer="state.timer"
      :timerPrettyTime="timerPrettyTime"
      :calculateProgress="calculateProgress"
      :goatEmojis="goatEmojis"
      :sprints="sprints"
      :breakCounter="state.breakCounter"
      @start-timer="startTimer"
    />

    <!-- Tasks -->

    <Tasks
      v-model:newTask="newTask"
      :toggleValue="toggleValue"
      :showNewTasks="showNewTasks"
      :tasks="tasks"
      :showCompletedTasks="showCompletedTasks"
      :completedTasks="completedTasks"
      @toggleTaskList="toggleTaskList"
      @removeTask="removeTask"
      @dragOver="dragOver"
      @endDrag="endDrag"
      @startDrag="startDrag"
      @onDrop="onDrop"
      @saveTask="saveTask"
    />

    <!-- Footer -->

    <About/>

  </div>
  
</template>

<style scoped>

</style>
