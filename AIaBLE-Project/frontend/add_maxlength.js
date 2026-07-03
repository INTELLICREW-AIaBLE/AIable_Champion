const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:/SU26/AIable_Champion/AIaBLE-Project/frontend/src');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add maxLength={100} to inputs
  content = content.replace(/<input([\s\S]*?)>/g, (match, p1) => {
    if (p1.includes('maxLength=') || p1.includes('type="file"') || p1.includes("type='file'") || p1.includes('type="checkbox"') || p1.includes('type="hidden"')) {
      return match;
    }
    return `<input maxLength={100}${p1}>`;
  });

  // Add maxLength={5000} to textareas
  content = content.replace(/<textarea([\s\S]*?)>/g, (match, p1) => {
    if (p1.includes('maxLength=')) {
      return match;
    }
    return `<textarea maxLength={5000}${p1}>`;
  });

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
    count++;
  }
});

console.log(`Finished updating ${count} files.`);
