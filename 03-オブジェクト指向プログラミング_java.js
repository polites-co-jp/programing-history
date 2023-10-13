const df = require("./xx-定義関数.js");

/**
 * タスク・スケジュールのベースクラス
 */
class TaskBase {
  /**
   * Id
   */
  #_id = "";
  get id() {
    return this.#_id;
  }
  set id(value) {
    this.#_id = value;
  }

  /**
   * タスク名
   */
  #_name = "";
  get name() {
    return this.#_name;
  }
  set name(value) {
    this.#_name = value;
  }

  /**
   * 開始予定日
   */
  get planStartDate() {
    throw Error("オーバーライドしてください");
  }

  /**
   * 終了予定日
   */
  get planEndDate() {
    throw Error("オーバーライドしてください");
  }

  /**
   * 開始日
   */
  get startDate() {
    throw Error("オーバーライドしてください");
  }

  /**
   * 終了日
   */
  get endDate() {
    throw Error("オーバーライドしてください");
  }

  /**
   * コンストラクタ
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * 予定期間に終了していたらtrue
   */
  get isSuccess() {
    if (!this.endDate || !this.planEndDate) return false;

    if (this.planEndDate >= this.endDate) return true;

    return false;
  }

  /**
   * 内容を文字列化
   */
  toString() {
    return `予定:${df.formatDate(this.planStartDate)}-${df.formatDate(
      this.planEndDate
    )} / 実績:${df.formatDate(this.startDate)}-${df.formatDate(
      this.endDate
    )}　${this.name}`;
  }
}

/**
 * スケジュール
 */
class Schedule extends TaskBase {
  /**
   * タスクリスト
   */
  #_tasks = [];
  get tasks() {
    return this.#_tasks;
  }
  set tasks(value) {
    this.#_tasks = value;
  }

