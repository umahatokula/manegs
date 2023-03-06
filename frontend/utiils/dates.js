export const getCurrentEpoch = () => {
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    return secondsSinceEpoch;
};

export const getCustomDateEpoch = (date) => {
    var someDate = new Date(date);

    return someDate.getTime();
};

export const getCustomDateEpochFromDateAndTime = (date, time) => {
    const concatenatedDate = date + ' ' + time;

    let dateObj = new Date(concatenatedDate);
    let epochTime = dateObj.getTime();
    
    return epochTime;
}

export function epochToHumanReadable(epoch) {
    let x = Number(epoch)
    const date = new Date(x);
    return date.toDateString();
}

/*
* Convert the epoch (unix) timestamp to a readable format.
*/
export function epochToHumanReadableTime(epochTimeStamp) {
    var d = new Date(epochTimeStamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = d.getFullYear();
    var month = months[d.getMonth()];
    var date = d.getDate();
    var hour = d.getHours();
    var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    var time = hour + ':' + min + ':' + sec ;

    return time
}

export function convertEpochToSpecificTimezone(timeEpoch, offset){
    var d = new Date(timeEpoch);
    console.log("🚀 ~ file: dates.js:46 ~ convertEpochToSpecificTimezone ~ d:", d)
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    console.log("🚀 ~ file: dates.js:48 ~ convertEpochToSpecificTimezone ~ utc:", utc)
    var nd = new Date(utc + (3600000*offset));
    console.log("🚀 ~ file: dates.js:50 ~ convertEpochToSpecificTimezone ~ nd:", nd)
    return nd.toLocaleString();
}