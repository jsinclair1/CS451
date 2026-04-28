import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "./loadGoogleMaps";

export default function PlacesAutocompleteMap({ onLocationSelect }) {
  const mapContainerRef = useRef(null);
  const autocompleteContainerRef = useRef(null);
  const [error, setError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    let map;
    let marker;
    let infoWindow;
    let autocompleteEl;
    let mapClickListener;

    const init = async () => {
      try {
        await loadGoogleMaps();

        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { BasicPlaceAutocompleteElement, Place } =
          await google.maps.importLibrary("places");

        map = new Map(mapContainerRef.current, {
          center: { lat: 39.0997, lng: -94.5786 }, // Kansas City
          zoom: 12,
          mapId: "DEMO_MAP_ID", // replace with your own mapId later if needed
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
        });

        infoWindow = new google.maps.InfoWindow();

        marker = new AdvancedMarkerElement({
          map,
          position: { lat: 39.0997, lng: -94.5786 },
          title: "Selected location",
        });

        autocompleteEl = new BasicPlaceAutocompleteElement();
        autocompleteEl.placeholder = "Search for a place";
        autocompleteEl.style.width = "320px";
        autocompleteEl.style.maxWidth = "calc(100vw - 32px)";

        // Bias results to current map viewport/area.
        autocompleteEl.locationBias = new google.maps.Circle({
          center: map.getCenter(),
          radius: 10000,
        });

        autocompleteContainerRef.current.innerHTML = "";
        autocompleteContainerRef.current.appendChild(autocompleteEl);

        const onPlaceSelect = async (event) => {
          try {
            // New Places API commonly provides placePrediction on gmp-select
            const placePrediction = event.placePrediction;
            const placeFromPrediction = placePrediction?.toPlace?.();

            // Fallback for other payload shapes
            const place = placeFromPrediction || event.place;
            if (!place) {
              console.warn("No place found in selection event:", event);
              return;
            }

            await place.fetchFields({
              fields: [
                "displayName",
                "formattedAddress",
                "location",
                "viewport",
              ],
            });

            if (!place.location) {
              console.warn("Selected place has no location:", place);
              return;
            }

            marker.position = place.location;

            if (place.viewport) {
              map.fitBounds(place.viewport);
            } else {
              map.setCenter(place.location);
              map.setZoom(16);
            }

            const name = place.displayName || "Selected place";
            const address = place.formattedAddress || "";

            infoWindow.setContent(`
              <div style="max-width: 240px;">
                <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(
                  name
                )}</div>
                <div>${escapeHtml(address)}</div>
                <div style="margin-top: 8px; font-size: 12px; color: #555;">
                  ${place.location.lat().toFixed(6)}, ${place.location.lng().toFixed(6)}
                </div>
              </div>
            `);

            infoWindow.open({ map, anchor: marker });

            setSelectedAddress(address);

            const locationData = {
              name,
              address,
            };

            console.log("Selected location data:", locationData);

            if (onLocationSelect) {
              onLocationSelect(locationData);
            }
          } catch (err) {
            console.error("Place select handler failed:", err);
            setError("Failed to load selected place details.");
          }
        };

        // Keep gmp-select (current API) and add compatibility listener
        autocompleteEl.addEventListener("gmp-select", onPlaceSelect);
        autocompleteEl.addEventListener("gmp-placeselect", onPlaceSelect);

        // Keep autocomplete bias near current map center.
        map.addListener("idle", () => {
          const center = map.getCenter();
          if (!center || !autocompleteEl) return;

          autocompleteEl.locationBias = new google.maps.Circle({
            center: { lat: center.lat(), lng: center.lng() },
            radius: 10000,
          });
        });

        // Example: click map to close infowindow
        mapClickListener = map.addListener("click", () => {
          infoWindow.close();
        });
      } catch (err) {
      console.error("Google Maps init failed:", err);
      setError(err?.message || "Google Maps failed to initialize.");
      }
    };

    init();

    return () => {
      if (mapClickListener) {
        google.maps.event.removeListener(mapClickListener);
      }
      if (autocompleteContainerRef.current) {
        autocompleteContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <div
          ref={autocompleteContainerRef}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 2,
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            padding: "8px",
          }}
        />
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {error ? (
        <p style={{ color: "crimson", marginTop: "8px" }}>{error}</p>
      ) : null}
    </div>
  );
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}