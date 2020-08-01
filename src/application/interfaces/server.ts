export const manifest = {
  server: {
    port: process.env.PORT || 5662,
    router: {
      stripTrailingSlash: true,
    },
  },

  register: {
    plugins: [
      // Logging
      {
        plugin: require('good'),
        options: {
          reporters: {
            consoleReporter: [
              {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*', error: '*' }],
              },
              {
                module: 'good-console',
                args: [{ format: 'YYYY-MM-DDTHH:mm:ss.SSS' }],
              },
              'stdout',
            ],
          },
        },
      }
    ],
  },
};

export const options = {
  relativeTo: __dirname,
};