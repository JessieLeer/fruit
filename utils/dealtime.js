const moment = require('moment.min.js');
export default function timestampToString(timestamp,format) {
    moment.locale('en', {
        longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm:ss"
        }
    });
    return moment(timestamp).format('l');
}
