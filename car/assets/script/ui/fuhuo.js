var storage = require("storage");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function()
    {
        this.game = cc.find("Canvas/node_gamecan").getComponent("game");
        this.res = cc.find("Canvas").getComponent("res");
        this.node.sc = this;
        this.initUI();
        
    },
    initUI: function()
    {
        this.chaoyuebg = cc.find("chaoyuebg",this.node);
        this.fuhuobg = cc.find("fuhuobg",this.node);
        //this.bclose = cc.find("close",this.node);
        //this.bclose_str = this.bclose.getComponent("cc.Label");
        this.point = cc.find("point",this.node).getComponent("cc.Label");


        this.chaoyuebg_icon = cc.find("icon",this.chaoyuebg);
        this.chaoyuebg_name = cc.find("name",this.chaoyuebg).getComponent("cc.Label");
        this.chaoyuebg_score = cc.find("score",this.chaoyuebg).getComponent("cc.Label");
        this.chaoyuebg_no = cc.find("no",this.chaoyuebg);

        this.fuhuobg_vedio = cc.find("vedio",this.fuhuobg);
        this.fuhuobg_share = cc.find("share",this.fuhuobg);
        this.fuhuobg_time = cc.find("time",this.fuhuobg).getComponent("cc.Label");


        this.point.string = cc.i18n.t('fuhuo_label_text.point')+storage.castPoint(this.game.point);
        this.chaoyuebg_score.string = cc.i18n.t('fuhuo_label_text.chaoyue_score')+"  0";
        //this.bclose_str.string = cc.i18n.t('fuhuo_label_text.close');

        var self = this;
        sdk.getChaoyueRank(function(data){
            if(data)
            {
                if(data.url && data.url.length>10)
                    self.res.loadPic(data.url,self.chaoyuebg_icon);
                self.chaoyuebg_name.string = storage.getLabelStr(data.nick,15);
                self.chaoyuebg_score.string = cc.i18n.t('fuhuo_label_text.chaoyue_score')+ " "+data.score;
            }
            else
            {
                self.chaoyuebg_icon.active = false;
                self.chaoyuebg_name.node.active = false;
                self.chaoyuebg_score.node.active = false;
                self.chaoyuebg_no.active = true;
            }
        },this.game.point);
    },

    updateUI: function()
    {
        this.timeval = 9;
        this.timedt = 0;
        this.candt = true;
    },

    show: function()
    {
        this.node.active = true;
        this.chaoyuebg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.fuhuobg.runAction(cc.sequence(
            cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
            cc.scaleTo(0.2,1).easing(cc.easeSineOut())
        ));
        this.updateUI();
    },

    hide: function()
    {
        var self = this;
        this.chaoyuebg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.18,0).easing(cc.easeSineOut())
            ));
        this.fuhuobg.runAction(cc.sequence(
            cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
            cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                self.node.destroy();
            })
        ));
    },

    click: function(event,data)
    {
        var self = this;
        if(data == "close")
        {
            var self = this;
            this.node.runAction(cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function(){
                    self.game.gameOver();
                })
            ));
            this.hide();
        }
        else if(data == "vedio")
        {
            this.candt = false;
            sdk.showVedio(function(res){
                if(res)
                {
                    self.game.fuhuo();
                    self.hide();
                }
                self.candt = true;
            });
        }
        else if(data == "share")
        {
            this.candt = false;
            sdk.share(function(res){
                if(res)
                {
                    self.game.fuhuo();
                    self.hide();
                }
                self.candt = true;
            },"fuhuo");
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    },


    update: function(dt)
    {
        if(this.timeval>0 && this.candt)
        {
            this.timedt += dt;
            if(this.timedt>=1)
            {
                this.timedt = 0;
                this.timeval -= 1;
                this.fuhuobg_time.string = this.timeval;
                this.fuhuobg_time.node.runAction(cc.sequence(
                    cc.scaleTo(0.1,1.2).easing(cc.easeSineOut()),
                    cc.scaleTo(0.1,1).easing(cc.easeSineOut())
                ));

                if(this.timeval<=0)
                {
                    this.click("","close");
                }
            }
        }
    }


    
});
