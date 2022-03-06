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

function getCurrLocalDateString()
{
  var now = new Date()
  var dd = String(now.getDate()).padStart(2, '0')
  var mm = String(now.getMonth() + 1).padStart(2, '0')
  var yyyy = now.getFullYear()
  var dateString = "" + yyyy + "-" + mm + "-" + dd
  return dateString
}
