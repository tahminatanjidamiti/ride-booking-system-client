import "leaflet";

declare module "leaflet" {
  namespace Control {
    interface GeocoderInstance {
      reverse(
        latlng: { lat: number; lng: number },
        scale: number,
        callback: (results: Array<{ name?: string; center?: [number, number] }>) => void
      ): void;
    }
    interface GeocoderStatic {
      nominatim(): GeocoderInstance;
    }
    // plugin attaches this to L.Control.Geocoder
    const Geocoder: GeocoderStatic;
  }
}