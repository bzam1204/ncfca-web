import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

const compat = new FlatCompat( {
  baseDirectory : __dirname,
} );

const eslintConfig = [
  ...compat.extends( "next/core-web-vitals", "next/typescript" ),
  { 
    rules : { 
      "@typescript-eslint/no-explicit-any" : "off",
    }, 
  },
  {
    files: ["src/hooks/**/*.ts", "src/hooks/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["next-auth/react"],
              "message": "Use Server Actions instead of useSession in hooks. See docs/api-layer-standardization.md"
            }
          ]
        }
      ],
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.name='fetch']",
          "message": "Use Server Actions instead of fetch() in hooks. See docs/api-layer-standardization.md"
        }
      ]
    }
  }
];

export default eslintConfig;
