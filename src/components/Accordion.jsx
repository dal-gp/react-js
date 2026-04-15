import AccordionItem from "./AccordionItem";
export default function Accordion({ faqs }) {
  return (
    <div className="accordion">
      {faqs.map((faq, i) => (
        <AccordionItem key={faq.title} faq={faq} num={i} />
      ))}
    </div>
  );
}
