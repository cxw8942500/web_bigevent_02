$(function () {
    // 2.定义过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = getZero(dt.getMonth() + 1)
        var d = getZero(dt.getDate())

        var hh = getZero(dt.getHours())
        var mm = getZero(dt.getMinutes())
        var ss = getZero(dt.getSeconds())
        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    }
    //2.1补零函数
    function getZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    var layer = layui.layer
    var form = layui.form

    //1.获取文章数据
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    //3.循环生成所有分类
    initClass()

    function initClass() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-class', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新执行layui
                form.render()
            }
        })
    }

    //4.筛选功能

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //赋值
        q.state = state
        q.cate_id = cate_id
        //调用重新渲染
        initTable()
    })

    //5.分页功能
    var laypage = layui.laypage

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //当前页面

            //分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 回调函数
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }


        })
    }


    //6.删除功能
    $('tbody').on('click', '.btn-dele', function () {
        var id = $(this).attr('data-in')
        layer.confirm('是否删除', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //获取这个页面上有几个删除按钮
                    var indexdel = $('.btn-dele').length
                    if (indexdel == 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


    
})