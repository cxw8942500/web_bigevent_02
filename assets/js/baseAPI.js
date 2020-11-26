//1.开发环境服务器
var baseURL = 'http://ajax.frontend.itheima.net'
//2.测试环境服务器
// var baseURL = 'http://ajax.frontend.itheima.net'
//3.生产环境服务器
// var baseURL = 'http://ajax.frontend.itheima.net'

//拦截所有的ajax请求，
$.ajaxPrefilter(function (params) {
    //1.拼接对应环境的服务器地址
    params.url = baseURL + params.url


    //2.对需要权限的接口配置头信息
    // 必须以/my/开头才行
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //3.拦截所有的响应，判断身份认证信息
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === "身份认证失败！") {
            //1.清空本地token
            localStorage.removeItem('token')
            //2.页面跳转
            location.href = '/login.html'
        }
    }
})