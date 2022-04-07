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
  const referenceDate = new Date(2022, 3, 18); // April 18th (months are 0 indexed in JS)
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

isMobile = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
  
