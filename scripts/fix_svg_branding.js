import fs from 'fs';
import path from 'path';

const svgDir = path.resolve('public/images');
const svgFiles = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

console.log(`Fixing branding in ${svgFiles.length} SVG files...`);

let modifiedCount = 0;
for (const file of svgFiles) {
  const filePath = path.join(svgDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace <tspan fill="...">.pk</tspan> or .com
  content = content.replace(/CareerDost<tspan[^>]*>\.(com|pk)<\/tspan>/g, 'CareerDost');
  // Replace • CareerDost.com or .pk
  content = content.replace(/•\s*CareerDost\.(com|pk)/g, '• CareerDost');
  // Replace any standalone CareerDost.com or CareerDost.pk in text
  content = content.replace(/CareerDost\.(com|pk)/g, 'CareerDost');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Successfully updated ${modifiedCount} SVG files.`);

// Also update generator scripts if present
const generatorScripts = [
  'scripts/generate_images.js',
  'scripts/generate_new_images.js',
  'scripts/generate_oct2_images.js',
  'scripts/generate_five_images.js'
];

for (const scriptPath of generatorScripts) {
  if (fs.existsSync(scriptPath)) {
    let script = fs.readFileSync(scriptPath, 'utf8');
    const originalScript = script;
    script = script.replace(/CareerDost<tspan fill="\$\{theme\.accent\}">\.(com|pk)<\/tspan>/g, 'CareerDost');
    script = script.replace(/CareerDost<tspan fill="[^"]*">\.(com|pk)<\/tspan>/g, 'CareerDost');
    script = script.replace(/•\s*CareerDost\.(com|pk)/g, '• CareerDost');
    script = script.replace(/CareerDost\.(com|pk)/g, 'CareerDost');
    if (script !== originalScript) {
      fs.writeFileSync(scriptPath, script, 'utf8');
      console.log(`Updated generator script: ${scriptPath}`);
    }
  }
}
