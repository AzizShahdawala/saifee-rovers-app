import { FACE_POSES } from "../../utils/facePoses";

export default function ImagePreview({
  capturedImages,
  setCapturedImages,
  setCurrentStep,
}) {
  const retake = (pose, index) => {
    const updated = { ...capturedImages };

    delete updated[pose.key];

    setCapturedImages(updated);

    setCurrentStep(index);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {FACE_POSES.map((pose, index) => (
        <div key={pose.key}>
          <h4>{pose.title}</h4>

          {capturedImages[pose.key] ? (
            <>
              <img
                src={capturedImages[pose.key]}
                alt={pose.title}
                width={150}
              />

              <br />

              <button type="button" onClick={() => retake(pose, index)}>
                Retake
              </button>
            </>
          ) : (
            <p>Not Captured</p>
          )}
        </div>
      ))}
    </div>
  );
}
