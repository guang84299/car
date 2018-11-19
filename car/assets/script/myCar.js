var config = require("config");
var storage = require("storage");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 400,//速度
        rotateSpeed: 120, // 旋转速度

        pstreak: {
            default: null,
            type: cc.Prefab
        },
        pspeed: {
            default: null,
            type: cc.Prefab
        },
        phit: {
            default: null,
            type: cc.Prefab
        },
        phot: {
            default: null,
            type: cc.Prefab
        },
        prange: {
            default: null,
            type: cc.Prefab
        },
        pbaohu: {
            default: null,
            type: cc.Prefab
        },
        pbaozha: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function()
    {
        this.game = cc.find("Canvas").getComponent("game");
        this.res = cc.find("Canvas").getComponent("res");
        this.body = this.node.getComponent("cc.RigidBody");
        this.shadow = cc.find("shadow",this.node);
        this.car = cc.find("car",this.node);
        this.node.sc = this;


        this.res.setSpriteFrame("images/mycar/mycar_"+(storage.getMyCarId()+1),this.shadow);
        this.res.setSpriteFrame("images/mycar/mycar_"+(storage.getMyCarId()+1),this.car);

        this.lv = 1;

        this.speed = config.myCarSpeed;
        this.rotateSpeed = config.myCarRotateSpeed;
        this.maxHp = config.myCarHp[storage.getHpLv()].num;
        this.hp = this.maxHp;

        this.currRotateSpeed = 0;
        this.currDirRotateSpeed = 0;


        this.dirState = "up";
        this.dirState2 = "up";
        this.state = "born";
        this.hurtState = false;
        this.dirAng = 0;
        this.rotateDt = 0;
        this.dirRotateDt = 0;

        this.speedNum = 0;//精彩时刻次数
        this.hitNum = 0;//复仇次数
        this.hotNum = 0;//暴走次数
        this.eatPropRang = config.myCarEatRange;//吃道具范围
        this.isBaoHu = false;

        this.streakDt = 0;
        this.isMyCar = true;

        this.initSpeed();
        this.game.updateHp();
        this.game.updateSpeedUp();
        this.game.updateHit();
        this.game.updateHot();
    },

    initSpeed: function()
    {
        this.body.linearVelocity = cc.v2(0,this.speed);
        this.updateShadow();
    },

    addBaoHu: function(time)
    {
        //time = 100000;
        var self = this;
        this.isBaoHu = true;

        if(this.baohu)
        {
            this.baohu.stopAllActions();
        }
        else
        {
            this.baohu = cc.instantiate(this.pbaohu);
            this.node.addChild(this.baohu);
        }

        this.baohu.runAction(cc.sequence(
            //cc.fadeIn(0.2),
            cc.fadeTo(0.2,130),
            cc.delayTime(time),
            cc.callFunc(function(){
                self.isBaoHu = false;
            }),
            cc.fadeOut(0.2)
        ));
    },

    addRange: function()
    {
        var self = this;
        this.eatPropRang = config.myCarEatRange*3;
        if(this.eatrange)
        {
            this.eatrange.stopAllActions();
        }
        else
        {
            this.eatrange = cc.instantiate(this.prange);
            this.eatrange.scale = this.eatPropRang/this.eatrange.width/this.node.scale;
            this.node.addChild(this.eatrange);
        }

        this.eatrange.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(10),
            cc.callFunc(function(){
                self.eatPropRang = config.myCarEatRange;
            }),
            cc.fadeOut(0.2)
        ));
    },

    addHotNum: function()
    {
        if(this.state == "hot")
        {
            this.hotNum++;
        }
    },

    addHitNum: function()
    {
        if(this.state == "hit")
        {
            this.hitNum++;
            if(this.hitNum>=6)
            {
                this.hitNum = 0;
                this.showHot();
            }
            this.game.updateHit();
        }
    },

    getHotTime: function()
    {
        return config.myCarHot[storage.getHotLv()].time;
    },

    showHot: function()
    {
        if(this.state == "hot")
            return;
        this.node.stopActionByTag(2);

        this.state = "hot";
        var self = this;
        this.hotNum = 0;
        this.speed = config.myCarSpeed*1.5;
        this.rotateSpeed = config.myCarRotateSpeed*2;
        this.body.linearVelocity = this.getCurrVec(this.getCurrRad());

        var hot = cc.instantiate(this.phot);
        hot.position = cc.v2(0,-this.node.height*0.8);
        this.node.addChild(hot);

        var time = config.myCarHot[storage.getHotLv()].time;

        var ac = cc.sequence(
            cc.delayTime(time),
            cc.removeSelf()
        );
        hot.runAction(ac);

        var ac2 = cc.sequence(
            cc.scaleTo(1,1.5).easing(cc.easeSineOut()),
            cc.delayTime(time-2),
            cc.scaleTo(1,0.7).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                self.speed = config.myCarSpeed;
                self.rotateSpeed = config.myCarRotateSpeed;
                self.state = "idle";
                self.addBaoHu(2);
                self.game.updateHot();
                self.game.updateSpeedUp();
                self.game.finishSpeedUp();
            })
        );
        ac2.setTag(2);
        this.node.runAction(ac2);

        this.game.updateHot(true);

        storage.playSound(this.game.audio_bianda);
    },

    getHitTime: function()
    {
        return config.myCarHit[storage.getHitLv()].time;
    },

    showHit: function()
    {
        this.node.stopActionByTag(2);

        this.state = "hit";
        var self = this;
        this.speedNum = 0;
        this.hitNum = 0;
        this.speed = config.myCarSpeed*1.5;
        this.rotateSpeed = config.myCarRotateSpeed*2;
        this.body.linearVelocity = this.getCurrVec(this.getCurrRad());

        var hit = cc.instantiate(this.phit);
        hit.position = cc.v2(0,-this.node.height*0.8);
        this.node.addChild(hit);

        var time = config.myCarHit[storage.getHitLv()].time;

        var ac = cc.sequence(
            cc.delayTime(time),
            cc.removeSelf()
        );
        hit.runAction(ac);

        var ac2 = cc.sequence(
            cc.scaleTo(1,1).easing(cc.easeSineOut()),
            cc.delayTime(time-2),
            cc.scaleTo(1,0.7).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                self.speed = config.myCarSpeed;
                self.rotateSpeed = config.myCarRotateSpeed;
                self.state = "idle";
                self.addBaoHu(2);
                self.game.finishSpeedUp();
                self.game.updateHit();
            })
        );
        ac2.setTag(2);
        this.node.runAction(ac2);

        this.game.updateHit(true);

        storage.playSound(this.game.audio_bianda);
    },

    speedUp: function()
    {
        if(this.state == "hit" || this.state == "hot" || this.isBaoHu)
            return;
        var self = this;
        this.speedNum++;
        if(this.speedNum == 1)
            this.game.addPoint(60);
        else if(this.speedNum == 2)
            this.game.addPoint(120);
        if(this.speedNum>=3)
        {
            this.game.addPoint(200);
            this.showHit();
        }
        else
        {
            this.node.stopActionByTag(2);

            this.speed = config.myCarSpeed*1.5;
            this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
            var speed = cc.instantiate(this.pspeed);
            speed.position = cc.v2(0,-this.node.height*0.8);
            this.node.addChild(speed);

            var time = config.myCarUp[storage.getSpeedLv()].time;
            var ac = cc.sequence(
                cc.delayTime(time),
                cc.removeSelf()
            );
            speed.runAction(ac);

            var ac2 = cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function(){
                    self.speed = config.myCarSpeed;
                    self.game.finishSpeedUp();
                })
            );
            ac2.setTag(2);
            this.node.runAction(ac2);
            this.game.startSpeedUp();
        }
        this.game.updateSpeedUp();

        storage.playSound(this.game.audio_speed);
    },

    toLeft: function()
    {
        this.node.stopActionByTag(1);
        this.dirState = "left";
        this.dirState2 = "left";
        cc.log("left");
    },

    toRight: function()
    {
        this.node.stopActionByTag(1);
        this.dirState = "right";
        this.dirState2 = "right";
        cc.log("right");
    },

    toUp: function()
    {
        var self = this;
        this.node.stopActionByTag(1);
        var ac = cc.sequence(
            cc.delayTime(0.1),
            cc.callFunc(function(){

                if(self.dirState == "left")
                {
                    self.dirState = "up_left";
                }
                else
                {
                    self.dirState = "up_right";
                }
                self.dirState2 = "up";
            })
        );
        ac.setTag(1);
        this.node.runAction(ac);

        //if(this.dirState == "left")
        //{
        //    this.dirState = "up_left";
        //}
        //else
        //{
        //    this.dirState = "up_right";
        //}
        //this.removeStreak();
    },

    addStreak: function()
    {
        //创建拖尾
        if(this.streak1 || this.streak2)
            return;

        this.streak1 = cc.instantiate(this.pstreak);
        this.game.node_game.addChild(this.streak1);

        this.streak2 = cc.instantiate(this.pstreak);
        this.game.node_game.addChild(this.streak2);
    },

    removeStreak: function()
    {
        if(this.streak1 && this.streakDt - this.streak1.streakDt > 0.2)
        {
            this.streak1.runAction(cc.sequence(
                cc.delayTime(10),
                cc.removeSelf(true)
            ));
            this.streak1 = null;
        }
        if(this.streak2 && this.streakDt - this.streak2.streakDt > 0.2)
        {
            this.streak2.runAction(cc.sequence(
                cc.delayTime(10),
                cc.removeSelf(true)
            ));
            this.streak2 = null;
        }
    },

    drawStreak: function()
    {
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

    getCurrRad: function()
    {
        //var rad = -this.body.linearVelocity.signAngle(cc.v2(0,this.speed));
        //var n = parseInt(Math.abs(this.node.rotation/360));
        //if(this.node.rotation>0)
        //{
        //    if(rad>0)
        //        rad = -Math.PI*2 + rad;
        //    rad = rad + n*-Math.PI*2;
        //}
        //else
        //{
        //    if(rad<0)
        //        rad = Math.PI*2 + rad;
        //    rad = rad + n*Math.PI*2;
        //}
        var rad = -Math.PI/180*this.dirAng;
        return rad;
    },

    getTarRad: function()
    {
        var rad = -Math.PI/180*this.node.rotation;
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

    getCarAng: function(rand)
    {
        var ang = this.node.rotation+(Math.random() - 0.5) * 2*rand;
        return ang;
    },
    getCarDir: function(ang)
    {
        var rad = -Math.PI/180*ang;
        return this.getCurrVec(rad).normalizeSelf();
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
        var tar = this.getTarRad();
        var rad = this.getCurrVec(tar).signAngle(cc.v2(1,0));
        var v = cc.v2(Math.cos(rad),Math.sin(rad)).normalizeSelf();

        this.shadow.position = v.mulSelf(12);
    },

    updateDir: function(dt)
    {
        this.streakDt += dt;

        var rotateSpeedTime = 0.4;
        var currDirRotateSpeedTime = 0.8;
        var maxDirRotateSpeed = this.rotateSpeed*0.8;
        var minDirRotateSpeedTime = currDirRotateSpeedTime*0.7;

        this.currRotateSpeed = this.linear(this.rotateDt,0,this.rotateSpeed,rotateSpeedTime);
        if(this.currRotateSpeed>this.rotateSpeed) this.currRotateSpeed = this.rotateSpeed;
        if(this.currRotateSpeed<-this.rotateSpeed) this.currRotateSpeed = -this.rotateSpeed;

        this.currDirRotateSpeed = this.linear(this.dirRotateDt,0,maxDirRotateSpeed,currDirRotateSpeedTime);
        if(this.currDirRotateSpeed>maxDirRotateSpeed) this.currDirRotateSpeed = maxDirRotateSpeed;
        if(this.currDirRotateSpeed<-maxDirRotateSpeed) this.currDirRotateSpeed = -maxDirRotateSpeed;

        if(this.dirState == "left")
        {
            this.rotateDt -= dt;
            if(this.rotateDt<-rotateSpeedTime) this.rotateDt = -rotateSpeedTime;

            this.dirRotateDt -= dt;
            if(this.dirRotateDt<-currDirRotateSpeedTime) this.dirRotateDt = -currDirRotateSpeedTime;
        }
        else if(this.dirState == "up_left")
        {
            this.rotateDt += dt;
            if(this.rotateDt>0) this.rotateDt = 0;

            if(this.node.rotation>this.dirAng)
            {
                this.dirRotateDt -= dt;
                if(this.dirRotateDt<minDirRotateSpeedTime) this.dirRotateDt = minDirRotateSpeedTime;
            }
            else
            {
                this.dirRotateDt += dt;
                if(this.dirRotateDt>-minDirRotateSpeedTime) this.dirRotateDt = -minDirRotateSpeedTime;
            }
        }
        else if(this.dirState == "right")
        {
            this.rotateDt += dt;
            if(this.rotateDt>rotateSpeedTime) this.rotateDt = rotateSpeedTime;

            this.dirRotateDt += dt;
            if(this.dirRotateDt>currDirRotateSpeedTime) this.dirRotateDt = currDirRotateSpeedTime;
        }
        else if(this.dirState == "up_right")
        {
            this.rotateDt -= dt;
            if(this.rotateDt<0) this.rotateDt = 0;

            if(this.node.rotation<this.dirAng)
            {
                this.dirRotateDt += dt;
                if(this.dirRotateDt>-minDirRotateSpeedTime) this.dirRotateDt = -minDirRotateSpeedTime;
            }
            else
            {
                this.dirRotateDt -= dt;
                if(this.dirRotateDt<minDirRotateSpeedTime) this.dirRotateDt = minDirRotateSpeedTime;
            }

        }


        if(this.currRotateSpeed!=0)
        {
            this.node.rotation += this.currRotateSpeed * dt;
        }
        this.updateShadow();

        var dis = this.node.rotation - this.dirAng;
        if(Math.abs(dis) > 2)
        {
            this.dirAng += this.currDirRotateSpeed*dt;
            if(this.node.rotation - this.dirAng < -60)
            {
                this.dirAng = this.node.rotation + 60;
            }
            if(this.node.rotation - this.dirAng > 60)
            {
                this.dirAng = this.node.rotation - 60;
            }

            this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
            this.drawStreak();

            //cc.log(dis);
        }
        else
        {
            this.removeStreak();
        }
    },

    rotateEaseIn: function(t,b,c,d)
    {
        return c*(t/=d)*t*t + b;
    },
    rotateEaseOut: function(t,b,c,d)
    {
        return -c *(t/=d)*(t-2) + b;
    },
    rotateEaseInOut: function(t,b,c,d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },


    update: function(dt)
    {
        if(this.state != "die")
        {
            this.updateDir(dt);

            if(this.baohu && this.baohu.opacity>1)
            {
                this.baohu.rotation = -this.node.rotation;
                this.baohu.position = cc.v2(0,-this.node.height*(1-this.node.anchorY)-10);
            }

        }
    },

    hurt: function()
    {
        if(!this.hurtState)
        {
            this.hurtState = true;
            this.hp -= 1;
            if(this.hp<=0)
            {
                this.die();
            }
            else
            {
                var self = this;
                this.node.stopActionByTag(3);
                var ac2 = cc.sequence(
                    cc.delayTime(2),
                    cc.callFunc(function(){
                        self.hurtState = false;
                    })
                );
                ac2.setTag(3);
                this.node.runAction(ac2);
                this.addBaoHu(2);
            }
            this.game.updateHp(true);
            cc.log(this.hp);
        }
    },

    die: function()
    {
        if(this.state != "die")
        {
            this.state = "die";

            this.body.linearVelocity = cc.v2(0,0);
            this.node.stopAllActions();
            var self = this;
            this.node.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.fadeOut(0.2),
                cc.callFunc(function(){
                    self.node.active = false;
                    self.game.willGameOver();
                })
            ));

            var baozha = cc.instantiate(this.pbaozha);
            baozha.position = this.node.position;
            this.node.parent.addChild(baozha,10);

            storage.playSound(this.game.audio_die);

            this.speedNum = 0;
            this.hitNum = 0;
            this.hotNum = 0;
            this.game.updateSpeedUp();
            this.game.updateHit();
            this.game.updateHot();
        }
    },

    fuhuo: function()
    {
        this.hurtState = false;
        this.state = "born";
        this.hp = 1;
        this.node.rotation = 0;
        this.node.active = true;
        this.node.runAction(cc.fadeIn(0.2));
        this.initSpeed();
        this.addBaoHu(2);
        this.game.updateHp();
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        //this.showContact(contact.getWorldManifold().points);
        if(this.dirState2 == "up")
            this.dirState = "up_left";
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

        this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
        //if(this.dirState2 == "left")
        //    this.dirState = "left";
        //else if(this.dirState2 == "right")
        //    this.dirState = "right";
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        if(this.state != "die" && !this.hurtState)
        {
            if(contact.getImpulse().normalImpulses[0]>20)
            {
               if(!this.isBaoHu && this.state != "hit" && this.state != "hot")
                    this.hurt();
            }
            //else if(contact.getImpulse().tangentImpulses>10)
            //{
            //    if(!this.isBaoHu && this.state != "hit" && this.state != "hot")
            //        this.hurt();
            //}
        }

    },

    onCollisionEnter: function (other, self)
    {
        this.speedUp();
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        //console.log('on collision exit');

    }

});
