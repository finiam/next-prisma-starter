if (!process.env.JWT_TOKEN_KEY) {
  console.error(
    "No JWT_TOKEN_KEY defined, please review your environment variables."
  );

  process.exit(-1);
}

const withRpc = require("next-rpc")({
  experimentalContext: true,
});

module.exports = withRpc({
  target: process.env.NEXT_TARGET,
  future: {
    webpack5: true,
  },
});
