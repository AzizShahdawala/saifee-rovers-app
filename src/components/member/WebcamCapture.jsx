/* eslint-disable no-unused-vars */
import Webcam from "react-webcam";
import { useRef } from "react";
import { FACE_POSES } from "../../utils/facePoses";
import FaceOverlay from "../FaceOverlay";
import StatusIndicator from "../StatusIndicator";

function WebcamCapture({
  currentStep,
  capturedImages,
  setCapturedImages,
  setCurrentStep,
}) {

    
  const webcamRef = useRef(null);

  const capture = () => {
    if (currentStep >= FACE_POSES.length) return;

    const image = webcamRef.current.getScreenshot();

    const pose = FACE_POSES[currentStep];

    setCapturedImages((prev) => ({
      ...prev,
      [pose.key]: image,
    }));

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
      />

      <br />

      {currentStep < FACE_POSES.length ? (
        <button type="button" onClick={capture}>
          Capture {FACE_POSES[currentStep].title}
        </button>
      ) : (
        <h3>All Required Images Captured</h3>
      )}
    </div>
  );
}

export default WebcamCapture;