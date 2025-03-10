import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 加载 Next.js 推荐配置
  ...compat.extends(
    "plugin:@next/next/recommended",
    "plugin:@next/next/core-web-vitals"
  ),
  // {
  //   // 自定义规则覆盖
  //   rules: {
  //     // "@typescript-eslint/no-unused-vars": "off" // 彻底关闭该规则
  //   }
  // }
];

export default eslintConfig;
