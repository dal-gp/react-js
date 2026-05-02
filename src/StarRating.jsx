import { useState } from "react";

/*
Building a reusable StarRating component
- build static: div > (div , p)
- dyn gen <span>S{i}</span>
- styles inline: containerStyle flex vertical center 16px gap, starContainerStyle flex, textStyle line height 1, margin 0
- allow consumer to specify maxRating
- set default value for maxRating

Creating the Star
- create Star component that returns full star
- use it in place span in StarRating
- display current rating whenever we click on one the star in the p element inplace of dummy number.
    - define state
    - use the state
    - update the state
- for each star decide full or empty star aka display full or empty depending on rating

Handling hover events
- what we want? 1. click -> permanent rating (saved) 2. hover -> temporary rating (only when mouse is there). So we need one more memory.
- mouse enters set temp memory , mouse leaves reset temp memory
- show temporary memory
- for each stars decide on show full or empty star ( so if hovering show hover star, else show saved stars)

Improving reusability with props
- accept size and color props with default values of 48 and #fcc419” (p.textStyle)
  - move textStyle inside the component
  - use the provided value inside textStyle
- use the same value (size and color) for the individual star (starStyle)
  - move starStyle inside the component
  - use the provided value of size to replace height and widht
  - use the provided value of color to replace fill and stroke for fullstar and stroke only for emptystar
- allow consumer to pass class name as props
  - accept class name prop with default value of emtpy string
  - then add class to the container
- allow user to display their text message instead of rating number
  - accept an array with default value set to empty array
  - if the items in array matches the max rating only then we display the msg that is passed in otherwise display the rating as before
- allow consumer to set default rating 
- allow consumer to get access to state 'rating' outside our component 
  - create dummy consumer's component e.g Test and use the StarRating inside Test component
  - ui changes so define state movieRating in Test component and use it for 'This movie was rated X stars'
  - update movieRating when rating state inside changes by passing set function to StarRating , accept and use it to update movieRating when rating changes
*/
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starContainerStyle = {
  display: "flex",
};

export default function StarRating({
  maxRating = 5,
  size = 48,
  color = "#fcc419",
  className = "",
  messages = [],
  defaultRating = 0,
  onSetMovieRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    fontSize: `${size}px`,
    color: `${color}`,
  };

  function handleRate(rating) {
    setRating(rating);
    if (onSetMovieRating) onSetMovieRating(rating);
  }

  function handleHoverIn(tempRating) {
    setTempRating(tempRating);
  }

  function handleHoverOut() {
    setTempRating(0);
  }
  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            i={i}
            key={i}
            onRate={handleRate}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ i, onRate, full, onHoverIn, onHoverOut, size, color }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starStyle}
      onClick={() => onRate(i + 1)}
      onMouseEnter={() => onHoverIn(i + 1)}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
