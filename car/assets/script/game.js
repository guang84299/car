/**
 * Created by guang on 18/7/18.
 */
var config = require("config");
var storage = require("storage");
var sdk = require("sdk");
const i18n = require('LanguageData');
i18n.init('zh');


cc.Class({
    extends: cc.Component,

    properties: {

        pmyCar: {
            default: null,
            type: cc.Prefab
        },
        pCars: {
            default: [],
            type: cc.Prefab
        },
        gameCamera: {
            default: null,
            type: cc.Node
        },
        pstreak: {
            default: null,
            type: cc.Prefab
        },
        pYuGao: {
            default: null,
            type: cc.Prefab
        },
        pPropYuGao: {
            default: [],
            type: cc.Prefab
        },
        pProp: {
            default: null,
            type: cc.Prefab
        },
        pemojibg: {
            default: null,
            type: cc.Prefab
        },
        pmyemoji: {
            default: null,
            type: cc.Prefab
        },
        map_1: {
            default: null,
            type: cc.Prefab
        },
        pbaozha: {
            default: null,
            type: cc.Prefab
        },
        psmoke: {
            default: null,
            type: cc.Prefab
        },
        node_fuhuo: {
            default: null,
            type: cc.Prefab
        },
        audio_music: {
            type: cc.AudioClip,
            default: null
        },
        audio_baozha: {
            type: cc.AudioClip,
            default: null
        },
        audio_bianda: {
            type: cc.AudioClip,
            default: null
        },
        audio_coll: {
            type: cc.AudioClip,
            default: null
        },
        audio_die: {
            type: cc.AudioClip,
            default: null
        },
        audio_speed: {
            type: cc.AudioClip,
            default: null
        }
    },

    onLoad: function() {
        this.initPhysics();
        this.initData();
        this.initUI();
        this.addListener();
    },

    initPhysics: function()
    {
        cc.director.getPhysicsManager().enabled = false;
        //cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //cc.PhysicsManager.DrawBits.e_pairBit |
        //cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //cc.PhysicsManager.DrawBits.e_jointBit |
        //cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.getPhysicsManager().debugDrawFlags = 0;
        //cc.PhysicsManager.FIXED_TIME_STEP = 1/20;
        cc.PhysicsManager.VELOCITY_ITERATIONS = 6;
        cc.PhysicsManager.POSITION_ITERATIONS = 6;
        //cc.PhysicsManager.MAX_ACCUMULATOR = cc.PhysicsManager.FIXED_TIME_STEP*2;
        //cc.director.getPhysicsManager().enabledAccumulator = false;
        cc.director.getPhysicsManager().gravity = cc.v2(0,0);



        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.gameCamera);
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    },

    initData: function()
    {
        this.state = "stop";

        this.enemyPools = [];
        for(var n =0;n<this.pCars.length;n++)
        {
            var enemyPool = new cc.NodePool();
            for (var i = 0; i < 12; i++) {
                var enemy = cc.instantiate(this.pCars[n]); // 创建节点
                enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
            }
            this.enemyPools.push(enemyPool);
        }

        this.yugaoPool = new cc.NodePool();
        for (var i = 0; i < 12; i++) {
            var e = cc.instantiate(this.pYuGao); // 创建节点
            this.yugaoPool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.propyugaoPools = [];
        for(var n =0;n<this.pPropYuGao.length;n++)
        {
            var yugaoPool = new cc.NodePool();
            for (var i = 0; i < 12; i++) {
                var e = cc.instantiate(this.pPropYuGao[n]); // 创建节点
                yugaoPool.put(e); // 通过 putInPool 接口放入对象池
            }
            this.propyugaoPools.push(yugaoPool);
        }

        this.propPool = new cc.NodePool();
        for (var i = 0; i < 6; i++) {
            var e = cc.instantiate(this.pProp); // 创建节点
            this.propPool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.pemojibgPool = new cc.NodePool();
        for (var i = 0; i < 8; i++) {
            var e = cc.instantiate(this.pemojibg); // 创建节点
            this.pemojibgPool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.myemojiPool = new cc.NodePool();
        for (var i = 0; i < 2; i++) {
            var e = cc.instantiate(this.pmyemoji); // 创建节点
            this.myemojiPool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.map_1Pool = new cc.NodePool();
        for (var i = 0; i < 8; i++) {
            var e = cc.instantiate(this.map_1); // 创建节点
            this.map_1Pool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.baozhaPool = new cc.NodePool();
        for (var i = 0; i < 8; i++) {
            var e = cc.instantiate(this.pbaozha); // 创建节点
            this.baozhaPool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.smokePool = new cc.NodePool();
        for (var i = 0; i < 8; i++) {
            var e = cc.instantiate(this.psmoke); // 创建节点
            this.smokePool.put(e); // 通过 putInPool 接口放入对象池
        }

        this.streakPool = new cc.NodePool();
        for (var i = 0; i < 10; i++) {
            var e = cc.instantiate(this.pstreak); // 创建节点
            this.streakPool.put(e); // 通过 putInPool 接口放入对象池
        }
    },

    createEnemy: function(lv)
    {
        var enemy = null;
        if (this.enemyPools[lv].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPools[lv].get();
            enemy.getComponent('car').resetData();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.pCars[lv]);
        }
        return enemy;
    },

    destoryEnemy: function(enemy)
    {
        this.enemyPools[enemy.sc.lv-1].put(enemy);
    },

    createYugao: function()
    {
        var yugao = null;
        if (this.yugaoPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            yugao = this.yugaoPool.get();
            //yugao.getComponent('car').resetData();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            yugao = cc.instantiate(this.pYuGao);
        }
        return yugao;
    },

    destoryYugao: function(yugao)
    {
        this.yugaoPool.put(yugao);
    },

    createPropyugao: function(lv)
    {
        var yugao = null;
        if (this.propyugaoPools[lv].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            yugao = this.propyugaoPools[lv].get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            yugao = cc.instantiate(this.pPropYuGao[lv]);
        }
        return yugao;
    },

    destoryPropyugao: function(yugao)
    {
        this.propyugaoPools[yugao.lv].put(yugao);
    },

    createProp: function(proptype)
    {
        var prop = null;
        if (this.propPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            prop = this.propPool.get();
            prop.getComponent('prop').resetDate(proptype);
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            prop = cc.instantiate(this.pProp);
        }
        return prop;
    },

    destoryProp: function(prop)
    {
        this.propPool.put(prop);
    },

    createEmojibg: function()
    {
        var emojibg = null;
        if (this.pemojibgPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            emojibg = this.pemojibgPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            emojibg = cc.instantiate(this.pemojibg);
        }
        return emojibg;
    },

    destoryEmojibg: function(emojibg)
    {
        this.pemojibgPool.put(emojibg);
    },

    createMyEmoji: function()
    {
        var emojibg = null;
        if (this.myemojiPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            emojibg = this.myemojiPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            emojibg = cc.instantiate(this.pmyemoji);
        }
        return emojibg;
    },

    destoryMyEmoji: function(emojibg)
    {
        this.myemojiPool.put(emojibg);
    },

    createMap: function()
    {
        var map = null;
        if (this.map_1Pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            map = this.map_1Pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            map = cc.instantiate(this.map_1);
        }
        return map;
    },

    destoryMap: function(map)
    {
        this.map_1Pool.put(map);
    },

    createBaozha: function()
    {
        var baozha = null;
        if (this.baozhaPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            baozha = this.baozhaPool.get();
            baozha.getComponent('cc.ParticleSystem').resetSystem();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            baozha = cc.instantiate(this.pbaozha);
        }
        return baozha;
    },

    destoryBaozha: function(baozha)
    {
        this.baozhaPool.put(baozha);
    },

    createSmoke: function()
    {
        var smoke = null;
        if (this.smokePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            smoke = this.smokePool.get();
            smoke.getComponent('cc.ParticleSystem').resetSystem();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            smoke = cc.instantiate(this.psmoke);
        }
        return smoke;
    },

    destorySmoke: function(smoke)
    {
        this.smokePool.put(smoke);
    },

    createStreak: function()
    {
        var streak = null;
        if (this.streakPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            streak = this.streakPool.get();
            streak.getComponent("cc.MotionStreak").reset();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            streak = cc.instantiate(this.pstreak);
        }
        return streak;
    },

    destoryStreak: function(streak)
    {
        this.streakPool.put(streak);
    },

    initUI: function()
    {
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        this.node_game = cc.find("Canvas/node_gamecan/node_game");
        this.layer_game = cc.find("layer_game",this.node_game);
        this.game_bg = cc.find("bg",this.node_game);
        this.game_uibg = cc.find("uibg",this.node_game);
        this.speed_mask = cc.find("speed_mask",this.game_uibg);
        this.hit_mask = cc.find("hit_mask",this.game_uibg);
        this.hot_mask = cc.find("hot_mask",this.game_uibg);
        this.game_white = cc.find("white",this.node_game);
        this.game_white.zIndex = 10000;
        this.par_speedup = cc.find("par_speedup",this.game_uibg);
        this.maps = cc.find("maps",this.node_game);



        this.node_ui = cc.find("Canvas/node_gamecan/node_ui");
        this.node_ui_point = cc.find("point",this.node_ui);
        this.node_ui_point_str = this.node_ui_point.getComponent("cc.Label");

        this.node_ui_node_hp = cc.find("node_hp",this.node_ui);
        this.node_ui_node_speedup = cc.find("node_speedup",this.node_ui);

        this.node_ui_node_hit = cc.find("node_hit",this.node_ui);
        this.node_ui_node_hit_pro = cc.find("pro",this.node_ui_node_hit).getComponent("cc.ProgressBar");
        this.node_ui_node_hit_txt = cc.find("txt",this.node_ui_node_hit);
        this.node_ui_node_hit_txt.v2 = this.node_ui_node_hit_txt.position;

        this.node_ui_node_hot = cc.find("node_hot",this.node_ui);
        this.node_ui_node_hot_pro = cc.find("pro",this.node_ui_node_hot).getComponent("cc.ProgressBar");
        this.node_ui_node_hot_txt = cc.find("txt",this.node_ui_node_hot);
        this.node_ui_node_hot_txt.v2 = this.node_ui_node_hot_txt.position;
        this.node_ui_node_hot_pro_huo = cc.find("pro/huo",this.node_ui_node_hot);

        this.bgColors = [
            cc.color(91,105,123),
            cc.color(112,91,123),
            cc.color(123,91,91),
            cc.color(123,115,91),
            cc.color(104,123,91),
            cc.color(91,123,120)
        ];

        //this.startGame();
    },

    resetData: function()
    {
        this.layer_game.destroyAllChildren();
        this.startGame();
    },

    updateUI: function()
    {

    },

    initCar: function()
    {
        this.myCar = cc.instantiate(this.pmyCar);
        this.layer_game.addChild(this.myCar,10);
    },


    startGame: function()
    {
        this.game_bg.color = this.bgColors[Math.floor(Math.random()*this.bgColors.length)];
        this.initCar();
        this.state = "start";
        this.gameTime = 0;
        this.currLevel = 0;
        this.levelDt = 0;
        this.point = 0;
        this.killCarNum = 0;

        this.cars = [];
        this.props = [];

        this.updatePointDt = 0;

        this.propTime = Math.random()*5+3;
        this.propDt = 0;

        this.gameDt = 0;
        this.shouyix2 = storage.getShouYiX2();
        this.shouyix2Time = 0;
        if(this.shouyix2)
        {
            var t = new Date().getTime();
            var t2 = storage.getShouYiTime() + 2*60*60*1000;
            this.shouyix2Time = (t2 - t)/1000;
        }


        storage.playMusic(this.audio_music);

        sdk.hideBanner();
    },

    willGameOver: function()
    {
        this.state = "stop";
        var node_fuhuo = cc.instantiate(this.node_fuhuo);
        this.node.addChild(node_fuhuo);
        node_fuhuo.sc.show();
        this.finishSpeedUp();
    },

    fuhuo: function()
    {
        this.myCar.sc.fuhuo();
        this.state = "start";
    },

    gameOver: function()
    {
        //结算
        storage.setPoint(this.point+storage.getPoint());
        storage.stopMusic();
        cc.mydata.over = true;
        cc.mydata.point = this.point;
        storage.setGameNum(storage.getGameNum()+1);
        storage.setKillCarNum(storage.getKillCarNum()+this.killCarNum);

        if(this.point > storage.getMaxPoint())
            storage.setMaxPoint(this.point);

        this.main.openOver();
    },

    updatePoint: function(dt)
    {
        this.updatePointDt += dt;
        if(this.updatePointDt >= 1)
        {
            if(this.shouyix2)
            {
                this.shouyix2Time -= this.updatePointDt;
                this.shouyix2 = this.shouyix2Time > 0;
                this.point +=  this.updatePointDt*4;
            }
            else
                this.point +=  this.updatePointDt*2;
            this.updatePointDt = 0;
            this.node_ui_point_str.string = i18n.t('game_label_text.point')+ storage.castPoint(this.point);
        }
    },

    updateHp: function(isAnim)
    {
        var maxHp = this.myCar.sc.maxHp;
        var currHp = this.myCar.sc.hp;

        var hpbgs = this.node_ui_node_hp.children;
        for(var i=0;i<hpbgs.length;i++)
        {
            var hpbg = hpbgs[i];
            if(i<maxHp)
            {
                hpbg.active = true;
                var hp = cc.find("hp",hpbg);
                if(isAnim && currHp==i)
                {
                    hp.runAction(cc.sequence(
                        cc.spawn(
                            cc.scaleTo(0.5,1.3).easing(cc.easeSineOut()),
                            cc.fadeOut(0.5)
                        ),
                        cc.callFunc(function(){
                            hp.active = false;
                            hp.opacity = 255;
                        })
                    ));
                }
                else
                {
                    hp.opacity = 255;
                    hp.scale = 1;
                    hp.active = (currHp>i ? true : false);
                }
            }
            else
            {
                hpbg.active = false;
            }
        }
    },

    updateSpeedUp: function()
    {
        if(this.myCar.sc.state == "hit" || this.myCar.sc.state == "hot")
        {
            this.node_ui_node_speedup.active = false;
            this.speed_mask.active = true;
            return;
        }
        this.node_ui_node_speedup.active = true;
        var speedNum = this.myCar.sc.speedNum;

        var speedUps = this.node_ui_node_speedup.children;
        for(var i=0;i<speedUps.length;i++)
        {
            var speedUp = speedUps[i];
            var speed = cc.find("speedup",speedUp);
            speed.active = (speedNum>i ? true : false);
        }
    },

    startSpeedUp: function()
    {
        this.speed_mask.active = true;
        //this.par_speedup.active = true;
    },

    finishSpeedUp: function()
    {
        this.speed_mask.active = false;
        this.par_speedup.active = false;
    },

    updateHit: function(isStart)
    {
        if(this.myCar.sc.state != "hit")
        {
            this.node_ui_node_hit.active = false;
            this.node_ui_node_hit_pro.currTime = 0;
            this.node_ui_node_hit_txt.stopAllActions();
            this.hit_mask.active = false;
            if(this.cars)
            this.updateCarAim(false);
            return;
        }
        this.node_ui_node_hit.active = true;
        this.node_ui_node_hit_pro.maxTime = this.myCar.sc.getHitTime();
        if(!this.node_ui_node_hit_pro.currTime || this.node_ui_node_hit_pro.currTime<=0)
            this.node_ui_node_hit_pro.currTime = this.node_ui_node_hit_pro.maxTime;
        var hitNum = this.myCar.sc.hitNum;

        var hits = cc.find("hits",this.node_ui_node_hit);
        var hitbgs = hits.children;
        for(var i=0;i<hitbgs.length;i++)
        {
            var hitbg = hitbgs[i];
            var hit = cc.find("hit",hitbg);
            hit.active = (hitNum>i ? true : false);
        }

        if(isStart)
        {
            this.node_ui_node_hit_txt.stopAllActions();
            this.node_ui_node_hit_txt.position = this.node_ui_node_hit_txt.v2;
            this.node_ui_node_hit_txt.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveBy(0.1,30,0).easing(cc.easeBackIn()),
                    cc.moveBy(0.1,-30,0).easing(cc.easeBackOut())
                )
            ));
            //this.game_bg.runAction(cc.tintTo(0.2,Math.floor(Math.random()*255),0,255));
            this.hit_mask.active = true;
            this.startSpeedUp();
            this.updateCarAim(true);
        }
    },

    updateHitPro: function(dt)
    {
        if(this.node_ui_node_hit.active)
        {
            this.node_ui_node_hit_pro.currTime -= dt;
            if(this.node_ui_node_hit_pro.currTime>0)
            {
                this.node_ui_node_hit_pro.progress = this.node_ui_node_hit_pro.currTime/this.node_ui_node_hit_pro.maxTime;
            }
        }
    },

    updateHot: function(isStart)
    {
        if(this.myCar.sc.state != "hot")
        {
            this.node_ui_node_hot_pro_huo.x = 200;
            this.node_ui_node_hot.active = false;
            this.node_ui_node_hot_pro.currTime = 0;
            this.node_ui_node_hot_txt.stopAllActions();
            this.hot_mask.active = false;
            return;
        }
        this.node_ui_node_hot.active = true;
        this.node_ui_node_hot_pro.maxTime = this.myCar.sc.getHotTime();
        if(!this.node_ui_node_hot_pro.currTime || this.node_ui_node_hot_pro.currTime<=0)
            this.node_ui_node_hot_pro.currTime = this.node_ui_node_hot_pro.maxTime;

        if(isStart)
        {
            this.node_ui_node_hot_txt.stopAllActions();
            this.node_ui_node_hot_txt.position = this.node_ui_node_hot_txt.v2;
            this.node_ui_node_hot_txt.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveBy(0.1,30,0).easing(cc.easeBackIn()),
                    cc.moveBy(0.1,-30,0).easing(cc.easeBackOut())
                )
            ));
            //this.game_bg.runAction(cc.tintTo(0.2,Math.floor(Math.random()*255),0,255));
            this.hot_mask.active = true;
            this.startSpeedUp();
        }
    },

    updateHotPro: function(dt)
    {
        if(this.node_ui_node_hot.active)
        {
            this.node_ui_node_hot_pro.currTime -= dt;
            if(this.node_ui_node_hot_pro.currTime>0)
            {
                this.node_ui_node_hot_pro.progress = this.node_ui_node_hot_pro.currTime/this.node_ui_node_hot_pro.maxTime;
                this.node_ui_node_hot_pro_huo.x = 400*this.node_ui_node_hot_pro.progress-200;
            }
        }
    },

    updateCarAim: function(visible)
    {
        for(var i =0;i<this.cars.length;i++)
        {
            if(visible)
                this.cars[i].sc.showAim();
            else
                this.cars[i].sc.hideAim();
        }
    },

    addPoint: function(point)
    {
        if(true)
        return;
        if(this.shouyix2)
            point *= 2;
        this.point += point;
        this.node_ui_point.stopAllActions();
        this.node_ui_point.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(0.2,1.3).easing(cc.easeSineOut()),
                cc.tintTo(0.2,0,0,255).easing(cc.easeSineOut())
            ),
            cc.spawn(
                cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
                cc.tintTo(0.2,255,255,255).easing(cc.easeSineOut())
            )
        ));

        var pbg = new cc.Node();
        var p = pbg.addComponent("cc.Label");
        p.string = "+"+point;
        p.fontSize = 22;
        pbg.position = this.node_ui_point.position;
        pbg.y -= 100;
        pbg.opacity = 0;
        pbg.color = cc.color(0,0,255);
        this.node_ui.addChild(pbg);

        pbg.runAction(cc.spawn(
            cc.moveBy(0.8,cc.v2(0,60)).easing(cc.easeSineOut()),
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.2),
                    cc.scaleTo(0.3,1.5).easing(cc.easeSineOut())
                ),
                cc.spawn(
                    cc.scaleTo(0.5,0.5).easing(cc.easeSineOut()),
                    cc.fadeOut(0.5)
                ),
                cc.delayTime(0.2),
                cc.removeSelf()
            )
        ));

    },


    updateLevel: function(dt)
    {
        this.gameTime+=dt;
        this.levelDt += dt;
        var level = Math.floor(this.gameTime/60);
        if(level>=config.carLevel.length) level = config.carLevel.length-1;
        this.currLevel = level;

        if(this.cars.length < 8 && this.levelDt>1)//config.carLevel[level].num
        {
            this.levelDt = 0;

            var r = Math.random();
            var carLv = 1;
            if(config.carLevel[level].lv1 > r)
                carLv = 1;
            else if(config.carLevel[level].lv1+config.carLevel[level].lv2 > r)
                carLv = 2;
            else if(config.carLevel[level].lv1+config.carLevel[level].lv2+config.carLevel[level].lv3 > r)
                carLv = 3;
            else
                carLv = 4;

            var car = this.createEnemy(carLv-1);
            var pAng = 10;
            if(this.gameTime<5)
                pAng = 90;
            var carAng = this.myCar.sc.getCarAng(pAng);
            var carDir = this.myCar.sc.getCarDir(carAng);
            car.carDir = carDir;
            car.carAng = carAng+180;
            //car.x =  (Math.random() - 0.5) * 2 * (cc.winSize.width*2) + this.myCar.x;
            //car.y =  (Math.random() - 0.5) * 2 * (cc.winSize.height*2) + this.myCar.y;
            car.position = carDir.mulSelf(cc.winSize.height*1.2).addSelf(this.myCar.position);
            this.layer_game.addChild(car,10);

            var yugao = this.createYugao();
            yugao.active = false;
            this.layer_game.addChild(yugao,11);
            car.yugao = yugao;

            this.cars.push(car);
        }

        //更新加速粒子
        if(this.par_speedup.active)
        {
            this.par_speedup.rotation = this.myCar.rotation-180;
        }
    },

    carDie: function(car)
    {
        this.removeCars(car);
        if(this.myCar.sc.state == "hit")
        {
            if(car.isCollMyCar)
                this.myCar.sc.addHitNum();
            this.addPoint(40 + (this.myCar.sc.hitNum-1)*20);

            this.killCarNum += 1;
        }
        else if(this.myCar.sc.state == "hot")
        {
            this.myCar.sc.addHotNum();
            this.addPoint(60 + (this.myCar.sc.hotNum-1)*30);
            this.game_white.runAction(cc.sequence(
                cc.fadeTo(0.05,140),
                cc.delayTime(0.1),
                cc.fadeOut(0.05)
            ));

            this.killCarNum += 1;
        }
        else
        {
            this.addPoint(40);
        }
        this.gameCameraAnima();

        storage.playSound(this.audio_baozha);
    },

    removeCars: function(car)
    {
        this.destoryYugao(car.yugao);
        this.destoryEnemy(car);
        car.isCreateEmoji = false;
        for(var i =0;i<this.cars.length;i++)
        {
            if(this.cars[i] == car)
            {
                this.cars.splice(i,1);
                break;
            }
        }
    },

    updateYuGao: function()
    {
        var w = cc.winSize.width/2;
        var h = cc.winSize.height/2;
        for(var i =0;i<this.cars.length;i++)
        {
            var car = this.cars[i];
            if(Math.abs(car.x-this.myCar.x)>w || Math.abs(car.y-this.myCar.y)>h)
            {
                car.yugao.active = true;
                var dir = this.myCar.position.sub(car.position).normalizeSelf();
                car.yugao.rotation = 180/Math.PI*cc.v2(-dir.x,-dir.y).signAngle(cc.v2(0,1))+180;
                car.yugao.position = this.myCar.position.add(dir.mulSelf(-h));
                if(car.yugao.x>this.myCar.x)
                {
                    if(car.yugao.x-this.myCar.x>w)
                        car.yugao.x = this.myCar.x+w-car.yugao.width/2;
                }
                else
                {
                    if(this.myCar.x-car.yugao.x>w)
                        car.yugao.x = this.myCar.x-w+car.yugao.width/2;
                }
            }
            else
            {
                car.yugao.active = false;
                this.updateEmoji(car);
            }
        }

        for(var i =0;i<this.props.length;i++)
        {
            var prop = this.props[i];
            if(Math.abs(prop.x-this.myCar.x)>w || Math.abs(prop.y-this.myCar.y)>h)
            {
                prop.yugao.active = true;
                var dir = this.myCar.position.sub(prop.position).normalizeSelf();
                prop.yugao.rotation = 180/Math.PI*cc.v2(-dir.x,-dir.y).signAngle(cc.v2(0,1))+180;
                prop.yugao.position = this.myCar.position.add(dir.mulSelf(-h));
                if(prop.yugao.x>this.myCar.x)
                {
                    if(prop.yugao.x-this.myCar.x>w)
                        prop.yugao.x = this.myCar.x+w-prop.yugao.width/2;
                }
                else
                {
                    if(this.myCar.x-prop.yugao.x>w)
                        prop.yugao.x = this.myCar.x-w+prop.yugao.width/2;
                }
            }
            else
            {
                prop.yugao.active = false;
            }
        }
    },

    updateEmoji: function(car)
    {

        if(car.emojibg)
        {
            car.emojibg.position = car.position;
        }
        else
        {
            if(!car.isCreateEmoji && Math.random()<0.3)
            {
                var emojibg = this.createEmojibg();
                this.layer_game.addChild(emojibg,10);

                car.emojibg = emojibg;
                car.emojibg.position = car.position;

                var emoji = cc.find("emoji",emojibg);
                var num = Math.floor(Math.random()*4+1);
                this.res.setSpriteFrame("images/emoji/car_speed_"+num,emoji);
                var self = this;
                emojibg.runAction(cc.sequence(
                    cc.scaleTo(0.3,1).easing(cc.easeElasticIn()),
                    cc.delayTime(2),
                    cc.scaleTo(0.3,0).easing(cc.easeElasticOut()),
                    cc.callFunc(function(){
                        self.destoryEmojibg(emojibg);
                        car.emojibg = null;
                    })
                ));


            }
        }
        car.isCreateEmoji = true;
    },

    createMyCarEmoji: function(type)
    {
        if(Math.random()<0.5)
        {
            var emoji = this.createMyEmoji();
            this.layer_game.addChild(emoji,10);
            emoji.position = this.myCar.position;
            this.res.setSpriteFrame("images/emoji/"+type,emoji);

            var self = this;
            emoji.runAction(cc.sequence(
                cc.scaleTo(0.3,1).easing(cc.easeElasticIn()),
                cc.delayTime(2),
                cc.scaleTo(0.3,0).easing(cc.easeElasticOut()),
                cc.callFunc(function(){
                    self.destoryMyEmoji(emoji);
                })
            ));


        }
    },

    updateProp: function(dt)
    {
        this.propDt += dt;
        if(this.propDt>=this.propTime)
        {
            this.propDt = 0;
            this.propTime = Math.random()*5+3;

            var proptype = Math.floor(Math.random()*4+1);

            var prop = this.createProp(proptype);
            prop.proptype = proptype;
            var carAng = this.myCar.sc.getCarAng(20);
            var carDir = this.myCar.sc.getCarDir(carAng);
            prop.position = carDir.mulSelf(cc.winSize.height*1.2).addSelf(this.myCar.position);

            //prop.x =  (Math.random() - 0.5) * 2 * (cc.winSize.width*2) + this.myCar.x;
            //prop.y =  (Math.random() - 0.5) * 2 * (cc.winSize.height*2) + this.myCar.y;
            this.layer_game.addChild(prop,10);

            var yugao = this.createPropyugao(proptype-1);
            yugao.lv = proptype-1;
            yugao.active = false;
            this.layer_game.addChild(yugao,11);
            prop.yugao = yugao;

            this.props.push(prop);
        }
    },

    propDie: function(prop,isColl)
    {
        var type = prop.sc.type;
        if(isColl)
        {
            //炸弹
            if(type == 1)
            {
                this.useZhaDan();
            }
            //防护盾
            else if(type == 2)
            {
                this.myCar.sc.addBaoHu(10);
            }
            //吸铁石
            else if(type == 3)
            {
                this.myCar.sc.addRange();
            }
            //点数
            else if(type == 4)
            {
                this.addPoint(prop.sc.pointNum);
            }
        }

        this.removeProps(prop);
    },

    removeProps: function(prop)
    {
        this.destoryPropyugao(prop.yugao);
        this.destoryProp(prop);
        for(var i =0;i<this.props.length;i++)
        {
            if(this.props[i] == prop)
            {
                this.props.splice(i,1);
                break;
            }
        }
    },

    useZhaDan: function()
    {
        var bcars = [];
        for(var i =0;i<this.cars.length;i++)
        {
            var car = this.cars[i];
            bcars.push(car);
        }
        for(var i =0;i<bcars.length;i++)
        {
            var car = bcars[i];
            car.sc.die();
        }
    },

    gameCameraAnima: function()
    {
        //this.gameCamera.stopAllActions();
        //this.gameCamera.runAction(cc.sequence(
        //    cc.moveBy(0.05,12,3).easing(cc.easeSineOut()),
        //    cc.moveBy(0.05,-12,-3).easing(cc.easeSineOut())
        //));
        sdk.vibrate();
    },


    click: function(event,data)
    {
        if(data == "home")
        {
            cc.director.loadScene("main");
        }

        cc.log(data);
    },


    addListener: function()
    {
        var s = cc.winSize;
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var pos = event.getLocation();
            if(pos.x > s.width/2)
            {
                this.myCar.sc.toRight();
            }
            else
            {
                this.myCar.sc.toLeft();
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pos = event.getLocation();
            this.myCar.sc.toUp();
        }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy: function() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.myCar.sc.toLeft();
                break;
            case cc.macro.KEY.right:
                this.myCar.sc.toRight();
                break;
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.myCar.sc.toUp();
                break;
            case cc.macro.KEY.right:
                this.myCar.sc.toUp();
                break;
        }
    },

    updateMap: function()
    {
        var fix = 2000;

        //找到最近的map
        var maps = this.maps.children;
        var map = maps[0];
        var desMaps = [];
        for(var i=0;i<maps.length;i++)
        {
            var m = maps[i];
            var dis1 = map.position.sub(this.myCar.position).mag();
            var dis2 = m.position.sub(this.myCar.position).mag();
            if(dis2<dis1)
            {
                map = m;
            }
            else if(dis2>fix*2)
            {
                desMaps.push(m);
            }
        }
        for(var i=0;i<desMaps.length;i++)
        {
            this.destoryMap(desMaps[i]);
        }

        var m1 = null;
        var m2 = null;
        var m3 = null;
        var m4 = null;
        var m5 = null;
        var m6 = null;
        var m7 = null;
        var m8 = null;
        for(var i=0;i<maps.length;i++)
        {
            var m = maps[i];
            if(m.y>map.y && m.x == map.x)
                m1 = m;
            if(m.y>map.y && m.x > map.x)
                m2 = m;
            if(m.y==map.y && m.x > map.x)
                m3 = m;
            if(m.y<map.y && m.x > map.x)
                m4 = m;
            if(m.y<map.y && m.x == map.x)
                m5 = m;
            if(m.y<map.y && m.x < map.x)
                m6 = m;
            if(m.y==map.y && m.x < map.x)
                m7 = m;
            if(m.y>map.y && m.x < map.x)
                m8 = m;
        }

        if(!m1)
        {
            var m = this.createMap();
            m.x = map.x;
            m.y = map.y + fix;
            m.scaleX = map.scaleX;
            m.scaleY = -map.scaleY;
            this.maps.addChild(m);
            m1 = m;
        }
        if(!m5)
        {
            var m = this.createMap();
            m.x = map.x;
            m.y = map.y - fix;
            m.scaleY = -map.scaleY;
            m.scaleX = map.scaleX;
            this.maps.addChild(m);
            m5 = m;
        }
        if(!m7)
        {
            var m = this.createMap();
            m.x = map.x - fix;
            m.y = map.y;
            m.scaleX = -map.scaleX;
            m.scaleY = map.scaleY;
            this.maps.addChild(m);
            m7 = m;
        }
        if(!m3)
        {
            var m = this.createMap();
            m.x = map.x + fix;
            m.y = map.y;
            m.scaleX = -map.scaleX;
            m.scaleY = map.scaleY;
            this.maps.addChild(m);
            m3 = m;
        }

        if(!m2)
        {
            var m = this.createMap();
            m.x = map.x + fix;
            m.y = map.y + fix;
            m.scaleX = -m1.scaleX;
            m.scaleY = -m3.scaleY;
            this.maps.addChild(m);
            m2 = m;
        }

        if(!m4)
        {
            var m = this.createMap();
            m.x = map.x + fix;
            m.y = map.y - fix;
            m.scaleY = -m3.scaleY;
            m.scaleX = -m5.scaleX;
            this.maps.addChild(m);
            m4 = m;
        }

        if(!m6)
        {
            var m = this.createMap();
            m.x = map.x - fix;
            m.y = map.y - fix;
            m.scaleX = -m5.scaleX;
            m.scaleY = -m7.scaleY;
            this.maps.addChild(m);
            m6 = m;
        }

        if(!m8)
        {
            var m = this.createMap();
            m.x = map.x - fix;
            m.y = map.y + fix;
            m.scaleX = -m1.scaleX;
            m.scaleY = -m7.scaleY;
            this.maps.addChild(m);
            m8 = m;
        }


    },

    updateCamera: function()
    {
        this.game_bg.position = this.myCar.position;
        this.game_uibg.position = this.myCar.position;
        this.game_white.position = this.myCar.position;
        this.gameCamera.position = this.myCar.position;
    },

    update: function(dt) {
        if(this.state == "start")
        {
            this.gameDt += dt;
            if(this.gameDt>1/10)
            {
                this.updateMap();
                this.updateLevel(this.gameDt);
                this.updateProp(this.gameDt);

                this.updateHitPro(this.gameDt);
                this.updateHotPro(this.gameDt);

                this.gameDt = 0;
            }
            this.updateYuGao();
            //this.updatePoint(dt);
        }
    }
});