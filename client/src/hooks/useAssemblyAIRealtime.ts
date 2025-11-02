/* eslint-disable */
// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';

interface FinalSegment {
  text: string;
}

interface UseAssemblyAIRealtime {
  interim: string;
  finals: FinalSegment[];
  isListening: boolean;
  isConnected: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

// Downsample from e.g. 48000 -> 16000 mono and convert to Int16
function downsampleTo16k(input: Float32Array, inputSampleRate: number): Int16Array {
  if (inputSampleRate === 16000) {
    const s = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      let val = Math.max(-1, Math.min(1, input[i]));
      s[i] = val < 0 ? val * 0x8000 : val * 0x7fff;
    }
    return s;
  }
  const ratio = inputSampleRate / 16000;
  const newLen = Math.round(input.length / ratio);
  const result = new Int16Array(newLen);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let acc = 0; let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < input.length; i++) {
      acc += input[i];
      count++;
    }
    const sample = acc / count;
    result[offsetResult] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function encodeBase64(data: ArrayBuffer | ArrayBufferLike): string {
  let binary = '';
  const bytes = new Uint8Array(data);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

export function useAssemblyAIRealtime(serverBase = 'http://localhost:5000'): UseAssemblyAIRealtime {
  const [interim, setInterim] = useState('');
  const [finals, setFinals] = useState<FinalSegment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const pingTimerRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (pingTimerRef.current) {
      window.clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
    try { wsRef.current?.close(); } catch {}
    wsRef.current = null;
    try { processorRef.current?.disconnect(); } catch {}
    processorRef.current = null;
    try { sourceRef.current?.disconnect(); } catch {}
    sourceRef.current = null;
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
  }, []);

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const start = useCallback(async () => {
    try {
      setError(null);
      setInterim('');
      // 1) Fetch ephemeral token from local server
      const tokenResp = await fetch(`${serverBase}/api/assemblyai-token`);
      if (!tokenResp.ok) {
        const t = await tokenResp.text();
        throw new Error(`Token error: ${t}`);
      }
      const tokenData = await tokenResp.json();
      const token = tokenData.token || tokenData?.realtime_token || tokenData?.data || tokenData?.id || tokenData?.access_token;
      if (!token) throw new Error('No token returned from server');

      // 2) Open WebSocket
      const url = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        // 3) Mic + audio pipeline
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        source.connect(processor);
        processor.connect(ctx.destination);

        processor.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          const s16 = downsampleTo16k(input, ctx.sampleRate);
          const base64 = encodeBase64(s16.buffer);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ audio_data: base64 }));
          }
        };

        // Keepalive ping
        pingTimerRef.current = window.setInterval(() => {
          try { ws.send(JSON.stringify({ ping: true })); } catch {}
        }, 5000);
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data as string);
          const type = data.message_type || data.type;
          if (type === 'partial_transcript' || type === 'partial') {
            setInterim(data.text || data.transcript || '');
          } else if (type === 'final_transcript' || type === 'final') {
            const text = (data.text || data.transcript || '').trim();
            if (text) setFinals((prev) => [...prev, { text }]);
            setInterim('');
          } else if (data.error) {
            setError(String(data.error));
          }
        } catch {
          // ignore non-JSON
        }
      };

      ws.onerror = () => {
        setError('WebSocket error');
      };

      ws.onclose = () => {
        cleanup();
      };

      setIsListening(true);
    } catch (err: any) {
      setError(err?.message || String(err));
      cleanup();
    }
  }, [cleanup, serverBase]);

  useEffect(() => () => cleanup(), [cleanup]);

  return { interim, finals, isListening, isConnected, error, start, stop };
}

export default useAssemblyAIRealtime;
