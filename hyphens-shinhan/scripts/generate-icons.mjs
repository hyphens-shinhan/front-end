import fs from 'fs'
import path from 'path'

const ICON_DIR = './src/assets/icons'
const OUTPUT_FILE = './src/components/common/Icon/index.ts'

function getSvgFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getSvgFiles(filePath, fileList)
    } else if (file.endsWith('.svg')) {
      fileList.push(filePath)
    }
  })
  return fileList
}

const files = getSvgFiles(ICON_DIR)

const iconData = files.map((file) => {
  const relativePath = path.relative(ICON_DIR, file)
  const name = relativePath
    .replace('.svg', '')
    .split(/[\\/_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')

  const importPath = `@/assets/icons/${relativePath.replace(/\\/g, '/')}`
  return { name, importPath }
})

// 파일 상단에 import 문 생성
const imports = iconData
  .map((d) => `import ${d.name} from '${d.importPath}';`)
  .join('\n')

// ICON_LIST 객체 생성
const mapEntries = iconData.map((d) => `  ${d.name},`).join('\n')

const content = `// 자동 생성된 파일입니다. 직접 수정하지 마세요!
// 생성일: ${new Date().toLocaleString()}

${imports}

export const ICON_LIST = {
${mapEntries}
} as const;

export type IconName = keyof typeof ICON_LIST;
`

const outputDir = path.dirname(OUTPUT_FILE)
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

fs.writeFileSync(OUTPUT_FILE, content)
console.log(`✨ ${iconData.length}개의 아이콘 시스템 등록 완료!`)
