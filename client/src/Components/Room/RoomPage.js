import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './RoomPage.css';

const RoomPage = () => {
  const { roomId } = useParams();
  const meetingContainer = useRef(null);
  const jitsiApi = useRef(null); // Store Jitsi instance
  const mediaRecorder = useRef(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        startMeeting();
      } else {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => startMeeting();
        document.body.appendChild(script);
      }
    };

    const startMeeting = () => {
      if (!meetingContainer.current) return;

      // 🚨 Destroy any previous Jitsi instance before creating a new one
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
      }

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId,
        parentNode: meetingContainer.current,
        userInfo: {
          displayName: "Adarsh Raut",
        },
        configOverwrite: {
          startWithVideoMuted: false,
          startWithAudioMuted: false,
          enableRecording: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        },
      };

      // ✅ Create Jitsi instance and store it
      jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

      jitsiApi.current.addEventListener('videoConferenceJoined', () => {
        console.log('Joined Jitsi Meeting');
      });

      jitsiApi.current.addEventListener('videoConferenceLeft', () => {
        console.log('Left Jitsi Meeting');
      });
    };

    loadJitsiScript();

    return () => {
      // 🚨 Cleanup Jitsi instance when component unmounts
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
      }
    };
  }, [roomId]);

  // const startRecording = () => {
  //   navigator.mediaDevices.getDisplayMedia({ video: true })
  //     .then((stream) => {
  //       mediaRecorder.current = new MediaRecorder(stream);
  //       const chunks = [];

  //       mediaRecorder.current.ondataavailable = (e) => {
  //         chunks.push(e.data);
  //       };

  //       mediaRecorder.current.onstop = () => {
  //         const blob = new Blob(chunks, { type: 'video/webm' });
  //         saveAs(blob, 'recorded-video.webm');
  //         chunks.length = 0;
  //       };

  //       mediaRecorder.current.start();
  //       setIsRecording(true);
  //     })
  //     .catch((error) => {
  //       console.error('Error capturing screen:', error);
  //     });
  // };

  // const stopRecording = () => {
  //   if (mediaRecorder.current) {
  //     mediaRecorder.current.stop();
  //     setIsRecording(false);
  //   }
  // };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={meetingContainer} style={{ height: '90vh', width: '100%' }} />
      {/* <div className="recording-button">
        {!isRecording ? (
          <button onClick={startRecording}>
            <RiCamera2Fill size={24} />
          </button>
        ) : (
          <button onClick={stopRecording}>
            <RiCamera2Fill size={24} />
          </button>
        )}
      </div> */}
    </div>
  );
};

export default RoomPage;
