/*
Building a reusable StarRating component
- build static: div > (div , p)
- dyn gen <span>S{i}</span>
- styles inline: containerStyle flex vertical center 16px gap, starContainerStyle flex, textStyle line height 1, margin 0
- allow consumer to specify maxRating
- set default value for maxRating
*/
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starContainerStyle = {
  display: "flex",
};
const textStyle = {
  lineHeight: "1",
  margin: "0",
};
export default function StarRating({ maxRating = 5 }) {
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: 7 }, (_, i) => (
          <span style={textStyle}>S{i}</span>
        ))}
      </div>
      <p style={textStyle}>7</p>
    </div>
  );
}
