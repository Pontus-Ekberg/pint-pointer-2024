import React, { useState, useEffect, useRef } from "react";
import { LoadScript } from "@react-google-maps/api";
import keg from "../assets/img/Keg.png";
import pripp from "../assets/img/Pripp.png";
import BarCard from "./BarCard";

// Funktion för att beräkna azimut
const calculateAzimuth = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const azimuthRad = Math.atan2(y, x);
  const azimuthDeg = (toDeg(azimuthRad) + 360) % 360;

  return azimuthDeg;
};

// Funktion för att beräkna avstånd
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3; // Jordens radie i meter
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Avstånd i meter
};

const Compass: React.FC = () => {
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [targetCoords, setTargetCoords] = useState({
    lat: 55.5859798,
    lon: 13.0062541,
  });
  const [barName, setBarName] = useState<string | null>(null);
  const [barPhotoUrl, setBarPhotoUrl] = useState<string | null>(null);
  const compassCircleRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [radius, setRadius] = useState(3); // Standard är 3 km
  const [showBarCard, setShowBarCard] = useState(false); // För att visa BarCard

  // Uppdaterar användarens position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude });
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Begär tillstånd för att använda Device Orientation API
  const handleOrientationPermission = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            setHasPermission(true);
          } else {
            alert("Permission to use device orientation is required!");
          }
        })
        .catch(() =>
          alert("Device orientation not supported or permission not granted.")
        );
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    if (hasPermission && userCoords) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading = e.alpha;

        const eventWithWebkitHeading = e as DeviceOrientationEvent & {
          webkitCompassHeading?: number;
        };
        if (
          typeof eventWithWebkitHeading.webkitCompassHeading !== "undefined"
        ) {
          heading = eventWithWebkitHeading.webkitCompassHeading;
        }

        if (heading !== null && userCoords) {
          const azimuth = calculateAzimuth(
            userCoords.lat,
            userCoords.lon,
            targetCoords.lat,
            targetCoords.lon
          );

          const relativeHeading = (azimuth - heading + 360) % 360;
          setCompassHeading(relativeHeading);

          if (compassCircleRef.current) {
            compassCircleRef.current.style.transform = `translate(-50%, -50%) rotate(${relativeHeading}deg)`;
          }
        }
      };

      window.addEventListener("deviceorientation", handleOrientation, true);

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, [hasPermission, userCoords, targetCoords]);

  useEffect(() => {
    if (userCoords) {
      const distanceToTarget = calculateDistance(
        userCoords.lat,
        userCoords.lon,
        targetCoords.lat,
        targetCoords.lon
      );
      setDistance(distanceToTarget);

      // Visa BarCard när användaren är inom 20 meter från baren
      if (distanceToTarget < 20) {
        setShowBarCard(false);
      } else {
        setShowBarCard(true);
      }
    }
  }, [userCoords, targetCoords]);

  // Funktion för att hitta en slumpad bar
  const findRandomBar = async () => {
    if (!userCoords) return;

    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: new google.maps.LatLng(userCoords.lat, userCoords.lon),
      radius: radius * 1000,
      type: "bar",
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const randomIndex = Math.floor(Math.random() * results.length);
        const bar = results[randomIndex];
        if (bar.geometry && bar.geometry.location) {
          const lat = bar.geometry.location.lat();
          const lon = bar.geometry.location.lng();
          setTargetCoords({ lat, lon });
          setBarName(bar.name || "Okänd Bar");
          setBarPhotoUrl(bar.photos ? bar.photos[0]?.getUrl() : null);
        } else {
          alert(
            "Could not retrieve location information for the selected bar."
          );
        }
      } else {
        alert(`Could not find any bars within ${radius} km.`);
      }
    });
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyD8Nw7hS3Hfl5sUc1VkA5pCuT0rO5pDMSQ"
      libraries={["places"]}
    >
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <select
          className="bg-gray-300 px-4 py-2 mb-3 border-2 border-black shadow-sm"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        >
          <option value={1}>1 km</option>
          <option value={2}>2 km</option>
          <option value={3}>3 km</option>
          <option value={4}>4 km</option>
          <option value={5}>5 km</option>
        </select>
        <button
          className="bg-gray-300 border-2 border-black px-4 py-2"
          onClick={findRandomBar}
        >
          Hitta en slumpad bar inom {radius} km
        </button>
        <div className="relative w-[320px] h-[320px] rounded-full mx-auto">
          <div
            ref={compassCircleRef}
            className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${keg})` }}
          ></div>
          <div
            className="absolute w-[60%] h-[60%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain z-10"
            style={{ backgroundImage: `url(${pripp})` }}
          ></div>
        </div>
        {compassHeading !== null && (
          <p className="text-lg font-semibold">
            Current Heading: {compassHeading.toFixed(2)}°
          </p>
        )}
        {barName && (
          <p className="text-lg font-semibold">Närmaste bar: {barName}</p>
        )}
        {distance !== null && (
          <p className="text-md text-gray-700">
            Avstånd till målet: {distance.toFixed(2)} meter
          </p>
        )}
        {showBarCard && barName && (
          <BarCard
            name={barName}
            photoUrl={barPhotoUrl}
            onClose={() => setShowBarCard(false)}
          />
        )}
        {!hasPermission && (
          <button
            className="bg-gray-300 border-2 border-black px-4 py-2 mx-10"
            onClick={handleOrientationPermission}
          >
            Ge tillstånd för att använda kompass
          </button>
        )}
      </div>
    </LoadScript>
  );
};

export default Compass;
