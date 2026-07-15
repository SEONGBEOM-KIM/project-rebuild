export async function copyTextToClipboard(text, clipboard = navigator.clipboard) {
  await clipboard.writeText(text);
}

export function downloadTextFile({ content, fileName, mimeType }, environment = globalThis) {
  const blob = new Blob([content], { type: mimeType });
  const url = environment.URL.createObjectURL(blob);
  const link = environment.document.createElement('a');
  link.href = url;
  link.download = fileName;
  environment.document.body.appendChild(link);
  link.click();
  link.remove();
  environment.URL.revokeObjectURL(url);
}
