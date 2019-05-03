# antd.macro

A [babel macro](https://github.com/kentcdodds/babel-plugin-macros) that helps you import antd's style.

## Installation

```bash
$ npm install antd.macro --save-dev
```

## Usage

```javascript
import { Button } from 'antd.macro';
```

Transforms to:

```javascript
import 'antd/es/button/css';
import { Button } from 'antd';
```

## Config

Create a [babel-plugin-macros config file](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/author.md#config-experimental).

```javascript
// babel-plugin-macros.config.js
module.exports = {
  antd: {
    style: 'less' // default is 'css',
  },
}
```

## What's the difference with babel-plugin-import?

1. It's explicitly.
1. It's antd-specific.
1. It can be used in CRA directly without rejecting.
1. It keeps your import statements, because webpack already has tree-shaking, it's unnecessary to import a component from a specific location.
