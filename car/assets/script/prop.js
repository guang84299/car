
cc.Class({
    extends: cc.Component,

    properties: {
        //1:炸弹 2:防护盾 3:吸铁石 4:点数
        sp_type: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    onLoad: function()
    {
        this.game = cc.find("Canvas/node_gamecan").getComponent("game");
        this.sprite = this.node.getComponent("cc.Sprite");
        this.node.sc = this;
        this.type = 1;
        this.state = "born";

        this.idleDt = 0;

        this.initType(this.node.proptype);
    },

    resetDate: function(proptype)
    {
        this.state = "born";
        this.idleDt = 0;
        this.node.scale = 1;
        this.type = proptype;

        this.sprite = this.node.getComponent("cc.Sprite");
        this.sprite.spriteFrame = this.sp_type[proptype-1];
        if(proptype == 4)
        {
            this.pointNum = Math.floor(Math.random()*450+50);
        }
    },

    initType: function(type)
    {
        this.type = type;
        this.sprite.spriteFrame = this.sp_type[type-1];

        if(type == 4)
        {
            this.pointNum = Math.floor(Math.random()*450+50);
        }
    },

    die: function(isColl)
    {
        var self = this;
        if(this.state != "die")
        {
            this.state = "die";

            if(isColl)
            {
                this.node.runAction(cc.sequence(
                    cc.spawn(
                        cc.moveTo(0.2,this.game.myCar.position).easing(cc.easeSineOut()),
                        cc.scaleTo(0.2,0).easing(cc.easeSineIn())
                    ),
                    cc.callFunc(function(){
                        self.game.propDie(self.node,isColl);
                    })
                ));
            }
            else
            {
                this.node.runAction(cc.sequence(
                    cc.scaleTo(0.2,0).easing(cc.easeSineIn()),
                    cc.callFunc(function(){
                        self.game.propDie(self.node,isColl);
                    })
                ));
            }
        }
    },


    update: function(dt)
    {
        if(this.state != "die")
        {
            this.idleDt += dt;

            if(this.idleDt>20)
            {
                this.die(false);
            }

            var dis = this.node.position.sub(this.game.myCar.position).mag();
            if(dis<this.game.myCar.sc.eatPropRang)
            {
                this.die(true);
            }
        }
    }
});
