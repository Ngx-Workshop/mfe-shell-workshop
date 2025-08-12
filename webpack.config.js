const {
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    mfe1: 'http://localhost:3000/remoteEntry.js',
  },

  shared: {
    '@angular/core': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '20.1.6',
    },
    '@angular/common': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '20.1.6',
    },
    '@angular/router': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '20.1.6',
    },
    '@angular/forms': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '20.1.6',
    },

    // If you use Material/CDK, share them too
    '@angular/cdk': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '20.1.5',
    },
    '@angular/material': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '20.1.5',
    },

    // RxJS + tslib
    rxjs: {
      singleton: true,
      strictVersion: true,
      requiredVersion: '7.8.2',
    },
    tslib: {
      singleton: true,
      strictVersion: true,
      requiredVersion: '2.8.1',
    },
  },
});
