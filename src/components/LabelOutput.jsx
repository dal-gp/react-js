export default function LabelOutput({ bill, serviceRating1, serviceRating2 }) {
  const tip = (serviceRating1 / 100) * 100 + (serviceRating2 / 100) * 100;
  return (
    bill > 0 && (
      <p>
        You pay ${bill + tip} ({bill} + ${tip} tip)
      </p>
    )
  );
}
