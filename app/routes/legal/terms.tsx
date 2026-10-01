import LegalDocument from "@/components/legal/LegalDocument";

export default function TermsPage() {
    return (
        <LegalDocument
            title="Terms of Service"
            summary="Terms for using DERforyou accounts, developer subdomains, DNS features, and related tools."
            sections={[
                {
                    title: "1. Agreement and operator",
                    paragraphs: [
                        "These terms form an agreement between you and DERforyou, the operator of the DER developer-domain service. By creating an account or using the service, you agree to these terms, the Privacy Policy, Acceptable Use Policy, and Domain Policy.",
                    ],
                },
                {
                    title: "2. Eligibility and account security",
                    bullets: [
                        "Provide accurate account and contact information and keep it reasonably current.",
                        "Protect your sign-in credentials, verification codes, sessions, and API keys. You are responsible for activity performed through your account, subject to applicable law.",
                        "Do not access another account or attempt to bypass authentication, ownership, or rate-limit controls.",
                    ],
                },
                {
                    title: "3. Free subdomains and service limits",
                    paragraphs: [
                        "Eligible subdomains are currently offered without a registration charge. A subdomain is a revocable permission to use a hostname under a parent domain controlled by DERforyou; it is not ownership of the parent domain or a separately registered top-level domain. Availability, eligibility, and continued access are not guaranteed.",
                        "We may change quotas, eligibility, supported DNS features, or availability as the service evolves. Third-party infrastructure, registry requirements, abuse prevention, or legal obligations may affect a hostname or feature.",
                    ],
                },
                {
                    title: "4. Your content and responsibilities",
                    bullets: [
                        "You remain responsible for websites, services, files, traffic, and other content served through your hostname.",
                        "You must have rights to the names and content you use and must comply with applicable law and the Acceptable Use Policy.",
                        "Do not transfer, sell, rent, or misrepresent a subdomain without written permission.",
                    ],
                },
                {
                    title: "5. Suspension and termination",
                    paragraphs: [
                        "DERforyou may restrict, suspend, or revoke account or domain access when reasonably necessary to address a policy violation, credible abuse report, security risk, service integrity issue, upstream provider requirement, or legal demand. Where lawful and practical, we will provide notice and an opportunity to respond. Emergency action may be taken first when delay could cause harm.",
                        "You may stop using the service and request account-data handling through hostmaster@der.my.id. Some records may be retained as described in the Privacy Policy.",
                    ],
                },
                {
                    title: "6. Availability and liability",
                    paragraphs: [
                        "The service is provided without an uptime guarantee. To the extent permitted by Indonesian law, DERforyou disclaims implied warranties and is not liable for indirect or consequential losses arising from service interruption, hostname loss, or third-party infrastructure. Nothing in these terms limits rights or liabilities that cannot legally be limited.",
                    ],
                },
                {
                    title: "7. Governing law and changes",
                    paragraphs: [
                        "These terms are governed by the laws of Indonesia. Disputes are subject to the competent courts under applicable Indonesian law, without limiting mandatory consumer protections. We may update these terms; continued use after an update takes effect constitutes acceptance where allowed by law.",
                    ],
                },
            ]}
        />
    );
}