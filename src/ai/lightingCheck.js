export function checkLighting(canvas) {
  const ctx = canvas.getContext("2d");

  const img = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  let total = 0;

  for (let i = 0; i < img.data.length; i += 4) {
    total += img.data[i];
  }

  const avg = total / (img.data.length / 4);

  return avg;
}
