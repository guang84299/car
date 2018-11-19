/**
 * Created by guang on 18/7/18.
 */

module.exports = {

    myCarSpeed: 250,
    myCarRotateSpeed: 120,
    myCarEatRange: 100,

    carLv:[
        {lv:1,speed:0.95,rotateSpeed:0.8},
        {lv:2,speed:1.1,rotateSpeed:1.0},
        {lv:3,speed:1.5,rotateSpeed:1.2},
        {lv:4,speed:1.8,rotateSpeed:1.5}
    ],

    carLevel: [
        {m:1,lv1:1.0,lv2:0,lv3:0,lv4:0,num:3},
        {m:2,lv1:0.8,lv2:0.2,lv3:0,lv4:0,num:4},
        {m:3,lv1:0.5,lv2:0.5,lv3:0,lv4:0,num:5},
        {m:4,lv1:0.4,lv2:0.5,lv3:0.1,lv4:0,num:5},
        {m:5,lv1:0.3,lv2:0.5,lv3:0.2,lv4:0,num:6},
        {m:6,lv1:0.1,lv2:0.6,lv3:0.2,lv4:0.1,num:6},
        {m:7,lv1:0.05,lv2:0.5,lv3:0.3,lv4:0.15,num:7},
        {m:8,lv1:0.05,lv2:0.45,lv3:0.3,lv4:0.2,num:7},
        {m:9,lv1:0,lv2:0.45,lv3:0.35,lv4:0.2,num:8},
        {m:10,lv1:0,lv2:0.4,lv3:0.4,lv4:0.2,num:8},
        {m:11,lv1:0,lv2:0.35,lv3:0.45,lv4:0.2,num:9},
        {m:12,lv1:0,lv2:0.3,lv3:0.5,lv4:0.2,num:9},
        {m:13,lv1:0,lv2:0.25,lv3:0.45,lv4:0.3,num:10},
        {m:14,lv1:0,lv2:0.2,lv3:0.4,lv4:0.4,num:10},
        {m:15,lv1:0,lv2:0.1,lv3:0.4,lv4:0.5,num:10},
        {m:16,lv1:0,lv2:0.05,lv3:0.35,lv4:0.6,num:11},
        {m:17,lv1:0,lv2:0,lv3:0.3,lv4:0.7,num:11},
        {m:18,lv1:0,lv2:0,lv3:0.3,lv4:0.7,num:11},
        {m:19,lv1:0,lv2:0,lv3:0.3,lv4:0.7,num:12},
        {m:20,lv1:0,lv2:0,lv3:0.3,lv4:0.7,num:12}
    ],

    //加速时间升级
    myCarUp: [
        {lv:1,time:8,cost:0},
        {lv:2,time:10,cost:1000},
        {lv:3,time:11.5,cost:5000},
        {lv:4,time:12.8,cost:10000},
        {lv:5,time:13.9,cost:30000},
        {lv:6,time:14.9,cost:80000},
        {lv:7,time:15.8,cost:150000},
        {lv:8,time:16.6,cost:300000},
        {lv:9,time:17.3,cost:500000},
        {lv:10,time:18,cost:1000000}
    ],

    //复仇
    myCarHit: [
        {lv:1,time:10,cost:0},
        {lv:2,time:11,cost:3000},
        {lv:3,time:12,cost:10000},
        {lv:4,time:13,cost:40000},
        {lv:5,time:14,cost:100000},
        {lv:6,time:15,cost:200000},
        {lv:7,time:15.5,cost:500000},
        {lv:8,time:16,cost:1000000},
        {lv:9,time:16.5,cost:2000000},
        {lv:10,time:17,cost:5000000}
    ],

    //暴走
    myCarHot: [
        {lv:1,time:6,cost:0},
        {lv:2,time:6.5,cost:2000},
        {lv:3,time:7,cost:4000},
        {lv:4,time:7.5,cost:8000},
        {lv:5,time:8,cost:14000},
        {lv:6,time:8.5,cost:20000},
        {lv:7,time:9,cost:40000},
        {lv:8,time:9.5,cost:80000},
        {lv:9,time:10,cost:150000},
        {lv:10,time:10.5,cost:300000}
    ],

    //生命
    myCarHp: [
        {lv:0,num:1,cost:0},
        {lv:1,num:2,cost:5000},
        {lv:2,num:3,cost:10000},
        {lv:3,num:4,cost:1000000},
        {lv:4,num:5,cost:2000000}
    ]
};