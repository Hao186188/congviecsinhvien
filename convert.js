import fs from "fs";
import path from "path";
import HTMLtoJSX from "html-to-jsx";

const converter = new HTMLtoJSX({ createClass: false });

const inputDir = "../"; // thư mục chứa file .html cũ (có thể sửa lại)
const outputDir = "./src/pages/";

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => f.endsWith(".html"));

for (const file of files) {
  const html = fs.readFileSync(path.join(inputDir, file), "utf8");
  const jsx = converter.convert(html);
  const componentName =
    file.replace(".html", "").replace(/(^\w|-\w)/g, c => c.replace("-", "").toUpperCase());

  const reactComponent = `import React from "react";

export default function ${componentName}() {
  return (
${jsx
  .split("\n")
  .map(line => "    " + line)
  .join("\n")}
  );
}
`;
  fs.writeFileSync(path.join(outputDir, `${componentName}.jsx`), reactComponent);
  console.log(`✅ Đã chuyển: ${file} → ${componentName}.jsx`);
}
