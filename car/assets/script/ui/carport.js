var storage = require("storage");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {
        item: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function()
    {
        
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        this.node.sc = this;
        this.initUI();
        
    },
    initUI: function()
    {
        this.bg = cc.find("bg",this.node);
        this.node_content = cc.find("bg/scroll/view/content",this.node);


        this.descs = [
            "",
            "第二天登录获得",
            "观看2次视频获得",
            "分享到群3次获得",
            "进行10次游戏",
            "干掉500辆警车",
            "解锁3辆车",
            "第七天登录",
            "观看3次视频获得",
            "干掉1000辆警车",
            "获得500k点数",
            "进行6次升级"
        ];

        this.initItems();
    },

    initItems: function()
    {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this;
        eventHandler.handler = "click";
        eventHandler.component = "carport";
        eventHandler.customEventData = "item";

        for(var i=0;i<6;i++)
        {
            var pitem = cc.instantiate(this.item);

            var a_name = cc.find("a/name",pitem);
            var a_car = cc.find("a/car",pitem);
            var a_get = cc.find("a/get",pitem);
            var a_desc = cc.find("a/desc",pitem);

            var b_name = cc.find("b/name",pitem);
            var b_car = cc.find("b/car",pitem);
            var b_get = cc.find("b/get",pitem);
            var b_desc = cc.find("b/desc",pitem);

            a_get.getComponent("cc.Button").clickEvents.push(eventHandler);
            b_get.getComponent("cc.Button").clickEvents.push(eventHandler);
            a_get.itemId = i*2;
            b_get.itemId = i*2+1;

            this.res.setSpriteFrame("images/carport/name_"+(i*2+1),a_name);
            this.res.setSpriteFrame("images/carport/name_"+(i*2+2),b_name);

            this.res.setSpriteFrame("images/mycar/mycar_"+(i*2+1),a_car);
            this.res.setSpriteFrame("images/mycar/mycar_"+(i*2+2),b_car);

            a_desc.getComponent("cc.Label").string = this.descs[a_get.itemId];
            b_desc.getComponent("cc.Label").string = this.descs[b_get.itemId];

            this.node_content.addChild(pitem);
        }

        this.updateItems();
    },

    updateItems: function()
    {
        var pitems = this.node_content.children;
        for(var i=0;i<pitems.length;i++)
        {
            var pitem = pitems[i];

            var a = cc.find("a",pitem);
            var b = cc.find("b",pitem);

            var a_get = cc.find("a/get",pitem);
            var b_get = cc.find("b/get",pitem);

            var a_suo = cc.find("a/suo",pitem);
            var b_suo = cc.find("b/suo",pitem);

            var a_car = cc.find("a/car",pitem);
            var b_car = cc.find("b/car",pitem);

            var a_get_sp = cc.find("sp",a_get);
            var b_get_sp = cc.find("sp",b_get);

            a_get_sp.x = 0;
            b_get_sp.x = 0;
            if(storage.getMyCarId() == a_get.itemId)
            {
                this.res.setSpriteFrame("images/common/box_3",a);
                this.res.setSpriteFrame("images/carport/using",a_get_sp);
                this.res.setSpriteFrame("images/common/btn_green",a_get);
                a_get.getComponent("cc.Button").interactable = false;
                a_car.getComponent("cc.Button").interactable = true;
                a_suo.active = false;
            }
            else
            {
                if(storage.isMyCarId(a_get.itemId))
                {
                    this.res.setSpriteFrame("images/common/box_3",a);
                    this.res.setSpriteFrame("images/common/btn_green",a_get);
                    this.res.setSpriteFrame("images/carport/having",a_get_sp);
                    a_get.getComponent("cc.Button").interactable = true;
                    a_car.getComponent("cc.Button").interactable = true;
                    a_get.bState = "use";
                    if(a_get.itemId == 2 || a_get.itemId == 8)//vedio
                    {
                        var tar = cc.find("tar",a_get);
                        tar.active = false;
                    }

                    a_suo.active = false;
                }
                else
                {
                    this.res.setSpriteFrame("images/common/box_4",a);
                    a_car.getComponent("cc.Button").interactable = false;
                    a_suo.active = true;
                    //vedio
                    if(a_get.itemId == 2 || a_get.itemId == 8)
                    {
                        a_get_sp.x = -30;
                        this.res.setSpriteFrame("images/common/btn_green",a_get);
                        this.res.setSpriteFrame("images/carport/vedio",a_get_sp);
                        a_get.getComponent("cc.Button").interactable = true;
                        a_get.bState = "vedio";
                        var tar = cc.find("tar",a_get);
                        tar.active = true;
                        var str = "/2";
                        if(a_get.itemId == 8)
                            str = "/3";
                        tar.getComponent("cc.Label").string = storage.getCarVedio(a_get.itemId)+str;
                    }
                    else //进行10次游戏 4 //解锁 6 获得500k点数 10
                    {
                        this.res.setSpriteFrame("images/common/btn_gray",a_get);
                        this.res.setSpriteFrame("images/carport/no",a_get_sp);
                        a_get.getComponent("cc.Button").interactable = false;
                    }
                }
            }

            if(storage.getMyCarId() == b_get.itemId)
            {
                this.res.setSpriteFrame("images/common/box_3",b);
                this.res.setSpriteFrame("images/common/btn_green",b_get);
                this.res.setSpriteFrame("images/carport/using",b_get_sp);
                b_get.getComponent("cc.Button").interactable = false;
                b_car.getComponent("cc.Button").interactable = true;
                b_suo.active = false;
            }
            else
            {
                if(storage.isMyCarId(b_get.itemId))
                {
                    this.res.setSpriteFrame("images/common/box_3",b);
                    this.res.setSpriteFrame("images/common/btn_green",b_get);
                    this.res.setSpriteFrame("images/carport/having",b_get_sp);
                    b_get.getComponent("cc.Button").interactable = true;
                    b_car.getComponent("cc.Button").interactable = true;
                    b_get.bState = "use";

                    //分享
                    if(b_get.itemId == 3)
                    {
                        var tar = cc.find("tar",a_get);
                        tar.active = false;
                    }

                    b_suo.active = false;
                }
                else
                {
                    this.res.setSpriteFrame("images/common/box_4",b);
                    b_car.getComponent("cc.Button").interactable = false;
                    b_suo.active = true;
                    //分享
                    if(b_get.itemId == 3)
                    {
                        b_get_sp.x = -30;
                        this.res.setSpriteFrame("images/common/btn_green",b_get);
                        this.res.setSpriteFrame("images/carport/vedio",b_get_sp);
                        b_get.getComponent("cc.Button").interactable = true;
                        b_get.bState = "share";

                        var tar = cc.find("tar",b_get);
                        tar.active = true;
                        tar.getComponent("cc.Label").string = storage.getCarShare(b_get.itemId)+"/3";
                    }
                    else //login 1 7 //干掉警车 5 9  //进行6次升级 11
                    {
                        this.res.setSpriteFrame("images/common/btn_gray",b_get);
                        this.res.setSpriteFrame("images/carport/no",b_get_sp);
                        b_get.getComponent("cc.Button").interactable = false;
                    }
                }
            }

        }
    },

    eventItem: function(bState,itemId)
    {
        var self = this;
        if(bState == "use")
        {
            storage.setMyCarId(itemId);
            this.updateItems();
        }
        else if(bState == "vedio")
        {
            sdk.showVedio(function(res){
                if(res)
                {
                    storage.setCarVedio(itemId,storage.getCarVedio(itemId)+1);
                    if(itemId == 2)
                    {
                        if(storage.getCarVedio(itemId) >= 2)
                            storage.addMyCarIds(itemId);
                    }
                    else if(itemId == 8)
                    {
                        if(storage.getCarVedio(itemId) >= 3)
                            storage.addMyCarIds(itemId);
                    }
                    self.updateItems();
                }
            });
        }
        else if(bState == "share")
        {
            sdk.share(function(res){
                if(res)
                {
                    storage.setCarShare(itemId,storage.getCarShare(itemId)+1);
                    if(itemId == 3)
                    {
                        if(storage.getCarShare(itemId) >= 3)
                            storage.addMyCarIds(itemId);
                    }
                    self.updateItems();
                }
            },"carport");
        }

    },

    updateUI: function()
    {

    },

    show: function()
    {
        //this.main.wxQuanState(false);
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.updateUI();
    },

    hide: function()
    {
        //this.main.wxQuanState(true);
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            cc.log(event.target.itemId,event.target.bState);
            this.eventItem(event.target.bState,event.target.itemId);
        }

        storage.playSound(this.res.audio_button);
        cc.log(data);
    }

    
});
