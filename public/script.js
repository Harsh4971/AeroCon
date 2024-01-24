const socket = io('/');         //Importing socket.io in js file
const videoGrid = document.querySelector('.video-grid');
const myVideo = document.createElement('video');        //myVideo is an element created using js of type videoto show our video
const ul = document.querySelector('ul');
myVideo.muted = true;       //to mute our own video

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({     //getuserMedia here is a promise
    video: true,
    audio: true
}).then(stream => {             //Stream here is the output of the navigator.mediaDevices.getUserMedia
    myVideoStream = stream;     //This isn't required
    addVideoStream(myVideo, stream);        //calling the function and passing the input given by user wether to use video audio or not along with myVideo  

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
            console.log("Checking");
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

    let text = document.querySelector('input');

    document.querySelector('html').addEventListener('keydown', (e) => {
        if (e.keyCode === 13 && text.value.length !== 0) {
            // console.log(text.value);
            socket.emit('message', text.value);
            text.value = '';
        }
    })

    socket.on('createMessage', message => {
        ul.innerHTML += `<li class = "message">${message}</li>`;
    })

    scrollToBottom();
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);       //Establishing the connection with this js file and passing the RoomId parameter in it
})


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {             //addVideoStream is a function that takes two parameters video and stream
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

// const scrollToBottom = () => {
//     let mainChatWindow = document.querySelector('.main__chat__window');
//     mainChatWindow.scrollTop = mainChatWindow.scrollHeight;
// }

const scrollToBottom = () => {
    let mainChatWindow = document.querySelector('.main__chat__window');
    mainChatWindow.scrollTop = mainChatWindow.scrollHeight;
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `<i class="fa-solid fa-microphone"></i>
                  <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fa-solid fa-microphone-slash"></i>
                  <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () => {
    const html = `<i class="stop fa-solid fa-video-slash"></i>
                  <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `<i class="fa-solid fa-video"></i>
                  <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}