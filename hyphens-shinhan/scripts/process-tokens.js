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

let cssVariables = [];

// 1. 변수 이름 청소 (공백, 괄호, % 등을 하이픈으로 변경)
function sanitizeName(name) {
    return name
        .replace(/\s+/g, '-')        // 공백 -> 하이픈
        .replace(/[()]/g, '')        // 괄호 제거
        .replace(/%/g, 'pct')        // % -> pct
        .replace(/\//g, '-')         // 슬래시 -> 하이픈
        .toLowerCase();
}

function resolveValue(val, key) {
    if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
        const path = val.slice(1, -1).replace(/\./g, '-');
        return `var(--${sanitizeName(path)})`;
    }
    
    // font-weight는 단위를 붙이지 않음
    if (key.toLowerCase().includes('fontweight')) {
        if (typeof val === 'string') {
            const weights = { 'regular': 400, 'medium': 500, 'semibold': 600, 'bold': 700 };
            return weights[val.toLowerCase()] || val.replace('px', '');
        }
        return val;
    }

    return val;
}

function walk(node, currentPath = '') {
    for (const key in node) {
        const item = node[key];
        const newPath = currentPath ? `${currentPath}-${key}` : key;

        if (item && typeof item === 'object') {
            if (item.hasOwnProperty('value')) {
                const cleanPath = sanitizeName(newPath);
                if (typeof item.value === 'object') {
                    for (const prop in item.value) {
                        const val = resolveValue(item.value[prop], prop);
                        const unit = (typeof val === 'number' && !prop.toLowerCase().includes('weight')) ? 'px' : '';
                        cssVariables.push(`  --${cleanPath}-${sanitizeName(prop)}: ${val}${unit};`);
                    }
                } else {
                    const val = resolveValue(item.value, key);
                    const unit = (item.type === 'dimension' && typeof val === 'number' && !key.toLowerCase().includes('weight')) ? 'px' : '';
                    cssVariables.push(`  --${cleanPath}: ${val}${unit};`);
                }
            } else {
                walk(item, newPath);
            }
        }
    }
}

walk(designTokens);

const cssContent = `:root {\n${cssVariables.join('\n')}\n}\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, cssContent);

console.log(`✅ ${cssVariables.length}개의 변수가 정화되어 저장되었습니다!`);