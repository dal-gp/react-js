export default function SelectPercentage({
  percentage,
  onSetPercentage,
  children,
}) {
  return (
    <div>
      <label htmlFor="rating">{children}</label>
      <select
        id="rating"
        value={percentage}
        onChange={(e) => onSetPercentage(Number(e.target.value))}
      >
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">t was good (10%)</option>
        <option value="20">Absolutely (20%)</option>
      </select>
    </div>
  );
}
