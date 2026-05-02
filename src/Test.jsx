import { useState } from "react";
import StarRating from "./StarRating";
export default function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating color="blue" onSetMovieRating={setMovieRating} />
      <p>This movie was rated {movieRating}</p>
    </>
  );
}
