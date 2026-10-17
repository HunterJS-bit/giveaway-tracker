import vue3GoogleLogin from 'vue3-google-login';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vue3GoogleLogin, {
        clientId: 'YOUR_GOOGLE_CLIENT_ID' // User must configure this
    });
});
