const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, '../tokens.json');
const outputPath = path.join(__dirname, '../src/styles/variables.css');

if (!fs.existsSync(tokenPath)) {
    console.error('❌ tokens.json 파일을 찾을 수 없습니다.');
    process.exit(1);
}

// 1. 이중 파싱 (가장 중요한 부분!)
const payload = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
const designTokens = JSON.parse(payload.tokens); // 문자열로 된 tokens를 다시 객체로 변환

let cssVariables = [];

/**
 * 참조 값({color.blue})을 CSS var(--color-blue) 형식으로 바꿉니다.
 */
function resolveValue(val) {
    if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
        const path = val.slice(1, -1).replace(/\./g, '-');
        return `var(--${path})`;
    }
    return val;
}

/**
 * 모든 토큰을 돌면서 CSS 변수를 생성합니다.
 */
function walk(node, currentPath = '') {
    for (const key in node) {
        const item = node[key];
        const newPath = currentPath ? `${currentPath}-${key}` : key;

        if (item && typeof item === 'object') {
            // 'value'가 있으면 최종 값입니다.
            if (item.hasOwnProperty('value')) {
                if (typeof item.value === 'object') {
                    // 폰트 스타일처럼 value 안에 여러 속성(fontSize 등)이 있는 경우
                    for (const prop in item.value) {
                        cssVariables.push(`  --${newPath}-${prop}: ${resolveValue(item.value[prop])}${typeof item.value[prop] === 'number' ? 'px' : ''};`);
                    }
                } else {
                    // 컬러나 수치 같은 단일 값인 경우
                    const unit = item.type === 'dimension' && typeof item.value === 'number' ? 'px' : '';
                    cssVariables.push(`  --${newPath}: ${resolveValue(item.value)}${unit};`);
                }
            } else {
                // 더 깊이 파고듭니다.
                walk(item, newPath);
            }
        }
    }
}

// 2. 변환 시작
walk(designTokens);

// 3. 파일 저장
const cssContent = `:root {\n${cssVariables.join('\n')}\n}\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, cssContent);

console.log(`✅ 총 ${cssVariables.length}개의 변수가 생성되었습니다!`);