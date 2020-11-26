$(function () {
    //1.定义校验表单
    var form = layui.form
    var layer = layui.layer
    form.verify({
        //1.1密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 1.2新旧密码不重复
        samePwd: function (value) {
            if (value === $('.layui-form input[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        // 1.3两次新密码必须相同
        rePwd: function (value) {
            if (value !== $('.layui-form input[name=newPwd]').val()) {
                return '两次输入不一致'
            }
        }
    })
    // 2.重置密码  表单提交,监听表单
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
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
                });
                window.parent.location = '/login.html'
                $('.layui-form')[0].reset()
            }
        })
    })

})