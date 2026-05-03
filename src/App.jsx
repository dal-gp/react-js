import { useState } from "react";

/*

*/
export default function App() {
  return (
    <div>
      <TextExpander expandedButtonText="Show text">
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>
      <TextExpander collapsedNumwords={20} expandedButtonText="Show more">
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>
      <TextExpander
        expandButtonText="Show text"
        className="box"
        expanded={true}
      >
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>
    </div>
  );
}

function TextExpander({
  children,
  collapsedNumwords = 10,
  expandButtonText = "Show more",
  collapsedButtonText = "Show less",
  className,
  expanded = false,
  buttonColor = "#1f09cd",
}) {
  const [isExpanded, setIsExapnded] = useState(expanded);
  const displayText = isExpanded
    ? children
    : `${children.split(" ").slice(0, collapsedNumwords).join(" ")} ...`;
  const buttonStyle = {
    background: "none",
    border: "none",
    font: "inherit",
    cursor: "Pointer",
    marginLeft: "6px",
    color: buttonColor,
  };
  return (
    <div className={className}>
      <span>{displayText}</span>
      <button
        style={buttonStyle}
        onClick={() => setIsExapnded((isExpanded) => !isExpanded)}
      >
        {isExpanded ? collapsedButtonText : expandButtonText}
      </button>
    </div>
  );
}
