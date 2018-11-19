var storage = require("storage");

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

        this.world = cc.find("bg/world",this.node);
        this.world_sel = cc.find("sel",this.world);

        this.friend = cc.find("bg/friend",this.node);
        this.friend_sel = cc.find("sel",this.friend);

        this.initWorld();
    },

    initWorld: function()
    {
        this.world.getComponent("cc.Button").interactable = false;
        this.world_sel.height = 100;

        this.friend.getComponent("cc.Button").interactable = true;
        this.friend_sel.height = 90;

        this.node_content.destroyAllChildren();

        for(var i=0;i<16;i++)
        {
            var pitem = cc.instantiate(this.item);

            var bg = cc.find("bg",pitem);
            var rank = cc.find("rank",pitem);
            var icon = cc.find("icon",pitem);
            var name = cc.find("name",pitem);
            var score = cc.find("score",pitem);

            rank.getComponent("cc.Label").string = (i+1);
            name.getComponent("cc.Label").string = "哈哈"+i;
            score.getComponent("cc.Label").string = Math.floor(Math.random()*1000000);

            if(i==5)
                bg.active = true;

            this.node_content.addChild(pitem);
        }

    },

    initFriend: function()
    {
        this.world.getComponent("cc.Button").interactable = true;
        this.world_sel.height = 90;

        this.friend.getComponent("cc.Button").interactable = false;
        this.friend_sel.height = 100;

        this.node_content.destroyAllChildren();

        for(var i=0;i<6;i++)
        {
            var pitem = cc.instantiate(this.item);

            var bg = cc.find("bg",pitem);
            var rank = cc.find("rank",pitem);
            var icon = cc.find("icon",pitem);
            var name = cc.find("name",pitem);
            var score = cc.find("score",pitem);

            rank.getComponent("cc.Label").string = (i+1);
            name.getComponent("cc.Label").string = "嘿嘿"+i;
            score.getComponent("cc.Label").string = Math.floor(Math.random()*1000000);

            if(i==2)
                bg.active = true;

            this.node_content.addChild(pitem);
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
        else if(data == "world")
        {
            this.initWorld();
        }
        else if(data == "friend")
        {
            this.initFriend();
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    }

    
});
