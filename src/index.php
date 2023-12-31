<!DOCTYPE html>
<html>

<head>
    <script src="/static/js/jquery-3.2.1.min.js"></script>
    <script src="/static/js/bootstrap.bundle.min.js"></script>
    <link href="/static/bootstrap-4.2.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="/static/fontawesome/css/all.css" rel="stylesheet">
    <link href="/watch.css" rel="stylesheet">

    <script type="text/javascript">
        const api_key = "<?php echo ($_ENV["YOUTUBE_KEY"]); ?>"
    </script>

    <title>Multivideo - Francelsoft</title>

    <link href="/static/favicon.ico" rel="icon" type="image/x-icon">
</head>

<body>
    <div id="control_panel">
        <div class="panel_time"></div>

        <div id="sounds">
            <button class="muteAll" onclick="muteAll()" data-toggle="tooltip" data-placement="top" title="Mute All">
                <i class="fas fa-volume-off"></i>
            </button>

        </div>


        <button class="resetSyncbtn" onclick="resetSync()" data-toggle="tooltip" data-placement="top" title="Reset"><i
                class="fas fa-undo"></i></button>
        <button class="syncbtn" onclick="goLiveAll()" data-toggle="tooltip" data-placement="top" title="Go LIVE">
            <i class="fas fa-sync-alt"></i></button>
        <button class="ratiobtn" onclick="changeVratio()" data-toggle="tooltip" data-placement="top"
            title="Change Ratio">16:9</button>
        <button class="playbtn" onclick="playPauseAll()" data-toggle="tooltip" data-placement="top"
            title="Play/Pause"></button>
        <button class="autoVolume" data-toggle="tooltip" data-placement="top" title="Rotate Sound">
            <i class="fas fa-volume-up"></i><i class="fas fa-recycle"></i><br>
        </button>
        <input type="text" id="autoVolumeSec" value="30" data-toggle="tooltip" data-placement="right"
            title="Enter the sound rotation interval(sec)">
        <div class="form-group panel_range">
            <input type="range" class="form-control-range" id="formControlRange" value="0" step="1">
        </div>
    </div>
    <script src="/watch.js"></script>
    <script src="/drag.js"></script>
    <script src="/youtubeapi.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            const urlParams = new URLSearchParams(window.location.search);
            const videosParam = urlParams.get('videos');
            const videosIds = videosParam.split(",")
            console.log(videosIds)


            if (urlParams.has('ch')) {
                const channlesParam = urlParams.get('ch');
                var chIds = channlesParam.split(",")

                getVideosFromChannels(chIds)
            }

            createPanel(videosIds)


            addVideo();


            dragElement(document.getElementById("control_panel"));
            // allPause();
        });
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })

        $(document).keydown(function (e) {
            //Numbers, hear that screen
            var d = Number(e.key)
            var isNumber = d > 0 && d <= params.length
            if (!e.ctrlKey && isNumber) {
                hear(d - 1)
                return;
            }

            if (e.ctrlKey && isNumber) {
                e.preventDefault();

                loadClip(d - 1)
            }

            if (e.key == "m" || d == 0) {
                console.log("shortcut for: mute all")
                muteAll();
                return
            }

            if (e.key == "+") {
                loadClip(-1)
            }

        });
    </script>
</body>

</html>