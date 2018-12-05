/**
 * Created by guang on 18/7/19.
 */
module.exports = {
    pice:['k','m','b','t','a','aa','ab','ac','ad','ae','af','ag','ah','ai','aj','ak','al','am','an','ao','ap','aq','ar','as','at'],
    audioContext: null,
    effectContext: null,
    playMusic: function(music)
    {
        if(this.getMusic() == 1)
        {
            this.stopMusic();
            //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            //{
            //    if(this.audioContext == null)
            //    {
            //        this.audioContext = BK.createAudioContext();
            //        this.audioContext.loop = true;
            //        this.audioContext.src = "GameRes://"+music;
            //    }
            //    this.audioContext.play();
            //}
            //else
            //{
                cc.audioEngine.play(music,true,0.6);
            //}
        }
    },

    pauseMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.pauseAll();
    },

    resumeMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.resumeAll();
    },

    stopMusic: function()
    {
        //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        //{
        //    if(this.audioContext)
        //        this.audioContext.pause();
        //}
        //else
        //{
            cc.audioEngine.stopAll();
        //}
    },

    playSound: function(sound)
    {
        if(this.getSound() == 1)
        {
            //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            //{
            //    if(this.effectContext == null)
            //    {
            //        this.effectContext = BK.createAudioContext({'type':'effect'});
            //    }
            //    //播放多个音效
            //    this.effectContext.src = "GameRes://"+sound;
            //    this.effectContext.play()
            //}
            //else
            //{
                cc.audioEngine.play(sound,false,1);
            //}
        }
    },

    setFirst: function(first)
    {
        cc.sys.localStorage.setItem("first",first);
    },

    getFirst: function()
    {
        var first = cc.sys.localStorage.getItem("first");
        first = first ? first : 0;
        return Number(first);
    },

    setPoint: function(point)
    {
        cc.sys.localStorage.setItem("point",Math.floor(point));

        if(point>=500000 && point < 500100)
        {
            this.addMyCarIds(10);
        }
    },

    getPoint: function()
    {
        var point = cc.sys.localStorage.getItem("point");
        point = point ? point : 0;
        return Number(point);
    },

    setMaxPoint: function(point)
    {
        cc.sys.localStorage.setItem("maxpoint",Math.floor(point));
    },

    getMaxPoint: function()
    {
        var point = cc.sys.localStorage.getItem("maxpoint");
        point = point ? point : 0;
        return Number(point);
    },

    setSpeedLv: function(lv)
    {
        cc.sys.localStorage.setItem("speedlv",lv);

        if(this.getLvUpNum()==6)
        {
            this.addMyCarIds(11);
        }
    },

    getSpeedLv: function()
    {
        var speedlv = cc.sys.localStorage.getItem("speedlv");
        speedlv = speedlv ? speedlv : 0;
        return Number(speedlv);
    },

    setHitLv: function(lv)
    {
        cc.sys.localStorage.setItem("hitlv",lv);

        if(this.getLvUpNum()==6)
        {
            this.addMyCarIds(11);
        }
    },

    getHitLv: function()
    {
        var hitlv = cc.sys.localStorage.getItem("hitlv");
        hitlv = hitlv ? hitlv : 0;
        return Number(hitlv);
    },

    setHotLv: function(lv)
    {
        cc.sys.localStorage.setItem("hotlv",lv);

        if(this.getLvUpNum()==6)
        {
            this.addMyCarIds(11);
        }
    },

    getHotLv: function()
    {
        var hotlv = cc.sys.localStorage.getItem("hotlv");
        hotlv = hotlv ? hotlv : 0;
        return Number(hotlv);
    },

    setHpLv: function(lv)
    {
        cc.sys.localStorage.setItem("hplv",lv);

        if(this.getLvUpNum()==6)
        {
            this.addMyCarIds(11);
        }
    },

    getHpLv: function()
    {
        var hplv = cc.sys.localStorage.getItem("hplv");
        hplv = hplv ? hplv : 0;
        return Number(hplv);
    },

    setMyCarId: function(id)
    {
        cc.sys.localStorage.setItem("mycarId",id);
    },

    getMyCarId: function()
    {
        var id = cc.sys.localStorage.getItem("mycarId");
        id = id ? id : 0;
        return Number(id);
    },

    isMyCarId: function(id)
    {
        var ids = this.getMyCarIds();
        var idstr = id+",";
        if(ids.indexOf(idstr) > -1)
            return true;
        return false;
    },

    addMyCarIds: function(id)
    {
        if(!this.isMyCarId(id))
        {
            var ids = this.getMyCarIds();
            cc.sys.localStorage.setItem("mycarIds",ids + (id+","));

            if(this.getJieSuoNum()>=3)
            {
                this.addMyCarIds(6);
            }
        }
    },

    setMyCarIds: function(ids)
    {
        cc.sys.localStorage.setItem("mycarIds",ids);
    },

    getMyCarIds: function()
    {
        var ids = cc.sys.localStorage.getItem("mycarIds");
        ids = ids ? ids : "";
        return ids;
    },

    setShouYiTime: function(time)
    {
        cc.sys.localStorage.setItem("shouyi_time",time);
    },

    getShouYiTime: function()
    {
        var time = cc.sys.localStorage.getItem("shouyi_time");
        time = time ? time : 0;
        return Number(time);
    },

    getShouYiX2: function()
    {
        var time = this.getShouYiTime();
        var now = new Date().getTime();
        var t = now - time;

        return (t < 2*60*60*1000 && t >= 0);
    },

    setLoginTime: function(time)
    {
        cc.sys.localStorage.setItem("login_time",time);
    },

    getLoginTime: function()
    {
        var time = cc.sys.localStorage.getItem("login_time");
        time = time ? time : 0;
        return Number(time);
    },

    setLoginDay: function(day)
    {
        cc.sys.localStorage.setItem("login_day",day);
    },

    getLoginDay: function()
    {
        var day = cc.sys.localStorage.getItem("login_day");
        day = day ? day : 0;
        return Number(day);
    },

    setCarVedio: function(carId,num)
    {
        cc.sys.localStorage.setItem("carvedio_"+carId,num);
    },

    getCarVedio: function(carId)
    {
        var num = cc.sys.localStorage.getItem("carvedio_"+carId);
        num = num ? num : 0;
        return Number(num);
    },

    setCarShare: function(carId,num)
    {
        cc.sys.localStorage.setItem("carshare_"+carId,num);
    },

    getCarShare: function(carId)
    {
        var num = cc.sys.localStorage.getItem("carshare_"+carId);
        num = num ? num : 0;
        return Number(num);
    },

    setGameNum: function(num)
    {
        cc.sys.localStorage.setItem("game_num",num);
        if(num>=10 && num < 12)
        {
            this.addMyCarIds(4);
        }
    },

    getGameNum: function()
    {
        var num = cc.sys.localStorage.getItem("game_num");
        num = num ? num : 0;
        return Number(num);
    },

    setKillCarNum: function(num)
    {
        cc.sys.localStorage.setItem("killcar_num",num);

        if(num>=500 && num <= 502)
        {
            this.addMyCarIds(5);
        }

        if(num>=1000 && num <= 1002)
        {
            this.addMyCarIds(9);
        }
    },

    getKillCarNum: function()
    {
        var num = cc.sys.localStorage.getItem("killcar_num");
        num = num ? num : 0;
        return Number(num);
    },

    getJieSuoNum: function()
    {
        var ids = this.getMyCarIds();
        return ids.split(",").length - 1;
    },

    getLvUpNum: function()
    {
        return this.getSpeedLv()+this.getHitLv()+this.getHotLv()+this.getHpLv();
    },

    //随机一个视频升级 0：没有  1，2，3，4
    setRandLv: function(type)
    {
        cc.sys.localStorage.setItem("randlv",type);
        this.setRandLvTime(new Date().getTime());
    },

    getRandLv: function()
    {
        var type = cc.sys.localStorage.getItem("randlv");
        type = type ? type : 0;
        return Number(type);
    },

    setRandLvTime: function(time)
    {
        cc.sys.localStorage.setItem("randlv_time",time);
    },

    getRandLvTime: function()
    {
        var time = cc.sys.localStorage.getItem("randlv_time");
        time = time ? time : 0;
        return Number(time);
    },

    setMusic: function(music)
    {
        cc.sys.localStorage.setItem("music",music);
    },
    getMusic: function()
    {
        var music = cc.sys.localStorage.getItem("music");
        music = music ? music : 0;
        return Number(music);
    },

    setSound: function(sound)
    {
        cc.sys.localStorage.setItem("sound",sound);
    },
    getSound: function()
    {
        var sound = cc.sys.localStorage.getItem("sound");
        sound = sound ? sound : 0;
        return Number(sound);
    },

    setVibrate: function(vibrate)
    {
        cc.sys.localStorage.setItem("vibrate",vibrate);
    },
    getVibrate: function()
    {
        var vibrate = cc.sys.localStorage.getItem("vibrate");
        vibrate = vibrate ? vibrate : 0;
        return Number(vibrate);
    },

    setAddSpeed: function(addspeed)
    {
        cc.sys.localStorage.setItem("addspeed",addspeed);
    },
    getAddSpeed: function()
    {
        var addspeed = cc.sys.localStorage.getItem("addspeed");
        addspeed = addspeed ? addspeed : 0;
        return Number(addspeed);
    },

    setAdCloseTime: function(time)
    {
        cc.sys.localStorage.setItem("adclose_time",time);
    },
    getAdCloseTime: function()
    {
        var time = cc.sys.localStorage.getItem("adclose_time");
        time = time ? time : 0;
        return Number(time);
    },

    setAdCloseNum: function(num)
    {
        cc.sys.localStorage.setItem("adclose_num",num);
    },
    getAdCloseNum: function()
    {
        var num = cc.sys.localStorage.getItem("adclose_num");
        num = num ? num : 0;
        return Number(num);
    },

    setYinDao: function(yindao)
    {
        cc.sys.localStorage.setItem("yindao",yindao);
    },
    getYinDao: function()
    {
        var yindao = cc.sys.localStorage.getItem("yindao");
        yindao = yindao ? yindao : 0;
        return Number(yindao);
    },

    scientificToNumber: function(num) {
        var str = num.toString();
        /*6e7或6e+7 都会自动转换数值*/
        var index = str.indexOf("e+");
        if (index == -1) {
            return str;
        } else {
            /*6e-7 需要手动转换*/
            var head = str.substr(0,index);
            var zero = '';
            var len = parseInt(str.substr(index+2,str.length));
            if(head.indexOf(".")>=0)
            {
                var h = head.split(".");
                head = h[0]+h[1];
                len = len - h[1].length;
            }
            for(var i=0;i<len;i++)
            {
                zero += '0';
            }
            return head + zero;
        }
    },


    castPoint: function(coin)
    {
        coin = Math.floor(coin);
        var str = this.scientificToNumber(coin);
        var s = '';
        var n = 0;
        if(str.length>3)
            n = parseInt((str.length-1)/3);
        if(n>0)
        {
            coin = parseFloat(coin/Math.pow(1000,n));//.toFixed(0);
        }
        str = coin+"";
        var l = str.split(".")[0].split("").reverse();
        for (var i = 0; i < l.length; i++) {
            s += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        s = s.split("").reverse().join("");
        if(n>0)
        {
            //var r = str.split(".")[1];
            //s = s + "." + r;
            s += this.pice[n-1];
        }
        return s;
    },

    getLabelStr: function(str,num)
    {
        var s = "";
        var len = 0;
        for (var i=0; i<str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
            else {
                len+=2;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
        }
        return s;
    }
};