export const HTTP_STATUS = {
    SUCCESS: 200,
    CLIENT_ERROR: 400,
    AUTHENTICATE: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
}

// promise status
export const SUCCESS = {success: 'success'}
export const FAIL = {fail: 'fail'}
export const COMPLETE = {complete: 'complete'}

export const PROMISE_STATUS = {
    success: 'success',
    fail: 'fail',
    complete: 'complete'
}

export const RESULT_STATUS = {
    SUCCESS: 200,
    SIGNATURE_FAILED: 1000  // 签名失败
}

//人脸轨迹路径颜色
export const ROUTE_COLOR = {
    PINK:"rgba(230,0,159,1)",
    BLUE:"rgba(0,1,255,1)",
    GREEN:"rgba(53,199,29,1)",
    VIOLET:"rgba(100,13,226,1)",
    YELLOW:"rgba(233,143,54,1)",
}
export const ROUTE_COLOR_ARR = [
    "rgba(230,0,159,1)",
    "rgba(0,1,255,1)",
    "rgba(53,199,29,1)",
    "rgba(100,13,226,1)",
    "rgba(233,143,54,1)",
]

//摄像头位置
export const VIDEO_LOCATION={
    A:{x:680,y:970},
    B:{x:420,y:870},
    C:{x:450,y:780},
    D:{x:440,y:385},
    E:{x:100,y:260},
    F:{x:80,y:720},
}