const presets = [
  [
    "@babel/preset-env",
    {
      targets: "defaults, IE 11, not dead",
      useBuiltIns: "entry",
      corejs: "^3",
    },
  ],
];
const plugins = [
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-optional-chaining",
];
module.exports = { presets, plugins };
