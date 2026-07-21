import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";

const definitions = [
  ["Account", "a unique account created for You to access our Service or parts of our Service."],
  ["Affiliate", "an entity that controls, is controlled by or is under common control with a party, where control means ownership of 50% or more of the voting shares, equity interest or other securities."],
  ["Company", "Ruchi Realty, 2/1, South Tukoganj, Indore (referred to as the Company, We, Us or Our)."],
  ["Cookies", "small files placed on Your computer, mobile device or other device that may contain details of Your browsing history."],
  ["Country", "Madhya Pradesh, India."],
  ["Device", "any device that can access the Service, such as a computer, cellphone or digital tablet."],
  ["Personal Data", "any information relating to an identified or identifiable individual."],
  ["Service", "the Website."],
  ["Service Provider", "a person or company that processes data on behalf of the Company or helps provide, analyze or support the Service."],
  ["Usage Data", "data collected automatically through use of the Service or its infrastructure, such as the duration of a page visit."],
  ["Website", "Ruchi Realty, accessible from https://ruchirealty.com/."],
  ["You", "the individual, company or legal entity accessing or using the Service."],
];

const uses = [
  "To provide and maintain our Service, including monitoring its usage.",
  "To manage Your Account and access to registered-user functionality.",
  "For the performance of a purchase contract or another contract with Us.",
  "To contact You by email, telephone, SMS or equivalent electronic communication about updates, products, services and security notices.",
  "To provide news, offers and information about similar goods, services and events, unless You opt out.",
  "To attend to and manage Your requests.",
  "To evaluate or conduct a merger, sale, restructuring or other business transfer.",
  "For data analysis, usage trends, campaign measurement and improvements to our Service, products, marketing and Your experience.",
];

const sharing = [
  "With Service Providers who help monitor, analyze or operate the Service and contact You.",
  "During negotiations or completion of a merger, financing, acquisition or sale of Company assets.",
  "With Affiliates that are required to honor this Privacy Policy.",
  "With business partners to offer products, services or promotions.",
  "With other users when You share information in public areas of the Service.",
  "For another purpose with Your consent.",
];

