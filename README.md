# cyclejs-ramda

Cycle.js と Ramda.js を組合せた構成の雛形です。TypeScript のコンパイルとバンドルは FuseBox で行います。

## Requirement
- Node.js v7.9.0
- npm v4.4.4
- yarn v0.27.5
- typings v2.1.1

## Usage

### How to use the DEMO

`yarn`コマンドを実行します。
```console
$ yarn start
```
`http://localhost:3000` が立ち上がります。

起動中は watch 状態となっており、`.ts`, `.styl`, `.pug` ファイルを編集すると自動でコンパイルが実行されてブラウザがリロードします。

## Installation

1. Node パッケージをインストールします。
```console
$ yarn install
```

2. TypeScript の型定義ファイルをインストールします。
```console
$ typings install
```

## Author

@wakamsha
