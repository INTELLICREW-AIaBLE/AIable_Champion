# 🚀 Hướng dẫn sử dụng các tính năng tối ưu

## Quick Start

### 1. Backend - Enable Streaming

Để sử dụng streaming response (hiển thị kết quả real-time):

```typescript
// Thêm stream: true vào request body
const response = await fetch('/api/optimizer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Your prompt here',
    model: 'Gemini',
    tone: 'academic',
    stream: true  // ← Enable streaming
  })
});
```

### 2. Frontend - Sử dụng Cached Profile

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { userProfile, loading, refreshProfile } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome {userProfile.name}!</h1>
      <button onClick={refreshProfile}>Refresh</button>
    </div>
  );
}
```

### 3. Streaming Request Hook

```typescript
import { useStreamingRequest } from '@/hooks/useAPIRequest';
import { useState } from 'react';

export default function AIGenerator() {
  const [result, setResult] = useState('');
  
  const { startStream, streaming, cancel } = useStreamingRequest({
    onChunk: (chunk) => {
      // Append each chunk to result
      setResult(prev => prev + chunk);
    },
    onComplete: (fullText) => {
      console.log('Generation complete!', fullText);
    }
  });
  
  const generate = () => {
    setResult('');
    startStream('/api/sandbox', {
      prompt: 'Write a story about AI',
      model: 'Gemini',
      stream: true
    });
  };
  
  return (
    <div>
      <button onClick={generate} disabled={streaming}>
        {streaming ? 'Generating...' : 'Generate'}
      </button>
      {streaming && <button onClick={cancel}>Cancel</button>}
      <pre>{result}</pre>
    </div>
  );
}
```

### 4. Debounced Search

```typescript
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      // This only runs 500ms after user stops typing
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 5. IndexedDB History

```typescript
import { addItem, getAllItems, STORES } from '@/lib/indexedDB';

// Save result to history
const saveToHistory = async (data: any) => {
  await addItem(STORES.OPTIMIZER_HISTORY, {
    prompt: data.prompt,
    result: data.optimized,
    model: data.model,
    timestamp: Date.now()
  });
};

// Get recent history
const getHistory = async () => {
  const history = await getAllItems(STORES.OPTIMIZER_HISTORY, 20);
  return history.sort((a, b) => b.timestamp - a.timestamp);
};
```

### 6. Cancelable API Request

```typescript
import { useAPIRequest } from '@/hooks/useAPIRequest';
import { useEffect } from 'react';

export default function DataFetcher() {
  const { execute, loading, data, cancel } = useAPIRequest();
  
  useEffect(() => {
    execute('/api/data', { method: 'GET' });
    
    // Auto-cancel when component unmounts
    return () => cancel();
  }, []);
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}
```

---

## 🎯 Performance Tips

### Tip 1: Always use cached hooks
```typescript
// ❌ Bad
const [profile, setProfile] = useState(null);
useEffect(() => {
  fetch('/api/profile').then(r => r.json()).then(setProfile);
}, []);

// ✅ Good
const { userProfile } = useAuth();
```

### Tip 2: Enable streaming for AI endpoints
```typescript
// ❌ Bad - Wait for full response
await fetch('/api/optimizer', {
  body: JSON.stringify({ prompt, model })
});

// ✅ Good - Stream chunks
await fetch('/api/optimizer', {
  body: JSON.stringify({ prompt, model, stream: true })
});
```

### Tip 3: Debounce user input
```typescript
// ❌ Bad - API call on every keystroke
onChange={(e) => searchAPI(e.target.value)}

// ✅ Good - Wait 500ms after typing stops
const debouncedValue = useDebounce(value, 500);
useEffect(() => searchAPI(debouncedValue), [debouncedValue]);
```

### Tip 4: Cache static data
```typescript
// ✅ Good - Cache recipe list
import { getCachedResponse, setCachedResponse } from '@/lib/indexedDB';

const recipes = await getCachedResponse('recipes_list', 5 * 60 * 1000);
if (!recipes) {
  const fresh = await fetchRecipes();
  await setCachedResponse('recipes_list', fresh);
}
```

---

## 🔥 Common Patterns

### Pattern 1: Optimistic UI Update
```typescript
const [data, setData] = useState(originalData);

const handleSave = async () => {
  // Update UI immediately
  setData(newData);
  
  try {
    await api.save(newData);
  } catch (error) {
    // Revert on error
    setData(originalData);
    alert('Save failed');
  }
};
```

### Pattern 2: Prefetch on Hover
```typescript
const prefetchData = async (id: string) => {
  const cached = await getCachedResponse(`item_${id}`);
  if (!cached) {
    const data = await fetch(`/api/items/${id}`);
    await setCachedResponse(`item_${id}`, data);
  }
};

<Link 
  href={`/item/${id}`}
  onMouseEnter={() => prefetchData(id)}
>
  View Item
</Link>
```

### Pattern 3: Progressive Loading
```typescript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);

const loadMore = async () => {
  setLoading(true);
  const newItems = await fetchItems(items.length, 20);
  setItems([...items, ...newItems]);
  setLoading(false);
};

// Load on scroll
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY + window.innerHeight >= document.height - 100) {
      loadMore();
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [items]);
```

---

## 📊 Monitoring Performance

### Check Cache Hit Rate
```typescript
// Add to your component
useEffect(() => {
  const start = performance.now();
  fetchData().then(() => {
    const end = performance.now();
    console.log(`Load time: ${end - start}ms`);
  });
}, []);
```

### Monitor IndexedDB Size
```typescript
// Browser console
navigator.storage.estimate().then(estimate => {
  console.log(`Used: ${estimate.usage} bytes`);
  console.log(`Quota: ${estimate.quota} bytes`);
  console.log(`Percentage: ${(estimate.usage / estimate.quota * 100).toFixed(2)}%`);
});
```

### Check Network Performance
- Open DevTools → Network
- Look for:
  - Green: Cached (fast)
  - Yellow: From server (slower)
  - Red: Failed/timeout

---

## 🐛 Troubleshooting

### Problem: Profile not loading
```typescript
// Solution: Force refresh
const { refreshProfile } = useAuth();
refreshProfile();

// Or clear cache
localStorage.removeItem('user_profile_cache');
```

### Problem: Streaming not working
```typescript
// Check if stream flag is set
body: JSON.stringify({
  prompt: 'test',
  stream: true  // ← Make sure this is true
})

// Check headers
headers: {
  'Content-Type': 'application/json'
}
```

### Problem: IndexedDB quota exceeded
```typescript
// Clear old cache
import { cleanOldCache, clearStore, STORES } from '@/lib/indexedDB';

// Clean entries older than 24 hours
await cleanOldCache(24 * 60 * 60 * 1000);

// Or clear entire store
await clearStore(STORES.CACHED_RESPONSES);
```

---

## 🎉 Ready to use!

Các tính năng tối ưu đã sẵn sàng. Chỉ cần import và sử dụng các hooks/utilities đã tạo:

- ✅ `useAuth()` - Cached profile
- ✅ `useAPIRequest()` - Cancelable requests
- ✅ `useStreamingRequest()` - SSE streaming
- ✅ `useDebounce()` - Debounced values
- ✅ IndexedDB utilities - Offline storage

**Happy coding! 🚀**
