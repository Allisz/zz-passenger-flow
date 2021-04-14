//部署
const base = "http://192.168.101.38:7007/api";
const wsBase = "ws://192.168.101.38:7007/api";
module.exports = {
    pageApi: {
        //获取统计
        getCount: base + '/getCount',
        //获取今日客流总数
        getTodayCount:base + '/screenShowFlow/todayPassengerSum',
        //获取历史客流总数
        getHistoryCount:base + '/screenShowFlow/historyPassengerSum',
        //获取历史客流总数
        getMaleRatio:base + '/screenShowFlow/maleFemaleRate',
        //人脸路径
        getFaceRoute:base + '/screenShowFlow/faceTrajectoryRecord',

    },
    wsApi: {
        wsUrl: wsBase + '/imserver/changru',
    }
}