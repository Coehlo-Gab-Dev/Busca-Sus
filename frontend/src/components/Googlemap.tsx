"use client";

import { useEffect, useRef, useState } from "react";
import "./Googlemap.css";

interface GoogleMapProps {
  destination: {
    place_id: string;
    name: string;
    formatted_address: string;
  } | null;
  onRouteCleared: () => void;
  showMessage: (message: string) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ destination, onRouteCleared, showMessage }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<any>(null);
  const [destinationMarker, setDestinationMarker] = useState<any>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("Por favor, digite seu endereço");
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer();

      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);

      const defaultCenter = { lat: -2.53073, lng: -44.3068 };
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: defaultCenter,
        mapTypeControl: true,
        streetViewControl: true,
      });

      directionsRendererInstance.setMap(mapInstance);
      setMap(mapInstance);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEuKHaxqYCj78yw90FXkwsE3a_ITRqfpA&libraries=places,geometry&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (window.google && map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
      if (userLocationMarker) {
        userLocationMarker.setMap(null);
      }
      if (destinationMarker) {
        destinationMarker.setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    if (window.google && addressInputRef.current && !autocomplete) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "BR" },
        fields: ["place_id", "geometry", "name", "formatted_address"],
      });

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          setUserLocation(newLocation);
          setAddressConfirmed(true);

          if (map) {
            map.setCenter(newLocation);
            map.setZoom(16);

            if (userLocationMarker) {
              userLocationMarker.setMap(null);
            }

            const marker = new window.google.maps.Marker({
              position: newLocation,
              map: map,
              title: "Seu Endereço",
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              },
            });

            setUserLocationMarker(marker);
          }

          setLocationStatus("Endereço confirmado");
        }
      });

      setAutocomplete(autocompleteInstance);
    }
  }, [map]);

  useEffect(() => {
    if (destination && directionsService && directionsRenderer && map && userLocation && addressConfirmed) {
      calculateAndDisplayRoute();
    }
  }, [destination, directionsService, directionsRenderer, map, userLocation, addressConfirmed]);

  const calculateAndDisplayRoute = () => {
    if (!userLocation || !destination?.place_id || !directionsService || !directionsRenderer) {
      showMessage("❌ Por favor, primeiro digite seu endereço válido");
      return;
    }

    if (destinationMarker) {
      destinationMarker.setMap(null);
    }

    const request = {
      origin: userLocation,
      destination: { placeId: destination.place_id },
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService
      .route(request)
      .then((response: any) => {
        directionsRenderer.setDirections(response);
        setShowDirections(true);

        const marker = new window.google.maps.Marker({
          position: response.routes[0].legs[0].end_location,
          map,
          title: destination.name,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
        setDestinationMarker(marker);
      })
      .catch((e: any) => {
        console.error("Erro ao calcular rota:", e);
        showMessage("❌ Erro ao calcular rota. Verifique seu endereço e tente novamente.");
      });
  };

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.set("directions", null);
    }
    if (destinationMarker) {
      destinationMarker.setMap(null);
      setDestinationMarker(null);
    }
    setShowDirections(false);
    onRouteCleared();

    if (map && userLocation) {
      map.setCenter(userLocation);
      map.setZoom(16);
    }
    setAddressConfirmed(false);
    setLocationStatus("Por favor, digite seu endereço novamente");
  };

  return (
    <div className="container-mapa">
      <div className="status-localizacao">
        <div className="conteudo-status">
          <p className="texto-status">
            <span className="rotulo-status">Status:</span> {locationStatus}
          </p>
          {userLocation && (
            <p className="detalhes-localizacao" style={{display: 'none'}}>
              📍 Coordenadas: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {!addressConfirmed && (
        <div className="modal-endereco obrigatorio">
          <div className="conteudo-modal">
            <h3 className="titulo-modal">📍 Digite seu Endereço Completo</h3>
            <p className="texto-modal">
              Por favor, digite seu endereço completo para continuar:
            </p>
            <input
              ref={addressInputRef}
              type="text"
              placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade"
              className="campo-endereco"
              required
            />
            <p className="texto-ajuda">Digite até ver sugestões de endereços e selecione o correto</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="mapa-google" />

      {addressConfirmed && (
        <div className="container-botoes">
          <button
            onClick={clearRoute}
            className="botao-limpar"
          >
            🔄 Nova Busca no Mapa
          </button>
        </div>
      )}
    </div>
  );
}