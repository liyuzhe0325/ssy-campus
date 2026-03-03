// ============================
// 认证 Hook
// 提供用户状态、登录、登出、刷新 token 等功能
// ============================

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/config/supabase';
import { getProfileByUserId } from '@/services/profileService';

export const useAuth = () => {
  const { user, profile, isLoading, setUser, setProfile, setIsLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    let subscription: any;

    const initAuth = async () => {
      setIsLoading(true);
      try {
        // 获取当前会话
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user && mounted) {
          setUser(session.user);
          const profile = await getProfileByUserId(session.user.id);
          setProfile(profile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        try {
          const profile = await getProfileByUserId(session.user.id);
          setProfile(profile);
        } catch (error) {
          console.error('Error fetching profile after sign in:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        clearAuth();
      } else if (event === 'TOKEN_REFRESHED') {
        // token 刷新成功，更新用户信息
        if (session?.user) setUser(session.user);
      }
    });

    subscription = authListener?.subscription;

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, nickname: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false,
    signIn,
    signUp,
    signOut,
  };
};
