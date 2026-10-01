import LegalDocument from "@/components/legal/LegalDocument";

export default function DomainPolicyPage() {
    return (
        <LegalDocument
            title="Domain Policy"
            summary="Eligibility and operating rules for subdomains provided through the DERforyou developer-domain service."
            sections={[
                {
                    title: "1. What a subdomain provides",
                    paragraphs: [
                        "A subdomain is a limited, revocable authorization to use a hostname beneath a parent domain controlled by DERforyou. It does not transfer ownership of the parent domain, confer registrar rights, or guarantee that a hostname can be transferred to another DNS provider.",
                    ],
                },
                {
                    title: "2. Registration and contact information",
                    bullets: [
                        "Choose a name that does not impersonate another person or organization and does not infringe a third party's rights.",
                        "Provide accurate contact details when requested for domain operations. Contact records are handled under the Privacy Policy.",
                        "A request is not approved until the service confirms it. A hostname preview or availability indication is not a grant of rights.",
                    ],
                },
                {
                    title: "3. DNS and service use",
                    paragraphs: [
                        "DNS records must be used for a lawful purpose and remain within the service's technical limits. DNS changes may take time to propagate and may depend on Cloudflare or other upstream infrastructure. Do not use DNS configuration to facilitate phishing, malware, spam, evasion, or other prohibited activity.",
                    ],
                },
                {
                    title: "4. Suspension, removal, and review",
                    paragraphs: [
                        "DERforyou may suspend or remove a hostname under the Terms of Service or Acceptable Use Policy, in response to a credible rights or abuse report, when required by law, or when necessary to protect service security and integrity. Where practical and lawful, notices explain the reason and how to request review.",
                    ],
                },
                {
                    title: "5. Name disputes and complaints",
                    paragraphs: [
                        "Rights holders and affected parties may report a hostname through hostmaster@der.my.id. Include the hostname, specific URLs, the basis for the complaint, supporting evidence, and a way to contact you. False or bad-faith reports may themselves violate applicable law.",
                    ],
                },
            ]}
        />
    );
}