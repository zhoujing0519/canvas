$(function () {

    SnowAnim("snow");
    $(window).scrollTop(0);

    // 写字canvas
    var Canvas_erasure = new erasure({
        elem: 'CanvasDoodle',
        img_src: 'images/foo.png',
        line_width: 10
    });
    // 写字canvas初始化
    Canvas_erasure.init();

    $(".btn_redo_png").click(function () {
        //重新写字
        Canvas_erasure.clearDraw();

        _hmt.push(['_trackEvent', '点击', '点击_重做', '点击_重做']);
        //$("#CanvasDoodle").css({opacity:0.8})
    });

    // 判断横竖屏
    window.addEventListener('orientationchange', function (event) {
        if (window.orientation == 180 || window.orientation == 0) {
            //alert("竖屏");
            //$(".wrap").show()
        }
        if (window.orientation == 90 || window.orientation == -90) {
            //alert("横屏");
            //$(".wrap").hide()
        }
    });


    //var myScroll = new IScroll('.intro_h');
    /*点击分享*/
    $(".btn_share_png").click(function () {
        siteinfo.makeState = 1;
        MaskShare();
        $(".card_waiting").show()
        setTimeout(function () {
            //var _base64 = $("#CanvasDoodle")[0].toDataURL("image/png");
           // console.log(_base64);

            _hmt.push(['_trackEvent', '事件', '事件_作品上传开始', '事件_作品上传开始']);
            //alert(siteinfo.touch_xy)
            savework({
                touch_xy: siteinfo.touch_xy
            }, function (docs) {
                siteinfo.uploaded = 1;
                _hmt.push(['_trackEvent', '事件', '事件_作品上传成功', '事件_作品上传成功']);
                //作品上传成功
                $(".card_waiting").fadeOut();
                $(".tip_share_png").fadeIn();
                var share_obj = {
                    title: siteinfo.title_shareB, // 分享标题
                    desc: siteinfo.desc_shareB,
                    link: 'http://kfc.qizyg.com/fans_only/test.html?workid=' + docs.workid, // 分享链接
                    imgUrl: siteinfo.imgUrl_share, // 分享图标
                    success: function () {
                        _hmt.push(['_trackEvent', '分享', '分享_作品', '分享_作品']);
                        // 用户确认分享后执行的回调函数
                        /*setTimeout(function () {
                            sharedshow();
                            _hmt.push(['_trackEvent', '场景', '场景_蛋挞吊牌', '场景_蛋挞吊牌_分享后']);
                        }, 100)*/

                        $(".mask_share").hide();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    } // 用户取消分享后执行的回调函数

                }
                wx.onMenuShareAppMessage(share_obj);
                wx.onMenuShareTimeline(share_obj);
            })
        }, 100);
    });
    //关闭分享提示层
    $(".mask_share").click(function () {
        $(".mask_share").fadeOut(500,function(){
            $(".tip_share_png").hide()
        });
        _hmt.push(['_trackEvent', '点击', '点击_关闭分享提示', '点击_关闭分享提示']);

    })
    //点击“新粉专享好礼”
    $(".btn_bottom_png").click(function () {
        _hmt.push(['_trackEvent', '场景', '场景_新粉专享好礼', '场景_新粉专享好礼']);
        $(".mask_bottom").show().animate({bottom: "0px"},function(){

        })
    });
    //关闭下部弹层
    $(".btn_close_bottom").click(function () {
        _hmt.push(['_trackEvent', '点击', '点击_关闭下部弹层', '点击_关闭下部弹层']);
        $(".mask_bottom").animate({bottom: "-632px"},function(){
            $(".mask_bottom").hide()
        })
    });
    //点击关注按钮
    $(".btn_att_pai").click(function () {
        _hmt.push(['_trackEvent', '点击', '点击_关注按钮', '点击_关注按钮_吊牌']);
        window.location.href = siteinfo.url_weixin;

    });
    $(".btn_att_bottom").click(function () {
        _hmt.push(['_trackEvent', '点击', '点击_关注按钮', '点击_关注按钮_下部弹层']);
        window.location.href = siteinfo.url_weixin;

    });
    //关闭活动介绍
    $(".btn_close_intro").click(function () {
        $(".mask_intro").fadeOut();
        _hmt.push(['_trackEvent', '点击', '点击_关闭活动介绍', '点击_关闭活动介绍']);
    })
    //点开活动介绍
    $(".btn_intro_png").click(function () {
        $(".mask_intro").fadeIn();
        _hmt.push(['_trackEvent', '场景', '场景_活动介绍', '场景_活动介绍']);
    })

    /*getwork({workid: siteinfo.workid}, function (docs) {
        siteinfo.work_touch_xy = docs.touch_xy
        console.log(siteinfo.work_touch_xy);

        var showWorkCanvas = new CanvasDoodle(document.getElementById('showWork'));
        showWorkCanvas.runDraw();
    })*/
    
    wxReady(function () {
        var share_obj = {
            title: siteinfo.title_share, // 分享标题
            desc: siteinfo.desc_share,
            link: 'http://kfc.qizyg.com/fans_only/test.html', // 分享链接
            imgUrl: siteinfo.imgUrl_share, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                //sharedshow()
                _hmt.push(['_trackEvent', '分享', '分享_活动', '分享_活动']);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            } // 用户取消分享后执行的回调函数
            ,
            trigger: function (docs) {

                if (siteinfo.workShared) {
                    if (!siteinfo.uploaded) {
                        alert("您的贺卡还在努力的上传中哦～")
                    }
                }
            }

        }
        wx.onMenuShareAppMessage(share_obj);
        wx.onMenuShareTimeline(share_obj);
        $(".loading_num").show();
        Loading(function () {
            _hmt.push(['_trackEvent', '场景', '场景_首页', '场景_进入首页']);
            $(".loading_main").fadeOut();
            $(".main").fadeIn(2000);

            Distinguish(function () {

                function userA_amin() {
                    SmokeAnim(function () {
                    });
                    setTimeout(function () {
                        //进入写字场景
                        WriteCanvas();
                        _hmt.push(['_trackEvent', '场景', '场景_写字', '场景_写字_用户A']);
                    }, 0);
                }

                var timer_s3 = 0;
                //如果是fans
                if (siteinfo.isfans == 1) {

                    _hmt.push(['_trackEvent', '场景', '场景_哈气', '场景_哈气_成功A']);
                    timer_s3 = setTimeout(function () {
                        //水汽动画
                        _hmt.push(['_trackEvent', '场景', '场景_咖啡水雾', '场景_咖啡水雾_用户A自动播放']);
                        userA_amin();

                    }, 5000);

                    //$(".mask")[0].addEventListener('touchstart', function (event) {
                    //    event.preventDefault();
                    //    clearTimeout(timer_s3);
                    //    userA_amin();
                    //    _hmt.push(['_trackEvent', '场景', '场景_咖啡水雾', '场景_咖啡水雾_用户A点击播放']);
                    //}, false);
                }
                else {
                    getwork({workid:siteinfo.workid},function(docs){
                        siteinfo.work_touch_xy=docs.touch_xy
                        console.log(siteinfo.work_touch_xy);

                        var showWorkCanvas =new CanvasDoodle(document.getElementById('showWork'));
                        showWorkCanvas.init(function(){
                            showWorkCanvas.runDraw(function(){
                                _hmt.push(['_trackEvent', '场景', '场景_哈气', '场景_哈气_成功B']);
                                $(".btn_gift_png,.btn_play_png").fadeIn(3000);
                                $(".btn_gift_png").click(function () {
                                    //查看关注优惠
                                    sharedshow();
                                    _hmt.push(['_trackEvent', '场景', '场景_蛋挞吊牌', '场景_蛋挞吊牌_用户B']);
                                    $(".btn_gift_png,.btn_play_png").hide();
                                    _hmt.push(['_trackEvent', '点击', '点击_领圣诞礼', '点击_领圣诞礼_用户B']);
                                })
                                $(".btn_play_png").click(function () {
                                    _hmt.push(['_trackEvent', '点击', '点击_写祝福语', '点击_写祝福语_用户B']);
                                    $(".btn_gift_png,.btn_play_png").fadeOut();
                                    //水汽动画
                                    _hmt.push(['_trackEvent', '场景', '场景_咖啡水雾', '场景_咖啡水雾_用户B']);
                                    SmokeAnim(function () {
                                    });
                                    setTimeout(function () {
                                        //进入写字场景
                                        WriteCanvas();
                                        _hmt.push(['_trackEvent', '场景', '场景_写字', '场景_写字_用户B']);
                                    }, 0)

                                });
                            });
                        });

                    })


                }


            });


        });

    });
    _hmt.push(['_trackEvent', '场景', '场景_loading页', '场景_进入loading页']);

});