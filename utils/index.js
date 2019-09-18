var barcode = require('./barcode')
function convertlength(length) {
    return Math.round(wx.getSystemInfoSync().windowWidth * length / 750)
}
function barc(id, code, width, height) {
    barcode.code128(wx.createCanvasContext(id), code, convertlength(width), convertlength(height))
}
module.exports = {
    barcode: barc
}