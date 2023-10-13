const df = require("./xx-定義関数.js");

// タスクベースのデータ型
function TaskBase(id, name) {
  this.id = id;
  this.name = name;

  this.isSuccess = () =>
    this.endDate && this.planEndDate && this.planEndDate >= this.endDate;
  this.toString = () =>
    `予定:${df.formatDate(this.planStartDate)}-${df.formatDate(
      this.planEndDate
    )} / 実績:${df.formatDate(this.startDate)}-${df.formatDate(this.endDate)} ${
      this.name
    }`;
}

// スケジュールデータ型
function Schedule(id, name, tasks) {
  TaskBase.call(this, id, name);
  this.tasks = tasks;

  this.planStartDate = () =>
    this.tasks.reduce(
      (minDate, task) =>
        !minDate || (task.planStartDate && minDate > task.planStartDate)
          ? task.planStartDate
          : minDate,
      null
    );
  this.planEndDate = () =>
    this.tasks.reduce(
      (maxDate, task) =>
        !maxDate || (task.planEndDate && maxDate < task.planEndDate)
          ? task.planEndDate
          : maxDate,
      null
    );
  this.startDate = () =>
    this.tasks.reduce(
      (minDate, task) =>
        !minDate || (task.startDate && minDate > task.startDate)
          ? task.startDate
          : minDate,
      null
    );
  this.endDate = () =>
    this.tasks.reduce(
      (maxDate, task) =>
        !maxDate || (task.endDate && maxDate < task.endDate)
          ? task.endDate
          : maxDate,
      null
    );

  this.searchTask = (taskId) =>
    this.tasks.find((task) => task.id === taskId) || null;
}

// タスクデータ型
function Task(
  id,
  scheduleId,
  name,
  planStartDate,
  planEndDate,
  startDate,
  endDate
) {
  TaskBase.call(this, id, name);
  this.scheduleId = scheduleId;
  this.planStartDate = parseDate(planStartDate);
  this.planEndDate = parseDate(planEndDate);
  this.startDate = parseDate(startDate);
  this.endDate = parseDate(endDate);
}

function parseDate(value) {
  if (!value) return null;
  if (typeof value === "string") return new Date(value);
  return value;
}

// スケジュールマネージャ
function ScheduleManager(scheduleCsv, taskCsv) {
  const taskMap = new Map();

  taskCsv.split("\n").forEach((line) => {
    const items = line.split(",");
    taskMap.set(
      items[0],
      new Task(
        items[0],
        items[1],
        items[2],
        items[3],
        items[4],
        items[5],
        items[6]
      )
    );
  });

  this.schedules = scheduleCsv.split("\n").map((line) => {
    const items = line.split(",");
    const tasks = items[0]
      .split(";")
      .map((taskId) => taskMap.get(taskId))
      .filter((task) => task);
    return new Schedule(items[0], items[1], tasks);
  });

  this.searchSchedule = (scheduleId) =>
    this.schedules.find((schedule) => schedule.id === scheduleId) || null;
  this.searchTask = (scheduleId, taskId) => {
    const schedule = this.searchSchedule(scheduleId);
    return schedule ? schedule.searchTask(taskId) : null;
  };

  this.getSuccessfulSchedules = () =>
    this.schedules.filter((schedule) => schedule.isSuccess);
  this.getSuccessfulTasks = () =>
    this.schedules.flatMap((schedule) =>
      schedule.tasks.filter((task) => task.isSuccess)
    );
  this.setStartTask = (scheduleId, taskId, startDate) => {
    const task = this.searchTask(scheduleId, taskId);
    if (task) task.startDate = parseDate(startDate);
  };
  this.setEndTask = (scheduleId, taskId, endDate) => {
    const task = this.searchTask(scheduleId, taskId);
    if (task) task.endDate = parseDate(endDate);
  };
}

const scheduleCsv = df.getSheduleCsvData();
const taskCsv = df.getTaskCsvData();

const scheduleManager = new ScheduleManager(scheduleCsv, taskCsv);

scheduleManager.setStartTask("004", "108", "2023-03-15");
scheduleManager.setEndTask("004", "108", "2023-03-15");

console.log("期限内に終えられたスケジュール一覧 ----------------");
scheduleManager
  .getSuccessfulSchedules()
  .forEach((schedule) => console.log(schedule.toString()));

console.log("期限内に終えられたタスク一覧 ----------------");
scheduleManager
  .getSuccessfulTasks()
  .forEach((task) => console.log(task.toString()));
