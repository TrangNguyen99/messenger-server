# Api doc: [here](https://clone-messengerr.herokuapp.com)

# Client: [here](https://github.com/TrangNguyen99/messenger-app)

# Setup

Create `.editorconfig`:

```
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*.ts]
end_of_line = crlf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
```

```
yarn add --dev --exact prettier
yarn add --dev eslint eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser

yarn eslint --init
```

Edit `.eslintrc.json`:

```json
{
  "extends": ["...", "prettier"],
  "plugins": ["...", "prettier"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": "error"
  }
}
```

Create `.prettierrc.json` (example):

```json
{
  "bracketSpacing": false,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "avoid",
  "endOfLine": "crlf",
  "semi": false
}
```

```
yarn add --dev typescript ts-node-dev @types/node

npx tsc --init
```

Edit `tsconfig.json`:

```json
{
  "target": "es6",
  "rootDir": "./src",
  "moduleResolution": "node",
  "outDir": "./dist"
}
```

Edit `package.json`:

```json
{
  "main": "dist/index.js",
  "engines": {
    "node": "16.x"
  },
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc"
  }
}
```
