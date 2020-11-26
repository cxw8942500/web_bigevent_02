$(function () {
    //1.自定义表单验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入1 ~ 6位之间'
            }
        }
    })
    //2.调用渲染函数
    initUserInfo()
    //封装一个渲染函数
    var layer = layui.layer

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                // 获取成功后给表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        //阻止重置
        e.preventDefault()
        // 从新渲染用户
        initUserInfo()
    })
    //4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                layer.msg(res.message, {
                    icon: 6
                })
                // 调用父页面中的更新用户和方法
                window.parent.getUserInof()
            }
        })
    })

})