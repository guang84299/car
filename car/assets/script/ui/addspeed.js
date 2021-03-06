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
        this.desc = cc.find("bg/desc",this.node).getComponent("cc.Label");
        this.guang = cc.find("bg/guang",this.node);
        this.vedio = cc.find("bg/vedio",this.node);
        this.btn_close = cc.find("bg/close",this.node);
        this.btn_close.active = false;

        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                self.btn_close.active = true;
            })
        ));

        this.guang.runAction(cc.repeatForever(cc.rotateBy(1,180)));

        //this.title.string = cc.i18n.t('shouyi_label_text.title');
        this.desc.string = cc.i18n.t('addspeed_label_text.desc');
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
            this.game.myCar.sc.addSpeed();
        }
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "vedio")
        {
            var self = this;
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setAddSpeed(1);
                    self.hide();
                }
            });
        }

        storage.playSound(this.res.audio_button);
        cc.log(data);
    }

    
});
