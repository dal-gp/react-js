export default function InputBill({ bill, setBill, children }) {
  return (
    <div>
      <label htmlFor="bill">{children}</label>
      <input
        type="number"
        placeholder="100"
        id="bill"
        required
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
    </div>
  );
}
