export default function FaceOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        width: 250,
        height: 320,
        border: "3px dashed #00ff00",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }}
    />
  );
}