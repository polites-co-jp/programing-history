const df = require("./xx-定義関数.js");

//    CSVデータのインデックス
const scheduleIdIdx = 0;
const scheduleNameIdx = 1;

const taskIdIdx = 0;
const taskScheduleIdIdx = 1;
const taskNameIdx = 2;
const taskStartPlanDateIdx = 3;
const taskEndPlanDateIdx = 4;
const taskStartDateIdx = 5;
const taskEndDateIdx = 6;

/**
 * CSV文字列を二次元配列に変換
 * @param {*} csvData
 */
function parseCsv(csvData) {
  let csvRows = csvData.split("\n");
  let result = [];
  for (let i = 0; i < csvRows.length; i++) {
    result.push(csvRows[i].split(","));
  }
  return result;
}

/**
 * タスクの開始日を登録する
 * @param {*} tasks
 * @param {*} taskId
 * @param {*} startDate
 */
function setTaskStartDate(tasks, taskId, startDate) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i][taskIdIdx] !== taskId) continue;
    tasks[i][taskStartDateIdx] = startDate;
    break;
  }
}

/**
 * タスクの開始日を登録する
 * @param {*} tasks
 * @param {*} taskId
 * @param {*} endtDate
 */
function setTaskEndDate(tasks, taskId, endtDate) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i][taskIdIdx] !== taskId) continue;
    tasks[i][taskEndDateIdx] = endtDate;
    break;
  }
}

/**
 * 開始予定日の最も古いのを取得
 * @param {*} tasks
 */
function getMinPlanStart(tasks) {
  let result = null;
  for (let i = 0; i < tasks.length; i++) {
    //  値がないものがある時算出不可能なので終了
    if (!tasks[i][taskStartPlanDateIdx]) return null;

    if (!result || result > tasks[i][taskStartPlanDateIdx]) {
      result = tasks[i][taskStartPlanDateIdx];
    }
  }
  return result;
}

/**
 * 終了予定日の最も古いのを取得
 * @param {*} tasks
 */
function getMaxPlanEnd(tasks) {
  let result = null;
  for (let i = 0; i < tasks.length; i++) {
    //  値がないものがある時算出不可能なので終了
    if (!tasks[i][taskEndPlanDateIdx]) return null;

    if (!result || result < tasks[i][taskEndPlanDateIdx]) {
      result = tasks[i][taskEndPlanDateIdx];
    }
  }
  return result;
}

/**
 * 開始の最も古いのを取得
 * @param {*} tasks
 */
function getMinStart(tasks) {
  let result = null;
  for (let i = 0; i < tasks.length; i++) {
    //  値がないものがある時算出不可能なので終了
    if (!tasks[i][taskStartDateIdx]) return null;

    if (!result || result > tasks[i][taskStartDateIdx]) {
      result = tasks[i][taskStartDateIdx];
    }
  }
  return result;
}

/**
 * 終了の最も古いのを取得
 * @param {*} tasks
 */
function getMaxEnd(tasks) {
  let result = null;
  for (let i = 0; i < tasks.length; i++) {
    //  値がないものがある時算出不可能なので終了
    if (!tasks[i][taskEndDateIdx]) return null;

    if (!result || result < tasks[i][taskEndDateIdx]) {
      result = tasks[i][taskEndDateIdx];
    }
  }
  return result;
}

/**
 * scheduleに対応するtaskの配列を取得する
 * @param {*} schedule
 * @param {*} tasks
 */
function getSchedulesTasks(schedule, tasks) {
  let result = [];
  for (let i = 0; i < tasks.length; i++) {
    if (schedule[scheduleIdIdx] === tasks[i][taskScheduleIdIdx])
      result.push(tasks[i]);
  }
  return result;
}

/**
 * scheduleとtask配列からそのscheduleが期限内に終わったかどうかを判定する
 * @param {*} schedules
 * @param {*} tasks
 */
function isScheduleSuccess(schedule, tasks) {
  let targetTasks = getSchedulesTasks(schedule, tasks);

  let startPlanDate = getMinPlanStart(targetTasks);
  let endPlanDate = getMaxPlanEnd(targetTasks);
  let startDate = getMinStart(targetTasks);
  let endDate = getMaxEnd(targetTasks);

  if (!startPlanDate || !endPlanDate || !startDate || !endDate) return false;

  if (endDate > endPlanDate) return false;

  return true;
}

