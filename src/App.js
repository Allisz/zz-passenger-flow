import './App.scss';
import React, {useState, useEffect} from "react";
import dayjs from "dayjs";
//api
import api from "./utils/api";
import {pageApi,wsApi} from "./utils/apiPath";
import {RESULT_STATUS, VIDEO_LOCATION,ROUTE_COLOR_ARR} from './utils/statusConst';
//component
import {DrawCurve, FaceRoute, FlowHistory, FlowToday, GenderItem} from "./components/AppComponents";
//source
import imageMale from './resources/images/male.png';
import imageFemale from './resources/images/female.png';
import imageRateCaption from "./resources/images/male-rate-caption.png";
import imageRouteCaption from "./resources/images/face-route-caption.png";
import imageCamera from "./resources/images/camera-icon.png";
import image0 from "./resources/images/route-pink.png";
import image1 from "./resources/images/route-blue.png";
import image2 from "./resources/images/route-green.png";
import image3 from "./resources/images/route-violet.png";
import image4 from "./resources/images/route-yellow.png";
//default
require('dayjs/locale/zh-cn');
dayjs.locale('zh-cn');
let eCharts = require("echarts/lib/echarts");
require('echarts/lib/chart/pie');



function App() {
    //页头时间 -
    const [nowTime, setNowTime] = useState(dayjs().format("HH:mm"));
    const [nowTimeTrigger, setNowTimeTrigger] = useState(dayjs().format("HH:mm:ss"));
    const [nowDate, setNowDate] = useState(dayjs().format("YYYY/MM/DD dddd"));
    useEffect(() => {
        const id = setTimeout(() => {
            setNowTime(dayjs().format("HH:mm"))
            setNowTimeTrigger(dayjs().format("HH:mm:ss"))
            setNowDate(dayjs().format("YYYY/MM/DD dddd"))
        }, 1000);
        return () => clearTimeout(id);
    }, [nowTimeTrigger]);
    //今日客流总数
    const [flowTodayCount, setFlowTodayCount] = useState(0);
    useEffect(()=>{
        function fetchData() {
            api.get(pageApi.getTodayCount, {}).then(json => {
                let {status, data} = json;
                if (status === RESULT_STATUS.SUCCESS) {
                    setFlowTodayCount(data);
                }
            })
        }
        fetchData();
    },[])
    //历史客流总数
    const [flowHistoryCount, setFlowHistoryCount] = useState(0);
    useEffect(()=>{
        function fetchData() {
            api.get(pageApi.getHistoryCount, {}).then(json => {
                let {status, data} = json;
                if (status === RESULT_STATUS.SUCCESS) {
                    setFlowHistoryCount(data);
                }
            })
        }
        fetchData();
    },[])
    //获取男女比例
    const [maleRatio, setMaleRatio] = useState({man:0.5,women:0.5});
    useEffect(()=>{
        function fetchData() {
            api.get(pageApi.getMaleRatio, {}).then(json => {
                let {status, data} = json;
                if (status === RESULT_STATUS.SUCCESS) {
                    setMaleRatio(data);
                }
            })
        }
        fetchData();
    },[])
    //绘制分析饼图
    useEffect(() => {
        function drawPie() {
            let myChart = eCharts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            let option = {
                color: ["#0001FF", "#E6009F"],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                series: [{
                    type: 'pie',
                    radius: ['32%', '52%'],
                    data: [{
                        value: maleRatio.man*100,
                        name: `男性 ${maleRatio.man*100}%`,
                    }, {
                        value: maleRatio.women*100,
                        name: `女性 ${maleRatio.women*100}%`,
                    },
                    ],
                    label: {
                        fontSize: 20,
                        color: "#fff",
                    },
                    labelLine: {
                        lineStyle: {
                            color: "#4BA1AD"
                        },
                    },
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

        drawPie();
    }, [maleRatio]);
    //人脸轨迹
    const [faceRoute,setFaceRoute] = useState([]);
    // useEffect(()=>{
    //         function fetchData() {
    //             api.get(pageApi.getFaceRoute, {}).then(json => {
    //                 console.log("json ",json)
    //                 let {status, data} = json;
    //                 if (status === RESULT_STATUS.SUCCESS) {
    //                     setFaceRoute(data);
    //                 }
    //             })
    //         }
    //
    //         fetchData();
    // },[])
    // //轨迹绘制
    // useEffect(()=>{
    //     function drawRoute() {
    //         faceRoute.map((value,index)=>{
    //             value.pathList.reduce((total,current,currentIndex)=>{
    //                 // console.log(index,total.tag,current.tag,VIDEO_LOCATION[total.tag],VIDEO_LOCATION[current.tag],ROUTE_COLOR_ARR[index],currentIndex-1,index)
    //                 if (total.tag){
    //                     DrawCurve(VIDEO_LOCATION[total.tag],VIDEO_LOCATION[current.tag],ROUTE_COLOR_ARR[index],currentIndex-1,index,3);
    //                 }
    //                 return current
    //             })
    //         })
    //     }
    //
    //    if (faceRoute.length<6&&clear()===1){
    //        drawRoute();
    //    }
    // },[faceRoute])
    //
    // //后台数据推送
    // useEffect(() => {
    //     let lockReconnect = false; //避免重复连接
    //     let ws = null; //WebSocket的引用
    //     let wsUrl = wsApi.wsUrl; //
    //     function createWebSocket(url) {
    //         try {
    //             if ('WebSocket' in window) {
    //                 ws = new WebSocket(wsUrl);
    //             } else {
    //                 console.log("不支持WebSocket>>>")
    //                 // ws = new SockJS("http://" + url + "/sockjs/socketServer");
    //             }
    //             initEventHandle();
    //         } catch (e) {
    //             reconnect(wsUrl);
    //         }
    //     }
    //
    //     function reconnect(url) {
    //         if (lockReconnect) return;
    //         lockReconnect = true;
    //         //没连接上会一直重连，设置延迟避免请求过多
    //         setTimeout(function() {
    //             createWebSocket(wsUrl);
    //             console.log("正在重连，当前时间" + new Date())
    //             lockReconnect = false;
    //         }, 5000); //这里设置重连间隔(ms)
    //     }
    //
    //     function initEventHandle() {
    //         // 连接成功建立后响应
    //         ws.onopen = function() {
    //             console.log("连接成功....." + wsUrl);
    //             ws.send("changru");
    //         }
    //         // 收到服务器消息后响应
    //         ws.onmessage = function(evt) {
    //             console.log('收到消息.....',new Date());
    //             // let socketData = JSON.parse( JSON.parse(evt.data));
    //             console.log('消息数据......', evt);
    //             // if(socketData.ranking){
    //             //     setRankList(socketData.ranking);
    //             // }
    //             // if(socketData.videoList){
    //             //     setVideoDataList(socketData.videoList);
    //             // }
    //             // if(socketData.getCount){
    //             //     setCountData(socketData.getCount);
    //             // }
    //             // if(socketData.cityList){
    //             //     setCityList(socketData.cityList);
    //             // }
    //             // if(socketData.mainBuilding){
    //             //     setMainBuildingData(socketData.mainBuilding);
    //             // }
    //         }
    //         // 连接关闭后响应
    //         ws.onclose = function(evt) {
    //             console.log("关闭连接......");
    //             reconnect(wsUrl); //重连
    //         }
    //         ws.onerror = function(evt) {
    //             console.log("ws发生错误......");
    //             reconnect(wsUrl); //重连
    //         };
    //     }
    //     createWebSocket();
    //     return () => {
    //         ws.close();
    //     }
    // }, []);
    //
    // function clear() {
    //     const canvas = document.getElementById('myCanvas');
    //     const ctx = canvas.getContext('2d');
    //     ctx.clearRect(0,0,canvas.width,canvas.height)
    //
    //     return 1;
    // }


    return (

        <div className="App">
            <div className="flex flow-time-head">
                <div className="left"> {nowTime}</div>
                <div className="right"> {nowDate}</div>
            </div>
            <div className="flex">
                <div className="content-body-left">
                    <div className="flex" style={{justifyContent:"space-between"}}>
                        <FlowToday flowTodayCount={flowTodayCount}/>
                        <FlowHistory flowHistoryCount={flowHistoryCount}/>
                    </div>
                    <div className="map-draw">
                        <img src={imageCamera} alt="" className="map-camera-icon" style={{left:"67%",top:"90%"}}/>
                        <img src={imageCamera} alt="" className="map-camera-icon" style={{left:"41%",top:"81%"}}/>
                        <img src={imageCamera} alt="" className="map-camera-icon" style={{left:"44.5%",top:"71%"}}/>
                        <img src={imageCamera} alt="" className="map-camera-icon" style={{left:"43.5%",top:"34%"}}/>
                        <img src={imageCamera} alt="" className="map-camera-icon" style={{left:"9%",top:"24%"}}/>
                        <img src={imageCamera} alt="" className="map-camera-icon" style={{left:"7%",top:"65%"}}/>
                        <canvas id="myCanvas" width="1000" height="1000"  className="map-draw-canvas"/>
                    </div>
                </div>

                <div className="content-body-center"/>

                <div className="content-body-right">

                    <img src={imageRateCaption} alt="" className="caption-image"/>
                    <div className="flex-column ">
                        <div className="flex gender-line">
                            <GenderItem
                                name='男性访客'
                                icon={imageMale}
                                percent={maleRatio.man*100}/>
                            <div className="divide"/>
                            <GenderItem
                                name='女性访客'
                                icon={imageFemale}
                                percent={maleRatio.women*100}/>
                        </div>
                    </div>

                    <div id="main" className="pie-rate"/>
                    <img src={imageRouteCaption} alt="" className="caption-image"/>

                    <div className="flex rank-title">
                        <div className="rank-title-left">人脸</div>
                        <div className="rank-title-right">轨迹线</div>
                    </div>
                    <FaceRoute routeIcon={image0} />
                    <FaceRoute routeIcon={image1} />
                    <FaceRoute routeIcon={image2} />
                    <FaceRoute routeIcon={image3} />
                    <FaceRoute routeIcon={image4} />
                </div>
            </div>

        </div>
    );
}

export default App;
