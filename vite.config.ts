import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    define: {
        'process.env': {},
        __DEV__: JSON.stringify(true)
    },
    resolve: {
        alias: {
            '@procosys/core': path.resolve(__dirname, 'src/core/'),
            '@procosys/modules': path.resolve(__dirname, 'src/modules/'),
            '@procosys/hooks': path.resolve(__dirname, 'src/hooks/'),
            '@procosys/components': path.resolve(__dirname, 'src/components/'),
            '@procosys/assets': path.resolve(__dirname, 'src/assets/'),
            '@procosys/http': path.resolve(__dirname, 'src/http/'),
            '@procosys/util': path.resolve(__dirname, 'src/util/'),
        },
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    }
});

