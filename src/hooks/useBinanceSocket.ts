import { useEffect, useRef } from 'react';

/**
 * useBinanceSocket - React hook for efficient real-time Binance kline data
 * @param wsUrl WebSocket URL (from GetLiveCandle)
 * @param onKline callback for each kline message (parsed)
 * @returns { connect, disconnect, isConnected }
 */
export function useBinanceSocket(wsUrl: string, onKline: (kline: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const isConnected = useRef(false);

  useEffect(() => {
    if (!wsUrl) return;
    let ws: WebSocket | null = new window.WebSocket(wsUrl);
    wsRef.current = ws;
    isConnected.current = true;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.k) onKline(msg.k);
      } catch {}
    };
    ws.onerror = () => { isConnected.current = false; };
    ws.onclose = () => { isConnected.current = false; };
    return () => {
      isConnected.current = false;
      ws?.close();
    };
  }, [wsUrl, onKline]);

  return {
    connect: () => {
      if (!wsRef.current && wsUrl) wsRef.current = new window.WebSocket(wsUrl);
    },
    disconnect: () => {
      wsRef.current?.close();
      wsRef.current = null;
    },
    isConnected: isConnected.current,
  };
}
