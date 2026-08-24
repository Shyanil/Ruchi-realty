export const HOME_FAQS = [
  {
    question: "Are Ruchi Realty projects RERA registered?",
    answer: "RERA registration details are provided for applicable Ruchi Realty projects. Buyers should review the registration number and approval information on the relevant project page and verify it on the official state RERA portal before making a decision.",
  },
  {
    question: "Which Ruchi Realty projects are ready to move?",
    answer: "Ready-to-move options shown on our website include One Prime Residential, One Rajarhat, Active Greens and Active Business Park in Kolkata; Oscar Billionaires, Oscar Pride, Saatvik Vihar, Ruchi Lifescapes, Saatvik Green, Anand Vihar and Ruchi Enclave in Indore; and Ruchi Lifescapes in Bhopal. Visit the Projects page for the latest status of each development.",
  },
  {
    question: "Does Ruchi Realty offer plotted developments in Indore?",
    answer: "Yes. Ruchi Realty offers plotted developments in Indore, including Oscar Billionaires, Oscar Pride, Saatvik Vihar, Ruchi Lifescapes, Saatvik Green, Anand Vihar, Oscar Fort, Oscar Sanctuary, Oscar Palace and Ruchi Enclave. Availability varies by project and plot size.",
  },
  {
    question: "Which projects are available in New Town, Kolkata?",
    answer: "Ruchi Realty projects in New Town, Kolkata include One Victoria in Action Area 1 and the ready-to-move One Prime Residential. Visit their project pages to compare configurations, amenities, location details and current availability.",
  },
  {
    question: "How do I check current price and availability?",
    answer: "Select a project and submit the enquiry form with your contact details. The relevant sales team will share the latest price, available units or plots, configurations and applicable offers, as inventory and pricing may change.",
  },
];

export function Faq() {
  return (
    <section className="faq section-pad" id="faqs">
      <div className="rr-wrap faq__layout">
        <div className="faq__intro section-intro--left">
          <div className="eyebrow sec-eyebrow">Frequently asked questions</div>
          <h2>Helpful answers,<br /><span className="rr-grad">clearly explained</span></h2>
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
