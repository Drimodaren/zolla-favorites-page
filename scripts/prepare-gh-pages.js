const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '..', 'dist');
const TARGET_DIR = path.resolve(__dirname, '..', 'docs');

const copyRecursive = (src, dest) => {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};

if (!fs.existsSync(SOURCE_DIR)) {
  console.error('Build output not found. Run "npm run build" first.');
  process.exit(1);
}

fs.rmSync(TARGET_DIR, { recursive: true, force: true });
fs.mkdirSync(TARGET_DIR, { recursive: true });

copyRecursive(SOURCE_DIR, TARGET_DIR);

console.log('Docs directory updated from dist. Push docs/ to publish via GitHub Pages.');
