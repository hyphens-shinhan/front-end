const fs = require('fs');
const path = require('path');

// 1. 피그마에서 받은 데이터 읽기
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '../tokens.json'), 'utf8'));

let cssContent = ':root {\n';

// 2. JSON 데이터를 CSS 변수로 변환 (간단한 예시)
// 피그마 변수 구조에 따라 이 부분은 수정이 필요할 수 있습니다.
if (tokens.values) {
  Object.entries(tokens.values).forEach(([key, value]) => {
    cssContent += `  --${key.replace(/\//g, '-')}: ${value};\n`;
  });
}

cssContent += '}\n';

// 3. variables.css 파일로 저장
const outputPath = path.join(__dirname, '../src/styles/variables.css');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, cssContent);

console.log('✅ variables.css 파일이 생성되었습니다!');