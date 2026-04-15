export default function Stats({ items }) {
  if (!items.length) {
    return (
      <p>
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );
  }

  const numItems = items.length;
  const numPackedItems = items.filter((item) => item.packed === true).length;
  const percentage = Math.round((numPackedItems / numItems) * 100);
  return (
    <footer>
      <p>
        {/* <em>
          {percentage === 100
            ? "You have everything! Ready to go ✈️ "
            : `👝 You have ${numItems} items on your list, and you already packed
          ${numPackedItems} (${percentage}%)`}
        </em> */}

        {percentage === 100 ? (
          <em>You have everything! Ready to go ✈️</em>
        ) : (
          <em>
            👝 You have {numItems} items on your list, and you already packed
            {numPackedItems} ({percentage}%)
          </em>
        )}
      </p>
    </footer>
  );
}
