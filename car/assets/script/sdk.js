/**
 * Created by guang on 18/7/18.
 */
var storage = require("storage");
module.exports = {
    isConec: true,

    vibrate: function(isLong)
    {
        if(storage.getVibrate() == 1 && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS))
        {
            if(isLong)
            {
                wx.vibrateLong({});
            }
            else
            {
                wx.vibrateShort({});
            }
        }
    },

    uploadScore: function(score,callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(!score)
                score = 0;
            var data = {
                userData: [
                    {
                        openId: GameStatusInfo.openId,
                        startMs: ((new Date()).getTime()-24*60*60*1000).toString(),    //必填。 游戏开始时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
                        endMs: ((new Date()).getTime()+3000*24*60*60*1000).toString(),  //必填。 游戏结束时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
                        scoreInfo: {
                            score: score //分数，类型必须是整型数
                        }
                    }
                ],
                // type 描述附加属性的用途
                // order 排序的方式，
                // 1: 从大到小，即每次上报的分数都会与本周期的最高得分比较，如果大于最高得分则覆盖，否则忽略
                // 2: 从小到大，即每次上报的分数都会与本周期的最低得分比较，如果低于最低得分则覆盖，否则忽略（比如酷跑类游戏的耗时，时间越短越好）
                // 3: 累积，即每次上报的积分都会累积到本周期已上报过的积分上
                // 4: 直接覆盖，每次上报的积分都会将本周期的得分覆盖，不管大小
                // 如score字段对应，上个属性.
                attr: {
                    score: {
                        type: 'rank',
                        order: 1
                    }
                }
            };

            // gameMode: 游戏模式，如果没有模式区分，直接填 1
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.Script.log(1,1,'---------上传分数 --------' + callback);
            BK.QQ.uploadScoreWithoutRoom(1, data, function(errCode, cmd, data) {
                // 返回错误码信息
                BK.Script.log(1,1,'------111---上传分数失败!错误码：' + errCode);
                if(callback)
                {
                    BK.Script.log(1,1,'---------上传分数失败!  1' + callback);
                    callback();
                }
                else
                {
                    BK.Script.log(1,1,'---------上传分数失败!  2' + callback);
                }

                if (errCode !== 0) {
                    BK.Script.log(1,1,'---------上传分数失败!错误码：' + errCode);
                }

            });

        }
        else
        {
            if(callback)
                callback();
        }
    },

    getRankList: function(callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var attr = "score";//使用哪一种上报数据做排行，可传入score，a1，a2等
            var order = 1;     //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
            var rankType = 0; //要查询的排行榜类型，0: 好友排行榜，1: 群排行榜，2: 讨论组排行榜，3: C2C二人转 (手Q 7.6.0以上支持)
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.getRankListWithoutRoom(attr, order, rankType, function(errCode, cmd, data) {
                BK.Script.log(1,1,"-------rank a1 callback  cmd" + cmd + " errCode:" + errCode + "  data:" + JSON.stringify(data));
                // 返回错误码信息
                if (errCode !== 0) {
                    BK.Script.log(1,1,'------获取排行榜数据失败!错误码：' + errCode);
                    if(callback)
                        callback(null);
                    return;
                }
                // 解析数据
                //var rd = data.data.ranking_list[i];
                // rd 的字段如下:
                //var rd = {
                //    url: '',            // 头像的 url
                //    nick: '',           // 昵称
                //    score: 1,           // 分数
                //    selfFlag: false,    // 是否是自己
                //};

                if (data) {
                    if(callback)
                        callback(data.data.ranking_list);
                }
                else
                {
                    if(callback)
                        callback(null);
                }
            });
        }
        else
        {
            if(callback)
                callback(null);
        }
    },

    getChaoyueRank: function(callback,score)
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var attr = "score";//使用哪一种上报数据做排行，可传入score，a1，a2等
            var order = 2;     //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
            var rankType = 0; //要查询的排行榜类型，0: 好友排行榜，1: 群排行榜，2: 讨论组排行榜，3: C2C二人转 (手Q 7.6.0以上支持)
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.getRankListWithoutRoom(attr, order, rankType, function(errCode, cmd, data) {
                BK.Script.log(1,1,"-------wxFuhuoRank callback  cmd" + cmd + " errCode:" + errCode + "  data:" + JSON.stringify(data));
                // 返回错误码信息
                if (errCode !== 0) {
                    if(callback)
                        callback(null);
                    return;
                }
                // 解析数据
                if (data) {
                    var chaoyue = null;
                    for(var i=0; i < data.data.ranking_list.length; ++i) {
                        var rd = data.data.ranking_list[i];

                        if(!rd.selfFlag)
                        {
                            if(score < rd.score)
                            {
                                chaoyue = rd;
                                break;
                            }
                        }
                    }

                    if(chaoyue)
                    {
                        if(callback)
                            callback(chaoyue);
                    }
                    else
                    {
                        if(callback)
                            callback(null);
                    }

                }
            });
        }
        else
        {
            if(callback)
                callback(null);
        }
    },

    showVedio: function(callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var videoAd = BK.Advertisement.createVideoAd();
            videoAd.onLoad(function () {
                //加载成功
                BK.Script.log(1,1,"onLoad")
            });

            videoAd.onPlayStart(function () {
                //开始播放
                videoAd.jiangli = false;
                BK.Script.log(1,1,"onPlayStart")
            });

            videoAd.onPlayFinish(function () {
                //播放结束
                videoAd.jiangli = true;
                BK.Script.log(1,1,"onPlayFinish")
            });

            videoAd.onError(function (err) {
                //加载失败
                BK.Script.log(1,1,"onError code:"+err.code+" msg:"+err.msg);
            });

            videoAd.onClose(function (err) {
                if(callback)
                    callback(videoAd.jiangli);
            });

            videoAd.show();
        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    showBanner: function()
    {
        var self = this;
        if(self.bannershow)
            return;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(this.isConec)
            {
                if(self.bannerAd == null)
                {
                    self.bannerAd = BK.Advertisement.createBannerAd({
                        viewId:1001
                    });
                    self.bannerAd.onLoad(function () {
                        //广告加载成功
                        if(!self.bannershow)
                        {
                            self.wxBannerHide();
                        }
                    });
                    self.bannerAd.onError(function (err) {
                        //加载失败
                        var msg = err.msg;
                        var code = err.code;
                        if(!self.bannershow)
                        {
                            self.wxBannerHide();
                        }
                        BK.Script.log(1, 1, "展示失败 msg:" + msg +"     "+code);
                    });
                }
                if(self.bannerAd)
                {
                    //self.bannerAd.isshows = true;
                    self.bannershow = true;
                    self.bannerAd.show();
                }
            }
        }
    },

    hideBanner: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            self.bannershow = false;
            if(self.bannerAd)
                self.bannerAd.destory();
            self.bannerAd = null;
        }
    },

    share: function(callback,channel)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var info = {};
            info.channel = channel;
            var query = JSON.stringify(info);
            var title = "[ QQ 红包 ] 恭喜发财 玩星辉联赛，百元红包等你来领！";
            var imageUrl = "http://www.qiqiup.com/gun.gif";

            BK.Share.share({
                qqImgUrl: imageUrl,
                summary: title,
                extendInfo: query,
                success: function(succObj){
                    BK.Console.log('Waaaah! share success', succObj.code, JSON.stringify(succObj.data));
                    if(callback)
                        callback(true);
                },
                fail: function(failObj){
                    BK.Console.log('Waaaah! share fail', failObj.code, JSON.stringify(failObj.msg));
                    if(callback)
                        callback(false);
                },
                complete: function(){
                    BK.Console.log('Waaaah! share complete');
                }
            });
        }
        else
        {
            if(callback)
                callback(true);
        }
    }
};