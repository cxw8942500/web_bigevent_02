$(function () {
            //1.获取用户信息
            getUserInof()

            //2.退出
            var layer = layui.layer
            $('#loginout').on('click', function () {
                layer.confirm('是否退出？', {
                    icon: 3,
                    title: '提示'
                }, function (index) {
                    //清除本地存的token
                    localStorage.removeItem('token')
                    //跳转页面
                    location.href = '/login.html'
                    // 关闭询问框
                    layer.close(index);
                });
            })
            //获取用户的基本信息，因为后面要用，所以要定义全局的函数
            function getUserInof() {
                $.ajax({
                    method: 'get',
                    url: '/my/userinfo',
                    // headers: {
                    //     Authorization: localStorage.getItem('token') || ''
                    // },
                    success: function (res) {
                        console.log(res);
                        if (res.status !== 0) {
                            return layer.msg(res.message, {
                                icon: 5
                            });
                        }
                        //请求成功，渲染用户头像
                        renderAvatar(res.data)
                    }
                })
            }

            //封装一个渲染头像的函数
            function renderAvatar(user) {
                //1.用户名，昵称优先，没有的话就用username
                var name = user.nickname || user.username
                $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
                //2.用户头像
                if (user.user_pic !== null) {
                    //有头像
                    $('.text-avatar').hide()
                    $('.layui-nav-img').attr('src', user.user_pic).show()
                } else {
                    //没有头像
                    $('.layui-nav-img').hide()
                    var text = name[0].toUpperCase()
                    $('.text-avatar').html(text).show()
                }
            }
        })