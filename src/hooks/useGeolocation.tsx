import { useEffect, useRef, useState } from "react";

export interface ILocation {
  lat: number;
  lng: number;
  formattedAddress?: string | undefined;
  ts?: string;
}

export default function useGeolocation() {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const getCurrent = (opts?: PositionOptions): Promise<ILocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        return reject(new Error("Geolocation not supported"));
      }
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: Number(pos.coords.latitude),
            lng: Number(pos.coords.longitude),
            ts: new Date().toISOString(),
          };
          setLocation(loc);
          setLoading(false);
          setError(null);
          resolve(loc);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          reject(err);
        },
        opts
      );
    });
  };

  const startWatch = (
    onUpdate?: (loc: ILocation) => void,
    opts?: PositionOptions
  ) => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = {
          lat: Number(pos.coords.latitude),
          lng: Number(pos.coords.longitude),
          ts: new Date().toISOString(),
        };
        setLocation(loc);
        setLoading(false);
        setError(null);
        if (onUpdate) onUpdate(loc);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      opts
    );
    watchIdRef.current = id;
  };

  const stopWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopWatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { location, loading, error, getCurrent, startWatch, stopWatch };
}