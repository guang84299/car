var storage = require("storage");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {
        this.main = cc.find("Canvas").getComponent("main");
        this.game = cc.find("Canvas/node_gamecan").getComponent("game");
        this.res = cc.find("Canvas").getComponent("res");
        this.node.sc = this;
        this.initUI();
        
    },
    initUI: function()
    {
        this.bg = cc.find("bg",this.node);
        //this.title = cc.find("bg/title",this.node).getComponent("cc.Label");
        this.hand_1 = cc.find("bg/hand_1",this.node);
        this.hand_2 = cc.find("bg/hand_2",this.node);
        this.sel = cc.find("bg/sel",this.node);
        this.btn_close = cc.find("bg/close",this.node);
        //this.btn_close.active = false;
        //
        //var self = this;
        //this.node.runAction(cc.sequence(
        //    cc.delayTime(1),
        //    cc.callFunc(function(){
        //        self.btn_close.active = true;
        //    })
        //));

        this.hand_1.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.5,0,-50),
            cc.moveBy(0.1,0,50)
        )));
        this.hand_2.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.5,0,-50),
            cc.moveBy(0.1,0,50)
        )));

        //this.title.string = cc.i18n.t('shouyi_label_text.title');
    },

    updateUI: function()
    {

    },

    show: function(isGame)
    {
        this.isGame = isGame;
        if(isGame) this.game.state = "pause";
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.updateUI();
    },

    hide: function()
    {
        if(this.isGame)
        {
            this.game.state = "start";
        }
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                    if(storage.getAddSpeed() == 0)
                    {
                        self.main.openAddSpeed(true);
                    }
                })
            ));
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            storage.setYinDao(1);
            this.hide();
        }
        else if(data == "sel")
        {
            storage.setYinDao(2);
            this.hide();
        }

        storage.playSound(this.res.audio_button);
        cc.log(data);
    }

    
});
