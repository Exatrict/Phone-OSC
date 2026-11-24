import { defineConfig } from 'vite'
import bassicSsl from '@vitejs/plugin-basic-ssl'

// root: 'src'          → unser Code (index.html, index.js, ...) liegt im src-Ordner
// publicDir: '../static' → alle Audio-Dateien; Vite liefert sie unter '/' aus,
//                          d.h. static/swoosh.wav ist im Browser '/swoosh.wav'
export default defineConfig({
  root: 'src',
  publicDir: '../static',
  plugins: [bassicSsl()],
  server: {
    port: 3000,
    host: false
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
