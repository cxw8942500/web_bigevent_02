$(function () {
    var layer = layui.layer
    var form = layui.form
    //1.获取文章的数据
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //2.添加文章分类
    var indexAdd = null
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类',
            area: ['500px', '250px'],
            type: 1,
            content: $('#tableAdd').html() //这里content是一个普通的String
        });
    })

    //2.1确认添加，给表单添加监听事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //重新调用渲染文章数据
                initArtCateList()
                //关闭弹出框
                layer.close(indexAdd)
            }
        })
    })


    //3.编辑功能
    var indexEait = null
    $('tbody').on('click', '.btn-eait', function () {
        indexEait = layer.open({
            title: '添加文章分类',
            area: ['500px', '250px'],
            type: 1,
            content: $('#dialog-edit').html() //这里content是一个普通的String
        });
        //3.1获取Id，发送ajax获取数据，渲染到页面
        var id = $(this).attr('data-in')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form_edit', res.data)

            }
        })
    })
    //3.2编辑功能确认提交
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //重新获取渲染
                initArtCateList()
                //关闭弹出框
                layer.close(indexEait)
            }
        })
    })

    //4.删除功能
    $('tbody').on('click', '.btn-dele', function () {
        var id = $(this).attr('data-in')
        layer.confirm('是否删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //发送ajax
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //重新渲染
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })

})