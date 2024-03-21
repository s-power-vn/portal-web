import {join, resolve} from 'path';

export default {
  plugins: {
    tailwindcss: {
      config: join(resolve(), 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};

