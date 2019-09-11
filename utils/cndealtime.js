const moment = require('moment.min.js');
function timestampToString(timestamp,format) {
    moment.locale('en', {
        longDateFormat: {
            l: "YYYY-MM"
        }
    });
    return moment(timestamp).format('l');
}
module.exports = {
    timestampToString: timestampToString,
    moment: moment
}