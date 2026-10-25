import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  
  // Check if user is authenticated and is admin
  if (!auth.isAuthenticated.value || !auth.isAdmin.value) {
    // Redirect to home if not admin
    return navigateTo('/');
  }
});
