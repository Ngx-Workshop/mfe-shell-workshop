const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    mfe1: 'http://localhost:3000/remoteEntry.js',
  },

  shared: {
    // ...shareAll({
    //   singleton: true,
    //   strictVersion: true,
    //   requiredVersion: "auto",
    // }),
    '@angular/core': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@angular/common': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@angular/router': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@angular/forms': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },

    // If you use Material/CDK, share them too
    '@angular/cdk': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@angular/material': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },

    // RxJS + tslib
    rxjs: { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    tslib: { singleton: true, strictVersion: true, requiredVersion: 'auto' },

    // Only if you’re NOT zoneless:
    'zone.js': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
  },
});