  /**
   * 開始予定日
   */
  get planStartDate() {
    let stockDate = null;
    for (let i = 0; i < this.#_tasks.length; i++) {
      //  開始予定日がないものがあれば、nullを返してそのまま終了
      if(!this.#_tasks[i].planStartDate) return null;
      if (
        !stockDate ||
        (this.#_tasks[i].planStartDate &&
          stockDate > this.#_tasks[i].planStartDate)
      ) {
        stockDate = this.#_tasks[i].planStartDate;
      }
    }
    return stockDate;
  }

  /**
   * 終了予定日
   */
  get planEndDate() {
    let stockDate = null;
    for (let i = 0; i < this.#_tasks.length; i++) {
      //  終了予定日がないものがあれば、nullを返してそのまま終了
      if(!this.#_tasks[i].planEndDate) return null;
      if (
        !stockDate ||
        (this.#_tasks[i].planEndDate && stockDate < this.#_tasks[i].planEndDate)
      ) {
        stockDate = this.#_tasks[i].planEndDate;
      }
    }
    return stockDate;
  }

  /**
   * 開始日
   */
  get startDate() {
    let stockDate = null;
    for (let i = 0; i < this.#_tasks.length; i++) {
      //  開始日がないものがあれば、nullを返してそのまま終了
      if(!this.#_tasks[i].startDate) return null;

      if (
        !stockDate ||
        (this.#_tasks[i].startDate && stockDate > this.#_tasks[i].startDate)
      ) {
        stockDate = this.#_tasks[i].startDate;
      }
    }
    return stockDate;
  }

  /**
   * 終了日
   */
  get endDate() {
    let stockDate = null;
    for (let i = 0; i < this.#_tasks.length; i++) {
      //  開始日がないものがあれば、nullを返してそのまま終了
      if(!this.#_tasks[i].endDate) return null;

      if (
        !stockDate ||
        (this.#_tasks[i].endDate && stockDate < this.#_tasks[i].endDate)
      ) {
        stockDate = this.#_tasks[i].endDate;
      }
    }
    return stockDate;
  }

  /**
   * コンストラクタ
   */
  constructor(id, name, tasks) {
    super(id, name);
    this.#_tasks = tasks;
  }

  /**
   * taskIdからTaskを取得
   * @param {*} taskId
   */
  searchTask(taskId) {
    for (let i = 0; i < this.#_tasks.length; i++) {
      if (this.#_tasks[i].id === taskId) return this.#_tasks[i];
    }
    return null;
  }
}

/**
 * タスク
 */
class Task extends TaskBase {
  /**
   * スケジュールID
   */
  #_scheduleId = "";
  get scheduleId() {
    return this.#_scheduleId;
  }
  set scheduleId(value) {
    this.#_scheduleId = value;
  }

  /**
   * 開始予定日
   */
  #_planStartDate;
  get planStartDate() {
    return this.#_planStartDate;
  }
  set planStartDate(value) {
    if (!value) {
      this.#_planStartDate = null;
    } else if (typeof value == "string") {
      this.#_planStartDate = new Date(value);
    } else {
      this.#_planStartDate = value;
    }
  }

  /**
   * 終了予定日
   */
  #_planEndDate;
  get planEndDate() {
    return this.#_planEndDate;
  }
  set planEndDate(value) {
    if (!value) {
      this.#_planEndDate = null;
    } else if (typeof value == "string") {
      this.#_planEndDate = new Date(value);
    } else {
      this.#_planEndDate = value;
    }
  }

  /**
   * 開始日
   */
  #_startDate;
  get startDate() {
    return this.#_startDate;
  }
  set startDate(value) {
    if (!value) {
      this.#_startDate = null;
    } else if (typeof value == "string") {
      this.#_startDate = new Date(value);
    } else {
      this.#_startDate = value;
    }
  }

  /**
   * 終了日
   */
  #_endDate;
  get endDate() {
    return this.#_endDate;
  }
  set endDate(value) {
    if (!value) {
      this.#_endDate = null;
    } else if (typeof value == "string") {
      this.#_endDate = new Date(value);
    } else {
      this.#_endDate = value;
    }
  }

  /**
   * コンストラクタ
   * @param {*} id
   * @param {*} scheduleId
   * @param {*} name
   * @param {*} planStartDate
   * @param {*} planEndDate
   * @param {*} startDate
   * @param {*} endDate
   */
  constructor(
    id,
    scheduleId,
    name,
    planStartDate,
    planEndDate,
    startDate,
    endDate
  ) {
    super(id, name);

    this.scheduleId = scheduleId;
    this.planStartDate = planStartDate;
    this.planEndDate = planEndDate;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

/**
 * スケジュールマネージャ
 */
class ScheduleManager {
  /**
   * スケジュール
   */
  #_schedules = [];

  //    初期化シリーズ  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  /**
   * コンストラクタ
   */
  constructor(scheduleCsv, taskCsv) {
    let tasks = this.#parseTaskCsv(taskCsv);
    let schedules = this.#parseScheduleCsv(scheduleCsv, tasks);
    this.#_schedules = schedules;
    // console.log(JSON.stringify(schedules));
  }

  /**
   * タスクCSVをパースして返す
   * @param {*} scheduleCsv
   */
  #parseTaskCsv(taskCsv) {
    let result = [];
    let lines = taskCsv.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let items = lines[i].split(",");
      let task = new Task(
        items[0],
        items[1],
        items[2],
        items[3],
        items[4],
        items[5],
        items[6]
      );
      result.push(task);
    }
    return result;
  }

  /**
   * スケジュールCSVをパースして返す
   * @param {*} scheduleCsv
   */
  #parseScheduleCsv(scheduleCsv, tasks) {
    let result = [];
    let lines = scheduleCsv.split("\n");

    for (let i = 0; i < lines.length; i++) {
      let items = lines[i].split(",");

      let currentTask = [];
      for (let h = 0; h < tasks.length; h++) {
        if (tasks[h].scheduleId === items[0]) {
          currentTask.push(tasks[h]);
        }
      }

      let schedule = new Schedule(items[0], items[1], currentTask);

      result.push(schedule);
    }
    return result;
  }

  //    データ取得シリーズ  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  /**
   * scheduleIdからscheduleを取得
   * @param {*} scheduleId
   */
  searchSchedule(scheduleId) {
    for (let i = 0; i < this.#_schedules.length; i++) {
      if (this.#_schedules[i].id === scheduleId) return this.#_schedules[i];
    }
    return null;
  }

  /**
   * ScheduleIdとTaskIdからTaskを取得
   * @param {*} scheduleId
   * @param {*} taskId
   */
  searchTask(scheduleId, taskId) {
    let schedule = this.searchSchedule(scheduleId);
    if (!schedule) {
      console.error("scheduleIdに対応するScheduleが見つかりません。");
      return null;
    }

    let task = schedule.searchTask(taskId);
    if (!task) {
      console.error("taskIdに対応するTaskが見つかりません。");
      return null;
    }

    return task;
  }

  /**
   * 期間内に終了したスケジュールを取得
   */
  getSuccessfulSchedules() {
    let result = [];
    for (let i = 0; i < this.#_schedules.length; i++) {
      if (this.#_schedules[i].isSuccess) result.push(this.#_schedules[i]);
    }
    return result;
  }

  /**
   * 期間内に終了したタスクを取得
   */
  getSuccessfulTasks() {
    let result = [];
    for (let i = 0; i < this.#_schedules.length; i++) {
      for (let h = 0; h < this.#_schedules[i].tasks.length; h++) {
        if (this.#_schedules[i].tasks[h].isSuccess)
          result.push(this.#_schedules[i].tasks[h]);
      }
    }
    return result;
  }

  //    データ登録シリーズ  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  /**
   * 開始日を登録
   * @param {*} scheduleId
   * @param {*} taskId
   * @param {*} startDate
   */
  setStartTask(scheduleId, taskId, startDate) {
    let task = this.searchTask(scheduleId, taskId);
    task.startDate = startDate;
  }

  /**
   * 終了日を登録
   * @param {*} scheduleId
   * @param {*} taskId
   * @param {*} endDate
   */
  setEndTask(scheduleId, taskId, endDate) {
    let task = this.searchTask(scheduleId, taskId);
    task.endDate = endDate;
  }
}

//  CSVのデータを取得
let scheduleCsv = df.getSheduleCsvData();
let taskCsv = df.getTaskCsvData();

//  タスクとスケジュールを初期化
let scheduleManager = new ScheduleManager(scheduleCsv, taskCsv);

//  scheduleId:004 taskId:108　の開始日と終了日を2023/03/15に設定
scheduleManager.setStartTask("004", "108", "2023-03-15");
scheduleManager.setEndTask("004", "108", "2023-03-15");

//  期限内に終えられたスケジュール一覧を出力
let successfulSchedules = scheduleManager.getSuccessfulSchedules();
console.log("期限内に終えられたスケジュール一覧 ----------------");
for (let i = 0; i < successfulSchedules.length; i++) {
  console.log(successfulSchedules[i].toString());
}
console.log("");

//  期限内に終えられたタスク一覧を出力
let successfulTasks = scheduleManager.getSuccessfulTasks();
console.log("期限内に終えられたタスク一覧 ----------------");
for (let i = 0; i < successfulTasks.length; i++) {
  console.log(successfulTasks[i].toString());
}