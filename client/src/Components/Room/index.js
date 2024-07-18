import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { saveAs } from 'file-saver';
import { RiCamera2Fill } from 'react-icons/ri'; // Import camera icon
import './RoomPage.css'; // Import external CSS file

const RoomPage = () => {
  const { roomId } = useParams();
  const meetingContainer = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  let mediaRecorder = useRef(null);

  useEffect(() => {
    const myMeeting = async () => {
      const appID = 1327144137;
      const serverSecret = "6d187c5585f114ad2d5c026ccb65fd0a";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), "Adarsh_Raut");
      const zc = ZegoUIKitPrebuilt.create(kitToken);

      zc.joinRoom({
        container: meetingContainer.current,
        sharedLinks: [{
          name: 'Copy Link',
          url: `http://localhost:3000/room/${roomId}`
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        onRecordingStatusUpdate: (status) => {
          console.log('Recording status:', status);
          if (status === 'recording') {
            startRecording();
          } else if (status === 'stopped') {
            stopRecording();
          }
        },
      });

      const startRecording = () => {
        // Start capturing the screen
        navigator.mediaDevices.getDisplayMedia({ video: true })
          .then((stream) => {
            // Create a MediaRecorder instance
            mediaRecorder.current = new MediaRecorder(stream);

            // Create an array to store the recorded data chunks
            const chunks = [];

            // Event handler for data available event
            mediaRecorder.current.ondataavailable = (e) => {
              chunks.push(e.data);
            };

            // Event handler for recording stopped event
            mediaRecorder.current.onstop = () => {
              // Convert the chunks into a single Blob data
              const blob = new Blob(chunks, { type: 'video/webm' });

              // Save the recorded file locally
              saveAs(blob, 'recorded-video.webm');

              // Reset the chunks array
              chunks.length = 0;
            };

            // Start recording
            mediaRecorder.current.start();
            setIsRecording(true);
          })
          .catch((error) => {
            console.error('Error capturing screen:', error);
          });
      };

      const stopRecording = () => {
        if (mediaRecorder.current) {
          // Stop recording
          mediaRecorder.current.stop();
          setIsRecording(false);
        }
      };

      // Expose the start and stop recording functions
      window.startRecording = startRecording;
      window.stopRecording = stopRecording;
    };

    myMeeting();
  }, [roomId]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={meetingContainer} />
      <div className="recording-button">
        {!isRecording ? (
          <button onClick={() => window.startRecording()}>
            <RiCamera2Fill size={24} />
          </button>
        ) : (
          <button onClick={() => window.stopRecording()}>
            <RiCamera2Fill size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
