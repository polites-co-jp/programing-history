const df = require("./xx-定義関数.js");

function createTaskBase(id, name) {
  return {
    id: id,
    name: name,
  };
}

function isSuccess(task, endDate, planEndDate) {
  if (!endDate || !planEndDate) return false;
  return planEndDate >= endDate;
}

function taskToString(task, planStartDate, planEndDate, startDate, endDate) {
  return `予定:${df.formatDate(planStartDate)}-${df.formatDate(
    planEndDate
  )} / 実績:${df.formatDate(startDate)}-${df.formatDate(endDate)} ${task.name}`;
}

function createSchedule(id, name, tasks) {
  return {
    id: id,
    name: name,
    tasks: tasks,
  };
}

function createTask(
  id,
  scheduleId,
  name,
  planStartDate,
  planEndDate,
  startDate,
  endDate
) {
  return {
    id: id,
    scheduleId: scheduleId,
    name: name,
    planStartDate: parseDate(planStartDate),
    planEndDate: parseDate(planEndDate),
    startDate: parseDate(startDate),
    endDate: parseDate(endDate),
  };
}

function createScheduleManager(scheduleCsv, taskCsv) {
  let schedules = [];
  let taskMap = {};

  let taskLines = taskCsv.split("\n");
  for (let i = 0; i < taskLines.length; i++) {
    let items = taskLines[i].split(",");
    let task = createTask(
      items[0],
      items[1],
      items[2],
      items[3],
      items[4],
      items[5],
      items[6]
    );
    taskMap[task.id] = task;
  }

  let scheduleLines = scheduleCsv.split("\n");
  for (let i = 0; i < scheduleLines.length; i++) {
    let items = scheduleLines[i].split(",");
    let taskIds = items[0].split(";");
    let tasks = [];

    for (let j = 0; j < taskIds.length; j++) {
      let task = taskMap[taskIds[j]];
      if (task) {
        tasks.push(task);
      }
    }

    let schedule = createSchedule(items[0], items[1], tasks);
    schedules.push(schedule);
  }

  return {
    schedules: schedules,
    searchSchedule: function (scheduleId) {
      for (let i = 0; i < this.schedules.length; i++) {
        if (this.schedules[i].id === scheduleId) {
          return this.schedules[i];
        }
      }
      return null;
    },
    searchTask: function (scheduleId, taskId) {
      let schedule = this.searchSchedule(scheduleId);
      if (schedule) {
        for (let i = 0; i < schedule.tasks.length; i++) {
          if (schedule.tasks[i].id === taskId) {
            return schedule.tasks[i];
          }
        }
      }
      return null;
    },
    getSuccessfulSchedules: function () {
      let successfulSchedules = [];
      for (let i = 0; i < this.schedules.length; i++) {
        let schedule = this.schedules[i];
        let endDate = schedule.endDate;
        let planEndDate = schedule.planEndDate;
        if (isSuccess(schedule, endDate, planEndDate)) {
          successfulSchedules.push(schedule);
        }
      }
      return successfulSchedules;
    },
    getSuccessfulTasks: function () {
      let successfulTasks = [];
      for (let i = 0; i < this.schedules.length; i++) {
        let tasks = this.schedules[i].tasks;
        for (let j = 0; j < tasks.length; j++) {
          let task = tasks[j];
          let endDate = task.endDate;
          let planEndDate = task.planEndDate;
          if (isSuccess(task, endDate, planEndDate)) {
            successfulTasks.push(task);
          }
        }
      }
      return successfulTasks;
    },
    setStartTask: function (scheduleId, taskId, startDate) {
      let task = this.searchTask(scheduleId, taskId);
      if (task) {
        task.startDate = parseDate(startDate);
      }
    },
    setEndTask: function (scheduleId, taskId, endDate) {
      let task = this.searchTask(scheduleId, taskId);
      if (task) {
        task.endDate = parseDate(endDate);
      }
    },
  };
}

function parseDate(value) {
  return !value ? null : typeof value === "string" ? new Date(value) : value;
}

const scheduleCsv = df.getSheduleCsvData();
const taskCsv = df.getTaskCsvData();

const scheduleManager = createScheduleManager(scheduleCsv, taskCsv);

scheduleManager.setStartTask("004", "108", "2023-03-15");
scheduleManager.setEndTask("004", "108", "2023-03-15");

console.log("期限内に終えられたスケジュール一覧 ----------------");
let successfulSchedules = scheduleManager.getSuccessfulSchedules();
for (let i = 0; i < successfulSchedules.length; i++) {
  let schedule = successfulSchedules[i];
  console.log(
    taskToString(
      schedule,
      schedule.startDate,
      schedule.endDate,
      schedule.startDate,
      schedule.endDate
    )
  );
}

console.log("期限内に終えられたタスク一覧 ----------------");
let successfulTasks = scheduleManager.getSuccessfulTasks();
for (let i = 0; i < successfulTasks.length; i++) {
  let task = successfulTasks[i];
  console.log(
    taskToString(
      task,
      task.planStartDate,
      task.planEndDate,
      task.startDate,
      task.endDate
    )
  );
}
