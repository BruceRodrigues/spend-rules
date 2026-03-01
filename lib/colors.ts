export function generateReadableColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const s = (70 + Math.random() * 20) / 100; // 70–90%
  const l = (60 + Math.random() * 10) / 100; // 60–70%
  const a = s * Math.min(l, 1 - l);
  const ch = (n: number) => {
    const k = (n + hue / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  const hex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(ch(0))}${hex(ch(8))}${hex(ch(4))}`;
}
