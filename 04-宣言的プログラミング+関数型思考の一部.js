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
  // set id(value) {
  //   this.#_id = value;
  // }

  /**
   * タスク名
   */
  #_name = "";
  get name() {
    return this.#_name;
  }
  // set name(value) {
  //   this.#_name = value;
  // }

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
   * @param {*} id
   * @param {*} name
   */
  constructor(id, name) {
    this.#_id = id;
    this.#_name = name;
  }

  /**
   * 予定期間に終了していたらtrue
   */
  get isSuccess() {
    return this.endDate && this.planEndDate && this.planEndDate >= this.endDate;
  }

  /**
   * 内容を文字列化
   */
  toString() {
    return `予定:${df.formatDate(this.planStartDate)}-${df.formatDate(
      this.planEndDate
    )} / 実績:${df.formatDate(this.startDate)}-${df.formatDate(this.endDate)} ${
      this.name
    }`;
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
    return this.#_tasks?.map((v) => new Task(v));
  }
  // set tasks(value) {
  //   this.#_tasks = value;
  // }

  /**
   * 開始予定日
   */
  get planStartDate() {
    return structuredClone(
      this.tasks.reduce(
        (minDate, task) =>
          !minDate || (task.planStartDate && minDate > task.planStartDate)
            ? task.planStartDate
            : minDate,
        null
      )
    );
  }

  /**
   * 終了予定日
   */
  get planEndDate() {
    return structuredClone(
      this.tasks.reduce(
        (maxDate, task) =>
          !maxDate || (task.planEndDate && maxDate < task.planEndDate)
            ? task.planEndDate
            : maxDate,
        null
      )
    );
  }

  /**
   * 開始日
   */
  get startDate() {
    return this.#_tasks.some((t) => !t.startDate)
      ? null
      : this.tasks.reduce(
          (maxDate, t) =>
            !maxDate || (t.startDate && maxDate < t.startDate)
              ? t.startDate
              : maxDate,
          null
        );
  }

  /**
   * 終了日
   */
  get endDate() {
    return this.#_tasks.some((t) => !t.endDate)
      ? null
      : this.tasks.reduce(
          (maxDate, t) =>
            !maxDate || (t.endDate && maxDate < t.endDate)
              ? t.endDate
              : maxDate,
          null
        );
  }

  /**
   * コンストラクタ
   */
  constructor(idOrSchedule, name, tasks) {
    //  コンストラクタパラメータの調整
    const initValue = !name
      ? {
          id: idOrSchedule.id,
          name: idOrSchedule.name,
          tasks: idOrSchedule.tasks,
        }
      : {
          id: idOrSchedule,
          name,
          tasks,
        };

    super(initValue.id, initValue.name);
    this.#_tasks = initValue.tasks.map((v) => new Task(v));
  }

  /**
   * taskIdからTaskを取得
   * @param {*} taskId
   * @returns
   */
  searchTask(taskId) {
    const targetTask = this.tasks.find((task) => task.id === taskId);
    return targetTask ? new Task(targetTask) : null;
  }

  /**
   * 指定のTaskに開始日を登録する
   * @param {*} taskId
   * @param {*} startDate
   */
  setStartTask(taskId, startDate) {
    const newTasks = this.tasks.map((t) =>
      t.id === taskId ? t.setStartTask(startDate) : t
    );
    return new Schedule(this.id, this.name, newTasks);
  }

  /**
   * 指定のTaskに終了日を登録する
   * @param {*} taskId
   * @param {*} endDate
   */
  setEndTask(taskId, endDate) {
    const newTasks = this.tasks.map((t) =>
      t.id === taskId ? t.setEndTask(endDate) : t
    );
    return new Schedule(this.id, this.name, newTasks);
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
  // set scheduleId(value) {
  //   this.#_scheduleId = value;
  // }

  /**
   * 開始予定日
   */
  #_planStartDate;
  get planStartDate() {
    return !!this.#_planStartDate ? new Date(this.#_planStartDate) : null;
  }
  // set planStartDate(value) {
  //   this.#_planStartDate = value;
  // }

  /**
   * 終了予定日
   */
  #_planEndDate;
  get planEndDate() {
    return !!this.#_planEndDate ? new Date(this.#_planEndDate) : null;
  }
  // set planEndDate(value) {
  //   this.#_planEndDate = value;
  // }

  /**
   * 開始日
   */
  #_startDate;
  get startDate() {
    return !!this.#_startDate ? new Date(this.#_startDate) : null;
  }
  // set startDate(value) {
  //   this.#_startDate = value;
  // }

  /**
   * 終了日
   */
  #_endDate;
  get endDate() {
    return !!this.#_endDate ? new Date(this.#_endDate) : null;
  }
  // set endDate(value) {
  //   this.#_endDate = value;
  // }

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
    idOrTask,
    scheduleId,
    name,
    planStartDate,
    planEndDate,
    startDate,
    endDate
  ) {
    //  コンストラクタパラメータの調整
    const initValue = !scheduleId
      ? {
          id: idOrTask.id,
          name: idOrTask.name,
          scheduleId: idOrTask.scheduleId,
          planStartDate: df.formatDate(idOrTask.planStartDate, "-"),
          planEndDate: df.formatDate(idOrTask.planEndDate, "-"),
          startDate: df.formatDate(idOrTask.startDate, "-"),
          endDate: df.formatDate(idOrTask.endDate, "-"),
        }
      : {
          id: idOrTask,
          name,
          scheduleId,
          planStartDate: df.formatDate(planStartDate, "-"),
          planEndDate: df.formatDate(planEndDate, "-"),
          startDate: df.formatDate(startDate, "-"),
          endDate: df.formatDate(endDate, "-"),
        };

    super(initValue.id, initValue.name);

    this.#_scheduleId = initValue.scheduleId;
    this.#_planStartDate = initValue.planStartDate;
    this.#_planEndDate = initValue.planEndDate;
    this.#_startDate = initValue.startDate;
    this.#_endDate = initValue.endDate;
  }

  /**
   * 開始日を登録する
   * @param {*} startDate
   */
  setStartTask(startDate) {
    return new Task(
      this.id,
      this.scheduleId,
      this.name,
      this.planStartDate,
      this.planEndDate,
      startDate,
      this.endDate
    );
  }

  /**
   * 終了日を登録する
   * @param {*} endDate
   */
  setEndTask(endDate) {
    return new Task(
      this.id,
      this.scheduleId,
      this.name,
      this.planStartDate,
      this.planEndDate,
      this.startDate,
      endDate
    );
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
  get schedules() {
    return this.#_schedules.map((v) => new Schedule(v));
  }

  /**
   * コンストラクタ
   * @param {*} scheduleCsv
   * @param {*} taskCsv
   */
  constructor(scheduleCsvOrSchedules, taskCsv) {
    if (!taskCsv) {
      this.#_schedules = scheduleCsvOrSchedules;
    } else {
      const tasks = this.#parseTaskCsv(taskCsv);
      const schedules = this.#parseScheduleCsv(scheduleCsvOrSchedules, tasks);

      this.#_schedules = schedules;
    }
  }

  /**
   * タスクCSVをパースして返す
   * @param {*} scheduleCsv
   */
  #parseTaskCsv(taskCsv) {
    const result = taskCsv
      .split("\n")
      .map(
        (v) =>
          new Task(
            v.split(",")[0],
            v.split(",")[1],
            v.split(",")[2],
            v.split(",")[3],
            v.split(",")[4],
            v.split(",")[5],
            v.split(",")[6]
          )
      );

    return result;
  }

  /**
   * スケジュールCSVをパースして返す
   * @param {*} scheduleCsv
   */
  #parseScheduleCsv(scheduleCsv, tasks) {
    const result = scheduleCsv.split("\n").map(
      (v) =>
        new Schedule(
          v.split(",")[0],
          v.split(",")[1],
          tasks.filter((t) => t.scheduleId === v.split(",")[0])
        )
    );
    return result;
  }

  //    データ取得シリーズ  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  /**
   * scheduleIdからscheduleを取得
   * @param {*} scheduleId
   */
  searchSchedule(scheduleId) {
    const targetSchedule = this.#_schedules.find((s) => s.id === scheduleId);
    return !!targetSchedule ? new Schedule(targetSchedule) : null;
  }

  /**
   * ScheduleIdとTaskIdからTaskを取得
   * @param {*} scheduleId
   * @param {*} taskId
   */
  searchTask(scheduleId, taskId) {
    const schedule = this.searchSchedule(scheduleId);
    return schedule ? schedule.searchTask(taskId) : null;
  }

  /**
   * 期間内に終了したスケジュールを取得
   */
  getSuccessfulSchedules() {
    const targetSchedule = this.#_schedules.filter((s) => s.isSuccess);
    return targetSchedule.map((v) => new Schedule(v));
  }

  /**
   * 期間内に終了したタスクを取得
   */
  getSuccessfulTasks() {
    return this.#_schedules
      .map((s) => {
        return s.tasks.filter((t) => t.isSuccess);
      })
      .flat();
  }

  //    データ登録シリーズ  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  /**
   * 開始日を登録
   * @param {*} scheduleId
   * @param {*} taskId
   * @param {*} startDate
   */
  setStartTask(scheduleId, taskId, startDate) {
    const newSchedules = this.#_schedules.map((s) =>
      s.id === scheduleId ? s.setStartTask(taskId, startDate) : s
    );
    5;
    return new ScheduleManager(newSchedules);
  }

  /**
   * 終了日を登録
   * @param {*} scheduleId
   * @param {*} taskId
   * @param {*} endDate
   */
  setEndTask(scheduleId, taskId, endDate) {
    const newSchedules = this.#_schedules.map((s) =>
      s.id === scheduleId ? s.setEndTask(taskId, endDate) : s
    );
    return new ScheduleManager(newSchedules);
  }
}

function main() {
  const scheduleCsv = df.getSheduleCsvData();
  const taskCsv = df.getTaskCsvData();

  const scheduleManager = new ScheduleManager(scheduleCsv, taskCsv);

  const setStartedManager = scheduleManager.setStartTask(
    "004",
    "108",
    "2023-03-15"
  );
  const setEndedManager = setStartedManager.setEndTask(
    "004",
    "108",
    "2023-03-15"
  );

  console.log("期限内に終えられたスケジュール一覧 ----------------");
  setEndedManager
    .getSuccessfulSchedules()
    .forEach((schedule) => console.log(schedule.toString()));

  console.log("");

  console.log("期限内に終えられたタスク一覧 ----------------");
  setEndedManager
    .getSuccessfulTasks()
    .forEach((task) => console.log(task.toString()));

  // console.log("");
  // console.log("");

  // console.log("期限内に終えられたスケジュール一覧 ----------------");
  // scheduleManager
  //   .getSuccessfulSchedules()
  //   .forEach((schedule) => console.log(schedule.toString()));

  //   console.log("");

  // console.log("期限内に終えられたタスク一覧 ----------------");
  // scheduleManager
  //   .getSuccessfulTasks()
  //   .forEach((task) => console.log(task.toString()));
}

main();
