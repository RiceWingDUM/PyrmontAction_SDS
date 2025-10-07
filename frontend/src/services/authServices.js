import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/authStore';

export const logout = async () => {
  const router = useRouter();
  const userStore = useUserStore();

  // Clear token from store
  userStore.logout();
  await router.push('/login');
};