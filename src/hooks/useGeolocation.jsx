import { useState } from "react";

/**
 * Custome hook to get user's current GPS position via browser geolocation API.
 * Reusable - copy into any project that needs geolocation.
 *
 * @param {Array|null} defaultPosition - Initial position value (default: null)
 * @returns { {isLoading, position, error, getPosition}}
 */
export function useGeolocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  //null not {} - safe to check with if(position)
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    );
  }

  return { isLoading, position, error, getPosition };
}
