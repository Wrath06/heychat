let localStream;
let remoteStream;
let localPeerConnection;
let remotePeerConnection;
let roomNameInput = document.getElementById('roomName');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

startButton.addEventListener('click', startVideoChat);
stopButton.addEventListener('click', stopVideoChat);

async function startVideoChat() {
    try {
        const roomName = roomNameInput.value.trim();
        if (!roomName) {
            alert('Please enter a room name.');
            return;
        }

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

        // Signaling: Include room information in signaling messages
        sendSignalingMessage({
            type: 'join-room',
            roomName: roomName
        });
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

    // Signaling: Notify server or peers about leaving the room
    sendSignalingMessage({
        type: 'leave-room'
    });
}

// Function to send signaling messages (to be implemented)
function sendSignalingMessage(message) {
    // This function will send the signaling message to the server or other peers
    console.log('Signaling message:', message);
    // You need to implement this function to handle actual signaling
}
