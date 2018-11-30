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

        this.world = cc.find("bg/world",this.node);
        this.world_sel = cc.find("sel",this.world);

        this.friend = cc.find("bg/friend",this.node);
        this.friend_sel = cc.find("sel",this.friend);

        this.initWorld();
    },

    initWorld: function()
    {
        var self = this;

        this.world.getComponent("cc.Button").interactable = false;
        this.world_sel.height = 80;
        this.res.setSpriteFrame("images/rank/box_sel",this.world_sel);

        this.friend.getComponent("cc.Button").interactable = true;
        this.friend_sel.height = 60;
        this.res.setSpriteFrame("images/rank/box_un",this.friend_sel);

        this.node_content.stopAllActions();
        this.node_content.destroyAllChildren();

        if(!this.main.worldrank)
        {
            this.main.qianqista.rankScore(function(res){
                self.main.worldrank = res.data;
                self.worldData = res.data;
                self.addWorldItem();
            });
        }
        else
        {
            this.worldData = this.main.worldrank;
            this.addWorldItem();
        }
    },

    initFriend: function()
    {
        var self = this;

        this.world.getComponent("cc.Button").interactable = true;
        this.world_sel.height = 60;
        this.res.setSpriteFrame("images/rank/box_un",this.world_sel);

        this.friend.getComponent("cc.Button").interactable = false;
        this.friend_sel.height = 80;
        this.res.setSpriteFrame("images/rank/box_sel",this.friend_sel);

        this.node_content.stopAllActions();
        this.node_content.destroyAllChildren();

        if(this.friendData)
        {
            this.addFriendItem();
        }
        else
        {
            sdk.getRankList(function(res){
                if(res)
                {
                    self.friendData = res;
                    if(self.world.getComponent("cc.Button").interactable)
                        self.addFriendItem();
                }
            });
        }

    },

    addWorldItem: function()
    {
        var self = this;
        var rnum = this.node_content.childrenCount;
        if(rnum < this.worldData.length)
        {
            var data = this.worldData[rnum];

            var pitem = cc.instantiate(this.item);

            var bg = cc.find("bg",pitem);
            var rank = cc.find("rank",pitem);
            var icon = cc.find("icon",pitem);
            var name = cc.find("name",pitem);
            var score = cc.find("score",pitem);

            rank.getComponent("cc.Label").string = (rnum+1)+"";
            if(data.avatarUrl && data.avatarUrl.length>10)
                this.res.loadPic(data.avatarUrl,icon);
            name.getComponent("cc.Label").string = storage.getLabelStr(data.nick,13);
            score.getComponent("cc.Label").string = data.score+"";

            if(data.openid==this.main.qianqista.openid)
                bg.active = true;

            this.node_content.addChild(pitem);

            this.node_content.runAction(cc.sequence(
                cc.delayTime(0.06),
                cc.callFunc(function(){
                    self.addWorldItem();
                })
            ));
        }
    },

    addFriendItem: function()
    {
        var self = this;
        var rnum = this.node_content.childrenCount;
        if(rnum < this.friendData.length)
        {
            var data = this.friendData[rnum];

            var pitem = cc.instantiate(this.item);

            var bg = cc.find("bg",pitem);
            var rank = cc.find("rank",pitem);
            var icon = cc.find("icon",pitem);
            var name = cc.find("name",pitem);
            var score = cc.find("score",pitem);

            rank.getComponent("cc.Label").string = (rnum+1)+"";
            if(data.url && data.url.length>10)
                this.res.loadPic(data.url,icon);
            name.getComponent("cc.Label").string = storage.getLabelStr(data.nick,13);
            score.getComponent("cc.Label").string = data.score+"";

            if(data.selfFlag)
                bg.active = true;

            this.node_content.addChild(pitem);

            this.node_content.runAction(cc.sequence(
                cc.delayTime(0.06),
                cc.callFunc(function(){
                    self.addFriendItem();
                })
            ));
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
