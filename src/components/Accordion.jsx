import { useState } from "react";

import AccordionItem from "./AccordionItem";
export default function Accordion({ faqs }) {
  const [curOpen, setCurOpen] = useState(false);
  return (
    <div className="accordion">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={faq.title}
          faq={faq}
          num={i}
          curOpen={curOpen}
          onOpen={setCurOpen}
        />
      ))}
    </div>
  );
}
