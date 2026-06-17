export default {
  '^/api/user': {
    target: 'https://1crm.io/',
    secure: false,
    changeOrigin: true,
  },
  '/api': {
    target: 'http://localhost:5001',
    secure: false,
    changeOrigin: true,
  },
};
