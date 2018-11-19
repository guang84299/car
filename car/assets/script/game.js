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
        map_1: {
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
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //cc.PhysicsManager.DrawBits.e_pairBit |
        //cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //cc.PhysicsManager.DrawBits.e_jointBit |
        //cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.getPhysicsManager().gravity = cc.v2(0,0);
        cc.director.getPhysicsManager().debugDrawFlags = 0;


        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.gameCamera);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    },

    initData: function()
    {
        this.state = "stop";
    },

    initUI: function()
    {
        this.node_game = cc.find("Canvas/node_game");
        this.game_bg = cc.find("bg",this.node_game);
        this.game_uibg = cc.find("uibg",this.node_game);
        this.speed_mask = cc.find("speed_mask",this.game_uibg);
        this.hit_mask = cc.find("hit_mask",this.game_uibg);
        this.hot_mask = cc.find("hot_mask",this.game_uibg);
        this.game_white = cc.find("white",this.node_game);
        this.game_white.zIndex = 10000;
        this.par_speedup = cc.find("par_speedup",this.game_uibg);
        this.maps = cc.find("maps",this.node_game);



        this.node_ui = cc.find("Canvas/node_ui");
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
            cc.color(198,198,149),
            cc.color(160,149,198),
            cc.color(156,198,149),
            cc.color(198,149,149),
            cc.color(180,149,198),
            cc.color(149,182,198)
        ];

        this.startGame();
    },

    updateUI: function()
    {

    },

    initCar: function()
    {
        this.myCar = cc.instantiate(this.pmyCar);
        this.node_game.addChild(this.myCar,10);
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

        this.cars = [];
        this.props = [];

        this.updatePointDt = 0;

        this.propTime = Math.random()*5+3;
        this.propDt = 0;

        storage.playMusic(this.audio_music);
    },

    willGameOver: function()
    {
        this.state = "stop";
        var node_fuhuo = cc.instantiate(this.node_fuhuo);
        this.node.addChild(node_fuhuo);
        node_fuhuo.sc.show();
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

        if(this.point > storage.getMaxPoint())
            storage.setMaxPoint(this.point);

        cc.director.loadScene("main");
    },

    updatePoint: function(dt)
    {
        this.updatePointDt += dt;
        if(this.updatePointDt >= 0.5)
        {
            if(storage.getShouYiX2())
                this.point +=  this.updatePointDt*4;
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
        this.par_speedup.active = true;
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
        if(storage.getShouYiX2())
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
                )
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

        if(this.cars.length < config.carLevel[level].num && this.levelDt>1)//config.carLevel[level].num
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

            var car = cc.instantiate(this.pCars[carLv-1]);
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
            this.node_game.addChild(car,10);

            var yugao = cc.instantiate(this.pYuGao);
            yugao.active = false;
            this.node_game.addChild(yugao,11);
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

            storage.setKillCarNum(storage.getKillCarNum()+1);
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

            storage.setKillCarNum(storage.getKillCarNum()+1);
        }
        else
        {
            this.addPoint(40);
        }
        this.gameCameraAnima();
        this.createMyCarEmoji();

        storage.playSound(this.audio_baozha);
    },

    removeCars: function(car)
    {
        for(var i =0;i<this.cars.length;i++)
        {
            if(this.cars[i] == car)
            {
                car.yugao.destroy();
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
                var emojibg = cc.instantiate(this.pemojibg);
                this.node_game.addChild(emojibg,10);

                car.emojibg = emojibg;
                car.emojibg.position = car.position;

                var emoji = cc.find("emoji",emojibg);
                var num = Math.floor(Math.random()*3+1);

                cc.loader.loadRes("game/emoji", cc.SpriteAtlas, function (err, atlas) {
                    var frame = atlas.getSpriteFrame('emoji'+num);
                    emoji.getComponent("cc.Sprite").spriteFrame = frame;
                });

                emojibg.runAction(cc.sequence(
                    cc.scaleTo(0.3,1).easing(cc.easeElasticIn()),
                    cc.delayTime(2),
                    cc.scaleTo(0.3,0).easing(cc.easeElasticOut()),
                    cc.callFunc(function(){
                        car.emojibg = null;
                    }),
                    cc.removeSelf()
                ));


            }
        }
        car.isCreateEmoji = true;
    },

    createMyCarEmoji: function()
    {
        if(Math.random()<0.4)
        {
            var emojibg = cc.instantiate(this.pemojibg);
            this.node_game.addChild(emojibg,10);

            emojibg.position = this.myCar.position;

            var emoji = cc.find("emoji",emojibg);
            var num = Math.floor(Math.random()*3+1);

            cc.loader.loadRes("game/emoji", cc.SpriteAtlas, function (err, atlas) {
                var frame = atlas.getSpriteFrame('emoji'+num);
                emoji.getComponent("cc.Sprite").spriteFrame = frame;
            });

            emojibg.runAction(cc.sequence(
                cc.scaleTo(0.3,1).easing(cc.easeElasticIn()),
                cc.delayTime(2),
                cc.scaleTo(0.3,0).easing(cc.easeElasticOut()),
                cc.removeSelf()
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

            var prop = cc.instantiate(this.pProp);
            prop.proptype = proptype;
            var carAng = this.myCar.sc.getCarAng(20);
            var carDir = this.myCar.sc.getCarDir(carAng);
            prop.position = carDir.mulSelf(cc.winSize.height*1.2).addSelf(this.myCar.position);

            //prop.x =  (Math.random() - 0.5) * 2 * (cc.winSize.width*2) + this.myCar.x;
            //prop.y =  (Math.random() - 0.5) * 2 * (cc.winSize.height*2) + this.myCar.y;
            this.node_game.addChild(prop,10);

            var yugao = cc.instantiate(this.pPropYuGao[proptype-1]);
            yugao.active = false;
            this.node_game.addChild(yugao,11);
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
        for(var i =0;i<this.props.length;i++)
        {
            if(this.props[i] == prop)
            {
                prop.yugao.destroy();
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
        this.gameCamera.runAction(cc.sequence(
            cc.moveBy(0.1,20,5).easing(cc.easeSineOut()),
            cc.moveBy(0.1,-20,-5).easing(cc.easeSineOut())
        ));
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
        this.game_bg.position = this.myCar.position;
        this.game_uibg.position = this.myCar.position;
        this.game_white.position = this.myCar.position;
        this.gameCamera.position = this.myCar.position;

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
            desMaps[i].destroy();
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
            var m = cc.instantiate(this.map_1);
            m.x = map.x;
            m.y = map.y + fix;
            m.scaleX = map.scaleX;
            m.scaleY = -map.scaleY;
            this.maps.addChild(m);
            m1 = m;
        }
        if(!m5)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x;
            m.y = map.y - fix;
            m.scaleY = -map.scaleY;
            m.scaleX = map.scaleX;
            this.maps.addChild(m);
            m5 = m;
        }
        if(!m7)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x - fix;
            m.y = map.y;
            m.scaleX = -map.scaleX;
            m.scaleY = map.scaleY;
            this.maps.addChild(m);
            m7 = m;
        }
        if(!m3)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x + fix;
            m.y = map.y;
            m.scaleX = -map.scaleX;
            m.scaleY = map.scaleY;
            this.maps.addChild(m);
            m3 = m;
        }

        if(!m2)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x + fix;
            m.y = map.y + fix;
            m.scaleX = -m1.scaleX;
            m.scaleY = -m3.scaleY;
            this.maps.addChild(m);
            m2 = m;
        }

        if(!m4)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x + fix;
            m.y = map.y - fix;
            m.scaleY = -m3.scaleY;
            m.scaleX = -m5.scaleX;
            this.maps.addChild(m);
            m4 = m;
        }

        if(!m6)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x - fix;
            m.y = map.y - fix;
            m.scaleX = -m5.scaleX;
            m.scaleY = -m7.scaleY;
            this.maps.addChild(m);
            m6 = m;
        }

        if(!m8)
        {
            var m = cc.instantiate(this.map_1);
            m.x = map.x - fix;
            m.y = map.y + fix;
            m.scaleX = -m1.scaleX;
            m.scaleY = -m7.scaleY;
            this.maps.addChild(m);
            m8 = m;
        }


    },

    update: function(dt) {
        if(this.state == "start")
        {
            this.updateMap();

            this.updateLevel(dt);
            this.updateYuGao();
            this.updatePoint(dt);
            this.updateProp(dt);

            this.updateHitPro(dt);
            this.updateHotPro(dt);
        }
    }
});