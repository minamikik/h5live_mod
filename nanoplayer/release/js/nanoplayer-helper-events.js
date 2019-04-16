var events = {};

events.onReady = function (e) {
    log('ready');
    document.getElementById('status').innerText = 'ready';
};
events.onPlay = function (e) {
    log('playing');
    log('play stats: ' + JSON.stringify(e.data));
    document.getElementById('status').innerText = 'playing';
    hideErrorWarning();
};
events.onPause = function (e) {
    var reason = (e.data.reason !== 'normal') ? ' (%reason%)'.replace('%reason%', e.data.reason) : '';
    log('pause' + reason);
    document.getElementById('status').innerText = 'paused' + reason;
};
events.onLoading = function (e) {
    log('loading');
    document.getElementById('status').innerText = 'loading';
};
events.onStartBuffering = function (e) {
    buffering.start = new Date();
    setTimeout(function () {
        if (buffering.start) {
            document.getElementById('status').innerText = 'buffering';
        }
    }, 2000);
};
events.onStopBuffering = function (e) {
    buffering.stop = new Date();
    if (buffering.start) {
        var duration = Math.abs(buffering.stop - buffering.start);
        if (duration > 1000) {
            log('buffering ' + duration + 'ms');
        }
        buffering.stop = buffering.start = 0;
    }
    document.getElementById('status').innerText = 'playing';
};
events.onError = function (e) {
    try {
        var err = JSON.stringify(e);
        if (err === '{}') {
            err = e.message;
        }
        e = err;
    } catch (err) { }
    log('Error = ' + e);
    document.getElementById('error').innerText = e;
    document.getElementById('error-container').style.display = 'block';
};
events.onWarning = function (e) {
    log('Warning = ' + e.data.message);
    document.getElementById('warning').innerText = e.data.message;
    document.getElementById('warning-container').style.display = 'block';
};
events.onMetaData = function (e) {
    var metadata = JSON.stringify(e.data);
    (metadata.length > 100) && (metadata = metadata.substr(0, 100) + '...');
    document.getElementById('metadata').innerText = metadata;
    document.getElementById('metadata-container').style.display = 'block';
    clearTimeout(metaDataTimeout);
    metaDataTimeout = setTimeout(function () { document.getElementById('metadata-container').style.display = 'none'; }, 5000);
    log('onMetaData');
    log(e, true);
};
events.onStats = function (e) {
    var stats = e.data.stats;
    document.getElementById("currentTime").textContent = stats.currentTime.toFixed(1);
    document.getElementById("playTimeStart").textContent = stats.playout.start.toFixed(1);
    document.getElementById("playTimeEnd").textContent = stats.playout.end.toFixed(1);
    document.getElementById("bufferTimeStart").textContent = stats.buffer.start.toFixed(1);
    document.getElementById("bufferTimeEnd").textContent = stats.buffer.end.toFixed(1);
    document.getElementById("bufferTimeDelay").textContent = stats.buffer.delay.avg.toFixed(1);
    document.getElementById("bufferTimeDelayMin").textContent = stats.buffer.delay.min.toFixed(1);
    document.getElementById("bufferTimeDelayMax").textContent = stats.buffer.delay.max.toFixed(1);
    if (stats.bitrate) {
        document.getElementById("bitrateAvg").textContent = (stats.bitrate.avg / 1000).toFixed(0) + ' kbps';
        document.getElementById("bitrateMin").textContent = (stats.bitrate.min / 1000).toFixed(0) + ' kbps';
        document.getElementById("bitrateMax").textContent = (stats.bitrate.max / 1000).toFixed(0) + ' kbps';
    }
    if (stats.framerate) {
        document.getElementById("framerateCurrent").textContent = stats.framerate.current + ' fps';
        document.getElementById("framerateAvg").textContent = (stats.framerate.avg).toFixed(1) + ' fps';
        document.getElementById("framerateMin").textContent = stats.framerate.min + ' fps';
        document.getElementById("framerateMax").textContent = stats.framerate.max + ' fps';
    }
};
events.onMute = function (e) {
    log('onMute');
};
events.onUnmute = function (e) {
    log('onUnmute');
};
events.onVolumeChange = function (e) {
    log('onVolumeChange ' + e.data.volume * 100);
};
events.onStreamInfo = function (e) {
    var streamInfo = JSON.stringify(e.data.streamInfo);
    log('onStreamInfo = ' + streamInfo);
};
events.onStreamInfoUpdate = function (e) {
    var streamInfo = JSON.stringify(e.data.streamInfo);
    log('onStreamInfoUpdate = ' + streamInfo);
};
events.onDestroy = function (e) {
    log('destroy');
    document.getElementById('status').innerText = 'destroy';
};

['change', 'blur', 'input', 'focus', 'keyup'].forEach(function (event) {
    // ['inputUrl', 'inputStreamname'].forEach(function (input) {
    //     document.getElementById(input).addEventListener(event, function (e) {
    //         if (config && config.source && config.source.h5live && e.currentTarget.value.length > 0) {
    //             config.source.h5live.rtmp = config.source.h5live.rtmp || {};
    //             config.source.h5live.rtmp[e.currentTarget.dataset.prop] = e.currentTarget.value;
    //         }
    //     });
    // });
    // document.getElementById('inputServer').addEventListener(event, function (e) {
    //     if (config && config.source && config.source.h5live && e.currentTarget.value.length > 0) {
    //         checkH5Live(e.currentTarget.value);
    //     }
    // });
});


