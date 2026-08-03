import Nav from "../components/Nav";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";

const offices = [
  {
    id: "indore-office",
    number: "01",
    city: "Indore Office",
    company: "RRHL Realty Limited",
    address: "2/1, South Tukoganj, Behind High Court, Indore – 452001 (M.P.), India.",
    sales: "+91 89292 25275",
    corporate: "0731-4018010 | 4018015 | 4018120",
        area: "Serving South Tukoganj, Bicholi Hapsi and greater Indore.",
    action: "Call Sales",
    href: "tel:+918929225275",
  },
  {
    id: "kolkata-office",
    number: "02",
    city: "Kolkata Office",
    company: "RRHL Realty Limited",
    address: "54, 10, Debendra Chandra Dey Rd, near ITC Sonar, Tangra, Kolkata – 700015 (W.B.), India.",
    sales: "+91 98364 18000",
    corporate: "033-66066777",
        area: "Serving Tangra, New Town, Rajarhat and greater Kolkata.",
    action: "Call Sales",
    href: "tel:+919836418000",
  },
  {
    id: "bhopal-office",
    number: "03",
    city: "Bhopal Office",
    company: "RRHL Realty Limited",
    address: "Behind Bhabha College, Jatkhedi Hoshangabad Road, Bhopal – 462026 (M.P.), India.",
    sales: "+91 89292 25275",
    corporate: "Customer Care: +91 89292 25275",
        area: "Serving Hoshangabad Road and greater Bhopal.",
    action: "Call Customer Care",
    href: "tel:+918929225275",
  },
];

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Ruchi Realty — Offices in Kolkata, Indore & Bhopal"
        description="Get in touch with Ruchi Realty. Schedule a site visit, request pricing, or contact our Kolkata, Indore or Bhopal office directly."
        canonical="https://ruchirealty.com/contact"
        image="/assets/projects/one-victoria.webp"
      />
      <Nav solid />
      <main className="contact-page">
        <header className="contact-page__hero">
          <div className="contact-page__mark" aria-hidden="true" />
          <div className="rr-wrap">
            <span className="eyebrow">Get In Touch</span>
            <h1>A considered way<br /><span>to find your place</span></h1>
            <p>You can get in touch with us across our offices in Indore, Kolkata, and Bhopal or reach our customer care team anytime.</p>
          </div>
        </header>

        <section className="contact-paths section-pad">
          <div className="rr-wrap">
            <div className="contact-paths__intro">
              <span className="eyebrow sec-eyebrow">Get In Touch</span>
              <h2>Our Offices &<br />Customer Care</h2>
            </div>
            <div className="contact-paths__grid">
              {offices.map((office) => (
                <article id={office.id} className="contact-path" key={office.id}>
                  <span className="contact-path__number">{office.number}</span>
                  <h3>{office.city}</h3>
                  <div className="contact-office-details">
                    <strong className="contact-office-company">{office.company}</strong>
                    <p className="contact-office-addr">{office.address}</p>
                    <p className="contact-office-area">{office.area}</p>
                    <p className="contact-office-phone">
                      <span>Ph. Sales: </span><a href={`tel:${office.sales.replace(/\s+/g, "")}`}>{office.sales}</a>
                    </p>
                    {office.corporate && (
                      <p className="contact-office-corp">
                        <span>Corporate: </span>{office.corporate}
                      </p>
                    )}
                  </div>
                  <a href={office.href} className="contact-office-btn">
                    {office.action}<span>→</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Contact
          eyebrow="Get in Touch"
          heading="Plan Your Site Visit"
          lead="Tell us which real estate project you'd like to explore. Share your preferred city, Indore, Kolkata or Bhopal, along with your project and contact details, and our team will reach out to answer questions or arrange a visit."
        />
      </main>
      <Footer />
    </>
  );
}
