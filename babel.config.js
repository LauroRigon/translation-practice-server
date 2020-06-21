module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@controllers': ['./app/src/controllers'],
          '@models': ['./src/app/models'],
          '@config': ['./src/app/config']
        }
      }
    ]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
