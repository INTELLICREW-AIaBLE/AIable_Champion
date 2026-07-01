import { useState, useEffect, useCallback } from 'react';

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
}

const PROFILE_CACHE_KEY = 'user_profile_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedProfile {
    data: UserProfile;
    timestamp: number;
}

/**
 * Custom hook for authentication and profile management with caching
 */
export function useAuth() {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'User',
        email: 'user@alable.edu.vn',
        avatar: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (forceRefresh = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        // Check cache first
        if (!forceRefresh) {
            try {
                const cached = localStorage.getItem(PROFILE_CACHE_KEY);
                if (cached) {
                    const parsedCache: CachedProfile = JSON.parse(cached);
                    const age = Date.now() - parsedCache.timestamp;

                    if (age < CACHE_DURATION) {
                        setUserProfile(parsedCache.data);
                        setLoading(false);
                        return;
                    }
                }
            } catch (e) {
                console.warn('[Cache Read Error]:', e);
            }
        }

        // Fetch from API
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();
            if (data.success && data.data) {
                const profile: UserProfile = {
                    name: data.data.name || 'User',
                    email: data.data.email || 'user@alable.edu.vn',
                    avatar: data.data.avatar || ''
                };

                setUserProfile(profile);

                // Update cache
                const cacheData: CachedProfile = {
                    data: profile,
                    timestamp: Date.now()
                };
                localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
            }
            setError(null);
        } catch (e) {
            console.error('[Profile Fetch Error]:', e);
            setError('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();

        // Listen to profile update events
        const handleProfileUpdate = () => fetchProfile(true);
        window.addEventListener('profileUpdated', handleProfileUpdate);

        return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
    }, [fetchProfile]);

    const refreshProfile = () => fetchProfile(true);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem(PROFILE_CACHE_KEY);
        setUserProfile({
            name: 'User',
            email: 'user@alable.edu.vn',
            avatar: ''
        });
    };

    return {
        userProfile,
        loading,
        error,
        refreshProfile,
        logout
    };
}

/**
 * Get cached profile synchronously (returns null if not cached)
 */
export function getCachedProfile(): UserProfile | null {
    try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY);
        if (!cached) return null;

        const parsedCache: CachedProfile = JSON.parse(cached);
        const age = Date.now() - parsedCache.timestamp;

        if (age < CACHE_DURATION) {
            return parsedCache.data;
        }
        return null;
    } catch (e) {
        return null;
    }
}
