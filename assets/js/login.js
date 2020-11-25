$(function () {
    // 点击去注册用户，登录页面隐藏，注册页面显示
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录，注册页面隐藏，登录页面隐藏
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //自定义表单验证
    var form = layui.form
    form.verify({
        //密码规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            var pwd = $('.reg-box input[name=password]').val()
            //比较
            if (value !== pwd) {
                return '两次密码输入不一致'
            }
        }
    })

    //注册  获取后台数据
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        //阻止默认表单提交
        e.preventDefault()
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: function (res) {
                //返回状态码判断
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                //提交成功处理代码
                layer.msg(res.message, {
                    icon: 6
                })
                //手动切换到登录表单
                $('#link_login').click()
                //重置注册表单
                $('#form_reg')[0].reset()
            }
        })
    })





    //监听登录表单
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                //判断登录状态码
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                }
                //登录成功
                layer.msg(res.message, {
                    icon: 6
                })
                // 保存token，未来要使用token
                localStorage.setItem('token', res.token)
                // 跳转页面
                location.href = '/index.html'
            }
        })
    })

})