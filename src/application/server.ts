export const manifest = {
  server: {
    port: process.env.PORT || 80,
    router: {
      stripTrailingSlash: true,
    },
  },

  register: {
    plugins: [
      // Logging
      {
        plugin: require('@hapi/good'),
        options: {
          reporters: {
            consoleReporter: [
              {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [{log: '*', response: '*', error: '*'}],
              },
              {
                module: '@hapi/good-console',
                args: [{format: 'YYYY-MM-DDTHH:mm:ss.SSS'}],
              },
              'stdout',
            ],
          },
        },
      },
    ],
  },
};

export const options = {
  relativeTo: __dirname,
};
