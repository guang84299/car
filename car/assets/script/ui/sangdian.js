/**
 * Created by guang on 18/7/19.
 */
var storage = require("storage");
var config = require("config");
cc.Class({
    extends: cc.Component,

    properties: {
        node_game_scroll: {
            type: cc.Node,
            default: null
        },
        coin: {
            type: cc.Node,
            default: null
        },
        item: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function() {
        this.game = cc.find("Canvas").getComponent("game");
        this.res = cc.find("Canvas").getComponent("res");
        this.items = [];

        this.initUI();
    },

    initUI: function()
    {
        this.coinnum = this.coin.getComponent("cc.Label");

        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this;
        eventHandler.handler = "click";
        eventHandler.component = "sangdian";
        eventHandler.customEventData = "item";

        var maxFishId = storage.getMaxFish();

        for(var i=1;i<this.res.fishs.length;i++)
        {
            var item = cc.instantiate(this.item);
            var fish = cc.find("fish",item);
            var add = cc.find("add",item);
            var add2 = cc.find("add2",item);
            var sp = cc.find("sp",add);
            var coin = cc.find("coin",sp);
            add.tag = i;
            add.getComponent("cc.Button").clickEvents.push(eventHandler);
            if(i<maxFishId)
            {
                add.active = true;
                add2.active = false;
                if(i != 0)
                {
                    fish.color = cc.color(255,255,255);
                    fish.opacity = 255;
                    fish.getComponent("cc.Sprite").spriteFrame = cc.instantiate(this.res.fishs[i]).getComponent("cc.Sprite").spriteFrame;
                    fish.scale = config.fish_max_width/fish.width;
                    var cost = storage.getFishPice(i+1);
                    if(cost == 0)
                    {
                        var coins = config.values[i-1]*config.people;
                        cc.log(coins);
                        cc.log(config.ratio*Math.pow(config.grow,storage.getFishBuy(i+1)));
                        cost = coins*config.ratio*Math.pow(config.grow,i-1) * Math.pow(config.fudu,storage.getFishBuy(i+1));
                        cc.log(cost);
                        storage.setFishPice(i+1,cost);
                    }
                    coin.getComponent("cc.Label").string = storage.castCoin(cost);
                    sp.x = -coin.width/2;
                }
            }
            else
            {
                add.active = false;
                add2.active = true;
                fish.color = cc.color(0,0,0);
                fish.opacity = 125;
                fish.getComponent("cc.Sprite").spriteFrame = cc.instantiate(this.res.fishs[i]).getComponent("cc.Sprite").spriteFrame;
                fish.scale = config.fish_max_width/fish.width;
            }
            this.items.push(item);
            this.node_game_scroll.addChild(item);
        }
    },

    updateUI: function()
    {
        this.coinnum.string = storage.castCoin(storage.getCoin());
        var maxFishId = storage.getMaxFish();
        for(var i=1;i<this.res.fishs.length;i++)
        {
            var item = this.items[i-1];
            var fish = cc.find("fish",item);
            var add = cc.find("add",item);
            var add2 = cc.find("add2",item);
            var sp = cc.find("sp",add);
            var coin = cc.find("coin",sp);
            var dian = cc.find("dian",add);
            var buy = storage.getFishBuy(i+1);
            if(buy == 0)
                dian.active = true;
            else
                dian.active = false;
            if(i<maxFishId)
            {
                add.active = true;
                add2.active = false;
                fish.color = cc.color(255,255,255);
                fish.opacity = 255;
                var cost = storage.getFishPice(i+1);
                if(cost == 0)
                {
                    var coins = config.values[i-1]*config.people;
                    cost = coins*config.ratio*Math.pow(config.grow,i-1) * Math.pow(config.fudu,storage.getFishBuy(i+1));
                    storage.setFishPice(i+1,cost);
                }
                coin.getComponent("cc.Label").string = storage.castCoin(cost);
                sp.x = -coin.width/2;
            }
            else
            {
                add.active = false;
                add2.active = true;
                fish.color = cc.color(0,0,0);
                fish.opacity = 125;
            }
        }
    },

    click: function(event,data)
    {
        if(data == "close_sangdian")
        {
            this.close();
        }
        else if(data == "item")
        {
            this.game.addYuByFishId(event.target.tag+1);
            this.updateUI();
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