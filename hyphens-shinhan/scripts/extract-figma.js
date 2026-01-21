const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 깃허브 Secrets에서 가져올 환경 변수
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

async function extractVariables() {
  try {
    console.log('🚀 피그마에서 변수 데이터를 가져오는 중...');
    const response = await axios.get(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
      { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
    );

    const { variables } = response.data.meta;
    let cssContent = '/* ✅ 피그마 API를 통해 자동으로 생성된 파일입니다. 직접 수정하지 마세요. */\n\n';
    cssContent += ':root {\n';

    Object.values(variables).forEach(variable => {
      // 슬래시(/)를 대시(-)로 바꾸어 CSS 규격에 맞춤
      const name = variable.name.replace(/\//g, '-').toLowerCase();
      
      // 첫 번째 모드(기본값)의 데이터를 추출
      const firstModeId = Object.keys(variable.valuesByMode)[0];
      let value = variable.valuesByMode[firstModeId];

      if (variable.resolvedType === 'COLOR') {
        // RGBA 값을 HEX로 변환
        const { r, g, b, a } = value;
        const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
        value = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        if (a < 1) value += toHex(a); // 투명도가 있을 경우 추가
      } else if (variable.resolvedType === 'FLOAT') {
        // 숫자형 변수(간격, 둥글기 등)는 px 단위 추가
        value = `${value}px`;
      }

      cssContent += `  --${name}: ${value};\n`;
    });

    cssContent += '}\n';

    // 저장 경로 설정: hyphens-shinhan/src/styles/variables.css
    const outputPath = path.join(__dirname, '../src/styles/variables.css');
    const dir = path.dirname(outputPath);
    
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, cssContent);
    
    console.log(`✅ 디자인 토큰 저장 완료: ${outputPath}`);
  } catch (error) {
    console.error('❌ 에러 발생:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

extractVariables();