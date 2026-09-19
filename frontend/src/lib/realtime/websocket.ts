import { featureFlags } from '@/config/feature-flags';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/constants';

type Listener = (payload: unknown) => void;

interface Envelope {
  event: string;
  data: unknown;
}

/**
 * Minimal reconnecting WebSocket client.
 *
 * Deliberately dependency-free: the backend gateway speaks plain JSON
 * `{ event, data }` frames, so pulling in socket.io-client would add ~40 kB
 * to the bundle for no gain. Behind `VITE_ENABLE_REALTIME`; when the flag is
 * off every method is a no-op and the app falls back to React Query polling.
 */
class RealtimeClient {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private attempts = 0;
  private reconnectTimer?: number;
  private heartbeatTimer?: number;
  private intentionallyClosed = false;

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  connect(): void {
    if (!featureFlags.realtime.enabled) return;
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) return;

    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return;

    this.intentionallyClosed = false;

    try {
      const url = `${featureFlags.realtime.websocketUrl}?token=${encodeURIComponent(token)}`;
      this.socket = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.attempts = 0;
      this.startHeartbeat();
      this.emitLocal('connect', null);
    };

    this.socket.onmessage = (event) => {
      try {
        const envelope = JSON.parse(event.data as string) as Envelope;
        if (envelope?.event) this.emitLocal(envelope.event, envelope.data);
      } catch {
        /* ignore malformed frames rather than tearing down the socket */
      }
    };

    this.socket.onerror = () => this.emitLocal('connect_error', null);

    this.socket.onclose = () => {
      this.stopHeartbeat();
      this.emitLocal('disconnect', null);
      if (!this.intentionallyClosed) this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.intentionallyClosed = true;
    window.clearTimeout(this.reconnectTimer);
    this.stopHeartbeat();
    this.socket?.close();
    this.socket = null;
  }

  on(event: string, listener: Listener): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  send(event: string, data: unknown): void {
    if (!this.isConnected) return;
    this.socket!.send(JSON.stringify({ event, data }));
  }

  private emitLocal(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Realtime listener for "${event}" threw:`, error);
      }
    });
  }

  /** Exponential backoff, capped at 30s, so a down server is not hammered. */
  private scheduleReconnect(): void {
    this.attempts += 1;
    if (this.attempts > 10) return;
    const delay = Math.min(30_000, 1_000 * 2 ** (this.attempts - 1));
    window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => this.connect(), delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => this.send('ping', Date.now()), 25_000);
  }

  private stopHeartbeat(): void {
    window.clearInterval(this.heartbeatTimer);
  }
}

export const realtime = new RealtimeClient();
