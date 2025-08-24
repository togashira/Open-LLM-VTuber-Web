import fs from 'fs';
import path from 'path';

interface Manifest {
  js: string;
  css: string;
}

function getLatestVersionedFiles(distPath: string): Manifest | null {
  const files = fs.readdirSync(distPath);
  const jsFile = files.find(f => /^chatbox-\d{8}_\d+\.js$/.test(f));
  const cssFile = files.find(f => /^chatbox-\d{8}_\d+\.css$/.test(f));
  if (!jsFile || !cssFile) return null;
  return { js: jsFile, css: cssFile };
}

function generateEmbedTags(manifest: Manifest, s3BaseUrl: string): string {
  const cssUrl = `${s3BaseUrl}/${manifest.css}`;
  const jsUrl = `${s3BaseUrl}/${manifest.js}`;
  const live2dLibUrl = `${s3BaseUrl}/libs/live2dcubismcore.min.js`;

  return `
<!-- Chatbox Embed CSS -->
<link rel="stylesheet" href="${cssUrl}">

<!-- Live2D Core Library -->
<script src="${live2dLibUrl}"></script>

<!-- Chatbox Embed JS -->
<script src="${jsUrl}"></script>

<!-- Optional iframe embed -->
<iframe src="${jsUrl}" allow="microphone; clipboard-write" style="width: 400px; height: 600px; border: none;" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>

<!-- Note: Ensure CORS and HTTPS are properly configured on S3 and CloudFront for iframe embedding -->
`;
}

function main() {
  const distPath = path.resolve(__dirname, '../dist/web');
  const s3BaseUrl = 'https://your-s3-bucket-url'; // Replace with actual S3 bucket URL

  const manifest = getLatestVersionedFiles(distPath);
  if (!manifest) {
    console.error('Versioned JS/CSS files not found in dist/web');
    process.exit(1);
  }

  const tags = generateEmbedTags(manifest, s3BaseUrl);
  const outputPath = path.resolve(__dirname, '../dist/web/embed-tags.html');
  fs.writeFileSync(outputPath, tags, 'utf-8');
  console.log('Embed tags generated at:', outputPath);
}

main();
