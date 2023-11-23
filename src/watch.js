const silenceColor = "#202020"
const muteAllColor = "#a62828"
const hearingColor = "#574de4"

var isMuted = false;
var lastHearing = 0

var params = new Array;
var videos = [];
var vCount = 0;
//Buttons
var playBtn = $(".playbtn");
var muteAllBtn = $(".muteAll:first");
var autoVolume = $(".autoVolume");
var bAutoVolume = false;
var moveRange = false;
var playing = false;
var vRatio = { 'width': 16, 'height': 9 };

$("#mute_1").on('click', function (e) {
    if (e.which == 2) {
        e.preventDefault();
        alert("middle button");
    }
});

// Yvideo Class
function Yvideo() {
    this.id;
    this.url;
    this.videoId;
    this.sTime = 0;//Start time(sec)
    this.ReferenceTime = 0;
    this.player;//Youtube Player
    this.loaded = false;
    this.status = -1;
    this.focused = false;
    this.addDiv = addDivBox;
    this.setSeek = setSeek;
    this.doSync = syncTime;
    this.muteBtn;

}
function syncTime(idx) {
    //console.log('sync: ' + idx);
    if (!videos[idx].focused) {
        var rtime = videos[idx].player.playerInfo.mediaReferenceTime;
        videos[idx].ReferenceTime = rtime;
    }
    // Sync Panel-Range
    if (!moveRange && idx == 'player_0') {
        var dTime = videos[idx].ReferenceTime;
        var dTimeFormat = new Date(dTime * 1000).toISOString().substr(11, 8);
        $('#formControlRange').prop('value', dTime);
        $('.panel_time').html(dTimeFormat);
    }
    setTimeout(syncTime, 10, idx);
}
function setSeek(secTime) {
    console.log('setSeek - ' + secTime);
    this.player.seekTo(secTime, true);
}
function addDivBox() {
    var parentDiv = $('body');
    var youtubeDiv = document.createElement('div');
    youtubeDiv.classList.add('div_viewer');
    youtubeDiv.setAttribute("id", "p_" + this.id);
    parentDiv.append(youtubeDiv);
    // add youtube video

    this.player = new YT.Player("p_" + this.id, {
        videoId: this.videoId,
        events: {
            'width': '100%',
            'height': '100%',
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        },
        playerVars: {
            // 'autoplay': 1,
            "enablejsapi": 1,
            'origin': window.location.origin,
            "color": "white"
        }
    });
}
// Yvideo Class End

function muteAll() {
    console.log("muting")

    if (isMuted) {
        hear(lastHearing)
        return
    }

    videos.forEach(v => {
        v.player.mute()
        v.muteBtn.style.color = silenceColor;
    })

    isMuted = true
    muteAllBtn.addClass("muted")
}

//base 0
function hear(vi) {
    videos.forEach(v => {
        if (v.id == vi) {
            v.muteBtn.style.color = hearingColor
            v.player.unMute()
        } else {
            v.muteBtn.style.color = silenceColor;
            v.player.mute()
        }
    })

    lastHearing = vi

    isMuted = false
    muteAllBtn.removeClass("muted")
}

function onPlayerReady(event) {
    var state = event.target.getPlayerState()

    //Not playing (1) or buffering (3), start video
    if (state != 1 && state != 3) {
        event.target.playVideo()
    }

    videos[event.target.id - 1].loaded = true

    if (videos.every(x => x.loaded)) {
        onAllPlayerReady();
    }

}

function onAllPlayerReady() {
    console.log("all loaded")
    if (!videos.every(v => v.player.getPlayerState() == 1)) {
        videos.forEach(x => x.player.getPlayerState() != 1 ? x.player.playVideo() : "")
        setTimeout(onAllPlayerReady, 1000)
        return;
    }

    console.log("all playing")
    hear(0)
    goLiveAll()

}

function retryStart() {

    onAllPlayerReady()
}

function onPlayerStateChange(event) {

    if (videos.every(v => v.player.getPlayerState() == 1)) {
        playBtn.addClass("paused")
    } else {
        playBtn.removeClass("paused")
    }
}
function allPlay() {
    videos.forEach(v => v.player.playVideo())
    playing = true;
}
function allPause() {
    videos.forEach(v => v.player.pauseVideo())
    playing = false;
}

function goLiveAll() {
    videos.forEach(v => v.player.seekTo(v.player.getDuration()))
}


//Add Videos
function addVideo() {
    if ((typeof YT !== "undefined") && YT && YT.Player) {
        for (var v in params) {
            var video = new Yvideo();
            video.videoId = params[v]['v'];
            video.sTime = params[v]['t'];
            video.id = vCount;

            videos[vCount] = video;
            videos[vCount].addDiv();

            video.muteBtn = $("#mute_" + vCount)[0]

            vCount += 1;
        }
        setSize();
        initPanelPos();
    } else {
        setTimeout(addVideo, 100);
    }
}

//crea
function createPanel(videosIds) {
    var soundsDiv = document.getElementById('sounds')

    var currLeft = 3
    var i = 1;
    videosIds.forEach(vId => {
        params.push({ 'v': vId, 't': '0' });

        let id = i - 1;

        var btn = document.createElement('button');
        btn.className = "soundbtn"
        btn.id = "mute_" + id;
        btn.setAttribute('data-toggle', "tooltip")
        btn.setAttribute("data-placement", "top")
        btn.onclick = x => hear(id)

        btn.setAttribute("title", "Audio " + i++)

        btn.style.left = currLeft + "px";
        currLeft += 30

        btn.setAttribute("lef", currLeft)
        var spn = document.createElement("i")
        spn.className = "fas fa-volume-up"

        btn.appendChild(spn)

        soundsDiv.appendChild(btn)
    });
}


