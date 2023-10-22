// *************１．タスクID108に対して開始日と終了日を設定する。
/**
 * １．タスクID108に対して開始日と終了日を設定する。
 */
const setTask108Date = () => {
  // 設定する日付
  const startDate = new Date(); //今日
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    1
  ); //来月の１日

  // 結果リスト
  const results = [];

  // taskのCSVをMapに変換
  const taskMap = taskCsv2Map(getTaskCsvData());

  // 開始日と終了日を設定する処理呼び出し
  const updateTaskMap = setStartEndDate(taskMap, "108", startDate, endDate);

  updateTaskMap.forEach((ele) => {
    results.push(ele);
  });

  //CSVに変換
  const resultcsv = results
    .map(
      (v) =>
        `${v.id},${v.scheduleId},${v.name},${v.startPlanDate},${v.endPlanDate},${v.startDate},${v.endDate}`
    )
    .join("\n");

  // 出力
  console.log("課題1");
  console.log(resultcsv);
};

/**
 * タスクの開始日と終了日を設定する
 */
const setStartEndDate = (mapData, setId, startDate, endDate) => {
  // 開始日と終了日を設定する
  const target = mapData.get(setId);
  target.startDate = formatDate(startDate, "-");
  target.endDate = formatDate(endDate, "-");

  // Mapに設定
  mapData.set(setId, target);

  // Mapを返却
  return mapData;
};

// *************２．予定期限内に完了したSchedule一覧を取得して表示する
/**
 * ２．予定期限内に完了したSchedule一覧を取得して表示する
 */
const getCompletedSchedulesWithinDeadline = () => {
  // ScheduleのCSVをMapに変換
  const scheduleMap = scheduleCsv2Map(getSheduleCsvData());

  // TaskのCSVをMapに変換
  const taskMap = taskCsv2Map(getTaskCsvData());

  // 結果リスト
  const results = [];
  const resultSchedule = [];

  // スケジュール毎にループ
  let filterList;
  let filterMap;
  let earlyStartDate;
  let earlyPlanStartDate;
  let lateEndDate;
  let latePlanEndDate;
  scheduleMap.forEach((schedule, scheduleId) => {
    // スケジュールIdでフィルタしたかったがやり方がわからないので調べて何とか出来たやり方で実施
    filterList = [...taskMap].filter(
      ([key, task]) => task.scheduleId === scheduleId
    );
    filterMap = new Map(filterList);

    // 設定用の変数を初期化
    earlyStartDate = null;
    earlyPlanStartDate = null;
    lateEndDate = null;
    latePlanEndDate = null;

    // フィルタしたタスクをみて開始日/終了日、予定開始日/予定終了日を設定する
    filterMap.forEach((ele, key) => {
      if (
        !earlyStartDate ||
        new Date(earlyStartDate) > new Date(ele.startDate)
      ) {
        earlyStartDate = ele.startDate;
      }
      if (
        !earlyPlanStartDate ||
        new Date(earlyPlanStartDate) > new Date(ele.startPlanDate)
      ) {
        earlyPlanStartDate = ele.startPlanDate;
      }
      if (!lateEndDate || new Date(lateEndDate) < new Date(ele.endDate)) {
        lateEndDate = ele.endDate;
      }
      if (
        !latePlanEndDate ||
        new Date(latePlanEndDate) < new Date(ele.endPlanDate)
      ) {
        latePlanEndDate = ele.endPlanDate;
      }
    });
    schedule.startDate = earlyStartDate;
    schedule.startPlanDate = earlyPlanStartDate;
    schedule.endDate = lateEndDate;
    schedule.endPlanDate = latePlanEndDate;

    // 結果に格納
    resultSchedule.push(schedule);
  });

  // 予定期限内に終わっているスケジュールレコードをPushする
  resultSchedule.forEach((ele) => {
    if (new Date(ele.endPlanDate) >= new Date(ele.endDate)) {
      results.push(ele);
    }
  });

  //CSVに変換
  const resultcsv = results
    .map(
      (v) =>
        `${v.id},${v.name},${v.startPlanDate},${v.endPlanDate},${v.startDate},${v.endDate}`
    )
    .join("\n");

  // 出力
  console.log("課題2");
  console.log(resultcsv);
};

// *************３．予定期限内に完了したTask一覧を取得して表示する
/**
 * ３．予定期限内に完了したTask一覧を取得して表示する
 */
const getCompletedTasksWithinDeadline = () => {
  // TaskのCSVをMapに変換
  const taskMap = taskCsv2Map(getTaskCsvData());

  // 結果リスト
  const results = [];

  // 予定期限内に終わっているタスクレコードをPushする
  taskMap.forEach((task) => {
    if (new Date(task.endPlanDate) >= new Date(task.endDate)) {
      results.push(task);
    }
  });

  //CSVに変換
  const resultcsv = results
    .map(
      (v) =>
        `${v.id},${v.scheduleId},${v.name},${v.startPlanDate},${v.endPlanDate},${v.startDate},${v.endDate}`
    )
    .join("\n");

  // 出力
  console.log("課題3");
  console.log(resultcsv);
};

