/**
 * Created by guang on 18/7/18.
 */
 var storage = require("storage");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function() {

        if(storage.getFirst() == 0)
        {
            storage.setFirst(1);
        }

    },

    initUI: function()
    {

    },

    click: function(event,data)
    {
        if(data == "start")
        {
            cc.director.loadScene("game");
        }
        cc.log(data);
    },

    update: function(dt) {

    }
});