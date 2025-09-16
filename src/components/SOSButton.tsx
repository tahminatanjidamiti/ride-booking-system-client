/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Siren } from "lucide-react";
import { toast } from "sonner";
import useGeolocation, { type ILocation } from "@/hooks/useGeolocation";
import MapSelector from "@/components/MapSelector";
import type { EmergencyContact } from "@/types";
import { useCreateSOSMutation, useEndSOSMutation, useUpdateSOSMutation } from "@/redux/features/sos/sos.api";


export default function SOSButton({ savedContacts = [] as EmergencyContact[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { location, getCurrent, startWatch, stopWatch } = useGeolocation();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [liveShare, setLiveShare] = useState(false);
  const [durationMins, setDurationMins] = useState(5);
  const [currentLoc, setCurrentLoc] = useState<ILocation | null>(null);
  const eventIdRef = useRef<string | null>(null);

  const [createSOS] = useCreateSOSMutation();
  const [updateSOS] = useUpdateSOSMutation();
  const [endSOS] = useEndSOSMutation();

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCurrent({ enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 });
        setCurrentLoc(loc);
      // eslint-disable-next-line no-empty
      } catch {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openConfirm = () => setOpen(true);
  const closeConfirm = () => {
    setOpen(false);
    if (liveShare) stopLiveShare();
  };

  const sendSOSHandler = async () => {
    setSending(true);
    try {
      const loc = currentLoc ?? (await getCurrent({ enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }));
      setCurrentLoc(loc);

      const payload = {
        contacts: savedContacts,
        initialLocation: { lat: loc.lat, lng: loc.lng },
        live: liveShare,
        durationMinutes: liveShare ? durationMins : 0,
        metadata: { platform: "web", userAgent: navigator.userAgent },
      };

      const res = await createSOS(payload).unwrap();
      if (res.ok) {
        toast.success("SOS sent. Help is on the way.");
        setOpen(false);
        eventIdRef.current = res.eventId || null;
        if (liveShare && eventIdRef.current) startLiveShare(eventIdRef.current);
      } else {
        toast.error(res.message ?? "Failed to send SOS");
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? "Failed to send SOS");
    } finally {
      setSending(false);
    }
  };

  const startLiveShare = (eventId: string) => {
    startWatch(
      async (loc: ILocation) => {
        setCurrentLoc(loc);
        if (eventId) {
          updateSOS({ id: eventId, location: loc }).catch(() => {});
        }
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    if (durationMins > 0) {
      const ms = durationMins * 60 * 1000;
      window.setTimeout(() => {
        stopLiveShare();
        toast("Live sharing stopped");
      }, ms);
    }

    setLiveShare(true);
  };

  const stopLiveShare = () => {
    stopWatch();
    setLiveShare(false);
    if (eventIdRef.current) {
      endSOS({ id: eventIdRef.current }).catch(() => {});
      eventIdRef.current = null;
    }
  };

  return (
    <>
      <button onClick={openConfirm} className="fixed bottom-3 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-red-800 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition" aria-label="SOS">
        <Siren className="w-5 h-5" />
        SOS
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6">
            <h3 className="text-xl font-bold mb-2">Send SOS</h3>
            <p className="mb-4">Your current location will be sent to your emergency contacts.</p>

            <div className="mb-4 h-60">
              <MapSelector
                mode="single"
                location={currentLoc ?? { lat: 24.8949, lng: 91.8687 }}
                onSetLocation={(loc) => setCurrentLoc({ ...loc })}
                height={240}
              />
            </div>

            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" checked={liveShare} onChange={(e) => setLiveShare(e.target.checked)} className="w-4 h-4" />
              <span>Share live location for</span>
              <input type="number" min={1} max={60} value={durationMins} onChange={(e) => setDurationMins(Number(e.target.value))} className="ml-2 w-20 px-2 py-1 border rounded" />
              <span>minutes</span>
            </label>

            <div className="flex items-center gap-3 justify-end mt-4">
              <button onClick={closeConfirm} className="px-4 py-2 rounded border">Cancel</button>
              {!liveShare ? (
                <button onClick={sendSOSHandler} disabled={sending} className="px-4 py-2 rounded bg-red-800 text-white disabled:opacity-60">{sending ? "Sending..." : "Confirm & Send SOS"}</button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={sendSOSHandler} disabled={sending} className="px-4 py-2 rounded bg-red-800 text-white disabled:opacity-60">{sending ? "Sending..." : "Confirm & Send & Start Live"}</button>
                  <button onClick={stopLiveShare} className="px-3 py-2 rounded border">Stop Live</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}