export default function PrivacyPolicyPage() {
  return <>
    <SEO title="Privacy Policy | Ruchi Realty" description="Read Ruchi Realty's privacy policy, including how personal data and cookies are collected, used, retained and protected." canonical="https://ruchirealty.com/privacy-policy" />
    <Nav solid />
    <main className="privacy-page">
      <header className="privacy-hero"><div className="rr-wrap"><span className="eyebrow">Legal</span><h1>Privacy Policy</h1><p>Last updated: April 20, 2024</p></div></header>
      <article className="privacy-content rr-wrap">
        <p className="privacy-intro">This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service. It also explains Your privacy rights and how the law protects You.</p>
        <p>We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>

        <section><h2>Interpretation and Definitions</h2><h3>Interpretation</h3><p>Words whose initial letter is capitalized have meanings defined below. These definitions have the same meaning whether they appear in singular or plural.</p><h3>Definitions</h3><dl>{definitions.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl></section>

        <section><h2>Collecting and Using Your Personal Data</h2><h3>Types of Data Collected</h3><h4>Personal Data</h4><p>While using Our Service, We may ask You to provide personally identifiable information that can be used to contact or identify You, including:</p><ul><li>Email address</li><li>First name and last name</li><li>Phone number</li><li>Usage Data</li></ul>
        <h4>Usage Data</h4><p>Usage Data is collected automatically and may include Your IP address, browser type and version, pages visited, visit date and time, time spent on pages, unique device identifiers and other diagnostic data.</p><p>When You access the Service through a mobile device, We may collect the device type, unique ID, IP address, operating system, mobile browser type and other diagnostic data. We may also collect information sent by Your browser.</p></section>

        <section><h2>Tracking Technologies and Cookies</h2><p>We use Cookies and similar technologies, including beacons, tags and scripts, to track activity and improve and analyze Our Service.</p><h3>Cookies or Browser Cookies</h3><p>A Cookie is a small file placed on Your Device. You can instruct Your browser to refuse Cookies or indicate when a Cookie is being sent. If You do not accept Cookies, some parts of the Service may not function properly.</p><h3>Web Beacons</h3><p>Parts of the Service and Our emails may contain small electronic files that allow Us to count visitors, understand email engagement, measure the popularity of sections and verify system integrity.</p><p>Persistent Cookies remain on Your Device when You go offline. Session Cookies are deleted when You close Your browser.</p><div className="privacy-note"><strong>Necessary / Essential Cookies</strong><p>Session Cookies administered by Us. These authenticate users, help prevent fraudulent use and provide requested Website functionality.</p><strong>Cookies Policy / Notice Acceptance Cookies</strong><p>Persistent Cookies administered by Us. These identify whether users have accepted Cookies.</p><strong>Functionality Cookies</strong><p>Persistent Cookies administered by Us. These remember choices such as login details or language preferences to provide a more personal experience.</p></div></section>

        <section><h2>Use of Your Personal Data</h2><p>The Company may use Personal Data for the following purposes:</p><ul>{uses.map(item => <li key={item}>{item}</li>)}</ul><h3>Sharing Your Personal Information</h3><ul>{sharing.map(item => <li key={item}>{item}</li>)}</ul></section>

        <section><h2>Retention of Your Personal Data</h2><p>The Company retains Personal Data only as long as necessary for the purposes in this Policy, including compliance with legal obligations, dispute resolution and enforcement of agreements and policies.</p><p>Usage Data is generally retained for a shorter period unless needed to strengthen security, improve functionality or meet legal obligations.</p></section>

        <section><h2>Transfer of Your Personal Data</h2><p>Your information is processed at the Company's operating offices and other locations where involved parties are located. It may be transferred to computers outside Your jurisdiction, where data protection laws may differ.</p><p>Your submission of information represents agreement to that transfer. The Company will take reasonable steps to ensure Your data is treated securely and will not transfer it without adequate controls.</p></section>

        <section><h2>Delete Your Personal Data</h2><p>You may request that We delete Personal Data collected about You. Where available, You may update, amend or delete information through Your Account, or contact Us to request access, correction or deletion.</p><p>We may retain certain information where We have a legal obligation or lawful basis to do so.</p></section>

        <section><h2>Disclosure of Your Personal Data</h2><h3>Business Transactions</h3><p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before it becomes subject to a different Privacy Policy.</p><h3>Law Enforcement</h3><p>The Company may disclose Personal Data when required by law or in response to valid requests by public authorities.</p><h3>Other Legal Requirements</h3><p>The Company may disclose Personal Data in good faith when necessary to:</p><ul><li>Comply with a legal obligation.</li><li>Protect and defend the Company's rights or property.</li><li>Prevent or investigate possible wrongdoing connected with the Service.</li><li>Protect the personal safety of users or the public.</li><li>Protect against legal liability.</li></ul></section>

        <section><h2>Security of Your Personal Data</h2><p>The security of Your Personal Data is important to Us. However, no Internet transmission or electronic storage method is completely secure. While We use commercially acceptable safeguards, We cannot guarantee absolute security.</p></section>

        <section><h2>Children's Privacy</h2><p>Our Service does not address anyone under 13, and We do not knowingly collect Personal Data from anyone under 13. Parents or guardians who believe a child has provided Personal Data should contact Us. If discovered, We will take steps to remove it.</p><p>Where parental consent is legally required, We may request it before collecting or using a child's information.</p></section>

        <section><h2>Links to Other Websites</h2><p>Our Service may link to websites not operated by Us. We encourage You to review each third party's Privacy Policy. We have no control over and accept no responsibility for third-party content, policies or practices.</p></section>

        <section><h2>Changes to this Privacy Policy</h2><p>We may update this Policy from time to time. Changes will be posted on this page and the Last updated date will be revised. Where appropriate, We may also provide email or prominent Service notice before changes take effect.</p><p>You are advised to review this Policy periodically. Changes are effective when posted here.</p></section>

        <section><h2>Contact Us</h2><p>For questions about this Privacy Policy:</p><ul><li>Email: <a href="mailto:emarketing@rrhlrealty.com">emarketing@rrhlrealty.com</a></li><li>Visit: <a href="https://ruchirealty.com/contact-us/">ruchirealty.com/contact-us/</a></li></ul></section>
      </article>
    </main>
    <Footer />
  </>;
}
