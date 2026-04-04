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
  return (
    <div>
      <h3>What do you need for your 😍 trip? </h3>
    </div>
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
