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

let rawVariables = [];    // 원본 데이터 (--font-size...)
let tailwindColors = [];  // 컬러 단축 별칭 (--color-primary...)
let utilityClasses = [];  // 폰트 세트 메뉴 (@utility body-1...)

function sanitizeName(name) {
    return name.replace(/\s+/g, '-').replace(/[()]/g, '').replace(/%/g, 'pct').replace(/\//g, '-').toLowerCase();
}

/**
 * 타이포그래피 세트를 분석해서 @utility 클래스를 생성합니다.
 * 이름 규칙: font-body-body1 -> body-1 형태로 단축
 */
function generateUtilities(node, currentPath) {
    const cleanName = sanitizeName(currentPath);
    
    // 클래스 이름 짧게 다듬기 규칙
    let utilityName = cleanName;
    if (utilityName.startsWith('font-body-body')) utilityName = utilityName.replace('font-body-body', 'body-');
    if (utilityName.startsWith('font-title-title')) utilityName = utilityName.replace('font-title-title', 'title-');
    if (utilityName.startsWith('font-title-shinhantitle')) utilityName = utilityName.replace('font-title-shinhantitle', 'shinhan-title-');

    if (node.fontSize || node.lineHeight || node.fontWeight) {
        let utility = `@utility ${utilityName} {\n`;
        if (node.fontFamily) utility += `  font-family: var(--${cleanName}-fontfamily);\n`;
        if (node.fontSize) utility += `  font-size: var(--${cleanName}-fontsize);\n`;
        if (node.fontWeight) utility += `  font-weight: var(--${cleanName}-fontweight);\n`;
        if (node.lineHeight) utility += `  line-height: var(--${cleanName}-lineheight);\n`;
        if (node.letterSpacing) utility += `  letter-spacing: var(--${cleanName}-letterspacing);\n`;
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
                
                // 1. 컬러 단축 이름 별칭 생성 로직
                if (cleanPath.startsWith('color-')) {
                    let alias = cleanPath.replace('color-', '');
                    // 수식어 제거 및 단순화
                    if (alias.endsWith('-normal')) alias = alias.replace('-normal', '');
                    if (alias.includes('greyscale-1white')) alias = 'white';
                    if (alias.includes('greyscale-12black')) alias = 'black';
                    if (alias.startsWith('greyscale-')) alias = alias.replace('greyscale-', 'grey-');
                    
                    tailwindColors.push(`  --color-${alias}: var(--${cleanPath});`);
                }

                // 2. 타이포그래피 처리
                if (typeof item.value === 'object') {
                    for (const prop in item.value) {
                        const val = item.value[prop];
                        const unit = (typeof val === 'number' && !prop.toLowerCase().includes('weight')) ? 'px' : '';
                        rawVariables.push(`  --${cleanPath}-${sanitizeName(prop)}: ${val}${unit};`);
                    }
                    generateUtilities(item.value, newPath);
                } else {
                    const unit = (item.type === 'dimension' && typeof item.value === 'number' && !key.toLowerCase().includes('weight')) ? 'px' : '';
                    rawVariables.push(`  --${cleanPath}: ${item.value}${unit};`);
                }
            } else { walk(item, newPath); }
        }
    }
}

walk(designTokens);

const fileContent = `
:root {
${rawVariables.join('\n')}
}

@theme {
/* 🎨 자동으로 생성된 컬러 별칭 (Short Names) */
${tailwindColors.join('\n')}
}

/* 🚀 자동으로 생성된 디자인 시스템 세트 메뉴 */
${utilityClasses.join('\n\n')}
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent);
console.log(`✅ 컬러 별칭과 ${utilityClasses.length}개의 세트 메뉴가 생성되었습니다!`);