const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, '../tokens.json');
const outputPath = path.join(__dirname, '../src/styles/variables.css');

if (!fs.existsSync(tokenPath)) {
    console.error('❌ tokens.json 파일을 찾을 수 없습니다.');
    process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
const designTokens = JSON.parse(payload.tokens);

let rawVariables = [];
let tailwindColors = [];
let utilityClasses = [];

function sanitizeName(name) {
    return name.replace(/\s+/g, '-').replace(/[()]/g, '').replace(/%/g, 'pct').replace(/\//g, '-').replace(/\./g, '-').toLowerCase();
}

/**
 * {scheme.unit.0} 형태의 피그마 별칭을 var(--scheme-unit-0) 형태로 변환합니다.
 */
function resolveValue(value) {
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const alias = sanitizeName(value.slice(1, -1));
        return `var(--${alias})`;
    }
    return value;
}

function generateUtilities(node, currentPath) {
    const cleanName = sanitizeName(currentPath);
    let utilityName = cleanName;
    if (utilityName.startsWith('font-body-body')) utilityName = utilityName.replace('font-body-body', 'body-');
    if (utilityName.startsWith('font-title-title')) utilityName = utilityName.replace('font-title-title', 'title-');
    if (utilityName.startsWith('font-title-shinhantitle')) utilityName = utilityName.replace('font-title-shinhantitle', 'shinhan-title-');

    if (node.fontSize || node.lineHeight || node.fontWeight) {
        let utility = `@utility ${utilityName} {\n`;
        if (node.fontFamily) utility += `  font-family: ${resolveValue(node.fontFamily.value || node.fontFamily)};\n`;
        if (node.fontSize) utility += `  font-size: ${resolveValue(node.fontSize.value || node.fontSize)};\n`;
        if (node.fontWeight) utility += `  font-weight: ${resolveValue(node.fontWeight.value || node.fontWeight)};\n`;
        if (node.lineHeight) utility += `  line-height: ${resolveValue(node.lineHeight.value || node.lineHeight)};\n`;
        utility += `}`;
        utilityClasses.push(utility);
    }
}

function walk(node, currentPath = '') {
    for (const key in node) {
        const item = node[key];
        const newPath = currentPath ? `${currentPath}-${key}` : key;

        if (item && typeof item === 'object') {
            if (item.hasOwnProperty('value')) {
                const cleanPath = sanitizeName(newPath);
                
                if (cleanPath.startsWith('color-')) {
                    let alias = cleanPath.replace('color-', '');
                    if (alias.endsWith('-normal')) alias = alias.replace('-normal', '');
                    if (alias.includes('greyscale-1white')) alias = 'white';
                    if (alias.includes('greyscale-12black')) alias = 'black';
                    if (alias.startsWith('greyscale-')) alias = alias.replace('greyscale-', 'grey-');
                    tailwindColors.push(`  --color-${alias}: var(--${cleanPath});`);
                }

                if (typeof item.value === 'object') {
                    for (const prop in item.value) {
                        const val = resolveValue(item.value[prop]);
                        const unit = (typeof val === 'number' && !prop.toLowerCase().includes('weight')) ? 'px' : '';
                        rawVariables.push(`  --${cleanPath}-${sanitizeName(prop)}: ${val}${unit};`);
                    }
                    generateUtilities(item.value, newPath);
                } else {
                    const val = resolveValue(item.value);
                    const unit = (item.type === 'dimension' && typeof val === 'number' && !key.toLowerCase().includes('weight')) ? 'px' : '';
                    rawVariables.push(`  --${cleanPath}: ${val}${unit};`);
                }
            } else { walk(item, newPath); }
        }
    }
}

walk(designTokens);

const fileContent = `:root {\n${rawVariables.join('\n')}\n}\n\n@theme {\n${tailwindColors.join('\n')}\n}\n\n${utilityClasses.join('\n\n')}`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent);