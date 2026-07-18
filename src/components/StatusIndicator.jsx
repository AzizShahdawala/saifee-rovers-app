export default function StatusIndicator({
  detected,
  message,
}) {
  return (
    <div
      style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        background: detected ? "#d4edda" : "#f8d7da",
      }}
    >
      {detected ? "🟢 " : "🔴 "}
      {message}
    </div>
  );
}