/**
 * Created by guang on 18/7/18.
 */
var config = require("config");
var storage = require("storage");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function() {
        this.res = cc.find("Canvas").getComponent("res");
        this.main = cc.find("Canvas").getComponent("main");
        this.node.sc = this;

        this.initUI();
        this.updateUI();
    },

    initUI: function()
    {
        this.node_gamecan = cc.find("Canvas/node_gamecan");
        this.node_center = cc.find("center",this.node);
        this.map_1 = cc.find("bg/map1",this.node);
        this.map_2 = cc.find("bg/map2",this.node);

        this.max_point = cc.find("max_point",this.node).getComponent("cc.Label");
        this.curr_point = cc.find("curr_point",this.node).getComponent("cc.Label");

        this.node_point = cc.find("pointbg/point",this.node_center).getComponent("cc.Label");

        this.node_speed = cc.find("speed",this.node_center).getComponent("cc.Button");
        this.node_speed_lv = cc.find("speed/lv",this.node_center).getComponent("cc.Label");
        this.node_speed_num = cc.find("speed/num",this.node_center).getComponent("cc.Label");
        this.node_speed_up = cc.find("speed/up",this.node_center).getComponent("cc.Button");
        this.node_speed_up_up = cc.find("speed/up/up",this.node_center);

        this.node_hit = cc.find("hit",this.node_center).getComponent("cc.Button");
        this.node_hit_lv = cc.find("hit/lv",this.node_center).getComponent("cc.Label");
        this.node_hit_num = cc.find("hit/num",this.node_center).getComponent("cc.Label");
        this.node_hit_up = cc.find("hit/up",this.node_center).getComponent("cc.Button");
        this.node_hit_up_up = cc.find("hit/up/up",this.node_center);

        this.node_hot = cc.find("hot",this.node_center).getComponent("cc.Button");
        this.node_hot_lv = cc.find("hot/lv",this.node_center).getComponent("cc.Label");
        this.node_hot_num = cc.find("hot/num",this.node_center).getComponent("cc.Label");
        this.node_hot_up = cc.find("hot/up",this.node_center).getComponent("cc.Button");
        this.node_hot_up_up = cc.find("hot/up/up",this.node_center);

        this.node_hp = cc.find("hp",this.node_center).getComponent("cc.Button");
        this.node_hp_lv = cc.find("hp/lv",this.node_center).getComponent("cc.Label");
        this.node_hp_num = cc.find("hp/num",this.node_center).getComponent("cc.Label");
        this.node_hp_up = cc.find("hp/up",this.node_center).getComponent("cc.Button");
        this.node_hp_up_up = cc.find("hp/up/up",this.node_center);

        this.shouyi = cc.find("shouyi",this.node);
        this.shouyi_sp = cc.find("shouyi/sp",this.node);
        this.shouyi_time = cc.find("shouyi/time",this.node);
        this.shouyi_time_str = this.shouyi_time.getComponent("cc.Label");

        this.skipgame = cc.find("skipgame",this.node);


        this.max_point.string = cc.i18n.t('over_label_text.max_point') + storage.castPoint(storage.getMaxPoint());
        this.curr_point.string = cc.i18n.t('over_label_text.curr_point') + storage.castPoint(cc.mydata.point);

        this.map_1.runAction(cc.repeatForever(cc.moveBy(13,0,-1000)));
        this.map_2.runAction(cc.repeatForever(cc.moveBy(13,0,-1000)));

        this.updateShouYi();
        this.main.uploadData();

        if(!storage.isMyCarId(2))
        {
            this.main.openYouHui();
        }

        this.skipgame.runAction(cc.repeatForever(cc.sequence(
            cc.repeat(cc.sequence(
                cc.rotateBy(0.2,20).easing(cc.easeSineOut()),
                cc.rotateBy(0.2,-40).easing(cc.easeSineOut()),
                cc.rotateBy(0.2,20).easing(cc.easeSineOut())
            ),2),
            cc.delayTime(3)
        )));
        this.skipgame.active = false;
        if(this.main.GAME.skipgame)
        {
            this.skipgame.active = this.main.GAME.skipgame.state ? true : false;
            this.res.loadPic(this.main.GAME.skipgame.pic,this.skipgame);
        }
    },

    updateUI: function()
    {
        this.node_point.string = cc.i18n.t('main_label_text.point_total') + storage.castPoint(storage.getPoint());

        this.node_speed_lv.string = "LV "+(storage.getSpeedLv()+1);
        this.node_hit_lv.string = "LV "+(storage.getHitLv()+1);
        this.node_hot_lv.string = "LV "+(storage.getHotLv()+1);
        this.node_hp_lv.string = "LV "+(storage.getHpLv()+1);

        var point = storage.getPoint();

        if(storage.getSpeedLv()<config.myCarUp.length-1)
        {
            var cost = config.myCarUp[storage.getSpeedLv()+1].cost;
            this.node_speed_num.string = storage.castPoint(cost);
            this.node_speed.interactable = (point>=cost);
            this.node_speed_up.interactable = this.node_speed.interactable;

            this.node_speed_up_up.x = -40;
            this.res.setSpriteFrame("images/levelup/up",this.node_speed_up_up);
        }
        else
        {
            this.node_speed_num.string = "";
            this.node_speed.interactable = false;
            this.node_speed_up.interactable = false;
            this.node_speed_up_up.x = 0;
            this.res.setSpriteFrame("images/levelup/max",this.node_speed_up_up);
        }

        if(storage.getHitLv()<config.myCarHit.length-1)
        {
            var cost = config.myCarHit[storage.getHitLv()+1].cost;
            this.node_hit_num.string = storage.castPoint(cost);
            this.node_hit.interactable = (point>=cost);
            this.node_hit_up.interactable = this.node_hit.interactable;

            this.node_hit_up_up.x = -40;
            this.res.setSpriteFrame("images/levelup/up",this.node_hit_up_up);
        }
        else
        {
            this.node_hit_num.string = "";
            this.node_hit.interactable = false;
            this.node_hit_up.interactable = false;
            this.node_hit_up_up.x = 0;
            this.res.setSpriteFrame("images/levelup/max",this.node_hit_up_up);
        }

        if(storage.getHotLv()<config.myCarHot.length-1)
        {
            var cost = config.myCarHot[storage.getHotLv()+1].cost;
            this.node_hot_num.string = storage.castPoint(cost);
            this.node_hot.interactable = (point>=cost);
            this.node_hot_up.interactable = this.node_hot.interactable;

            this.node_hot_up_up.x = -40;
            this.res.setSpriteFrame("images/levelup/up",this.node_hot_up_up);
        }
        else
        {
            this.node_hot_num.string = "";
            this.node_hot.interactable = false;
            this.node_hot_up.interactable = false;
            this.node_hot_up_up.x = 0;
            this.res.setSpriteFrame("images/levelup/max",this.node_hot_up_up);
        }

        if(storage.getHpLv()<config.myCarHp.length-1)
        {
            var cost = config.myCarHp[storage.getHpLv()+1].cost;
            this.node_hp_num.string = storage.castPoint(cost);
            this.node_hp.interactable = (point>=cost);
            this.node_hp_up.interactable = this.node_hp.interactable;

            this.node_hp_up_up.x = -40;
            this.res.setSpriteFrame("images/levelup/up",this.node_hp_up_up);
        }
        else
        {
            this.node_hp_num.string = "";
            this.node_hp.interactable = false;
            this.node_hp_up.interactable = false;
            this.node_hp_up_up.x = 0;
            this.res.setSpriteFrame("images/levelup/max",this.node_hp_up_up);
        }

        var randLv = storage.getRandLv();

        if(randLv == 1)
        {
            this.node_speed_num.string = "";
            this.node_speed.interactable = true;
            this.node_speed_up.interactable = true;
            this.res.setSpriteFrame("images/levelup/vedio_up",this.node_speed_up_up);
            this.node_speed_up_up.x = 0;
        }
        else if(randLv == 2)
        {
            this.node_hit_num.string = "";
            this.node_hit.interactable = true;
            this.node_hit_up.interactable = true;
            this.res.setSpriteFrame("images/levelup/vedio_up",this.node_hit_up_up);
            this.node_hit_up_up.x = 0;
        }
        else if(randLv == 3)
        {
            this.node_hot_num.string = "";
            this.node_hot.interactable = true;
            this.node_hot_up.interactable = true;
            this.res.setSpriteFrame("images/levelup/vedio_up",this.node_hot_up_up);
            this.node_hot_up_up.x = 0;
        }
        else if(randLv == 4)
        {
            this.node_hp_num.string = "";
            this.node_hp.interactable = true;
            this.node_hp_up.interactable = true;
            this.res.setSpriteFrame("images/levelup/vedio_up",this.node_hp_up_up);
            this.node_hp_up_up.x = 0;
        }
    },

    openRank: function()
    {
       this.main.openRank();
    },

    openCarPort: function()
    {
       this.main.openCarPort();
    },

    openSetting: function()
    {
        this.main.openSetting();
    },

    openShouYi: function()
    {
        this.main.openShouYi();
    },

    click: function(event,data)
    {
        var self = this;
        if(data == "again")
        {
            var game = this.node_gamecan.getComponent("game");
            game.resetData();
            this.node.destroy();
            //cc.director.loadScene("game");
        }
        else if(data == "speedup")
        {
            this.speedup();
        }
        else if(data == "hitup")
        {
            this.hitup();
        }
        else if(data == "hotup")
        {
            this.hotup();
        }
        else if(data == "hpup")
        {
            this.hpup();
        }
        else if(data == "setting")
        {
            this.openSetting();
        }
        else if(data == "shouyi")
        {
            this.openShouYi();
        }
        else if(data == "carport")
        {
            this.openCarPort();
        }
        else if(data == "rank")
        {
            this.openRank();
        }
        else if(data == "share")
        {
            sdk.share(null,"over");
        }
        else if(data == "addspeed")
        {
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setAddSpeed(1);
                    self.updateAddSpeed();
                }
            });
        }
        else if(data == "skipgame")
        {
            sdk.skipGame(this.main.GAME.skipgame.gameid,this.main.GAME.skipgame.url);
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    speedup: function()
    {
        var randLv = storage.getRandLv();
        if(randLv == 1)
        {
            var self = this;
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setRandLv(0);
                    storage.setSpeedLv(storage.getSpeedLv()+1);
                    self.updateUI();
                    self.main.uploadData();
                    storage.playSound(self.res.audio_up);
                }
                else
                {
                    self.res.showToast("升级失败！");
                }
            });
        }
        else
        {
            var cost = config.myCarUp[storage.getSpeedLv()+1].cost;
            storage.setPoint(storage.getPoint()-cost);
            storage.setSpeedLv(storage.getSpeedLv()+1);
            this.updateUI();
            this.main.uploadData();
            storage.playSound(this.res.audio_up);
        }
    },

    hitup: function()
    {
        var randLv = storage.getRandLv();
        if(randLv == 2)
        {
            var self = this;
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setRandLv(0);
                    storage.setHitLv(storage.getHitLv()+1);
                    self.updateUI();
                    self.main.uploadData();
                    storage.playSound(self.res.audio_up);
                }
                else
                {
                    self.res.showToast("升级失败！");
                }
            });
        }
        else
        {
            var cost = config.myCarHit[storage.getHitLv()+1].cost;
            storage.setPoint(storage.getPoint()-cost);
            storage.setHitLv(storage.getHitLv()+1);
            this.updateUI();
            this.main.uploadData();
            storage.playSound(this.res.audio_up);
        }
    },

    hotup: function()
    {
        var randLv = storage.getRandLv();
        if(randLv == 3)
        {
            var self = this;
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setRandLv(0);
                    storage.setHotLv(storage.getHotLv()+1);
                    self.updateUI();
                    self.main.uploadData();
                    storage.playSound(self.res.audio_up);
                }
                else
                {
                    self.res.showToast("升级失败！");
                }
            });
        }
        else
        {
            var cost = config.myCarHot[storage.getHotLv()+1].cost;
            storage.setPoint(storage.getPoint()-cost);
            storage.setHotLv(storage.getHotLv()+1);
            this.updateUI();
            this.main.uploadData();
            storage.playSound(this.res.audio_up);
        }
    },

    hpup: function()
    {
        var randLv = storage.getRandLv();
        if(randLv == 4)
        {
            var self = this;
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setRandLv(0);
                    storage.setHpLv(storage.getHpLv()+1);
                    self.updateUI();
                    self.main.uploadData();
                    storage.playSound(self.res.audio_up);
                }
                else
                {
                    self.res.showToast("升级失败！");
                }
            });
        }
        else
        {
            var cost = config.myCarHp[storage.getHpLv()+1].cost;
            storage.setPoint(storage.getPoint()-cost);
            storage.setHpLv(storage.getHpLv()+1);
            this.updateUI();
            this.main.uploadData();
            storage.playSound(this.res.audio_up);
        }
    },

    updateShouYi: function()
    {
        var time = storage.getShouYiTime();
        var now = new Date().getTime();
        var t = now - time;
        if(t > 24*60*60*1000)
        {
            this.shouyi.getComponent("cc.Button").interactable = true;
            this.res.setSpriteFrame("images/shouyi/zi_x2",this.shouyi_sp);
            this.shouyi_time.active = false;

            this.shouyi.updateTime = false;
        }
        else if(t <= 24*60*60*1000 && t >= 2*60*60*1000)
        {
            this.shouyi.getComponent("cc.Button").interactable = false;
            this.res.setSpriteFrame("images/shouyi/zi_moring",this.shouyi_sp);
            this.shouyi_time.active = false;

            this.shouyi.updateTime = false;
        }
        else if(t < 2*60*60*1000 && t >= 0)
        {
            this.shouyi.getComponent("cc.Button").interactable = false;
            this.res.setSpriteFrame("images/shouyi/box_time",this.shouyi_sp);
            this.shouyi_time.active = true;
            this.shouyi_time_str.string = "2:00:00";

            this.shouyi.updateTime = true;
            this.shouyi.updateTimeDt = 0;
        }
    },

    updateShouYiTime: function(dt)
    {
        if(this.shouyi.updateTime)
        {
            this.shouyi.updateTimeDt += dt;
            if(this.shouyi.updateTimeDt>=1)
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
                    this.shouyi_time_str.string = sh+":"+sm+":"+ss;
                }
                else
                {
                    this.shouyi.updateTime = false;
                    this.updateShouYi();
                }
            }
        }
    },

    updateAddSpeed: function()
    {
        this.node_addspeed = cc.find("addspeed",this.node);
        if(storage.getAddSpeed())
        {
            this.res.setSpriteFrame("images/main/addspeed_2",this.node_addspeed);
        }
        else
        {
            this.res.setSpriteFrame("images/main/addspeed_1",this.node_addspeed);
        }
    },

    update: function(dt) {
        this.updateShouYiTime(dt);


        if(this.map_1.y < -2000)
        {
            this.map_1.y = 2000;
        }

        if(this.map_2.y < -2000)
        {
            this.map_2.y = 2000;
        }
    }
});