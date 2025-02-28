
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder;
var recordedBlobs;
var sourceBuffer;
var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');

var recordButton = document.querySelector('button#record');
var playButton = document.querySelector('button#play');
var downloadButton = document.querySelector('button#download');
var uploadButton = document.querySelector('button#upload');

recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;
uploadButton.onclick = upload;

// window.isSecureContext could be used for Chrome
var isSecureOrigin = location.protocol === 'https:' ||
    location.hostname === 'localhost';
// if (!isSecureOrigin) {
//   alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
//     '\n\nChanging protocol to HTTPS');
//   location.protocol = 'HTTPS';
// }

var constraints = {
    audio: true,
    video: true
};

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream: ', stream);
    window.stream = stream;
    gumVideo.srcObject = stream;
}

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

recordedVideo.addEventListener('error', function (ev) {
    console.error('MediaRecording.recordedMedia.error()');
    alert('Your browser can not play\n\n' + recordedVideo.src
        + '\n\n media clip. event: ' + JSON.stringify(ev));
}, true);

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
}

function toggleRecording() {
    if (recordButton.textContent === 'Start Recording') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        playButton.disabled = false;
        downloadButton.disabled = false;
        uploadButton.disabled = false;
    }
}
function startRecording() {
    recordedBlobs = [];
    var options = {mimeType: 'video/webm;codecs=vp9'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: 'video/webm;codecs=vp8'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: ''};
            }
        }
    }
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: '
            + e + '. mimeType: ' + options.mimeType);
        return;
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
    uploadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}
function stopRecording() {
    mediaRecorder.stop();
    var videoName = document.createElement("input");
    videoName.setAttribute('type', 'text');
    videoName.setAttribute('value', 'default');
    mediaRecorder.disabled = true;
    console.log('Recorded Blobs: ', recordedBlobs);
    recordedVideo.controls = true;
}
function play() {
    var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    // workaround for non-seekable video taken from
    // https://bugs.chromium.org/p/chromium/issues/detail?id=642012#c23
    recordedVideo.addEventListener('loadedmetadata', function () {
        if (recordedVideo.duration === Infinity) {
            recordedVideo.currentTime = 1e101;
            recordedVideo.ontimeupdate = function () {
                recordedVideo.currentTime = 0;
                recordedVideo.ontimeupdate = function () {
                    delete recordedVideo.ontimeupdate;
                    recordedVideo.play();
                };
            };
        }
    });
}
function download() {
    var blob = new Blob(recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}
function createObjectURL(file) {
    if (window.webkitURL) {
        return window.webkitURL.createObjectURL(file);
    } else if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(file);
    } else {
        return null;
    }
}
function upload() {
    if(webVideoRecordObj.check_login){
        var ajax_nonce=webVideoRecordObj.create_nonce;
        var name=document.getElementById("custom_post_title").value;
        //   alert(name);
        var descrtipt=document.getElementById("custom_post_description").value;
        //   alert(descrtipt);
        var blob = new Blob(recordedBlobs, {type: 'video/webm'});
        var url = webVideoRecordObj.createWebVideoAjaxUrl;
        var dataValue = new FormData();
        dataValue.append('action','webVideoUpload');
        dataValue.append('file', blob);
        dataValue.append('webVideoSecurity',ajax_nonce);
        dataValue.append('custom_post_title', name);
        dataValue.append('custom_post_description', descrtipt);
//                console.log(dataValue);
        jQuery.ajax({
            type:"post",
            url: url,
            data:dataValue,
            contentType:false,
            processData:false,
            success:function (message) {
                alert(message);
                document.getElementById("custom_post_title").value=" ";
                document.getElementById("custom_post_description").value=" ";
            },
            error:function (err) {
                console.log(err);
            }

        });
    }
    else {
        alert("User should be logged in to upload video");
    }
}/**
 * Created by Nitu on 3/12/2018.
 */
