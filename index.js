let localStream;
let remoteStream;
let localPeerConnection;
let remotePeerConnection;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

startButton.addEventListener('click', startVideoChat);
stopButton.addEventListener('click', stopVideoChat);

async function startVideoChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        let localStream;
        let remoteStream;
        let localPeerConnection;
        let remotePeerConnection;
        
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        
        startButton.addEventListener('click', startVideoChat);
        stopButton.addEventListener('click', stopVideoChat);
        
        async function startVideoChat() {
            roomName = roomInput.value.trim(); // Get the room name entered by the user
    if (!roomName) {
        alert('Please enter a room name.');
        return;
    }
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideo.srcObject = localStream;
        
                // Create local peer connection
                localPeerConnection = new RTCPeerConnection();
                localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));
        
                // Create remote peer connection
                remotePeerConnection = new RTCPeerConnection();
                remotePeerConnection.ontrack = handleRemoteStream;
        
                // Add local stream to remote peer connection
                localPeerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        remotePeerConnection.addIceCandidate(event.candidate);
                    }
                };
        
                // Add remote stream to local peer connection
                localPeerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        remotePeerConnection.addIceCandidate(event.candidate);
                    }
                };
        
                const offer = await localPeerConnection.createOffer();
                await localPeerConnection.setLocalDescription(offer);
                await remotePeerConnection.setRemoteDescription(offer);
        
                const answer = await remotePeerConnection.createAnswer();
                await remotePeerConnection.setLocalDescription(answer);
                await localPeerConnection.setRemoteDescription(answer);
            } catch (error) {
                console.error('Error starting video chat:', error);
            }
        }
        
        function handleRemoteStream(event) {
            remoteVideo.srcObject = event.streams[0];
        }
        
        function stopVideoChat() {
            localStream.getTracks().forEach(track => track.stop());
            localVideo.srcObject = null;
            remoteVideo.srcObject = null;
            localPeerConnection.close();
            remotePeerConnection.close();
        }
        
        // Create local peer connection
        localPeerConnection = new RTCPeerConnection();
        localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));

        // Create remote peer connection
        remotePeerConnection = new RTCPeerConnection();
        remotePeerConnection.ontrack = handleRemoteStream;

        // Add local stream to remote peer connection
        localPeerConnection.onicecandidate = event => {
            if (event.candidate) {
                remotePeerConnection.addIceCandidate(event.candidate);
            }
        };

        // Add remote stream to local peer connection
        localPeerConnection.onicecandidate = event => {
            if (event.candidate) {
                remotePeerConnection.addIceCandidate(event.candidate);
            }
        };

        const offer = await localPeerConnection.createOffer();
        await localPeerConnection.setLocalDescription(offer);
        await remotePeerConnection.setRemoteDescription(offer);

        const answer = await remotePeerConnection.createAnswer();
        await remotePeerConnection.setLocalDescription(answer);
        await localPeerConnection.setRemoteDescription(answer);
    } catch (error) {
        console.error('Error starting video chat:', error);
    }
}

function handleRemoteStream(event) {
    remoteVideo.srcObject = event.streams[0];
}

function stopVideoChat() {
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    localPeerConnection.close();
    remotePeerConnection.close();
}
