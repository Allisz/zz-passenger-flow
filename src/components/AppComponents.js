import portraitBlank from "../resources/images/portrait-blank.png"
import image0 from "../resources/images/route-pink.png";
import image1 from "../resources/images/route-blue.png";
import image2 from "../resources/images/route-green.png";
import image3 from "../resources/images/route-violet.png";
import image4 from "../resources/images/route-yellow.png";
import React from "react";
import {thousands} from "../utils/SystemFunction";

//图片预加载
function preload(images) {
    let imageRoute = [];
    for (let i = 0; i < images.length; i++) {
        imageRoute[i] = new Image()
        imageRoute[i].src = images[i]
    }

}

//性别比例
export const GenderItem = ({icon, name, percent}) => {
    return (
        <div className="flex gender-item">
            <div className="image-div">
                <img src={icon} alt="" className="image-icon"/>
            </div>
            <div className="flex-column">
                <div className="name">{name}</div>
                <div className="percent">{percent}%</div>
            </div>
        </div>
    )
};

//人脸轨迹
export const FaceRoute = ({faceIcon, faceId, routeIcon, style}) => {
    // let preImage=[image0, image1, image2, image3, image4];
    // preload(preImage);

    return <div className="flex route-item" style={style}>
        <div className="rank-title-left"><img src={faceIcon ? faceIcon : portraitBlank} className="face-icon" alt=""/>
        </div>
        <div className="rank-title-right"><img src={routeIcon} alt="" className="route-icon"/></div>
    </div>;

}

//今日客流总数
export const FlowToday = ({flowTodayCount}) => {
    let arr = flowTodayCount.toString().split('');
    if (arr.length<4){
        for (let i = 0;  i <= 4 - arr.length;i++) {
            arr.unshift("0")
        }
    }
    return <div className="flow-today">
        <div className="flow-today-font">今日客流总数</div>
        <div className="flex all-count-line">
            {arr.map((value, index) =>
                <div key={index} className="flex count">{value}</div>
            )}
        </div>
    </div>
}
//历史客流总数
export const FlowHistory = ({flowHistoryCount}) => {
    return <div className="flow-history">
        <div className="flex flow-history-title">
            <div className="flow-history-icon"/>
            历史客流总数
            <div className="flow-history-opacity">(仅统计过去一年)</div>
        </div>
        <div className="flow-history-number">
            {thousands(flowHistoryCount)}
        </div>
    </div>
}

//人脸轨迹 绘图
export function DrawCurve(p0, p2, color, time,length,routeTime) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let SC = {...p0};
    let B = {...p0};
    let startTime;
    const duration = routeTime*1000;
    let count = 1;
    let prevX;
    let prevY;
    let prevAngelX;
    let prevAngelY;

    let randomPoint = [{
        x: p0.x + (Math.floor(Math.random()) * 2 - 1) * 60+length*20,
        y: p2.y + (Math.floor(Math.random()) * 2 - 1) * 60+length*20,
    }, {x: p2.x + (Math.floor(Math.random()) * 2 - 1) * 60+length*20, y: p0.y + (Math.floor(Math.random()) * 2 - 1) * 60+length*20}]
    const p1 = randomPoint[Math.floor(Math.random() * randomPoint.length)];
    let temp = Math.sqrt(Math.pow((p2.x - p0.x), 2) + Math.pow((p2.y - p0.y), 2));
    const countTe = Math.floor(temp / 200) + 1
    const countPer = 9 - countTe
    const countDuration = Math.floor((duration / 1000) * 30)

    // 计算出子控制点的坐标
    function calSC(t) {
        SC.x = p0.x + (p1.x - p0.x) * t;
        SC.y = p0.y + (p1.y - p0.y) * t;
    }

    // 计算出子贝塞尔曲线的终点
    function calB(t) {
        B.x = Math.pow(1 - t, 2) * p0.x + 2 * t * (1 - t) * p1.x + Math.pow(t, 2) * p2.x;
        B.y = Math.pow(1 - t, 2) * p0.y + 2 * t * (1 - t) * p1.y + Math.pow(t, 2) * p2.y;
    }

    const step = (currentTime) => {
        !startTime && (startTime = currentTime);
        const timeElapsed = currentTime - startTime;
        let progress = Math.min(timeElapsed / duration, 1);
        //绘制
        const draw = () => {
            ctx.beginPath();
            ctx.moveTo(B.x, B.y);
            prevX = B.x;
            prevY = B.y;
            calB(progress);
            calSC(progress);
            if (count === countDuration - 5) {
                prevAngelX = B.x;
                prevAngelY = B.y;
            }

            if (count % countPer === 0) {
                ctx.quadraticCurveTo(prevX, prevY, B.x, B.y);
                ctx.strokeStyle = color;
                ctx.stroke();
            } else {
                if (count === countDuration || count === (countDuration + 1)) {
                    let tempPoint = calAngel({x: prevAngelX, y: prevAngelY}, B, countTe + 1)
                    ctx.moveTo(tempPoint.a.x, tempPoint.a.y)
                    ctx.lineTo(B.x, B.y);
                    ctx.lineTo(tempPoint.b.x, tempPoint.b.y)
                    ctx.fillStyle = color;
                    ctx.fill()
                    ctx.moveTo(tempPoint.b.x, tempPoint.b.y)
                    ctx.strokeStyle = color;
                    ctx.lineTo(tempPoint.a.x, tempPoint.a.y)
                    ctx.stroke();
                }
            }
        }

        draw();
        if (progress < 1) {
            count++
            requestAnimationFrame(step)
        } else {
            console.log('动画执行完毕')
        }
    }

    setTimeout(() => {
        requestAnimationFrame(step)
    }, time * routeTime*1000+500*(time+1))

}

//计算直角三角形坐标
export function calAngel(p0, p1, l) {
    let temp = Math.sqrt(Math.pow((p1.x - p0.x), 2) + Math.pow((p1.y - p0.y), 2));
    let a = {
        x: p0.x + (l * (p1.y - p0.y)) / temp,
        y: p0.y - (l * (p1.x - p0.x)) / temp,
    }
    let b = {
        x: p0.x - (l * (p1.y - p0.y)) / temp,
        y: p0.y + (l * (p1.x - p0.x)) / temp,
    }
    return {a, b};
}