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
  return <div>LIST</div>;
}

function Item() {}

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
