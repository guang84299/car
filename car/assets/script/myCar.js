var config = require("config");

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
        }
    },

    onLoad: function()
    {
        this.game = cc.find("Canvas").getComponent("game");
        this.body = this.node.getComponent("cc.RigidBody");
        this.shadow = cc.find("shadow",this.node);
        this.node.sc = this;

        this.speed = config.myCarSpeed;
        this.rotateSpeed = config.myCarRotateSpeed;

        this.currRotateSpeed = 0;
        this.currDirRotateSpeed = 0;


        this.dirState = "up";
        this.state = "born";
        this.dirAng = 0;
        this.toDt = 0;
        this.upDt = 0;
        this.rotateDt = 0;
        this.dirRotateDt = 0;
        this.isGunXing = false;

        this.hitNum = 0;
        this.hotNum = 0;
        this.lv = 1;

        this.streakDt = 0;


        this.initSpeed();
    },

    initSpeed: function()
    {
        this.body.linearVelocity = cc.v2(0,this.speed);
        this.updateShadow();
    },

    addHotNum: function()
    {
        if(this.state == "hit")
        {
            this.hotNum++;
            if(this.hotNum>=6)
            {
                this.showHot();
                cc.log("showHot");
            }
        }
    },

    showHot: function()
    {
        this.state = "hot";
        var self = this;
        this.hotNum = 0;
        this.speed = config.myCarSpeed*1.5;
        this.body.linearVelocity = this.getCurrVec(this.getCurrRad());

        var hot = cc.instantiate(this.phot);
        hot.position = cc.v2(0,-this.node.height*0.8);
        this.node.addChild(hot);

        var time = config.myCarHot[this.lv-1].time;

        var ac = cc.sequence(
            cc.delayTime(time),
            cc.callFunc(function(){
                self.speed = config.myCarSpeed;
                self.state = "idle";
            }),
            cc.removeSelf()
        );
        hot.runAction(ac);

        var ac2 = cc.sequence(
            cc.scaleTo(1,0.6).easing(cc.easeSineOut()),
            cc.delayTime(time-2),
            cc.scaleTo(1,0.3).easing(cc.easeSineOut())
        );
        ac2.setTag(2);
        this.node.runAction(ac2);
    },

    showHit: function()
    {
        this.state = "hit";
        var self = this;
        this.hitNum = 0;
        this.speed = config.myCarSpeed*1.5;
        this.body.linearVelocity = this.getCurrVec(this.getCurrRad());

        var hit = cc.instantiate(this.phit);
        hit.position = cc.v2(0,-this.node.height*0.8);
        this.node.addChild(hit);

        var time = config.myCarHit[this.lv-1].time;

        var ac = cc.sequence(
            cc.delayTime(time),
            cc.callFunc(function(){
                self.speed = config.myCarSpeed;
                self.state = "idle";
            }),
            cc.removeSelf()
        );
        hit.runAction(ac);

        var ac2 = cc.sequence(
            cc.scaleTo(1,0.5).easing(cc.easeSineOut()),
            cc.delayTime(time-2),
            cc.scaleTo(1,0.3).easing(cc.easeSineOut())
        );
        ac2.setTag(2);
        this.node.runAction(ac2);
    },

    speedUp: function()
    {
        if(this.state == "hit")
            return;
        var self = this;
        this.hitNum++;
        if(this.hitNum>=3)
        {
            this.showHit();
        }
        else
        {
            this.speed = config.myCarSpeed*1.5;
            this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
            var speed = cc.instantiate(this.pspeed);
            speed.position = cc.v2(0,-this.node.height*0.8);
            this.node.addChild(speed);

            var time = config.myCarUp[this.lv-1].time;
            var ac = cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function(){
                    self.speed = config.myCarSpeed;
                }),
                cc.removeSelf()
            );
            speed.runAction(ac);
        }
    },

    toLeft: function()
    {
        this.node.stopActionByTag(1);
        this.dirState = "left";
        cc.log("left");
    },

    toRight: function()
    {
        this.node.stopActionByTag(1);
        this.dirState = "right";
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
        var left = cc.v2(-this.node.width/2+10,-140);
        var right = cc.v2(this.node.width/2-10,-140);

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

        this.shadow.position = v.mulSelf(40);
    },

    updateDir: function(dt)
    {
        this.streakDt += dt;

        var rotateSpeedTime = 1.2;
        var currDirRotateSpeedTime = 2;
        var maxDirRotateSpeed = this.rotateSpeed*0.8;
        var minDirRotateSpeedTime = currDirRotateSpeedTime/4;

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

            this.updateShadow();
        }

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

            //cc.log(dis,this.currDirRotateSpeed);
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
        this.updateDir(dt);
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        //this.showContact(contact.getWorldManifold().points);
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

        this.body.linearVelocity = this.getCurrVec(this.getCurrRad());
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        if(contact.getImpulse().normalImpulses>0)
        {
            cc.log(contact.getImpulse().normalImpulses);
        }
        else if(contact.getImpulse().tangentImpulses>0)
        {
            cc.log(contact.getImpulse().tangentImpulses);
        }
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
        this.speedUp();
    }

});
