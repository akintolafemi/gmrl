export default function ToDateTime(secs) {
  let dateTimeObj = {};
  try {
    const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    var fullDT = new Date(1970, 0, 1); // Epoch
    fullDT.setSeconds(secs);
    dateTimeObj.fullDT = fullDT;
    var date = new Date(fullDT);
    var year = date.getFullYear();
    dateTimeObj.year = year;
    var monthNumber = date.getMonth() + 1;
    dateTimeObj.monthNumber = monthNumber;
    dateTimeObj.month = monthsArray[monthNumber - 1];
    var day = date.getDate();
    dateTimeObj.day = day;
    let currentYr = new Date().getFullYear();
    currentYr = parseInt(currentYr);
    year = parseInt(year);
    var age = currentYr - year;
    dateTimeObj.age = age;
    return dateTimeObj;
  } catch (error) {
    console.log(error.message);
  }
  return
}
