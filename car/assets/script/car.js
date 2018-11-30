var config = require("config");
var storage = require("storage");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 400,//速度
        rotateSpeed: 120, // 旋转速度
        lv: 1,

        pdeng1: {
            default: null,
            type: cc.Prefab
        },
        pdeng2: {
            default: null,
            type: cc.Prefab
        },
        paim: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function()
    {
        this.game = cc.find("Canvas/node_gamecan").getComponent("game");
        this.body = this.node.getComponent("cc.RigidBody");
        this.shadow = cc.find("shadow",this.node);

        this.node.sc = this;

        this.speed = config.myCarSpeed;
        this.rotateSpeed = config.myCarRotateSpeed;

        this.state = "born";
        this.dirAng = 0;
        this.streakDt = 0;
        this.isMyCar = false;
        this.isColl = false;

        this.speedVar = Math.random()*4+1;
        this.speedVarDt = 0;

        this.collTime = 0;

        this.initLv();
        this.initSpeed();

        if(this.game.myCar.sc.state == "hit")
            this.showAim();

        //this.initDeng();
    },

    resetData: function()
    {
        this.isColl = false;
        this.node.opacity = 255;
        this.state = "born";
        this.initLv();
        if(this.game && this.game.myCar.sc.state == "hit")
            this.showAim();
        else
            this.hideAim();
    },

    initSpeed: function()
    {
        this.node.rotation = this.node.carAng;
        //this.body.linearVelocity = this.node.carDir.mulSelf(-this.speed);
        this.updateShadow();
    },

    initLv: function()
    {
        this.speed = config.myCarSpeed*config.carLv[this.lv-1].speed;
        var s = (Math.random() - 0.5) * 2 *(this.speed*0.2);
        this.speed += s;
        this.rotateSpeed = config.myCarRotateSpeed*config.carLv[this.lv-1].rotateSpeed;
    },

    initDeng: function()
    {
        this.deng1 = cc.instantiate(this.pdeng1);
        this.node.addChild(this.deng1);

        //this.deng2 = cc.instantiate(this.pdeng2);
        //this.node.addChild(this.deng2);
        //
        //var ac1 = cc.repeatForever(cc.sequence(
        //    cc.fadeTo(0.5,160).easing(cc.easeSineOut()),
        //    cc.fadeTo(0.5,60).easing(cc.easeSineOut()),
        //    cc.delayTime(0.3)
        //));
        //
        //var ac2 = cc.repeatForever(cc.sequence(
        //    cc.fadeTo(0.5,60).easing(cc.easeSineOut()),
        //    cc.fadeTo(0.5,160).easing(cc.easeSineOut()),
        //    cc.delayTime(0.4)
        //));
        //
        //this.deng1.runAction(ac1);
        //this.deng2.runAction(ac2);
    },

    changeSpeed: function()
    {
        this.speed = config.myCarSpeed*config.carLv[this.lv-1].speed;
        var s = (Math.random() - 0.5) * 2 *(this.speed*0.2);
        this.speed += s;
        //this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
    },

    subSpeed: function()
    {
        this.speed = 0;
        //this.body.linearVelocity = this.getCurrVec(this.getCurrRad());

        var self = this;
        this.node.stopActionByTag(2);
        var ac = cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(function(){
                self.changeSpeed();
            })
        );
        ac.setTag(2);
        this.node.runAction(ac);
    },

    die: function(isCollMyCar)
    {
        if(this.state != "die")
        {
            this.state = "die";
            this.node.isCollMyCar = isCollMyCar;

            //this.node.runAction(cc.sequence(
            //    cc.delayTime(0.1),
            //    cc.fadeOut()
            //));
            var self = this;
            if(this.streak1)
            {
                var streak1 = this.streak1;
                this.streak1.runAction(cc.sequence(
                    cc.delayTime(5),
                    cc.callFunc(function(){
                        self.game.destoryStreak(streak1);
                    })
                ));
                this.streak1 = null;
            }
            if(this.streak2)
            {
                var streak2 = this.streak2;
                this.streak2.runAction(cc.sequence(
                    cc.delayTime(5),
                    cc.callFunc(function(){
                        self.game.destoryStreak(streak2);
                    })
                ));
                this.streak2 = null;
            }

            //var self = this;
            //var baozha = this.game.createBaozha();
            //baozha.position = this.node.position;
            //this.game.layer_game.addChild(baozha,10);
            //baozha.runAction(cc.sequence(
            //    cc.delayTime(1),
            //    cc.callFunc(function(){
            //        self.game.destoryBaozha(baozha);
            //    })
            //));
            //
            //var smoke = this.game.createSmoke();
            //smoke.position = this.node.position;
            //this.game.layer_game.addChild(smoke,10);
            //smoke.runAction(cc.sequence(
            //    cc.delayTime(2),
            //    cc.callFunc(function(){
            //        self.game.destorySmoke(smoke);
            //    })
            //));

            this.game.carDie(this.node);

        }
    },

    showAim: function()
    {
        if(this.aim)
        {
            this.aim.active = true;
        }
        else
        {
            this.aim = cc.instantiate(this.paim);
            this.node.addChild(this.aim,10);
        }
    },

    hideAim: function()
    {
        if(this.aim)
        {
            this.aim.active = false;
        }
    },

    addStreak: function()
    {
        //创建拖尾
        if(this.streak1 || this.streak2)
            return;

        this.streak1 = this.game.createStreak();
        this.game.layer_game.addChild(this.streak1);

        this.streak2 = this.game.createStreak();
        this.game.layer_game.addChild(this.streak2);

        this.streak1.streakDt = this.streakDt;
        this.streak2.streakDt = this.streakDt;
    },

    removeStreak: function()
    {
        var self = this;
        if(this.streak1 && this.streakDt - this.streak1.streakDt > 0.2)
        {
            var streak1 = this.streak1;
            this.streak1.runAction(cc.sequence(
                cc.delayTime(5),
                cc.callFunc(function(){
                    self.game.destoryStreak(streak1);
                })
            ));
            this.streak1 = null;
        }
        if(this.streak2 && this.streakDt - this.streak2.streakDt > 0.2)
        {
            var streak2 = this.streak2;
            this.streak2.runAction(cc.sequence(
                cc.delayTime(5),
                cc.callFunc(function(){
                    self.game.destoryStreak(streak2);
                })
            ));
            this.streak2 = null;
        }
    },

    drawStreak: function()
    {
        if(this.state != "die1")
            return;
        this.addStreak();

        var v = cc.v2(-cc.winSize.width/2,-cc.winSize.height/2);
        var left = cc.v2(-this.node.width/2+10,-this.node.height*0.7);
        var right = cc.v2(this.node.width/2-10,-this.node.height*0.7);

        if(this.streak1)
        {
            this.streak1.position = this.node.convertToWorldSpaceAR(left).add(v);
        }
        if(this.streak2)
        {
            this.streak2.position = this.node.convertToWorldSpaceAR(right).add(v);
        }

        this.streak1.streakDt = this.streakDt;
        this.streak2.streakDt = this.streakDt;
    },

    enbleBody: function(active)
    {
        this.body.active = active;
    },

    //当前行驶角度的弧度
    getCurrRad: function()
    {
        var rad = -Math.PI/180*this.dirAng;
        return rad;
    },

    //实际角度的弧度
    getRad: function()
    {
        var rad = -Math.PI/180*this.node.rotation;
        return rad;
    },
    //目标方向的弧度
    getTarRad: function()
    {
        var rad = -this.game.myCar.position.sub(this.node.position).signAngle(cc.v2(0,1));
        return rad;
    },

    getCurrVec: function(rad)
    {
        return cc.v2(0,this.speed).rotateSelf(rad);
    },

    getCurrAng: function(rad)
    {
        return -180/Math.PI*rad;
    },

    //t: current time（当前时间）
    //b: beginning value（初始值）
    //c: change in value（变化量）
    //d: duration（要持续时间）
    easeIn: function(t,b,c,d){
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOut: function(t,b,c,d){
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOut: function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    linear: function(t,b,c,d)
    {
        return c*t/d + b;
    },

    updateShadow: function()
    {
        var tar = -Math.PI/180*this.node.rotation;
        var rad = this.getCurrVec(tar).signAngle(cc.v2(1,0));
        var v = cc.v2(Math.cos(rad),Math.sin(rad)).normalizeSelf();

        this.shadow.position = v.mulSelf(12);
    },

    updateDir: function(dt)
    {
        var tarRad = this.getTarRad();
        var currRad = this.getRad();

        var v1 = cc.v2(Math.cos(tarRad),Math.sin(tarRad));
        var v2 = cc.v2(Math.cos(currRad),Math.sin(currRad));

        var rotate = this.getCurrAng(v1.signAngle(v2));

        if(Math.abs(rotate) > 3)
        {
            if(rotate>0)
                this.node.rotation -= this.rotateSpeed * dt;
            else
                this.node.rotation += this.rotateSpeed * dt;
        }

        var dis = this.node.rotation - this.dirAng;
        if(Math.abs(dis) > 3)
        {
            var df = 0.7;
            if(this.dirAng>this.node.rotation)
                df = -df;
            this.dirAng += this.rotateSpeed * dt * df;

            if(this.node.rotation - this.dirAng < -60)
                this.dirAng = this.node.rotation + 60;

            if(this.node.rotation - this.dirAng > 60)
                this.dirAng = this.node.rotation - 60;

            //this.body.linearVelocity = this.getCurrVec(this.getCurrRad());


        }

        this.streakDt += dt;
        if(Math.abs(dis) > 3)
        {
            this.drawStreak();
            this.updateShadow();
        }
        else
        {
            this.removeStreak();
        }
    },

    updateSpeed: function(dt)
    {
        this.speedVarDt += dt;
        if(this.speedVarDt >= this.speedVar)
        {
            this.speedVarDt = 0;
            this.speedVar = Math.random()*4+1;
            this.changeSpeed();
        }

        var p = this.node.position.add(this.getCurrVec(this.getCurrRad()).mulSelf(dt));
        if(this.isColl)
            p = this.node.position.add(this.getCurrVec(this.getCurrRad()).mulSelf(-dt/2));
        this.node.position = p;
        //this.body.syncPosition();
    },


    update: function(dt)
    {
        if(this.state != "die")
        {
            this.updateDir(dt);
            this.updateSpeed(dt);
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        //this.showContact(contact.getWorldManifold().points);
        //cc.log(otherCollider);
        //if(otherCollider.node.sc.isMyCar)
        //this.subSpeed();
        var t = new Date().getTime();
        if(t-this.collTime>1000)
        {
            this.collTime = t;
            storage.playSound(this.game.audio_coll);
        }

    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

        //this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        if(this.state != "die")
        {
            if(contact.getImpulse().normalImpulses[0]>3)
            {
                if(otherCollider.node.sc.isMyCar)
                {
                    //otherCollider.node.sc.isBaoHu || && otherCollider.node.sc.hp >= 1
                    if(otherCollider.node.sc.state == "hit" || otherCollider.node.sc.state == "hot" )
                        this.die(true);
                }
                else
                {
                    this.die(false);
                }
            }
            //else if(contact.getImpulse().tangentImpulses[]>1)
            //{
            //    cc.log(contact.getImpulse().tangentImpulses);
            //    if(otherCollider.node.sc.isMyCar)
            //    {
            //        if(otherCollider.node.sc.isBaoHu || otherCollider.node.sc.state == "hit" || otherCollider.node.sc.state == "hot")
            //            this.die();
            //    }
            //    else
            //    {
            //        this.die();
            //    }
            //}
        }

    },

    onCollisionStay: function (other, self) {
        //console.log('on collision stay');
        if(other.tag == self.tag)
        {
            if(self.tag == 0)
            {
               this.isColl = true;
            }
        }
    },

    onCollisionEnter: function (other, self)
    {
        if(other.tag == self.tag)
        {
            if(self.tag == 0)
            {
                if(this.state != "die")
                {
                    if(other.node.sc.isMyCar)
                    {
                        this.isColl = true;
                        //otherCollider.node.sc.isBaoHu || && otherCollider.node.sc.hp >= 1
                        if(other.node.sc.state == "hit" || other.node.sc.state == "hot" )
                            this.die(true);
                    }
                    else
                    {
                        this.die(false);
                        if(other.node.sc.state != "die")
                        {
                            other.node.sc.die(false);
                        }
                    }

                    var t = new Date().getTime();
                    if(t-this.collTime>1000)
                    {
                        this.collTime = t;
                        storage.playSound(this.game.audio_coll);
                    }
                }
            }
        }

    },

    onCollisionExit: function (other, self) {
        //console.log('on collision exit');
        if(other.tag == self.tag)
        {
            if(self.tag == 0)
            {
                this.isColl = false;
            }
        }
    }

});
