function Loading(fc) {
    var _url = siteinfo.url_cdn;
    var reslist = [];
    reslist.push(_url + 'img/bg_loading.png');
    reslist.push(_url + 'img/btn_att_bottom.png');
    reslist.push(_url + 'img/btn_bottom.png?t=1');
    reslist.push(_url + 'img/btn_close_bottom.png');
    reslist.push(_url + 'img/btn_close_intro.png');
    reslist.push(_url + 'img/btn_gift.png');
    reslist.push(_url + 'img/btn_intro.png');
    reslist.push(_url + 'img/btn_play.png');
    reslist.push(_url + 'img/btn_redo.png');
    reslist.push(_url + 'img/btn_share.png');
    reslist.push(_url + 'img/foo.png');
    reslist.push(_url + 'img/loading.png');
    reslist.push(_url + 'img/logo.png');
    reslist.push(_url + 'img/mask.png');
    reslist.push(_url + 'img/notice.png');
    reslist.push(_url + 'img/pai_att.png');
    reslist.push(_url + 'img/ParticleSmoke.png');
    reslist.push(_url + 'img/pic_pop_bottom.png');
    reslist.push(_url + 'img/s1.png');
    //reslist.push(_url + 'img/s2.png');
    if (siteinfo.isfans) {
        reslist.push(_url + 'img/s3.png');
        reslist.push(_url + 'img/t1.png');
    }
    else {
        reslist.push(_url + 'img/t1B.png');
       // reslist.push(siteinfo.workUrl);
    }
    reslist.push(_url + 'img/t2_1.png');
    reslist.push(_url + 'img/t2_2.png');
    reslist.push(_url + 'img/t2.png');
    reslist.push(_url + 'img/t3.png');
    reslist.push(_url + 'img/tip_share.png');


    for (var i = 0; i < 25; i++) {
        reslist.push(_url + 'img/smoke_small/a' + i + '.png')
    }
    var loadMax = reslist.length;
    var loadNum = 0;
    var loadNow = 0;
    $.imgpreload(reslist,
        {
            each: function () {
                loadNum++;
                loadNow = parseInt((loadNum / loadMax) * 100);
                //console.log(loadNow);
                $("#loading_num").html(loadNow);
            },
            all: function () {
                // callback invoked when all images have loaded
                // this = array of dom image objects
                // check for success with: $(this[i]).data('loaded')
                $("img[data-src]").each(function () {
                    $(this).attr("src", $(this).attr("data-src"));
                });
                if (fc) {
                    fc()
                }
            }
        });
    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);
}
function MaskShare() {
    console.log('MaskShare()');
    $(".mask_share").show();
    siteinfo.workShared=1;

}
function WriteCanvas() {
    var timer_notice=0;
    $(".smoke").fadeOut(2000);
    $(".foo").fadeIn(2000, function () {
        $(".mask").hide();
        $(".notice").fadeIn(300,function(){
            //$(".btn_write").fadeIn(1000);
            timer_notice=setTimeout(function () {
                $(".notice").fadeOut(300,function(){
                    $(".btn_write").fadeIn(1000)
                });
            }, 1500);
        });
    });

    $(".s2,.s3").fadeOut(2000);

    $(".notice")[0].addEventListener('touchstart', function (event) {
        event.preventDefault();
        clearTimeout(timer_notice);
        $(".notice").fadeOut(300,function(){
            $(".btn_write").fadeIn(1000)
        });
    }, false);


}

