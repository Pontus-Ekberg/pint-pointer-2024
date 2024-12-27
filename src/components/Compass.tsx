import React, { useState, useEffect, useRef } from "react";
import { LoadScript, Libraries } from "@react-google-maps/api";
import { auth, db } from "../service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import keg from "../assets/img/Keg.png";
import pripp from "../assets/img/Pripp.png";
import unseeImg from "../assets/img/unsee.png";
import seeImg from "../assets/img/see.png";
import BarCard from "./BarCard";
import skumol from "../assets/img/skumol.png";
import ol from "../assets/img/ol.png";

const libraries: Libraries = ["places"];

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

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3;
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
  const [barAddress, setBarAddress] = useState<string | null>(null);
  const compassCircleRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [openingHours, setOpeningHours] = useState<string[]>([]);

  const [radius, setRadius] = useState(3);
  const [showBarCard, setShowBarCard] = useState(false);
  const [showBarName, setShowBarName] = useState(false);
  const [barFound, setBarFound] = useState(false);

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

      if (distanceToTarget < 20) {
        setShowBarCard(true);
      } else {
        setShowBarCard(false);
      }
    }
  }, [userCoords, targetCoords]);

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
          setBarAddress(bar.vicinity || null);

          // Beräkna avstånd
          const newDistance = calculateDistance(
            userCoords.lat,
            userCoords.lon,
            lat,
            lon
          );
          setDistance(newDistance);
          setBarFound(true);

          if (bar.place_id) {
            placesService.getDetails(
              { placeId: bar.place_id },
              (place, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  place
                ) {
                  const openingHours = place.opening_hours
                    ? place.opening_hours.weekday_text
                    : [];
                  setOpeningHours(openingHours || []);
                }
              }
            );
          }
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

  const saveBarToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Du måste vara inloggad för att spara barer.");
      return;
    }

    try {
      const barRef = doc(
        db,
        "users",
        user.uid,
        "savedBars",
        barName || "Unknown Bar"
      );
      await setDoc(barRef, {
        name: barName || "Unknown Bar",
        photoUrl: barPhotoUrl,
        address: barAddress || null,
        timestamp: new Date(),
        openingHours: openingHours,
      });
      alert(`${barName} har sparats i din profil!`);
    } catch (error) {
      console.error("Error saving bar: ", error);
      alert("Kunde inte spara baren. Försök igen.");
    }
  };

  const toggleBarName = () => {
    setShowBarName(!showBarName);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="mt-[25px] w-screen flex flex-col justify-center items-center md:mt-10 font-barrio">
        <div onClick={toggleBarName}>
          <img
            src={showBarName ? unseeImg : seeImg}
            alt={showBarName ? "Hide" : "Show"}
            className="w-12 h-12 mt-2 cursor-pointer"
          />
        </div>

        {showBarName && barName && (
          <p className="text-lg text-white font-semibold">{barName}</p>
        )}

        {distance !== null && (
          <p className="text-md text-white font-bold">
            {barFound ? `${distance.toFixed(2)} meter` : "0 meter"}
          </p>
        )}

        <div className="relative w-[280px] h-[320px] rounded-full mx-auto  md:mt-10 md:w-[350px] md:h-[500px]">
          <div
            ref={compassCircleRef}
            className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${keg})` }}
          ></div>
          <div
            className="absolute w-[60%] h-[60%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain z-10 md:w-[90%] md:h-[50%]"
            style={{ backgroundImage: `url(${pripp})` }}
          ></div>
        </div>

        {showBarCard && barName && (
          <BarCard
            name={barName}
            photoUrl={barPhotoUrl}
            address={barAddress || null}
            openingHours={openingHours}
            onClose={() => setShowBarCard(false)}
            onSave={saveBarToFirestore}
          />
        )}

        <div className="flex items-center space-x-4 mt-4">
          <select
            className="bg-cover bg-center drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg px-4 py-2 border-2 border-black shadow-sm md:w-24 md:h-14"
            style={{
              backgroundImage: `url(${ol})`,
            }}
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
            className="bg-cover bg-center drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg border-2 border-black px-4 py-2 md:w-48 md:h-14"
            style={{
              backgroundImage: `url(${ol})`,
            }}
            onClick={findRandomBar}
          >
            Find bar: {radius} km
          </button>
        </div>

        {!hasPermission && (
          <button
            className="absolute z-40 bg-cover bg-center drop-shadow-md hover:scale-105 hover:brightness-110 rounded-lg border-2 border-black px-4 py-2 mx-10 md:w-64 md:h-20
            "
            style={{
              backgroundImage: `url(${skumol})`,
            }}
            onClick={handleOrientationPermission}
          >
            GIVE PERMISSION TO COMPASS
          </button>
        )}
      </div>
    </LoadScript>
  );
};

export default Compass;
