import Accordion from "./components/Accordion";

const faqs = [
  { title: "title1", text: "text1" },
  { title: "title2", text: "text2" },
  { title: "title3", text: "text3" },
];

function App() {
  return <Accordion faqs={faqs} />;
}

export default App;