/**
 * 期限内に終えられたスケジュールを取得
 * @param {*} schedules
 * @param {*} tasks
 */
function getSuccessSchedules(schedules, tasks) {
  let result = [];
  for (let i = 0; i < schedules.length; i++) {
    if (isScheduleSuccess(schedules[i], tasks)) {
      result.push(schedules[i]);
    }
  }
  return result;
}

/**
 * scheduleとtaskから、出力するための文字列を取得する
 * @param {*} schedule
 * @param {*} tasks
 */
function getOutputTextBySchedule(schedule, tasks) {
  let targetTasks = getSchedulesTasks(schedule, tasks);

  let startPlanDate = getMinPlanStart(targetTasks);
  let endPlanDate = getMaxPlanEnd(targetTasks);
  let startDate = getMinStart(targetTasks);
  let endDate = getMaxEnd(targetTasks);

  return `予定:${df.formatDate(startPlanDate)}-${df.formatDate(
    endPlanDate
  )} / 実績:${df.formatDate(startDate)}-${df.formatDate(endDate)}　${
    schedule[scheduleNameIdx]
  }`;
}

/**
 * scheduleとtaskから、出力するための文字列を取得する
 * @param {*} schedule
 * @param {*} tasks
 */
function getOutputTextBySchedules(schedules, tasks) {
  let result = [];
  for (let i = 0; i < schedules.length; i++) {
    result.push(getOutputTextBySchedule(schedules[i], tasks));
  }
  return result;
}



/**
 * タスクが正常終了したとき
 * @param {*} tasks
 */
function isTaskSuccess( task) {

  if(!task[taskStartPlanDateIdx] || !task[taskEndPlanDateIdx] || !task[taskStartDateIdx]|| !task[taskEndDateIdx])
    return false;

  if (task[taskEndDateIdx] > task[taskEndPlanDateIdx]) return false;

  return true;
}


/**
 * 期限内に完了したタスクを取得
 * @param {*} tasks
 */
function getSuccessTasks(tasks) {

  let result = []
  for(let i = 0; i < tasks.length; i++){
    if(isTaskSuccess(tasks[i]))
      result.push(tasks[i])
  }
  return result
}

/**
 * taskから、出力するための文字列を取得する
 * @param {*} task 
 */
function getOutputTextByTask(task){


  return `予定:${df.formatDate(task[taskStartPlanDateIdx])}-${df.formatDate(task[taskEndPlanDateIdx]
  )} / 実績:${df.formatDate(task[taskStartDateIdx])}-${df.formatDate(task[taskEndDateIdx])}　${
    task[taskNameIdx]
  }`;
}

/**
 * taskから、出力するための文字列を取得する
 * @param {*} task 
 */
function getOutputTextByTasks(tasks){

  let result = []
  for(let i = 0; i < tasks.length; i++){
      result.push(getOutputTextByTask( tasks[i]))
  }
  return result;
}


function mian() {
  //  CSVのデータを取得 ========================

  //    スケジュールのデータを取得
  let scheduleData = parseCsv(df.getSheduleCsvData());

  //    タスクのデータを取得
  let taskData = parseCsv(df.getTaskCsvData());

  //  scheduleId:004 taskId:108　の開始日と終了日を2023/03/15に設定
  setTaskStartDate(taskData, "108", "2023-03-15");
  setTaskEndDate(taskData, "108", "2023-03-15");

  //  期限内に終えられたスケジュールを取得
  let successSchedules = getSuccessSchedules(scheduleData, taskData);
  //  対象のスケジュールの出力用文字列を取得
  let successSchedulesTexts = getOutputTextBySchedules(
    successSchedules,
    taskData
  );

  console.log("期限内に終えられたスケジュール一覧 ----------------");

  //  取得したスケジュールを出力
  for(let i = 0; i < successSchedulesTexts.length; i++){
    console.log(successSchedulesTexts[i]);
  }

  console.log("");

  //  期限内に終えられたタスクを取得
  let successTasks = getSuccessTasks(taskData);
  //  対象のタスクの出力用文字列を取得
  let successTasksTexts = getOutputTextByTasks(successTasks);

  console.log("期限内に終えられたタスク一覧 ----------------");
  //  取得したタスクを出力
  for(let i = 0; i < successTasksTexts.length; i++){
    console.log(successTasksTexts[i]);
  }


}

mian();
