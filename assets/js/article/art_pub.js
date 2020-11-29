$(function () {
    //1.获取文章分类列表
    var layer = layui.layer
    var form = layui.form
    initCate()
    //封装一个获取文章列表的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //1.1渲染分类列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //重新调用layui渲染
                form.render()
            }
        })
    }
    //2.初始化富文本编辑器
    initEditor()

    //3.
    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)


    //4.上传文件
    $('#btnCover').on('click', function () {
        $('#btnSelect').click()
    })


    //5.文件框添加change事件
    $('#btnSelect').on('change', function (e) {
        var file = e.target.files[0]
        //5.1非空校验
        if (file === undefined) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //6.发布和存为草稿
    var state = null
    $('#release1').on('click', function () {
        state = '发布'
    })
    $('#release2').on('click', function () {
        state = '存为草稿'
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //6.1
        var fd = new FormData(this)
        fd.append('state', state)
        //6.2
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // console.log(blob);
                fd.append('cover_img', blob)

                //6.3调用增加分类列表的函数
                initaddCate(fd)
            })
    })

    //封装一个增加分类的函数
    function initaddCate(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // location.href = '/article/art_list.html'
                window.parent.document.querySelector('#click-list').click()
            }
        })
    }
})