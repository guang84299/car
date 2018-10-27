/**
 * Created by guang on 18/7/18.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        fishs: {
            default: [],
            type: cc.Prefab
        },
        tishi: {
            default: null,
            type: cc.Prefab
        }
    },
    
    onLoad: function() {

    },

    showTishi: function(str)
    {
    	var tishi = cc.instantiate(this.tishi);
    	tishi.getComponent("tishi").updateUI(str);
    	this.node.addChild(tishi,10000);
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