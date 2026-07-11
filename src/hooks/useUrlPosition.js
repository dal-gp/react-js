import { useSearchParams } from "react-router-dom";

/**
 * Custom hook to read lat/lng from the URL query string.
 * Reusable wherever map position is needed from the URL.
 * Built on top of React Router's useSearchParams hook.
 *
 * @returns {[string, string]} lat, lng - both strins (URL params are always strings)
 */
export function useUrlPosition() {
  /**
   * searchParams: URLSearchParams instance - use .get(), not dot notation
   * setSearchParams: updates the query string (replaces entirely)
   */
  const [searchParams, setSearchParams] = useSearchParams();

  // Read city position from URL query string (set when user clicks a city)
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat, lng]; // array - caller can rename on destructure
}
