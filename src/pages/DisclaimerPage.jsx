import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";

export default function DisclaimerPage() {
  return <>
    <SEO title="Disclaimer | Ruchi Realty" description="Read the Ruchi Realty website disclaimer concerning project information, visual representations, availability and third-party links." canonical="https://ruchirealty.com/disclaimer" />
    <Nav solid />
    <main className="privacy-page">
      <header className="privacy-hero"><div className="rr-wrap"><span className="eyebrow">Legal</span><h1>Disclaimer</h1><p>Last updated: July 21, 2026</p></div></header>
      <article className="privacy-content rr-wrap">
        <p className="privacy-intro">The information on this website is provided by Ruchi Realty for general information and guidance. Please read this disclaimer before relying on any project, property or company information presented here.</p>

        <section><h2>General Information</h2><p>While Ruchi Realty makes reasonable efforts to keep information accurate and current, the content on this website is provided on an “as is” basis. We make no representation or warranty, express or implied, about its completeness, accuracy, reliability, suitability or availability.</p><p>Website content does not constitute a legal offer, contract, investment advice or professional advice. Any property transaction will be governed only by the final executed agreement and applicable statutory documents.</p></section>

        <section><h2>Project Information</h2><p>Project plans, specifications, dimensions, amenities, features, prices, availability, possession timelines and other details are indicative and may be revised subject to approvals, construction requirements, market conditions and applicable law.</p><p>Prospective purchasers should independently verify all material information, approvals, registrations and terms with an authorized Ruchi Realty representative before making a purchase or investment decision.</p></section>

        <section><h2>Images and Visual Representations</h2><p>Artist impressions, computer-generated images, photographs, videos, floor plans, maps, furniture layouts, landscaping and other visual material are illustrative. Actual construction, finishes, views, surroundings, fittings, furniture and specifications may differ.</p><p>Maps and location representations are not to scale and are intended only to indicate approximate location and connectivity.</p></section>

        <section><h2>Pricing and Availability</h2><p>Prices, offers, payment plans, inventory and availability may change without prior notice. Taxes, registration charges, maintenance charges and other statutory or incidental costs may apply in addition to any displayed price.</p></section>

        <section><h2>Regulatory Information</h2><p>Where applicable, users should refer to the relevant Real Estate Regulatory Authority website and official project documents for current registration details and disclosures. In the event of any inconsistency, statutory filings and executed agreements will prevail over website content.</p></section>

        <section><h2>External Links</h2><p>This website may contain links to third-party websites. These links are provided for convenience only. Ruchi Realty does not control or endorse third-party content and is not responsible for its availability, accuracy, security or privacy practices.</p></section>

        <section><h2>Limitation of Liability</h2><p>To the extent permitted by law, Ruchi Realty and its affiliates, directors, employees and representatives will not be liable for any direct, indirect, incidental or consequential loss arising from use of, inability to use, or reliance on this website or its content.</p></section>

        <section><h2>Changes to this Disclaimer</h2><p>We may update this disclaimer at any time without prior notice. Changes become effective when published on this page. Users should review this page periodically.</p></section>

        <section><h2>Contact Us</h2><p>For questions or verification of project information, email <a href="mailto:emarketing@rrhlrealty.com">emarketing@rrhlrealty.com</a> or visit our <a href="/contact">Contact Us</a> page.</p></section>
      </article>
    </main>
    <Footer />
  </>;
}
