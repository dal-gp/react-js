/*
scaffolding only (Header, Main wrapper with children prop)
*/
import Main from "./components/Main";
import Header from "./Header";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <p>1/15</p>
        <p>Question</p>
      </main>
    </div>
  );
}

export default App;
