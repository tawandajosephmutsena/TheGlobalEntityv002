import fs from 'fs';
import path from 'path';

const projectDir = '/Users/mac/Herd/stitch';
const reactAppDir = path.join(projectDir, 'react-app');
const componentsDir = path.join(reactAppDir, 'src', 'pages');

if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

function processHtmlToJsx(html, componentName) {
    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) return null;
    let bodyContent = bodyMatch[1];
    
    // Remove script tags entirely
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Wrap style block contents in template literal for JSX compatibility
    bodyContent = bodyContent.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, '<style>{`$1`}</style>');
    
    // Basic JSX conversions
    bodyContent = bodyContent.replace(/class="/g, 'className="');
    bodyContent = bodyContent.replace(/for="/g, 'htmlFor="');
    
    // Convert comments
    bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
    
    // Self close tags
    bodyContent = bodyContent.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
    bodyContent = bodyContent.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
    bodyContent = bodyContent.replace(/<br\s*\/?>/g, '<br />');
    bodyContent = bodyContent.replace(/<hr\s*\/?>/g, '<hr />');
    bodyContent = bodyContent.replace(/<source([^>]*?)(?<!\/)>/g, '<source$1 />');
    bodyContent = bodyContent.replace(/<meta([^>]*?)(?<!\/)>/g, '<meta$1 />');
    bodyContent = bodyContent.replace(/<link([^>]*?)(?<!\/)>/g, '<link$1 />');

    // Inline styles conversion
    // e.g. style="font-variation-settings: 'FILL' 1;" -> style={{ fontVariationSettings: "'FILL' 1" }}
    bodyContent = bodyContent.replace(/style="([^"]+)"/g, (match, styles) => {
        const styleRules = styles.split(';').filter(s => s.trim().length > 0);
        let reactStyles = [];
        for (const rule of styleRules) {
            const [key, val] = rule.split(':');
            if (key && val) {
                const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                let cleanVal = val.trim();
                // Check if it's purely a number
                if (!isNaN(cleanVal) && cleanVal !== '') {
                    reactStyles.push(`${camelKey}: ${cleanVal}`);
                } else {
                    // It's a string, we need to escape quotes if any
                    // Replace ' with \' or just wrap in `
                    reactStyles.push(`${camelKey}: \`${cleanVal.replace(/`/g, '\\`')}\``);
                }
            }
        }
        return `style={{ ${reactStyles.join(', ')} }}`;
    });
    
    // Also remove any stray &amp; inside unescaped places, though react handles it if it's text.
    // SVG attributes that need camelCase
    const svgAttrs = [
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule',
        'stroke-dasharray', 'stroke-dashoffset', 'viewBox'
    ];
    for (const attr of svgAttrs) {
        const camel = attr === 'viewBox' ? 'viewBox' : attr.split('-').map((word, index) => index === 0 ? word : word[0].toUpperCase() + word.slice(1)).join('');
        const regex = new RegExp(` ${attr}=`, 'g');
        bodyContent = bodyContent.replace(regex, ` ${camel}=`);
    }

    return `import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${bodyContent}
    </>
  );
}
`;
}

const folders = fs.readdirSync(projectDir).filter(f => fs.statSync(path.join(projectDir, f)).isDirectory() && f !== 'react-app' && f !== '.git');

let appImports = [];
let appRoutes = [];

folders.forEach(folder => {
    const codeHtmlPath = path.join(projectDir, folder, 'code.html');
    if (fs.existsSync(codeHtmlPath)) {
        const html = fs.readFileSync(codeHtmlPath, 'utf-8');
        // Create component name, remove leading non-alphabets, split by non-alphanumeric
        const componentName = folder.replace(/^[\d_]+/, '').split(/[^a-zA-Z0-9]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        
        const jsxContent = processHtmlToJsx(html, componentName);
        if (jsxContent) {
            const componentPath = path.join(componentsDir, `${componentName}.jsx`);
            fs.writeFileSync(componentPath, jsxContent);
            console.log(`Created ${componentName} from ${folder}`);
            
            appImports.push(`import ${componentName} from './pages/${componentName}';`);
            appRoutes.push(`          <Route path="/${folder}" element={<${componentName} />} />`);
        }
    }
});

// Update App.jsx
const appJsxContent = `import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
${appImports.join('\n')}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <nav className="w-64 h-screen overflow-y-auto bg-gray-100 p-4 border-r hidden md:block">
          <h2 className="text-xl font-bold mb-4">Components</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-blue-600 hover:underline">Home (Catalog)</Link></li>
${folders.map(f => {
    const componentName = f.replace(/^[\d_]+/, '').split(/[^a-zA-Z0-9]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    return `            <li><Link to="/${f}" className="text-blue-600 hover:underline">${componentName}</Link></li>`;
}).join('\n')}
          </ul>
        </nav>
        <main className="flex-1 bg-white relative">
          <Routes>
            <Route path="/" element={<Catalog />} />
${appRoutes.join('\n')}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Catalog() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Components Catalog</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
${folders.map(f => {
    const componentName = f.replace(/^[\d_]+/, '').split(/[^a-zA-Z0-9]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    return `        <li className="p-4 border rounded shadow hover:bg-gray-50">
          <Link to="/${f}" className="text-xl font-semibold text-primary">{componentName}</Link>
          <div className="text-gray-500 text-sm mt-2">${f}</div>
        </li>`;
}).join('\n')}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(path.join(reactAppDir, 'src', 'App.jsx'), appJsxContent);
console.log('App.jsx updated with all routes.');
