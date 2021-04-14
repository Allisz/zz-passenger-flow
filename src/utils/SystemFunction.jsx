export var Global = (function(){
    function deepCopy(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    return {
        deepCopy: deepCopy
    }

}());

// 数字千分位用逗号分割
export var thousands = function(num){
    if(!num) {
        return 0;
    }
    var str = num.toString();
    var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg,"$1,");
};

// 数字补零
export var PrefixInteger = function(num, length){
    return (Array(length).join('0') + num).slice(-length);
};