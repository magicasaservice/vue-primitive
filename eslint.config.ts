import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ...pluginVue.configs['flat/essential'],
    rules: {
      ...pluginVue.configs['flat/essential'].rules,
      'vue/multi-word-component-names': 'off',
    },
  },
]
