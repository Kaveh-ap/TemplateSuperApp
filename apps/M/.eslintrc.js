module.exports = {
    extends: ['@react-native-community', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'no-use-before-define': 'off',
        'flowtype/no-types-missing-file-annotation': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-shadow': 'off',
        'no-undef': 'off',
    },
    overrides: [
        {
            extends: ['@react-native-community', 'prettier'],
            plugins: ['@typescript-eslint', 'prettier'],
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            rules: {
                '@typescript-eslint/no-shadow': ['error'],
                'no-use-before-define': 'off',
                'react/react-in-jsx-scope': 'off',
                'flowtype/no-types-missing-file-annotation': 'off',
                'no-shadow': 'off',
                'no-undef': 'off',
            },
        },
    ],
};
