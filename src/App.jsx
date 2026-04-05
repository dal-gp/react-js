import { useState } from "react";

const intialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: true },
];

function App() {
  return (
    <div>
      <Logo />
      <Form />
      <PackingList />
      <Stats />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 👝</h1>;
}

function Form() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { quantity, description, packed: false, id: Date.now() };
    console.log(newItem);

    setQuantity(1);
    setDescription("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip? </h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {/* <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option> */}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList() {
  return (
    <ul>
      {intialItems.map((item) => (
        <Item item={item} key={item.id} />
      ))}
    </ul>
  );
}

function Item({ item }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
        <button>❌</button>
      </span>
    </li>
  );
}

function Stats() {
  return (
    <footer>
      <p>
        <em>👝 You have X items on your list, and you already packed X(x%)</em>
      </p>
    </footer>
  );
}

export default App;
