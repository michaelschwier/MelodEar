function getUrlParamAsInt(parameter, defaultvalue) 
{
  var params = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    params[key] = value;
  });
  var urlparameter = defaultvalue;
  if(window.location.href.indexOf(parameter) > -1) {
    urlparameter = parseInt(params[parameter]);
  }
  return urlparameter;
}

function getUrlParamAsString(parameter, defaultvalue) 
{
  var params = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    params[key] = value;
  });
  var urlparameter = defaultvalue;
  if(window.location.href.indexOf(parameter) > -1) {
    urlparameter = params[parameter];
  }
  return urlparameter;
}

function getLanguage()
{
  var language = getUrlParamAsString("lang", "")
  if (language == "") {
    language = navigator.language || navigator.userLanguage;
  }
  console.log("Found language", language)
  if (language.startsWith("de")) {
    language = "de";
  }
  else {
    language = "en";
  }
  return language
}

function getCurrLocalDateTimeString()
{
  var now = new Date()
  var dd = String(now.getDate()).padStart(2, '0')
  var mm = String(now.getMonth() + 1).padStart(2, '0')
  var yyyy = now.getFullYear()
  var dateString = "" + yyyy + "-" + mm + "-" + dd
  var hours = String(now.getHours()).padStart(2, '0')
  var minutes = String(now.getMinutes()).padStart(2, '0')
  var seconds = String(now.getSeconds()).padStart(2, '0')
  var timesString = hours + ":" + minutes + ":" + seconds
  return dateString + " " + timesString
}

function getGameIndexByDateTime(dateTimeString)
{
  // const oneDay = 24 * 60 * 60 * 1000;
  const oneDay = 5 * 60 * 1000;
  const referenceDate = new Date(2022, 2, 30); // March 30th (months are 0 indexed in JS)
  const dateTime = getDateTimeInts(dateTimeString)
  // const date = new Date(dateTime[0], dateTime[1], dateTime[2])
  const date = new Date(dateTime[0], dateTime[1], dateTime[2], dateTime[3], dateTime[4], dateTime[5])
  // const diffDays = Math.round((date - referenceDate) / oneDay)
  const diffDays = Math.floor((date - referenceDate) / oneDay)
  return diffDays
}

function getDateTimeInts(dateTimeString)
{
  var dateTimeStrings = dateTimeString.split(" ")
  var dateString = dateTimeStrings[0]
  var timeString = dateTimeStrings[1]
  var dateStrings = dateString.split("-")
  var yyyy = parseInt(dateStrings[0])
  var mm = parseInt(dateStrings[1]) - 1
  var dd = parseInt(dateStrings[2])
  var timesStrings = timeString.split(":")
  var hours = parseInt(timesStrings[0])
  var minutes = parseInt(timesStrings[1])
  var seconds = parseInt(timesStrings[2])
  return [yyyy, mm, dd, hours, minutes, seconds]
}
