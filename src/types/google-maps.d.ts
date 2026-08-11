// Minimal ambient types for the slice of the Google Maps JS API (Places,
// new PlaceAutocompleteElement) that this project actually uses. The
// official @types/google.maps package doesn't yet cover
// PlaceAutocompleteElement, so we declare just enough here rather than
// pulling in a mismatched dependency.

export {};

declare global {
  namespace GoogleMapsPlaces {
    interface PlaceLatLng {
      lat(): number;
      lng(): number;
    }

    interface Place {
      displayName?: string | null;
      formattedAddress?: string | null;
      location?: PlaceLatLng | null;
      fetchFields(options: { fields: string[] }): Promise<void>;
    }

    interface PlacePrediction {
      toPlace(): Place;
    }

    interface PlaceAutocompleteSelectEvent extends Event {
      placePrediction: PlacePrediction;
    }

    interface PlaceAutocompleteElementOptions {
      includedPrimaryTypes?: string[];
    }

    class PlaceAutocompleteElement extends HTMLElement {
      constructor(options?: PlaceAutocompleteElementOptions);
    }
  }

  interface GoogleMapsApi {
    importLibrary(libraryName: string): Promise<unknown>;
    places: {
      PlaceAutocompleteElement: typeof GoogleMapsPlaces.PlaceAutocompleteElement;
    };
  }

  interface Window {
    google?: {
      maps: GoogleMapsApi;
    };
  }
}