//咖啡水汽
function SmokeAnim(fc) {
    var canvas = document.getElementById('smoke_canvas'), 
        ctx = canvas.getContext("2d");


    var timer = 0;
    var reslist = [];
    var _url = siteinfo.url_cdn;
    for (var i = 0; i < 25; i++) {
        reslist.push(_url + 'img/smoke_small/a' + i + '.png')
    }
    var i_s = 0;

    function changeSmoke() {
        var img = new Image();
        img.src = reslist[i_s];
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            i_s++;
            if (i_s >= reslist.length) {
                clearInterval(timer);

                if (fc) {
                    fc()
                }
            }
        }

    }

    $(".smoke").show();
    changeSmoke();
    timer = setInterval(changeSmoke, 80);
}
//雪花
function SnowAnim(elem) {
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var container;

    var particle;

    var camera;
    var scene;
    var renderer;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var particles = [];
    var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
    particleImage.src = siteinfo.url_cdn + 'img/ParticleSmoke.png';


    function init() {

        container = document.getElementById(elem);
        //document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
        camera.position.z = 300;

        scene = new THREE.Scene();
        scene.add(camera);

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        var material = new THREE.ParticleBasicMaterial({map: new THREE.Texture(particleImage)});

        for (var i = 0; i < 200; i++) {

            particle = new Particle3D(material);
            particle.position.x = Math.random() * 2000 - 1000;
            particle.position.y = Math.random() * 2000 - 1000;
            particle.position.z = Math.random() * 2000 - 1000;
            particle.scale.x = particle.scale.y = 1;
            scene.add(particle);

            particles.push(particle);
        }

        container.appendChild(renderer.domElement);


        //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        //document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        /* document.addEventListener('touchmove', function (event) {
         event.preventDefault();
         }, false);*/

        setInterval(loop, 1000 / 30);

    }

    function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart(event) {

        if (event.touches.length == 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(event) {

        if (event.touches.length == 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

//

    function loop() {

        for (var i = 0; i < particles.length; i++) {

            var particle = particles[i];
            particle.updatePhysics();

            with (particle.position) {
                if (y < -1000) y += 2000;
                if (x > 1000) x -= 2000;
                else if (x < -1000) x += 2000;
                if (z > 1000) z -= 2000;
                else if (z < -1000) z += 2000;
            }
        }

        camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        camera.position.y += ( -mouseY - camera.position.y ) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);


    }

    init();
}
//哈气
function Distinguish(fc) {

    var timer_ns = 0;
    var x_start = [];
    var n_index = 0;
    var length_x = 0;
    var sport = 0;
    var x_obj = {
        start: 0, end: 0
    }
    var num_action = 0;//哈气次数

    function controlRecord(timer) {


        wx.startRecord({
            success:function(res){
               // alert("开始录音success");
                var timerRecord = 0;
                //clearTimeout(timerRecord);

                timerRecord = setTimeout(function () {
                    scene_transIng();
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                            clearTimeout(timerRecord);
                            wx.translateVoice({
                                localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                                isShowProgressTips: 0, // 默认为1，显示进度提示
                                success: function (res) {

                                    var str_tran = res.translateResult || "嗯";
                                    //alert(str_tran); // 语音识别的结果
                                    if (getRecord(str_tran)) {
                                        //alert("匹配成功!");
                                        scene_transSucces();//识别成功
                                        //$(".test").html('识别结果：' + res.translateResult + '<br>是否匹配：是<br>匹配字库：' + '"呵","喝","和","哈","啊","妈","我","爱"');

                                    }
                                    else {
                                        //alert("启动失败："+res.translateResult);

                                        scene_transFail();
                                        //$(".test").html('识别结果：' + res.translateResult + '<br>是否匹配：否<br>匹配字库：' + '"呵","喝","和","哈","啊","妈","我","爱"');

                                    }
                                    //alert('识别结果：' + res.translateResult);
                                    clearTimeout(timerRecord);

                                },
                                fail: function () {
                                    //alert("识别失败")
                                    scene_transFail();
                                    clearTimeout(timerRecord);
                                }
                            });
                        },
                        fail: function () {

                            scene_transFail();
                            clearTimeout(timerRecord);
                        }
                    });
                }, timer);
            },
            cancel:function(){
               // alert("用户取消录音");
                scene_transSucces()
            }
        });
        //$(".test").html("湿度测算中。。。");



    }

    function getRecord(str) {
        var wordArayy = ["呵", "喝", "和", "哈", "啊", "妈", "我", "爱","好","哦","哎","发","阿","吃","百度","ps"];
        var wordNum = 0;
        var wordResult = false;
        for (var i = 0; i < wordArayy.length; i++) {
            var wordIndex = str.indexOf(wordArayy[i]);
            if (wordIndex >= 0) {
                wordNum++
            }
        }
        if (wordNum > 0) {
            wordResult = true;
        }
        return wordResult;
    }

