/**
 * Created by guang on 18/7/18.
 */
var storage = require("storage");
module.exports = {


    vibrate: function(isLong)
    {
        if(storage.getVibrate() == 1 && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS))
        {
            if(isLong)
            {
                wx.vibrateLong({});
            }
            else
            {
                wx.vibrateShort({});
            }
        }
    },

    showVedio: function(callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {

        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    share: function(callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {

        }
        else
        {
            if(callback)
                callback(true);
        }
    }
};