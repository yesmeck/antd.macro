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
  let newName = component.toLowerCase();
  switch (newName) {
    case 'datepicker':
      newName = 'date-picker';
      break;
    case 'timepicker':
      newName = 'time-picker';
      break;
    case 'autocomplete':
      newName = 'auto-complete';
      break;
    case 'configprovider':
      newName = 'config-provider';
      break;
    case 'inputnumber':
      newName = 'input-number';
      break;
    case 'pageheader':
      newName = 'page-header';
      break;
    case 'treeselect':
      newName = 'tree-select';
      break;
    default:
      break;
  }
  let stylePath = `antd/es/${newName}/style`;
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
