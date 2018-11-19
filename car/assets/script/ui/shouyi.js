var storage = require("storage");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {
        
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        this.node.sc = this;
        this.initUI();
        
    },
    initUI: function()
    {
        this.bg = cc.find("bg",this.node);
        //this.title = cc.find("bg/title",this.node).getComponent("cc.Label");
        this.desc = cc.find("bg/desc",this.node).getComponent("cc.Label");
        this.vedio = cc.find("bg/vedio",this.node);
        this.time = cc.find("bg/time",this.node);
        this.time_str = this.time.getComponent("cc.Label");

        //this.title.string = cc.i18n.t('shouyi_label_text.title');
        this.desc.string = cc.i18n.t('shouyi_label_text.desc');
    },

    updateUI: function()
    {
        var time = storage.getShouYiTime();
        var now = new Date().getTime();
        var t = now - time;
        if(t > 24*60*60*1000)
        {
            this.vedio.active = true;
            this.time.active = false;
            this.updateTime = false;
        }
        else if(t <= 24*60*60*1000 && t >= 2*60*60*1000)
        {
            this.vedio.active = false;
            this.time.active = true;
            this.time_str.string = cc.i18n.t('main_label_text.shouyi_mingtian');
            this.updateTime = false;
        }
        else if(t < 2*60*60*1000 && t >= 0)
        {
            this.vedio.active = false;
            this.time.active = true;
            this.time_str.string = "2:00:00";
            this.updateTime = true;
            this.updateTimeDt = 0;
        }
    },

    show: function()
    {
        //this.main.wxQuanState(false);
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.updateUI();
    },

    hide: function()
    {
        //this.main.wxQuanState(true);
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
            storage.setShouYiTime(new Date().getTime());
            this.updateUI();
            this.main.updateShouYi();
        }

        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    updateShouYiTime: function(dt)
    {
        if(this.updateTime)
        {
            this.updateTimeDt += dt;
            if(this.updateTimeDt>=1)
            {
                var t = storage.getShouYiTime();
                var now = new Date().getTime();
                var time = now - t;

                if(time < 2*60*60*1000 && time > 0)
                {
                    time = 2*60*60*1000 - time;
                    var h = Math.floor(time/(60*60*1000));
                    var m = Math.floor((time - h*60*60*1000)/(60*1000));
                    var s = Math.floor(((time - h*60*60*1000 - m*60*1000))/1000);
                    var sh = h < 10 ? "0"+h : h;
                    var sm = m < 10 ? "0"+m : m;
                    var ss = s < 10 ? "0"+s : s;
                    this.time_str.string = sh+":"+sm+":"+ss;
                }
                else
                {
                    this.updateTime = false;
                    this.updateUI();
                }
            }
        }
    },

    update: function(dt)
    {
        this.updateShouYiTime(dt);
    }


    
});
