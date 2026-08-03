export const HOME_FAQS = [
  {
    question: "What types of properties does Ruchi Realty offer?",
    answer: "Ruchi Realty offers residential homes, commercial spaces, and plotted developments across key locations.",
  },
  {
    question: "Where are Ruchi Realty projects located?",
    answer: "Our projects are located across Kolkata, Indore, and Bhopal, with options in established and emerging neighbourhoods.",
  },
  {
    question: "How can I book a site visit?",
    answer: "Click “Book a Visit” on the website or submit an enquiry form. Our team will contact you to arrange a convenient time.",
  },
  {
    question: "Can I download a project brochure and floor plan?",
    answer: "Yes. Visit the relevant project page to view available details and request or download the brochure and floor plans.",
  },
  {
    question: "How can I get pricing and availability details?",
    answer: "Submit an enquiry through the website or contact our sales team. They will share current availability, pricing, and relevant project information.",
  },
];

export function Faq() {
  return (
    <section className="faq section-pad" id="faqs">
      <div className="rr-wrap faq__layout">
        <div className="faq__intro">
          <div className="eyebrow sec-eyebrow">Frequently asked questions</div>
          <h2>Helpful answers,<br /><span className="rr-grad">clearly explained.</span></h2>
          <p>Everything you need to know before exploring a Ruchi Realty project.</p>
        </div>
        <div className="faq__list">
          {HOME_FAQS.map((item, index) => (
            <details className="faq__item" key={item.question} open={index === 0}>
              <summary><span>{item.question}</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
