interface IDotNetFormatOptions {
    abbreviatedDayNames: string[];
    abbreviatedMonthNames: string[];
    dayNames: string[];
    monthNames: string[];
    amDesignator: string;
    pmDesignator: string;
    timeSeparator: string;
}

interface Date {
    toDotNetFormat(fmt: string, options?: IDotNetFormatOptions): string;
}

var defaults: IDotNetFormatOptions = {
    abbreviatedDayNames: [ 
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" 
    ],
    abbreviatedMonthNames: [ 
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
        "Aug", "Sep", "Oct", "Nov", "Dec" 
    ],
    dayNames: [ 
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday" 
    ],
    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 
        'December'
    ],
    amDesignator: "AM",
    pmDesignator: "PM",
    timeSeparator: ":"
}

Date.prototype.toDotNetFormat = function (fmt: string, options: IDotNetFormatOptions): string {

    options = Object.assign({}, defaults, options);

    var wordSplitter = /\w+/gi, _date = this;
    var _format = function (fmt: string): string {
        var tokenisedFmt = (fmt + "").replace(wordSplitter, "{{$&}}")
        var tokenSplitter = /\W+/gi;
        var words = tokenisedFmt.split(tokenSplitter);
        words.forEach(function(word: string) {
            if(word !== "") {
                if (typeof(wordReplacer[word]) === "function") {
                    tokenisedFmt = tokenisedFmt.replace(`{{${word}}}`, wordReplacer[word]() );
                }
                else {
                    wordReplacer['e'](word);
                }
            }
        });
        return tokenisedFmt.replace(/\s+(?=\b(?:st|nd|rd|th)\b)/g, "");
    };
    var wordReplacer: any = {
        //The day of the month, from 1 through 31. (eg. 5/1/2014 1:45:30 PM, Output: 1)
        d : function() {
            return _date.getDate();
        },
        //The day of the month, from 01 through 31. (eg. 5/1/2014 1:45:30 PM, Output: 01)
        dd : function() {
            return _padZeroLeft(_date.getDate(),2);
        },
        //The abbreviated name of the day of the week. (eg. 5/15/2014 1:45:30 PM, Output: Mon)
        ddd : function() {
            return options.abbreviatedDayNames[_date.getDay()];
        },
        //The full name of the day of the week. (eg. 5/15/2014 1:45:30 PM, Output: Monday)
        dddd : function() {
            return options.dayNames[_date.getDay()];
        },
        //The tenths of a second in a date and time value. (eg. 5/15/2014 13:45:30.617, Output: 6)
        f : function() {
            return parseInt("" + (_date.getMilliseconds() / 100)) ;
        },
        //The hundredths of a second in a date and time value.  
        //(e.g., 5/15/2014 13:45:30.617, Output: 61)
        ff : function() {
            return parseInt("" + (_date.getMilliseconds() / 10)) ;
        },
        //The milliseconds in a date and time value. (eg. 5/15/2014 13:45:30.617, Output: 617)
        fff : function() {
            return _date.getMilliseconds() ;
        },
        //If non-zero, The tenths of a second in a date and time value. 
        //(eg. 5/15/2014 13:45:30.617, Output: 6)
        F : function() {
            return (_date.getMilliseconds() / 100 > 0) ? parseInt("" + (_date.getMilliseconds() / 100)) : '' ;
        },
        //If non-zero, The hundredths of a second in a date and time value.  
        //(e.g., 5/15/2014 13:45:30.617, Output: 61)
        FF : function() {
            return (_date.getMilliseconds() / 10 > 0) ? parseInt("" + (_date.getMilliseconds() / 10)) : '' ;
        },
        //If non-zero, The milliseconds in a date and time value. 
        //(eg. 5/15/2014 13:45:30.617, Output: 617)
        FFF : function() {
            return (_date.getMilliseconds() > 0) ? _date.getMilliseconds() : '' ;
        },
        //The hour, using a 12-hour clock from 1 to 12. (eg. 5/15/2014 1:45:30 AM, Output: 1)
        h : function() {
            return _date.getHours() % 12 || 12;
        },
        //The hour, using a 12-hour clock from 01 to 12. (eg. 5/15/2014 1:45:30 AM, Output: 01)
        hh : function() {
            return _padZeroLeft(_date.getHours() % 12 || 12, 2);
        },
        //The hour, using a 24-hour clock from 0 to 23. (eg. 5/15/2014 1:45:30 AM, Output: 1)
        H : function() {
            return _date.getHours();
        },
        //The hour, using a 24-hour clock from 00 to 23. (eg. 5/15/2014 1:45:30 AM, Output: 01)
        HH : function() {
            return _padZeroLeft(_date.getHours(),2);
        },
        //The minute, from 0 through 59. (eg. 5/15/2014 1:09:30 AM, Output: 9
        m : function() {
             return _date.getMinutes();
        },
        //The minute, from 00 through 59. (eg. 5/15/2014 1:09:30 AM, Output: 09
        mm : function() {
            return _padZeroLeft(_date.getMinutes(),2);
        },
        //The month, from 1 through 12. (eg. 5/15/2014 1:45:30 PM, Output: 6
        M : function() {
            return _date.getMonth() + 1;
        },
        //The month, from 01 through 12. (eg. 5/15/2014 1:45:30 PM, Output: 06
        MM : function() {
            return _padZeroLeft(_date.getMonth() + 1,2);
        },
        //The abbreviated name of the month. (eg. 5/15/2014 1:45:30 PM, Output: Jun
        MMM : function() {
            return options?.abbreviatedMonthNames[_date.getMonth()];
        },
        //The full name of the month. (eg. 5/15/2014 1:45:30 PM, Output: June)
        MMMM : function() {
            return options?.monthNames[_date.getMonth()];
        },
        //The second, from 0 through 59. (eg. 5/15/2014 1:45:09 PM, Output: 9)
        s : function() {
            return _date.getSeconds();
        },
        //The second, from 00 through 59. (eg. 5/15/2014 1:45:09 PM, Output: 09)
        ss : function() {
            return _padZeroLeft(_date.getSeconds(),2);
        },
        //The first character of the AM/PM designator. (eg. 5/15/2014 1:45:30 PM, Output: P)
        t : function() {
            return wordReplacer.tt().substr(0, 1);
        },
        //The AM/PM designator. (eg. 5/15/2014 1:45:30 PM, Output: PM)
        tt : function() {
            return _date.getHours() >= 12 ? options.pmDesignator : options.amDesignator;
        },
        //The year, from 0 to 99. (eg. 5/15/2014 1:45:30 PM, Output: 9)
        y : function() {
            return Number(_date.getFullYear().toString().substr(2,2));
        },
        //The year, from 00 to 99. (eg. 5/15/2014 1:45:30 PM, Output: 09)
        yy : function() {
            return _padZeroLeft(_date.getFullYear().toString().substr(2,2),2);
        },
        //The year, with a minimum of three digits. (eg. 5/15/2014 1:45:30 PM, Output: 2009)
        yyy : function() {
            var _y = Number(_date.getFullYear().toString().substr(1,2));
            return _y > 100 ? _y : _date.getFullYear();
        },
        //The year as a four-digit number. (eg. 5/15/2014 1:45:30 PM, Output: 2009)
        yyyy : function() {
            return _date.getFullYear();
        },
        //The year as a five-digit number. (eg. 5/15/2014 1:45:30 PM, Output: 02009)
        yyyyy : function() {
            return _padZeroLeft(_date.getFullYear(),5);
        },
        //Hours offset from UTC, with no leading zeros. (eg. 5/15/2014 1:45:30 PM -07:00, Output: -7)
        z : function() {
            return parseInt("" + (_date.getTimezoneOffset() / 60)); //hourse
        },
        //Hours offset from UTC, with a leading zero for a single-digit value. 
        //(e.g., 5/15/2014 1:45:30 PM -07:00, Output: -07)
        zz : function() {
            var _h: any =  parseInt("" + (_date.getTimezoneOffset() / 60)); //hourse
            if(_h < 0) _h =  '-' + _padZeroLeft(Math.abs(_h),2);
            return _h;
        },
        //Hours and minutes offset from UTC. (eg. 5/15/2014 1:45:30 PM -07:00, Output: -07:00)
        zzz : function() {
            var _h =  parseInt("" + (_date.getTimezoneOffset() / 60)); //hourse
            var _m = _date.getTimezoneOffset() - (60 * _h);
            var _hm = _padZeroLeft(_h,2) + options.timeSeparator + _padZeroLeft(Math.abs(_m),2);
            if(_h < 0) _hm =  '-' + _padZeroLeft(Math.abs(_h),2) + options.timeSeparator + _padZeroLeft(Math.abs(_m),2);
            return _hm;
        },
        //Date ordinal display from day of the date. (eg. 5/15/2014 1:45:30 PM, Output: 15th)
        st: function () {
            var _day = wordReplacer.d();
            return _day < 4 || _day > 20 && ['st', 'nd', 'rd'][_day % 10 - 1] || 'th';
        },
        e: function (method: string) {
            throw 'ERROR: Not supported method [' + method + ']';
        }
    };
    var _padZeroLeft = function (number: any, digitCount: number): string {
        if ((number = number + "").length < digitCount) {
            return new Array((++digitCount) - number.length).join('0') + number;
        }
        return number;
    }
    return _format(fmt);
}