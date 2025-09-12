import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ILocation } from "@/types";

// --- Fix Leaflet default marker ---
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type Props =
  | {
      mode?: "ride"; // pickup + dropoff
      pickup: ILocation;
      dropoff: ILocation;
      active: "pickup" | "dropoff";
      onSetPickup: (loc: ILocation) => void;
      onSetDropoff: (loc: ILocation) => void;
      center?: ILocation;
      height?: number;
    }
  | {
      mode: "single"; // one location (Profile etc.)
      location: ILocation;
      onSetLocation: (loc: ILocation) => void;
      center?: ILocation;
      height?: number;
    };

const MapSelector: React.FC<Props> = (props) => {
  const [activeMarker, setActiveMarker] = useState<"pickup" | "dropoff">("pickup");

  const LocationSetter = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const loc: ILocation = {
          lat: parseFloat(lat.toFixed(4)),
          lng: parseFloat(lng.toFixed(4)),
          formattedAddress: undefined,
        };

        if (props.mode === "single") {
          props.onSetLocation(loc);
        } else {
          if (activeMarker === "pickup") props.onSetPickup(loc);
          else props.onSetDropoff(loc);
        }
      },
    });
    return null;
  };

  return (
    <div className="border rounded p-4">
      {props.mode !== "single" && (
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveMarker("pickup")}
            className={`px-3 py-1 rounded ${
              activeMarker === "pickup" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Set Pickup
          </button>
          <button
            type="button"
            onClick={() => setActiveMarker("dropoff")}
            className={`px-3 py-1 rounded ${
              activeMarker === "dropoff" ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            Set Dropoff
          </button>
        </div>
      )}

      <MapContainer
        center={
          props.mode === "single"
            ? [props.location.lat, props.location.lng]
            : props.pickup.lat !== 0
            ? [props.pickup.lat, props.pickup.lng]
            : [24.8949, 91.8687]
        }
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: `${props.height ?? 400}px`, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationSetter />

        {props.mode === "single" && props.location.lat !== 0 && (
          <Marker
            position={[props.location.lat, props.location.lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const pos = (e.target as L.Marker).getLatLng();
                props.onSetLocation({
                  lat: parseFloat(pos.lat.toFixed(4)),
                  lng: parseFloat(pos.lng.toFixed(4)),
                  formattedAddress: props.location.formattedAddress,
                });
              },
            }}
          >
            <Popup>Location</Popup>
          </Marker>
        )}

        {props.mode !== "single" && props.pickup.lat !== 0 && (
          <Marker
            position={[props.pickup.lat, props.pickup.lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const pos = (e.target as L.Marker).getLatLng();
                props.onSetPickup({
                  lat: parseFloat(pos.lat.toFixed(4)),
                  lng: parseFloat(pos.lng.toFixed(4)),
                  formattedAddress: props.pickup.formattedAddress,
                });
              },
            }}
          >
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {props.mode !== "single" && props.dropoff.lat !== 0 && (
          <Marker
            position={[props.dropoff.lat, props.dropoff.lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const pos = (e.target as L.Marker).getLatLng();
                props.onSetDropoff({
                  lat: parseFloat(pos.lat.toFixed(4)),
                  lng: parseFloat(pos.lng.toFixed(4)),
                  formattedAddress: props.dropoff.formattedAddress,
                });
              },
            }}
          >
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapSelector;