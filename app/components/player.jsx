'use client';
import { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const VideoPlayer = ({ videoUrl }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const getYouTubeId = (url) => {
    const match = url?.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match?.[1] || null;
  };

  const videoId = getYouTubeId(videoUrl);
  // Detect if the video is YouTube and set aspect ratio accordingly
  const aspectClass = videoId ? 'aspect-w-3 aspect-h-4' : 'aspect-w-16 aspect-h-9';

  useEffect(() => {
    if (typeof window !== 'undefined' && videoId && containerRef.current) {
      // Clear any previous player content
      containerRef.current.innerHTML = `
        <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}"></div>
      `;

      playerRef.current = new Plyr('#player', {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true,
          container: null
        },
        youtube: {
          noCookie: false,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1
        },
        // Mobile performance optimizations
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        quality: { default: 720, options: [720, 480, 360] }
      });

      // Add mobile-specific event listeners for better performance
      if (playerRef.current && window.innerWidth <= 768) {
        playerRef.current.on('enterfullscreen', () => {
          // Force hardware acceleration
          const playerElement = containerRef.current.querySelector('.plyr');
          if (playerElement) {
            playerElement.style.transform = 'translateZ(0)';
            playerElement.style.backfaceVisibility = 'hidden';
          }
        });

        playerRef.current.on('exitfullscreen', () => {
          // Reset transforms
          const playerElement = containerRef.current.querySelector('.plyr');
          if (playerElement) {
            playerElement.style.transform = '';
            playerElement.style.backfaceVisibility = '';
          }
        });
      }
    }

    // Cleanup player instance
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white bg-black">
        رابط الفيديو غير صالح أو غير مدعوم
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`${aspectClass} w-full h-full`}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)'
      }}
    />
  );
};

export default VideoPlayer;