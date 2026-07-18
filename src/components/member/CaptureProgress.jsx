export default function CaptureProgress({
  current,

  total,
}) {
  return (
    <div
      style={{
        width: "100%",

        background: "#ddd",

        height: 15,

        borderRadius: 10,

        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: `${(current / total) * 100}%`,

          height: 15,

          background: "green",

          borderRadius: 10,
        }}
      />
    </div>
  );
}
