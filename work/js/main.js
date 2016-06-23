'use strict';

// navigator.getUserMedia = navigator.getUserMedia ||
//   navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//
// var constraints = {
//   audio: true,
//   video: true
// };
//
// var video = document.querySelector('video');
//
// function successCallback(stream) {
//   window.stream = stream;
//   if (window.URL) {
//     video.src = window.URL.createObjectURL(stream);
//   } else {
//     video.src = stream;
//   }
// }
//
// function errorCallback(error) {
//   console.warn('navigator.getUserMedia error: ', error);
// }
//
// navigator.getUserMedia(constraints, successCallback, errorCallback);


const startButton = document.getElementById('startButton')
const callButton = document.getElementById('callButton')
const hangupButton = document.getElementById('hangupButton')

callButton.disabled = true
hangupButton.disabled = true
startButton.onclick = start
callButton.onclick = call
hangupButton.onclick = hangup

const localVideo = document.getElementById('localVideo')
const offerOptions = {
  offerToReceiveVideo: 1,
  offerToReceiveAudio: 1
}
const remoteVideo = document.getElementById('remoteVideo')

let startTime
let localStream
let firstPeerConnection
let secondPeerConnection

loadedMetaData(localVideo)
loadedMetaData(remoteVideo)

function loadedMetaData(element) {
  element.addEventListener('loadedmetadata', () => {
    trace(`Local video videoWidth: ${element.videoWidth}px, videoHeight: ${element.videoHeight}px`)
  })
}

remoteVideo.onresize = () => {
  trace(`Remote video videoWidth: ${remoteVideo.videoWidth}px, videoHeight: ${remoteVideo.videoHeight}`)
  if (startTime) {
    const elapsedTime = window.performance.now() - startTime
    trace(`Setup time: ${elapsedTime.toFixed(3)}ms`)
    startTime = null
  }
}

const getName = pc => {
  return (pc === firstPeerConnection) ? 'pc1' : 'pc2'
}

const gotStream = stream => {
  trace('Received local stream')
  localVideo.srcObject = stream
  window.localStream = localStream = stream;
  callButton.disabled = false
}

const getOtherPeerConnection = pc => {
  return (firstPeerConnection === pc) ? secondPeerConnection : firstPeerConnection
}

function start() {
  trace('Requesting local stream')
  startButton.disabled = true
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
  .then(gotStream)
  .catch(e => alert(`getUserMedia() error: ${e.name}`))
}



function trace(text) {
  if (window.performance) {
    const now = (window.performance.now() / 1000).toFixed(3)
    console.info(`${now}: ${text}`)
  } else {
    console.info(text)
  }
}

function start() {
  const videoTracks = localStream.getVideoTracks
  const audioTracks = localStream.getAudioTracks

  let servers = null

  callButton.disabled = true
  hangupButton.disabled = false
  trace('Starting call')
  startTime = window.performance.now()

  if (videoTracks.length > 0) trace(`Using video device: ${videoTracks[0].label}`)
  if (audioTracks.length > 0) trace(`Using audio device: ${audioTracks[0].label}`)

  window.firstPeerConnection = firstPeerConnection = new RTCPeerConnection(servers)
  trace('Created local peer connection object firstPeerConnection')
  firstPeerConnection.onicecandidate = e =>

}


function call() {}
function hangup() {}


function onIceCandidate(pc, event) {
  if (event.candidate) {
    getOtherPc(pc).addIceCandidate()
  }
}
