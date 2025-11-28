import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base : '/Burger', // Vercel වලට මේ line එක අවශ්‍ය නැහැ. ඒක comment කරන්න හෝ මකන්න.
})