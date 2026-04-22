let googleMapsPromise = null;

export function loadGoogleMaps() {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
      return;
    }

    // Official inline bootstrap loader pattern adapted for React/Vite.
    // Loads the Maps JavaScript API once, then enables google.maps.importLibrary().
    ((g) => {
      let h, a, k;
      const p = "The Google Maps JavaScript API";
      const c = "google";
      const l = "importLibrary";
      const q = "__ib__";
      const m = document;
      let b = window;

      b = b[c] || (b[c] = {});
      const d = b.maps || (b.maps = {});
      const r = new Set();
      const e = new URLSearchParams();

      const u = () =>
        h ||
        (h = new Promise(async (f, n) => {
          a = m.createElement("script");

          e.set("libraries", [...r] + "");
          for (k in g) {
            e.set(
              k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
              g[k]
            );
          }

          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e.toString();
          d[q] = f;
          a.onerror = () => n(new Error(p + " could not load."));
          a.nonce = m.querySelector("script[nonce]")?.nonce || "";
          m.head.append(a);
        }));

      if (d[l]) {
        resolve(window.google);
        return;
      }

      d[l] = (f, ...n) => {
        r.add(f);
        return u().then(() => d[l](f, ...n));
      };
    })({
      key: apiKey,
      v: "weekly",
    });

    // Wait until the bootstrap loader has established google.maps.importLibrary.
    const start = Date.now();
    const maxWaitMs = 10000;

    const checkReady = () => {
      if (window.google?.maps?.importLibrary) {
        resolve(window.google);
        return;
      }

      if (Date.now() - start > maxWaitMs) {
        reject(new Error("Timed out loading Google Maps"));
        return;
      }

      setTimeout(checkReady, 50);
    };

    checkReady();
  });

  return googleMapsPromise;
}