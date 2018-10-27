/**
 * Created by guang on 18/7/19.
 */
var storage = require("storage");
var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        
        
    },

    onLoad: function() {
        this.game = cc.find("Canvas").getComponent("game");
        this.res = cc.find("Canvas").getComponent("res");

        this.initUI();
    },

    initUI: function()
    {
        
    },

    updateUI: function()
    {
        
    },


    click: function(event,data)
    {
        if(data == "close")
        {
            this.close();
        }

        cc.log(data);
    },

    open: function()
    {
        this.node.active = true;
        this.updateUI();
    },

    close: function()
    {
        this.node.active = false;
    }


});