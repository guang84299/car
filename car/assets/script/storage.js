/**
 * Created by guang on 18/7/19.
 */
module.exports = {

    setFirst: function(first)
    {
        cc.sys.localStorage.setItem("first",first);
    },

    getFirst: function()
    {
        var first = cc.sys.localStorage.getItem("first");
        first = first ? first : 0;
        return Number(first);
    },

    setPoint: function(point)
    {
        cc.sys.localStorage.setItem("point",point);
    },

    getPoint: function()
    {
        var point = cc.sys.localStorage.getItem("point");
        point = point ? point : 0;
        return Number(point);
    }
};