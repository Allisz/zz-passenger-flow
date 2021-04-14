import { HTTP_STATUS, RESULT_STATUS } from './statusConst';
import axios from 'axios';
import { pageApi } from "./apiPath";
let Mock = require('mockjs');
// let requestMock = false;
let requestMock  = true;

function fetchMock() {
    return {
        [`${pageApi.getCount}:GET`]: Mock.mock({
            "code": 200,
            "data": {
                'pv|': 10000000, //总计
                'pvManPercent': 25, //统计男
                'pvWomenPercent': 75, //统计女
                'pvYoungPercent': 98, //
                'pvOldPercent': 1, //老年人
                'pvMidPercent': 1, //中年人
            },
            "status": 200
        }),
        [`${pageApi.getFaceRoute}:GET`]: Mock.mock({
            "code": 200,
            "data":[{
                faceUrl: "",
                route:[1,2,3,4,5,6],
            },],
            "status": 200
        }),
        [`${pageApi.getTodayCount}:GET`]: Mock.mock({
            "code": 200,
            "data":1234,
            "status": 200
        }),
        [`${pageApi.getHistoryCount}:GET`]: Mock.mock({
            "code": 200,
            "data":12345,
            "status": 200
        }),
        [`${pageApi.getMaleRatio}:GET`]: Mock.mock({
            "code": 200,
            "data": {
                "man":0.3,
                "women":0.7,
            },
            "status": 200
        }),
    }
}
const fetch = (options) => {
    const { method = 'get', contentType, data } = options;
    let url = options.url;
    let headers = {
        'Content-Type': contentType
    };
    console.log(`发起${method}请求>>>>>`, url);
    switch (method.toUpperCase()) {
        case 'GET':
            return axios.get(url, {
                params: data,
                headers: headers
            });
        case 'DELETE':
            return axios.delete(url, {
                data: data,
                headers: headers
            });
        case 'POST':
            return axios.post(url, data, {
                headers: headers
            });
        case 'PUT':
            return axios.post(url, data, {
                headers: headers
            });
        default:
            return axios(options)
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    request(options) {
        if (requestMock) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    let mockdata = fetchMock();
                    console.log(options.url + ":" + options.method)
                    let d = mockdata[options.url + ":" + options.method];
                    resolve(d);
                }, 250);
            });
        } else {
            return fetch(options).then((response) => {
                const { status, data } = response;
                if (status === HTTP_STATUS.SUCCESS) {
                    if (data.code !== RESULT_STATUS.SUCCESS) {
                        console.log("接口非成功调用状态");
                        return response;
                    }else{
                        return data;
                    }
                } else {
                    console.log("服务器错误");
                }
            }).catch((error) => {
                console.log('catch error', error);
                return {};
            })
        }
    },
    get(url, data = '') {
        let params = { url, data, method: 'GET' };
        return this.request(params);
    },
    post: function(url, data, contentType = "application/json", showErrorToast = true) {
        let params = { url, data, contentType, showErrorToast, method: 'POST' };
        return this.request(params);
    },
    put: function(url, data, contentType = "application/json") {
        let params = { url, data, contentType, method: 'PUT' };
        return this.request(params);
    },
}