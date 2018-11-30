/**
 * Created by guang on 18/7/18.
 */
var config = require("config");
var storage = require("storage");
var qianqista = require("qianqista");
var sdk = require("sdk");
var i18n = require('LanguageData');
i18n.init('zh');

cc.i18n = i18n;
cc.mydata={};
cc.qianqista = qianqista;

cc.Class({
    extends: cc.Component,

    properties: {
        node_setting: {
            default: null,
            type: cc.Prefab
        },
        node_shouyi: {
            default: null,
            type: cc.Prefab
        },
        node_over: {
            default: null,
            type: cc.Prefab
        },
        node_carport: {
            default: null,
            type: cc.Prefab
        },
        node_rank: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function() {
        this.res = cc.find("Canvas").getComponent("res");
        this.qianqista = qianqista;
        this.GAME = {};
        if(storage.getFirst() == 0)
        {
            storage.setFirst(1);
            storage.setMusic(1);
            storage.setSound(1);
            storage.setVibrate(1);
            storage.addMyCarIds(0);
        }
        //storage.playMusic(this.res.audio_mainBGM);

        this.initData();

        this.initUI();
        this.updateUI();

        //cc.game.addPersistRootNode(this.node);
        cc.game.setFrameRate(60);
        //cc.debug.setDisplayStats(true);
        //storage.setSpeedLv(0);
        //storage.setPoint(10000);

        //storage.setShouYiTime(new Date().getTime()-2*60*60*1000);


        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            BK.Script.logToConsole = 1;
            //var data = JSON.stringify(BK.Director.fps);
            //BK.Director.tickerSetInterval = 2;
            //BK.Director.tickerSetInterval(2);
        }
        var score = storage.getMaxPoint();
        sdk.uploadScore(score,this.initNet.bind(this));
        sdk.showBanner();
    },

    initNet: function()
    {
        var self = this;
        qianqista.init("4599","疯狂漂移",function(){
            qianqista.datas(function(res){
                console.log('my datas:', res);
                if(res.state == 200)
                {
                    self.updateLocalData(res.data);
                }
            });
            qianqista.pdatas(function(res){
                self.updateLocalData2(res);
            });
            qianqista.rankScore(function(res){
                self.worldrank = res.data;
            });
        });

        qianqista.control(function(res){
            console.log('my control:', res);
            if(res.state == 200)
            {
                self.GAME.control = res.data;
                self.updateUIControl();

            }
        });

        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            BK.Script.log(1,1,'---------qianqista.init：');
            BK.onEnterForeground(function(){
                BK.Script.log(1,1,"---onEnterForeground----");

                //storage.playMusic(self.res.audio_bgm);
            });
        }
    },

    updateData: function()
    {
        var self = this;
        qianqista.datas(function(res){
            if(res.state == 200)
            {
                self.updateLocalData(res.data);
            }
        });
    },

    updateLocalData: function(data)
    {
        if(data)
        {
            var datas = JSON.parse(data);
            if(datas.hasOwnProperty("first"))
                storage.setFirst(1);
            if(datas.hasOwnProperty("point"))
                storage.setPoint(Number(datas.point));
            if(datas.hasOwnProperty("maxpoint"))
                storage.setMaxPoint(Number(datas.maxpoint));
            if(datas.hasOwnProperty("speedlv"))
                storage.setSpeedLv(Number(datas.speedlv));
            if(datas.hasOwnProperty("hitlv"))
                storage.setHitLv(Number(datas.hitlv));
            if(datas.hasOwnProperty("hotlv"))
                storage.setHotLv(Number(datas.hotlv));
            if(datas.hasOwnProperty("hplv"))
                storage.setHpLv(Number(datas.hplv));
            if(datas.hasOwnProperty("mycarId"))
                storage.setMyCarId(Number(datas.mycarId));
            if(datas.hasOwnProperty("mycarIds"))
                storage.setMyCarIds(datas.mycarIds);
            if(datas.hasOwnProperty("shouyi_time"))
                storage.setShouYiTime(Number(datas.shouyi_time));
            if(datas.hasOwnProperty("login_time"))
                storage.setLoginTime(Number(datas.login_time));
            if(datas.hasOwnProperty("login_day"))
                storage.setLoginDay(Number(datas.login_day));
            if(datas.hasOwnProperty("game_num"))
                storage.setGameNum(Number(datas.game_num));
            if(datas.hasOwnProperty("killcar_num"))
                storage.setKillCarNum(Number(datas.killcar_num));
            if(datas.hasOwnProperty("randlv"))
                storage.setRandLv(Number(datas.randlv));
            if(datas.hasOwnProperty("randlv_time"))
                storage.setRandLvTime(Number(datas.randlv_time));

            this.updateUI();
            this.updateShouYi();
            this.initData();
        }
        else
        {
            this.uploadData();
        }

    },

    updateLocalData2: function(res)
    {
        var self = this;
        if(res.state == 1)
        {
            qianqista.paddUser(function(res){
                qianqista.rankScore(function(res2){
                    self.worldrank = res2.data;
                });
            },storage.getMaxPoint());
        }
        else
        {
            var datas = res.data;
            if(datas)
            {

            }
        }
    },

    uploadData: function()
    {
        var datas = {};
        datas.first = storage.getFirst();
        datas.point = storage.getPoint();
        datas.maxpoint = storage.getMaxPoint();
        datas.speedlv = storage.getSpeedLv();
        datas.hitlv = storage.getHitLv();
        datas.hotlv = storage.getHotLv();
        datas.hplv = storage.getHpLv();
        datas.mycarId = storage.getMyCarId();
        datas.mycarIds = storage.getMyCarIds();
        datas.shouyi_time = storage.getShouYiTime();
        datas.login_time = storage.getLoginTime();
        datas.login_day = storage.getLoginDay();
        datas.game_num = storage.getGameNum();
        datas.killcar_num = storage.getKillCarNum();
        datas.randlv = storage.getRandLv();
        datas.randlv_time = storage.getRandLvTime();

        var data = JSON.stringify(datas);
        var self = this;
        qianqista.uploaddatas(data,function(res){
            console.log("--uploaddatas:",res);
            if(res && res.state == 200)
                self.updateData();
        });

        qianqista.uploadScore(storage.getMaxPoint());
    },

    updateUIControl: function()
    {
        this.GAME.sharecard = false;

        if(this.GAME.control.length>0)
        {
            this.GAME.shares = {};
            for(var i=0;i<this.GAME.control.length;i++)
            {
                var con = this.GAME.control[i];
                if(con.id == "sharecard")
                {
                    if(con.value == "1")
                    {
                        this.GAME.sharecard = true;
                    }
                }
            }

        }

        if(this.GAME.control.length>0)
        {

        }
    },

    initData: function()
    {
        var now = new Date();
        var login = new Date(storage.getLoginTime());
        var update = false;
        if(storage.getLoginTime() == 0 || now.getDate() != login.getDate() || now.getTime()-login.getTime()>24*60*60*1000)
        {
            storage.setLoginTime(now.getTime());
            storage.setLoginDay(storage.getLoginDay()+1);

            //更新车库数据
            if(storage.getLoginDay() == 2)
            {
                storage.addMyCarIds(1);
            }
            else if(storage.getLoginDay() == 7)
            {
                storage.addMyCarIds(7);
            }
            update = true;
        }

        if(storage.getGameNum()>=2 && storage.getRandLv() == 0 && now.getTime()-storage.getRandLvTime()>10*60*1000)
        {
            var types = [];
            if(storage.getSpeedLv()<config.myCarUp.length-1)
                types.push(1);
            if(storage.getHitLv()<config.myCarHit.length-1)
                types.push(2);
            if(storage.getHotLv()<config.myCarHot.length-1)
                types.push(3);
            if(storage.getHpLv()<config.myCarHp.length-1)
                types.push(4);
            if(types.length>0)
            {
                storage.setRandLv(types[Math.floor(Math.random()*types.length)]);
                update = true;
            }

        }

        if(update)
        {
            this.uploadData();
        }
    },

    initUI: function()
    {
        this.node_main = cc.find("node_main",this.node);
        this.node_gamecan = cc.find("node_gamecan",this.node);
        this.node_center = cc.find("center",this.node_main);
        this.map_1 = cc.find("bg/map1",this.node_main);
        this.map_2 = cc.find("bg/map2",this.node_main);

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

        this.shouyi = cc.find("shouyi",this.node_main);
        this.shouyi_sp = cc.find("shouyi/sp",this.node_main);
        this.shouyi_time = cc.find("shouyi/time",this.node_main);
        this.shouyi_time_str = this.shouyi_time.getComponent("cc.Label");


        this.map_1.runAction(cc.repeatForever(cc.moveBy(13,0,-1000)));
        this.map_2.runAction(cc.repeatForever(cc.moveBy(13,0,-1000)));
        this.updateShouYi();
    },

    updateUI: function()
    {
        this.node_point.string = i18n.t('main_label_text.point_total') + storage.castPoint(storage.getPoint());

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
        var node_rank = cc.instantiate(this.node_rank);
        this.node.addChild(node_rank);
        node_rank.sc.show();
    },

    openCarPort: function()
    {
        var node_carport = cc.instantiate(this.node_carport);
        this.node.addChild(node_carport);
        node_carport.sc.show();
    },

    openOver: function()
    {
        this.node_main.active = false;
        var node_over = cc.instantiate(this.node_over);
        this.node.addChild(node_over);
        this.oversc = node_over.sc;
    },

    openSetting: function()
    {
        var node_setting = cc.instantiate(this.node_setting);
        this.node.addChild(node_setting);
        node_setting.sc.show();
    },

    openShouYi: function()
    {
        var node_shouyi = cc.instantiate(this.node_shouyi);
        this.node.addChild(node_shouyi);
        node_shouyi.sc.show();
    },

    click: function(event,data)
    {
        if(data == "start")
        {
            this.node_main.active = false;
            this.node_gamecan.active = true;
            var game = this.node_gamecan.getComponent("game");
            game.resetData();
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
            sdk.share(null,"main");
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
                    storage.playSound(self.res.audio_up);
                    self.uploadData();
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
            storage.playSound(this.res.audio_up);

            this.uploadData();
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
                    storage.playSound(self.res.audio_up);
                    self.uploadData();
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
            storage.playSound(this.res.audio_up);
            this.uploadData();
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
                    self.uploadData();
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
            this.uploadData();
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
                    self.uploadData();
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
            this.uploadData();
            storage.playSound(this.res.audio_up);
        }
    },

    updateShouYi: function()
    {
        if(this.oversc)
        {
            this.oversc.updateShouYi();
        }
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