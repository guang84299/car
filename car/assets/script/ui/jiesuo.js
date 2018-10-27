/**
 * Created by guang on 18/7/19.
 */
var storage = require("storage");
var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        fishbg: {
            type: cc.Node,
            default: null
        },
        guang: {
            type: cc.Node,
            default: null
        }
        
    },

    onLoad: function() {
        this.game = cc.find("Canvas").getComponent("game");
        this.res = cc.find("Canvas").getComponent("res");

        this.initUI();
    },

    initUI: function()
    {
        this.guang.runAction(cc.repeatForever(cc.rotateBy(1,180)));
    },

    updateUI: function()
    {
        var maxFishId = storage.getMaxFish();
        this.fishbg.destroyAllChildren();

        var fish = cc.instantiate(this.res.fishs[maxFishId-1]);
        this.fishbg.addChild(fish);
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