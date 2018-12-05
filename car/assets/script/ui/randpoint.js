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
        this.point = cc.find("bg/point",this.node).getComponent("cc.Label");

        this.vedio = cc.find("bg/vedio",this.node);
        this.ok = cc.find("bg/ok",this.node);
        this.btn_close = cc.find("bg/close",this.node);
        this.btn_close.active = false;

        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                self.btn_close.active = true;
            })
        ));

        //this.title.string = cc.i18n.t('shouyi_label_text.title');
        this.desc.string = cc.i18n.t('randpoint_label_text.desc');

        this.pointNum = 0;
        var r = Math.random();
        if(r<=0.5)
            this.pointNum = Math.floor(Math.random()*1000) + 2000;
        else if(r <= 0.8)
            this.pointNum = Math.floor(Math.random()*1000) + 3000;
        else
            this.pointNum = Math.floor(Math.random()*1000) + 4000;

        this.point.string = this.pointNum;

        storage.setPoint(storage.getPoint()+this.pointNum);
        this.main.uploadData();

        this.pointNumx2 = this.pointNum;
        this.x2 = false;
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
        if(this.isGame) this.game.state = "start";
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
                    self.pointX2();
                }
            });
        }

        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    pointX2: function()
    {
        this.x2 = true;
        this.x2Dt = 0;
        this.btn_close.active = false;
        this.vedio.active = false;

        storage.setPoint(storage.getPoint()+this.pointNum);
        this.main.uploadData();
    },

    update: function(dt)
    {
        if(this.x2)
        {
            this.x2Dt += dt;
            if(this.x2Dt > 0.1)
            {
                this.x2Dt = 0;

                if(this.pointNumx2 < this.pointNum*2)
                {
                    this.pointNumx2 += Math.floor(Math.random()*300+50);
                    if(this.pointNumx2 > this.pointNum*2)
                        this.pointNumx2 = this.pointNum*2;
                    this.point.string = this.pointNumx2;
                }
                else
                {
                    this.x2 = false;
                    this.ok.active = true;
                }
            }

        }
    }

    
});
