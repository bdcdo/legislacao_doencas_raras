/**
 * DHTML date validation script for dd/mm/yyyy. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
// Declaring valid date character, minimum year and maximum year
var dtCh= "/";
var minYear=1980;
var maxYear=2100;

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary (year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
   } 
   return this
}

function compareDate(dtStr1, dtStr2){
	var pos1=dtStr1.indexOf(dtCh)
	var pos2=dtStr1.indexOf(dtCh,pos1+1)

	var strDay=dtStr1.substring(0,pos1)
	if (strDay.length == 1) strDay = "0" + strDay;
	var strMonth=dtStr1.substring(pos1+1,pos2)
	if (strMonth.length == 1) strMonth = "0" + strMonth;
	var strYear=dtStr1.substring(pos2+1)

	var data1 = strYear + strMonth + strDay;
	
	pos1=dtStr2.indexOf(dtCh)
	pos2=dtStr2.indexOf(dtCh,pos1+1)

	strDay=dtStr2.substring(0,pos1)
	if (strDay.length == 1) strDay = "0" + strDay;
	strMonth=dtStr2.substring(pos1+1,pos2)
	if (strMonth.length == 1) strMonth = "0" + strMonth;
	strYear=dtStr2.substring(pos2+1)

	var data2 = strYear + strMonth + strDay;

	if (data1 > data2) 
		return false;
	return true;
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12)
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)
	var strDay=dtStr.substring(0,pos1)
	var strMonth=dtStr.substring(pos1+1,pos2)
	var strYear=dtStr.substring(pos2+1)
	strYr=strYear
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		alert("O formato da data deve ser: dd/mm/aaaa")
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		alert("Informe um mês válido.")
		return false
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		alert("Informe um dia válido.")
		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		alert("Informe um ano válido entre "+minYear+" e "+maxYear)
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		alert("Informe uma data válida")
		return false
	}
return true
}
function inverteData(dtStr){
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)

	var strDay=dtStr.substring(0,pos1)
	if (strDay.length == 1) strDay = "0" + strDay;
	var strMonth=dtStr.substring(pos1+1,pos2)
	if (strMonth.length == 1) strMonth = "0" + strMonth;
	var strYear=dtStr.substring(pos2+1)

	return (strYear + strMonth + strDay);
}

