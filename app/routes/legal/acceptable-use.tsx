import LegalDocument from "@/components/legal/LegalDocument";

export default function AcceptableUsePage() {
    return (
        <LegalDocument
            title="Acceptable Use Policy"
            summary="Rules intended to protect domain users, third parties, and the stability of the DERforyou service."
            sections={[
                {
                    title: "1. Prohibited activity",
                    bullets: [
                        "Phishing, credential theft, impersonation, scams, fraud, or deceptive redirects.",
                        "Malware, ransomware, botnets, command-and-control infrastructure, exploit delivery, or unauthorized scanning and intrusion.",
                        "Unsolicited bulk email, spam, abusive automation, or activity that degrades service availability.",
                        "Content or activity that is unlawful, threatens safety, infringes intellectual property, exposes private information, or violates another party's rights.",
                        "Circumventing account verification, domain eligibility checks, quotas, suspension, or security controls.",
                        "Reselling, squatting, or using a subdomain to mislead users about ownership, affiliation, or the nature of a service.",
                    ],
                },
                {
                    title: "2. Security and responsible disclosure",
                    paragraphs: [
                        "Do not test, access, or disrupt systems without authorization. Report suspected vulnerabilities privately to hostmaster@der.my.id with enough detail to reproduce the issue. Do not access other users' data, establish persistence, or publicly disclose an exploitable issue before coordinating remediation.",
                    ],
                },
                {
                    title: "3. Enforcement",
                    paragraphs: [
                        "We may investigate reports and take proportionate action, including requesting information, disabling DNS, suspending a hostname, or restricting an account. We may preserve relevant records and cooperate with lawful requests. Where practical and lawful, we will notify the affected account holder and offer a review path.",
                    ],
                },
                {
                    title: "4. Reporting abuse",
                    paragraphs: [
                        "Send reports to hostmaster@der.my.id. Include the affected hostname, URLs, a clear description, supporting evidence, your contact details, and any relevant authority or rights-holder reference. Do not include passwords, verification codes, or unrelated sensitive information.",
                    ],
                },
            ]}
        />
    );
}