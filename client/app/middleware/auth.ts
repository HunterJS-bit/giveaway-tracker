import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();
  
  // Ensure auth status is checked
  await auth.checkAuthStatus();
  
  // Check if user is authenticated and is admin
  if (!auth.isAuthenticated.value || !auth.isAdmin.value) {
    // Redirect to home if not admin
    return navigateTo('/');
  }
});
