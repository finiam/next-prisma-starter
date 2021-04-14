const withRpc = require("next-rpc")({
  experimentalContext: true,
});

module.exports = withRpc({
  target: process.env.NEXT_TARGET,
});
