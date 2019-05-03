import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { createMacro } from 'babel-plugin-macros';
import { addSideEffect } from '@babel/helper-module-imports';
import { join } from 'path';

interface Config {
  style: 'less' | 'css';
}

const defaultConfig: Config = {
  style: 'css',
};

function importStyle(
  component: string,
  path: NodePath<t.Identifier>,
  config: Config
) {
  let stylePath = `antd/es/${component.toLowerCase()}/style`;
  if (config.style === 'css') {
    stylePath = join(stylePath, 'css');
  }
  addSideEffect(path, stylePath);
}

function antd({
  references,
  state,
  config,
}: {
  references: { [name: string]: NodePath<t.Identifier>[] };
  state: any;
  config: Config;
}) {
  const components: Array<{ name: string; alias: string }> = [];
  Object.keys(references).forEach(component => {
    const refPath = references[component][0];
    components.push({
      name: component,
      alias: refPath.node.name,
    });
    importStyle(component, refPath, { ...defaultConfig, ...config });
  });
  state.file.path.unshiftContainer('body', [
    t.importDeclaration(
      components.map(component =>
        t.importSpecifier(
          t.identifier(component.alias),
          t.identifier(component.name)
        )
      ),
      t.stringLiteral('antd')
    ),
  ]);
}

export default createMacro(antd, {
  configName: 'antd',
});
