

console.log("")


console.log("momentjs ------------------------------")
const moment = require("moment")

const momentNow = moment()
console.log(`momentNow : ${momentNow.format('YYYY/MM/DD')}`)

const momentNowPlus3day = momentNow.add(3, "days");
console.log(`momentNow : ${momentNow.format('YYYY/MM/DD')}`)
console.log(`momentNowPlus3day : ${momentNowPlus3day.format('YYYY/MM/DD')}`)


console.log("")



console.log("dayjs ------------------------------")

const dayjs = require("dayjs")

const dayNow = dayjs()
console.log(`dayNow : ${dayNow.format('YYYY/MM/DD')}`)

const dayNowPlus3day = dayNow.add(3, "days");
console.log(`dayNow : ${dayNow.format('YYYY/MM/DD')}`)
console.log(`dayNowPlus3day : ${dayNowPlus3day.format('YYYY/MM/DD')}`)

console.log("")

