module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'selector-id-pattern': null,
    'selector-no-vendor-prefix': null,
    // Отключаем правила, которые конфликтуют с автоформатированием
    'scss/operator-no-unspaced': null,
    'scss/at-if-closing-brace-newline-after': null,
    'scss/at-if-closing-brace-space-after': null,
    'scss/at-else-empty-line-before': null,
  },
};
