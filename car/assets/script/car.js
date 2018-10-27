var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 400,//速度
        rotateSpeed: 120, // 旋转速度

        pstreak: {
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

        this.state = "born";
        this.dirAng = 0;
        this.streakDt = 0;
        this.lv = 1;

        this.initLv(this.node.carLv);
        this.initSpeed();
    },

    initSpeed: function()
    {
        this.body.linearVelocity = cc.v2(0,this.speed);
        this.updateShadow();
    },

    initLv: function(lv)
    {
        this.lv = lv;
        this.speed = config.myCarSpeed*config.carLv[lv-1].speed;
        this.rotateSpeed = config.myCarRotateSpeed*config.carLv[lv-1].rotateSpeed;

        cc.log(lv);
    },

    die: function()
    {
        if(this.state != "die")
        {
            this.state = "die";
            this.game.carDie(this.node);

            this.node.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.removeSelf()
            ));
        }
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

        this.streak1.streakDt = this.streakDt;
        this.streak2.streakDt = this.streakDt;
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

        this.shadow.position = v.mulSelf(40);
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

            if(this.node.rotation - this.dirAng < -90)
                this.dirAng = this.node.rotation + 90;

            if(this.node.rotation - this.dirAng > 90)
                this.dirAng = this.node.rotation - 90;

            this.body.linearVelocity = this.getCurrVec(this.getCurrRad());


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


    update: function(dt)
    {
        if(this.state != "die")
        {
            this.updateDir(dt);
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        //this.showContact(contact.getWorldManifold().points);
        //cc.log(otherCollider);
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
        if(this.state != "die" && otherCollider.node.sc.state != "die")
        {
            if(contact.getImpulse().normalImpulses>50)
            {
                //cc.log(contact.getImpulse().normalImpulses,contact.getImpulse().tangentImpulses);
                this.die();
            }
            else if(contact.getImpulse().tangentImpulses>10)
            {
                cc.log(contact.getImpulse().tangentImpulses);
                this.die();
            }
        }

    }

});
