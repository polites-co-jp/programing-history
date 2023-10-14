const df = require("./xx-定義関数.js");

function mian() {
  //  CSVのデータを取得 ========================

  //    スケジュールのデータを取得
  let scheduleCsv = df.getSheduleCsvData();
  let scheduleRows = scheduleCsv.split("\n");
  let scheduleData = [];
  for (let i = 0; i < scheduleRows.length; i++) {
    scheduleData.push(scheduleRows[i].split(","));
  }

  //    タスクのデータを取得
  let taskCsv = df.getTaskCsvData();
  let taskRows = taskCsv.split("\n");
  let taskData = [];
  for (let i = 0; i < taskRows.length; i++) {
    taskData.push(taskRows[i].split(","));
  }

  //    CSVデータのインデックス
  let scheduleIdIdx = 0;
  let scheduleNameIdx = 1;

  let taskIdIdx = 0;
  let taskScheduleIdIdx = 1;
  let taskNameIdx = 2;
  let taskStartPlanDateIdx = 3;
  let taskEndPlanDateIdx = 4;
  let taskStartDateIdx = 5;
  let taskEndDateIdx = 6;

  //  scheduleId:004 taskId:108　の開始日と終了日を2023/03/15に設定

  for (let i = 0; i < taskData.length; i++) {
    if (taskData[i][taskIdIdx] !== "108") continue;
    taskData[i][taskStartDateIdx] = "2023-03-15";
    taskData[i][taskEndDateIdx] = "2023-03-15";
    break;
  }

  //    期限内に終えられたスケジュール
  console.log("期限内に終えられたスケジュール一覧 ----------------");

  for (let i = 0; i < scheduleData.length; i++) {
    let minPlanStart = null;
    let maxPlanEnd = null;
    let minStart = null;
    let maxEnd = null;

    for (let h = 0; h < taskData.length; h++) {
      //  スケジュールに対応するタスク
      if (scheduleData[i][scheduleIdIdx] !== taskData[h][taskScheduleIdIdx]) {
        continue;
      }

      //  どれかの値が日付じゃなければ判定不可能なのでnullに設定
      if (
        !taskData[h][taskStartPlanDateIdx] ||
        !taskData[h][taskEndPlanDateIdx] ||
        !taskData[h][taskStartDateIdx] ||
        !taskData[h][taskEndDateIdx]
      ) {
        maxEnd = null;
        break;
      }

      //  対象の値取得
      if (!minPlanStart || minPlanStart > taskData[h][taskStartPlanDateIdx]) {
        minPlanStart = taskData[h][taskStartPlanDateIdx];
      }
      if (!maxPlanEnd || maxPlanEnd < taskData[h][taskEndPlanDateIdx]) {
        maxPlanEnd = taskData[h][taskEndPlanDateIdx];
      }
      if (!minStart || minStart > taskData[h][taskStartDateIdx]) {
        minStart = taskData[h][taskStartDateIdx];
      }
      if (!maxEnd || maxEnd < taskData[h][taskEndDateIdx]) {
        maxEnd = taskData[h][taskEndDateIdx];
      }
    }

    //  どれかの値が日付じゃなければ判定不可能なので期間内に終わっていないものとする
    if (!minPlanStart || !maxPlanEnd || !minStart || !maxEnd) {
      continue;
    }
    //  期間内に終わってなければ次のスケジュールを確認
    if (maxPlanEnd < maxEnd) continue;

    console.log(
      `予定:${df.formatDate(minPlanStart)}-${df.formatDate(
        maxPlanEnd
      )} / 実績:${df.formatDate(minStart)}-${df.formatDate(maxEnd)}　${
        scheduleData[i][scheduleNameIdx]
      }`
    );
  }

  //    期限内に終えられたタスク
  console.log("");
  console.log("期限内に終えられたタスク一覧 ----------------");

  for (let h = 0; h < taskData.length; h++) {
    //  どれかの値が日付じゃなければ判定不可能なのでnullに設定
    if (
      !taskData[h][taskStartPlanDateIdx] ||
      !taskData[h][taskEndPlanDateIdx] ||
      !taskData[h][taskStartDateIdx] ||
      !taskData[h][taskEndDateIdx]
    ) {
      maxEnd = null;
      break;
    }

    //  対象の値
    let minPlanStart = taskData[h][taskStartPlanDateIdx];
    let maxPlanEnd = taskData[h][taskEndPlanDateIdx];
    let minStart = taskData[h][taskStartDateIdx];
    let maxEnd = taskData[h][taskEndDateIdx];

    //  どれかの値が日付じゃなければ判定不可能なので期間内に終わっていないものとする
    if (!minPlanStart || !maxPlanEnd || !minStart || !maxEnd) {
      continue;
    }
    //  期間内に終わってなければ次のスケジュールを確認
    if (maxPlanEnd < maxEnd) continue;

    console.log(
      `予定:${df.formatDate(minPlanStart)}-${df.formatDate(
        maxPlanEnd
      )} / 実績:${df.formatDate(minStart)}-${df.formatDate(maxEnd)}　${
        taskData[h][taskNameIdx]
      }`
    );
  }
}

mian();