$(window).resize(function () {
    setSize();
    initPanelPos();
});

// set Iframe Size
function setSize() {
    //console.log('setSize()');
    var doc_width = document.documentElement.clientWidth;
    var doc_height = document.documentElement.clientHeight;
    var r_width;
    var r_height;
    var totalArea = doc_width * doc_height;
    var remainRatio = 1.0;
    var bestCol = 0;
    var view_count = videos.length;
    for (var col = 1; col <= view_count; col++) {
        var width = doc_width / col;
        var rows = Math.ceil(view_count / col);
        var height = width * (vRatio['height'] / vRatio['width']);
        if ((height * rows) > doc_height) {
            height = doc_height / rows;
            width = height * (vRatio['width'] / vRatio['height']);
        }

        var nowRatio = (totalArea - (width * height * view_count)) / totalArea;
        if (nowRatio >= 0 && nowRatio <= remainRatio) {
            remainRatio = nowRatio;
            r_width = width;
            r_height = height;
            bestCol = col;
        }
        //console.log('Best(' + bestCol + ')-remainRatio:' + remainRatio);
    }
    //set Youtube Iframe size.
    var viewer = $('.div_viewer');
    viewer.css('width', r_width + 'px');
    viewer.css('height', r_height + 'px');

    //set body padding.
    $('body').css('padding-left', '0px');
    if (doc_width > (r_width * bestCol)) {
        var lMargin = (doc_width - (r_width * bestCol)) / 2;
        $('body').css('padding-left', lMargin + 'px');
    }
    var rows = Math.ceil(view_count / bestCol);

    $('body').css('padding-top', '0px');
    if (doc_height > (r_height * rows)) {
        var tMargin = (doc_height - (r_height * rows)) / 2;
        $('body').css('padding-top', tMargin + 'px');
    }
}

//set Control Panel
function initPanelPos() {
    var doc_width = document.documentElement.clientWidth;
    var doc_height = document.documentElement.clientHeight;
    var pWidth = $('#control_panel').width();
    var pHeigth = $('#control_panel').height();
    $('#control_panel').css('top', (doc_height - pHeigth - 70) + 'px');
    $('#control_panel').css('left', ((doc_width / 2) - (pWidth / 2)) + 'px');
}


function playPauseAll() {
    playBtn.toggleClass("paused");

    playBtn.hasClass('paused') ? allPlay() : allPause();
    return false;
}

//Auto Volume Button Event
autoVolume.click(function () {
    toggleautoVolume();
});
function toggleautoVolume() {

    autoVolume.toggleClass("auto");
    if (autoVolume.hasClass('auto')) {
        bAutoVolume = true;
        changeVolume('player_0');
    } else {
        bAutoVolume = false;
    }
    return false;
}
function changeVolume(vId) {
    //console.log('tick-changeVolume-' + vId);
    if (!bAutoVolume) { return; }
    for (var video in videos) {
        if (video == vId) {
            videos[video].player.unMute();
            for (var n = 1; n < 5; n = n + 2) {
                setTimeout(noticeVol, n * 100, video, 'hidden');
                setTimeout(noticeVol, (n + 1) * 100, video, 'visible');
            }
        } else {
            videos[video].player.mute();
        }
    }
    var aTime = $('#autoVolumeSec').val();
    var idx = parseInt(vId.replace('player_', ''));
    var view_count = Object.keys(videos).length;
    idx = idx + 1;
    if (view_count <= idx) {
        idx = 0
    }
    setTimeout(changeVolume, (aTime * 1000), 'player_' + idx);
}


function noticeVol(vId, visib) {
    $('#' + vId).css('visibility', visib);
}

//Panel-resetSync Button Click Event
function resetSync() {
    console.log('resetSync()');
    for (var video in videos) {
        videos[video].setSeek(videos[video].sTime);
    }
}
//Panel-Sync Button Click Event
function resyncTime() {
    //console.log('syncTime()');
    var totalPlayTime = parseFloat(videos['player_0'].ReferenceTime) - parseFloat(videos['player_0'].sTime);
    for (var video in videos) {
        var setTime = parseFloat(totalPlayTime) + parseFloat(videos[video].sTime)
        videos[video].setSeek(setTime);
    }
}
//Panel-ratio Button Click Event
function changeVratio() {
    var w = vRatio['width'];
    var h = vRatio['height'];
    vRatio['width'] = h;
    vRatio['height'] = w;
    $('.ratiobtn').html(vRatio['width'] + ':' + vRatio['height']);
    setSize();
}

//Panel-Range Moving Event
$('#formControlRange').focus(function () {
    moveRange = true;
});
$('#formControlRange').blur(function () {
    moveRange = false;
});
$('#formControlRange').on('change', function () {
    videos['player_0'].setSeek($(this).val());
    $('#formControlRange').blur();
    setTimeout(resyncTime, 100);
});

function loadClip(vi) {
    navigator.clipboard.readText()
        .then(text => {
            loadByURL(vi, text)
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
}

function loadByURL(vi, url) {
    // https://www.youtube.com/watch?v=cb12KmMMDJA
    id = url.split("v=")[1];
    videos[vi].player.loadVideoById(id)
}