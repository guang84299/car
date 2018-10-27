/**
 * Created by guang on 18/7/18.
 */
var config = require("config");
var storage = require("storage");
const i18n = require('LanguageData');
i18n.init('zh');


cc.Class({
    extends: cc.Component,

    properties: {

        pmyCar: {
            default: null,
            type: cc.Prefab
        },
        pCar: {
            default: null,
            type: cc.Prefab
        },
        gameCamera: {
            default: null,
            type: cc.Node
        },
        pYuGao: {
            default: null,
            type: cc.Prefab
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
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit;
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

        this.node_ui = cc.find("Canvas/node_ui");
        this.node_ui_point = cc.find("point",this.node_ui);
        this.node_ui_point_str = this.node_ui_point.getComponent("cc.Label");

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
        this.initCar();
        this.state = "start";
        this.gameTime = 0;
        this.currLevel = 0;
        this.point = 0;

        this.cars = [];

        this.updatePointDt = 0;
    },

    updatePoint: function(dt)
    {
        this.updatePointDt += dt;
        if(this.updatePointDt >= 0.5)
        {
            this.point +=  this.updatePointDt*2;
            this.updatePointDt = 0;
            this.node_ui_point_str.string = i18n.t('game_label_text.point')+Math.floor(this.point);
        }
    },

    addPoint: function(point)
    {
        this.point += point;
    },


    updateLevel: function(dt)
    {
        this.gameTime+=dt;
        var level = Math.floor(this.gameTime/60);
        if(level>=config.carLevel.length) level = config.carLevel.length-1;
        this.currLevel = level;

        if(this.cars.length < 0)//config.carLevel[level].num
        {
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

            var car = cc.instantiate(this.pCar);
            car.carLv = carLv;
            car.x =  (Math.random() - 0.5) * 2 * (cc.winSize.width*2) + this.myCar.x;
            car.y =  (Math.random() - 0.5) * 2 * (cc.winSize.height*2) + this.myCar.y;
            this.node_game.addChild(car,10);

            var yugao = cc.instantiate(this.pYuGao);
            yugao.active = false;
            this.node_game.addChild(yugao);
            car.yugao = yugao;

            this.cars.push(car);
        }
    },

    carDie: function(car)
    {
        this.removeCars(car);
        this.myCar.sc.addHotNum();
        this.point += 40;
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
                car.yugao.rotation = 180/Math.PI*cc.v2(-dir.x,-dir.y).signAngle(cc.v2(0,1));
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
            }
        }
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
    },

    update: function(dt) {
        if(this.state == "start")
        {
            this.game_bg.position = this.myCar.position;
            this.gameCamera.position = this.myCar.position;

            this.updateLevel(dt);
            this.updateYuGao();
            this.updatePoint(dt);
        }
    }
});