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
const formatDate = (date, split='/') => {
  
  if(!date) return ``;
  if(typeof date === 'undefined') return ``;

  if(typeof date === 'string'){
    date = new Date(date)
  }


  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  return year + split + month + split + day;
}

module.exports = {
  getSheduleCsvData,
  getTaskCsvData,
  formatDate
};
