import { LegalRequestForm } from '../components/LegalRequestForm'

export function LegalRequests() {
  return <div className="legal-requests-layout">
    <div className="legal-request-intro"><h2>Privacy, correction & removal requests</h2><p>Use this form for a privacy request, a concern about published content, or a message to the project operator. No account is required.</p><p>To leave the waiting list, you can also use the removal link in your welcome email. Opening that link shows a confirmation page; the removal action deletes your active waiting-list entry.</p><p>A form submission does not automatically disclose or delete anyone’s information. We may need to verify control of an address or authority to make a request before acting.</p><p>This is not an emergency, medical-care or legal-representation service. Do not use it for urgent help.</p><a href="#/content-removal">Content correction and copyright guidance</a></div>
    <LegalRequestForm />
  </div>
}