// *************課題用共通処理

/**
 * タスクCSVをMap（key:id,value:taskレコード）に変換する
 */
const taskCsv2Map = (csv) => {
  const resultMap = new Map();
  // 改行コードで分割
  const lines = csv.split("\n");
  lines.forEach((line) => {
    // カンマで分割
    let cells = line.split(",");
    const tmp = {};
    cells.forEach((cell, index) => {
      tmp[taskHeader[index]] = cell;
    });
    resultMap.set(tmp.id, tmp);
  });
  return resultMap;
};

/**
 * タスクのヘッダー定義
 */
const taskHeader = [
  "id",
  "scheduleId",
  "name",
  "startPlanDate",
  "endPlanDate",
  "startDate",
  "endDate",
];

/**
 * スケジュールCSVをMap（key:id,value:scheduleレコード）に変換する
 */
const scheduleCsv2Map = (csv) => {
  const resultMap = new Map();
  // 改行コードで分割
  const lines = csv.split("\n");
  lines.forEach((line) => {
    // カンマで分割
    let cells = line.split(",");
    const tmp = {};
    cells.forEach((cell, index) => {
      tmp[scheduleHeader[index]] = cell;
    });
    resultMap.set(tmp.id, tmp);
  });
  return resultMap;
};

/**
 * スケジュールのヘッダー定義
 */
const scheduleHeader = [
  "id",
  "name",
  "startPlanDate",
  "endPlanDate",
  "startDate",
  "endDate",
];

// *************xx-定義関数.js
/**
 * スケジュールのCSVデータを取得
 * @returns
 */
const getSheduleCsvData = () => {
  return [
    {
      id: "001",
      name: "アイディア出し",
    },
    {
      id: "002",
      name: "原稿作成",
    },
    {
      id: "003",
      name: "プレゼン作成",
    },
    {
      id: "004",
      name: "実践",
    },
  ]
    .map((v) => `${v.id},${v.name}`)
    .join("\n");
};

/**
 * タスクのCSVデータを取得
 * @returns
 */
const getTaskCsvData = () => {
  return [
    {
      id: "101",
      scheduleId: "001",
      name: "マインドマップ作成",
      startPlanDate: "2023-01-02",
      endPlanDate: "2023-01-10",
      startDate: "2023-01-02",
      endDate: "2023-01-08",
    },
    {
      id: "102",
      scheduleId: "001",
      name: "箇条書き作成",
      startPlanDate: "2023-01-10",
      endPlanDate: "2023-01-20",
      startDate: "2023-01-12",
      endDate: "2023-01-18",
    },
    {
      id: "103",
      scheduleId: "002",
      name: "箇条書きの書き下し",
      startPlanDate: "2023-01-20",
      endPlanDate: "2023-01-30",
      startDate: "2023-01-28",
      endDate: "2023-02-02",
    },
    {
      id: "104",
      scheduleId: "002",
      name: "文章校正",
      startPlanDate: "2023-01-30",
      endPlanDate: "2023-02-10",
      startDate: "2023-02-05",
      endDate: "2023-02-11",
    },
    {
      id: "105",
      scheduleId: "003",
      name: "スライドテンプレートの作成",
      startPlanDate: "2023-02-10",
      endPlanDate: "2023-02-20",
      startDate: "2023-02-12",
      endDate: "2023-02-09",
    },
    {
      id: "106",
      scheduleId: "003",
      name: "スライド作成",
      startPlanDate: "2023-02-20",
      endPlanDate: "2023-02-28",
      startDate: "2023-02-10",
      endDate: "2023-02-18",
    },
    {
      id: "107",
      scheduleId: "004",
      name: "プレゼン練習",
      startPlanDate: "2023-02-28",
      endPlanDate: "2023-03-10",
      startDate: "2023-02-20",
      endDate: "2023-03-14",
    },
    {
      id: "108",
      scheduleId: "004",
      name: "当日実演",
      startPlanDate: "2023-03-15",
      endPlanDate: "2023-03-15",
      startDate: "",
      endDate: "",
    },
  ]
    .map(
      (v) =>
        `${v.id},${v.scheduleId},${v.name},${v.startPlanDate},${v.endPlanDate},${v.startDate},${v.endDate}`
    )
    .join("\n");
};

/**
 * Date型をYYYY/MM/DDにする
 * @param {*} date
 * @returns
 */
const formatDate = (date, split = "/") => {
  if (!date) return ``;
  if (typeof date === "undefined") return ``;

  if (typeof date === "string") {
    date = new Date(date);
  }

  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  return year + split + month + split + day;
};
