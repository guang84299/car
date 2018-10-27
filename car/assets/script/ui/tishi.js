/**
 * Created by guang on 18/7/19.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        str: {
            type: cc.Node,
            default: null
        }
        
    },

    onLoad: function() {
        this.initUI();
    },

    initUI: function()
    {
        
    },

    updateUI: function(str)
    {
        this.str.getComponent("cc.Label").string = str;
    },


    click: function(event,data)
    {
        if(data == "close")
        {
            this.close();
        }

        cc.log(data);
    },

    close: function()
    {
        this.node.destroy();
        this.destroy();
    }


});