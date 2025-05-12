export default function transformText(text) {
  let transformed = text.charAt(0).toUpperCase() + text.slice(1).replace(/([A-Z])/, ' $1');
  return transformed
}