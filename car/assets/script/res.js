/**
 * Created by guang on 18/7/18.
 */
cc.Class({
    extends: cc.Component,

    properties: {

        toast: {
            default: null,
            type: cc.Prefab
        },
        audio_button: {
            type: cc.AudioClip,
            default: null
        },
        audio_up: {
            type: cc.AudioClip,
            default: null
        }
    },
    
    onLoad: function() {

    },

    setSpriteFrame: function(url,sp)
    {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if(!err && sp)
            {
                sp.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            }
        });
    },

    showToast: function(str)
    {
    	var toast = cc.instantiate(this.toast);
    	cc.find("label",toast).getComponent("cc.Label").string = str;
    	this.node.addChild(toast,10000);
        toast.opacity = 0;
        toast.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(2),
            cc.fadeOut(0.3),
            cc.removeSelf()
        ));
    },

    showCoin: function(coin,pos)
    {
    	var node = new cc.Node();
    	node.color = cc.color(0,0,0);
    	var label = node.addComponent("cc.Label");
    	label.fontSize = 22;
    	label.string = coin;
    	if(pos)
    		node.position = pos;
    	this.node.addChild(node,10000);

    	node.runAction(cc.sequence(
    			cc.moveBy(1,0,100).easing(cc.easeSineIn()),
    			cc.callFunc(function(){
    				node.destroy();
    			})
    		));
    }
});