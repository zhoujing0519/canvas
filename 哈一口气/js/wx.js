function wxReady(fc) {

    $.ajax({
        url: '/componet/jssdk'// 此处url请求地址需要替换成你自己实际项目中服务器数字签名服务地址
        , type: 'post'
        , data: {
            urls: window.location.href.split('#')[0], // 将当前URL地址上传至服务器用于产生数字签名
            appid:siteinfo.appid
        }

    }).done(function (r) {
        // 返回了数字签名对象
        console.log(r);


        // 开始配置微信JS-SDK
        wx.config({
            debug: false,
            appId: siteinfo.appid,
            timestamp: r.timestamp,
            nonceStr: r.nonceStr,
            signature: r.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'chooseImage',
                'hideAllNonBaseMenuItem',
                'uploadImage',
                'startRecord',
                'stopRecord',
                'translateVoice',
                'addCard',
                'chooseCard',
                'openCard',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem'
            ]
        });

        // 调用微信API
        wx.ready(function () {
            if (fc) {
                fc();
            }
            // wx.hideAllNonBaseMenuItem();

        });

    });
}