//界面：识别中
    function scene_transIng() {

        // $(".tip").fadeOut();
        $(".t1,.t3").fadeOut();
        $(".t2").fadeIn();
        changeText();
        // $(".s2").addClass("s2_anim").show();
        //$(".s2").fadeIn(3000);
        x_obj.start = 0;
        x_obj.end = 0;
        _hmt.push(['_trackEvent', '场景', '场景_哈气', '场景_哈气_识别中']);
    }

//界面：识别失败
    function scene_transFail() {
        num_action++;
        if (num_action <= 1) {
            $(".tip").fadeOut();
            $(".t3").fadeIn();
            $(".s2").fadeOut(1000);
            //addMove();
            setTimeout(function () {
                //controlRecord(3000)
                scene_transIng();
                setTimeout(scene_transSucces, 3000);
            }, 2000);
        }
        else {
            //scene_transIng();
            //setTimeout(scene_transSucces, 1000);
            //num_action = 0;
        }

        _hmt.push(['_trackEvent', '场景', '场景_哈气', '场景_哈气_识别失败']);
    }

//界面：识别成功
    function scene_transSucces() {
        $(".tip").fadeOut(2000);
        //$(".t2").fadeOut(2000);
        //$(".s2").hide();
        //setTimeout(function(){},1000);
        $(".s3").fadeIn(2000);
        if (fc) {
            fc()
        }
        wx.stopRecord();
    }

    var n_s2, x_end;//仰卧起坐状态：0：坐直；1：动作完成
    function sport2(event) {
        sport = 1;
        var x = event.beta;
        var y = event.gamma;
        var z = event.alpha;

        length_x = x_start.push(x);

        n_index++;
        x_obj.start = x_start[1];
        x_obj.end = x_start[n_index - 1];
        //$("#x_start").val(x_start[1]);
        //$("#x_end").val(x_start[n_index-1]);
        //$(".test").html("x1:"+$("#x_start").val()+"x2:"+$("#x_end").val());


    }

    function addMove() {

        removeMove();
        x_obj.start = x_obj.end = 0;
        setTimeout(function () {
            window.addEventListener("deviceorientation", sport2, true);
        }, 600)

        timer_ns = setInterval(function () {
            //alert(sport);
            if (sport == 1) {
                //alert(x_obj.start);
                //alert(x_obj.end);
                //$(".test").html("x1:" + x_obj.start + "<br>x2:" + x_obj.end + "<br>x1-x2:" + (x_obj.end - x_obj.start));

                if (Math.abs(x_obj.end - x_obj.start) >= 4) {
                    controlRecord(5000);
                    removeMove();
                    x_start.length = 0;
                    x_start = [];
                    n_index = 0;
                    clearInterval(timer_ns);
                }
            }

        }, 500);


    }

    function removeMove() {
        window.removeEventListener("deviceorientation", sport2, true);
        x_obj.start = 0;
        x_obj.end = 0;
    }

    var timer_text = 0;
    var text_index = 0;

    function changeText() {
        clearInterval(timer_text);
        timer_text = setInterval(function () {
            text_index++;
            if (text_index < 4) {
                $(".text").hide().eq(text_index - 1).show();
            }
            else {
                text_index = 0;
            }
        }, 700)
    }

    addMove();
}
function savework(obj, fc) {

    $.post("savework", {touch_xy:obj.touch_xy}, function (docs) {
        if (fc) {
            fc(docs);
        }
    }, "json")
}
function getwork(obj, fc) {
    $.post("work", {workid:obj.workid}, function (docs) {
        if (fc) {
            fc(docs);
        }
    }, "json")
}
function sharedshow() {
    $(".mask_share,.pic,.foo").hide();
    $(".scene_shared").show();
    $(".btn_bottom_png").hide()
}