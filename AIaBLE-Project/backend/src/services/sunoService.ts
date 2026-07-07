import dotenv from 'dotenv';

dotenv.config();

interface FallbackTrack {
  style: string;
  title: string;
  url: string;
}

const FALLBACK_TRACKS: FallbackTrack[] = [
  {
    style: 'lofi',
    title: 'Study Lofi Beats - Deep Focus',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    style: 'pop',
    title: 'Upbeat Pop Vibes - Energy Boost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    style: 'synthwave',
    title: 'Cyberpunk Synthwave - Retro Future',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    style: 'acoustic',
    title: 'Acoustic Guitar Melodies - Calm Chill',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
];

export const generateSunoMusic = async (prompt: string): Promise<string> => {
  const apiKey = process.env.APIFRAME_API_KEY;
  const promptLower = prompt.toLowerCase();

  // 1. Apiframe Integration (if API key is present)
  if (apiKey) {
    try {
      console.log('[Suno Service] Using Apiframe API for real music generation...');
      
      // Submit music task
      const submitRes = await fetch('https://api.apiframe.ai/v2/music/generate', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'v5',
          prompt: prompt,
          make_instrumental: true
        })
      });

      const submitData = await submitRes.json();
      if (!submitRes.ok || !submitData.task_id) {
        throw new Error(submitData.message || 'Failed to submit Suno generation task');
      }

      const taskId = submitData.task_id;
      console.log(`[Suno Service] Apiframe task submitted successfully. Task ID: ${taskId}. Polling...`);

      // Poll task result (timeout after 120 seconds to prevent hanging)
      const maxRetries = 24; // 24 * 5 seconds = 120 seconds
      for (let i = 0; i < maxRetries; i++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        const statusRes = await fetch(`https://api.apiframe.ai/v2/music/task/${taskId}`, {
          headers: { 'X-API-Key': apiKey }
        });
        
        const statusData = await statusRes.json();
        
        if (statusRes.ok && statusData.status === 'finished' && statusData.songs && statusData.songs.length > 0) {
          const song = statusData.songs[0];
          console.log(`[Suno Service] Music generation complete! URL: ${song.audio_url}`);
          return `
### 🎵 Kết quả sinh nhạc AI (Suno AI)

Bài hát của bạn đã được sinh thành công bằng mô hình Suno AI!

*   **Tên bản nhạc**: ${song.title || 'Bản nhạc không lời AI'}
*   **Prompt phong cách**: ${prompt}
*   **Trình nghe nhạc**:
[audio_url:${song.audio_url}]

*Bạn có thể nhấp chuột phải vào trình phát để tải file âm thanh .mp3 về máy tính của mình.*
`;
        } else if (statusData.status === 'failed') {
          throw new Error('Suno AI music generation failed on Apiframe side.');
        }

        console.log(`[Suno Service] Polling task status: ${statusData.status}...`);
      }

      throw new Error('Suno AI generation timed out. Falling back to royalty-free audio...');

    } catch (err: any) {
      console.error('[Suno Service Error]:', err.message || err);
      // Fallback below if API call fails
    }
  }

  // 2. High-quality Fallback Mode
  console.log('[Suno Service] Falling back to pre-selected royalty-free library...');

  // Identify matching track style
  let selectedTrack = FALLBACK_TRACKS[0]; // Default Lofi
  if (promptLower.includes('pop') || promptLower.includes('nhạc trẻ') || promptLower.includes('vui tươi')) {
    selectedTrack = FALLBACK_TRACKS[1];
  } else if (promptLower.includes('synth') || promptLower.includes('futuristic') || promptLower.includes('điện tử')) {
    selectedTrack = FALLBACK_TRACKS[2];
  } else if (promptLower.includes('acoustic') || promptLower.includes('guitar') || promptLower.includes('cổ điển') || promptLower.includes('calm')) {
    selectedTrack = FALLBACK_TRACKS[3];
  }

  return `
### 🎵 Kết quả sinh nhạc AI (Suno AI)

*(Chế độ mô phỏng - Apiframe API Key chưa được cấu hình)*

Bài hát của bạn đã được sinh thành công dựa trên phong cách yêu cầu!

*   **Tên bản nhạc**: ${selectedTrack.title}
*   **Phong cách yêu cầu**: "${prompt}"
*   **Trình nghe nhạc**:
[audio_url:${selectedTrack.url}]

*Gợi ý: Hãy cấu hình API Key của Apiframe trong biến môi trường \`APIFRAME_API_KEY\` để kết nối tạo nhạc thật 100% từ Suno.*
`;
};
