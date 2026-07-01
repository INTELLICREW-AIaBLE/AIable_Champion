import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAPIRequestOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    enableCache?: boolean;
}

/**
 * Custom hook for API requests with abort controller and caching
 */
export function useAPIRequest<T = any>(options?: UseAPIRequestOptions) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const execute = useCallback(async (
        url: string,
        fetchOptions?: RequestInit
    ): Promise<T | null> => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);

            if (options?.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('[Request Aborted]');
                return null;
            }

            const error = err instanceof Error ? err : new Error('Unknown error');
            setError(error);

            if (options?.onError) {
                options.onError(error);
            }

            return null;
        } finally {
            if (!abortController.signal.aborted) {
                setLoading(false);
            }
        }
    }, [options]);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        cancel
    };
}

/**
 * Hook for streaming SSE requests
 */
export function useStreamingRequest(options?: {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: Error) => void;
}) {
    const [streaming, setStreaming] = useState(false);
    const [chunks, setChunks] = useState<string[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    const startStream = useCallback(async (url: string, body: any) => {
        // Cancel previous stream
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setStreaming(true);
        setChunks([]);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (!reader) {
                throw new Error('Response body is null');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonData = JSON.parse(line.slice(6));

                            if (jsonData.type === 'chunk') {
                                fullText += jsonData.content;
                                setChunks(prev => [...prev, jsonData.content]);
                                if (options?.onChunk) {
                                    options.onChunk(jsonData.content);
                                }
                            } else if (jsonData.type === 'complete') {
                                if (options?.onComplete) {
                                    options.onComplete(jsonData.fullText || fullText);
                                }
                            } else if (jsonData.type === 'error') {
                                throw new Error(jsonData.message);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                const error = err instanceof Error ? err : new Error('Stream error');
                if (options?.onError) {
                    options.onError(error);
                }
            }
        } finally {
            if (!abortController.signal.aborted) {
                setStreaming(false);
            }
        }
    }, [options]);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setStreaming(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        streaming,
        chunks,
        startStream,
        cancel
    };
}
