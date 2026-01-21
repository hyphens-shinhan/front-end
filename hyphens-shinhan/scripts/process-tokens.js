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

let rawVariables = [];    // 원자 단위 데이터 (--font-size...)
let utilityClasses = [];  // 세트 메뉴 데이터 (@utility...)

function sanitizeName(name) {
    return name.replace(/\s+/g, '-').replace(/[()]/g, '').replace(/%/g, 'pct').replace(/\//g, '-').toLowerCase();
}

/**
 * 타이포그래피 그룹을 분석해서 @utility 문법으로 변환합니다.
 */
function generateUtilities(node, currentPath) {
    const cleanName = sanitizeName(currentPath);
    
    // 이 노드가 폰트 스타일의 모든 속성을 가지고 있는지 확인
    if (node.fontSize || node.lineHeight || node.fontWeight) {
        let utility = `@utility ${cleanName} {\n`;
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
                if (typeof item.value === 'object') {
                    // 세트 메뉴 속성들(fontSize, fontWeight 등)을 개별 변수로 저장
                    for (const prop in item.value) {
                        const val = item.value[prop];
                        const unit = (typeof val === 'number' && !prop.toLowerCase().includes('weight')) ? 'px' : '';
                        rawVariables.push(`  --${cleanPath}-${sanitizeName(prop)}: ${val}${unit};`);
                    }
                    // 세트 메뉴 유틸리티 생성 호출
                    generateUtilities(item.value, newPath);
                } else {
                    const unit = (item.type === 'dimension' && typeof item.value === 'number' && !key.toLowerCase().includes('weight')) ? 'px' : '';
                    rawVariables.push(`  --${cleanPath}: ${item.value}${unit};`);
                }
            } else {
                walk(item, newPath);
            }
        }
    }
}

walk(designTokens);

// 최종 파일 저장 (Variables + Utilities)
const fileContent = `
:root {
${rawVariables.join('\n')}
}

/* 🚀 자동으로 생성된 디자인 시스템 세트 메뉴 */
${utilityClasses.join('\n\n')}
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent);
console.log(`✅ ${utilityClasses.length}개의 세트 메뉴 유틸리티가 생성되었습니다!`);