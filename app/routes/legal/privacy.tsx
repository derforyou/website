import LegalDocument from "@/components/legal/LegalDocument";

export default function PrivacyPolicyPage() {
    return (
        <LegalDocument
            title="Privacy Policy"
            summary="How DERforyou collects, uses, stores, and shares information when you use its developer subdomain and account services."
            sections={[
                {
                    title: "1. Who operates the service",
                    paragraphs: [
                        "DERforyou operates the DER developer-domain service. For privacy questions or requests, contact hostmaster@der.my.id. This notice is governed by applicable Indonesian law, including mandatory data-protection rights.",
                    ],
                },
                {
                    title: "2. Information we process",
                    bullets: [
                        "Account data such as name, email address, verification status, and account timestamps.",
                        "Authentication and security data such as session identifiers, IP address, user-agent, verification records, and—when GitHub sign-in is enabled—provider identifiers and authentication tokens required for sign-in.",
                        "Domain and DNS data such as requested hostnames, ownership/contact references, status, DNS record values, and provider record identifiers.",
                        "Contact details you provide for domain operations, including name, organization, email, phone, and postal address fields.",
                        "API-key metadata and security records. The database schema stores a key prefix and hash rather than the plaintext key, along with usage/revocation timestamps and audit events.",
                    ],
                },
                {
                    title: "3. Why we use information",
                    bullets: [
                        "Create and secure accounts, authenticate users, and send one-time verification codes.",
                        "Provide domain, DNS, contact-profile, and developer-access features; enforce ownership and service policies.",
                        "Detect abuse, troubleshoot incidents, protect the service, and maintain operational records.",
                        "Respond to support, privacy, legal, and abuse reports and comply with applicable legal obligations.",
                    ],
                },
                {
                    title: "4. Service providers and sharing",
                    paragraphs: [
                        "We use Cloudflare for hosting, database and DNS-related infrastructure. Verification email may be sent through Resend or Brevo, depending on deployment configuration and provider availability. GitHub receives authentication requests only when GitHub OAuth is enabled and you choose that sign-in method. These providers process information under their own terms and privacy notices.",
                        "We do not sell personal information. We may disclose information when necessary to protect users or the service, investigate a credible abuse report, respond to a lawful request, or enforce these policies.",
                    ],
                },
                {
                    title: "5. Cookies and logs",
                    paragraphs: [
                        "Authentication uses essential session cookies. Security and infrastructure providers may generate technical logs needed to deliver and protect the service. The application code does not currently configure advertising or behavioral analytics cookies.",
                    ],
                },
                {
                    title: "6. Retention and deletion requests",
                    paragraphs: [
                        "One-time verification codes are configured to expire after five minutes. The service does not currently publish a fixed calendar retention period for other record categories. We retain account, domain, contact, security, and audit information only while reasonably needed to operate and protect the service, resolve disputes, or meet legal obligations.",
                        "You may request access, correction, or deletion by emailing hostmaster@der.my.id. We will review the request under applicable law; some records may need to be retained for security, abuse prevention, or legal compliance.",
                    ],
                },
                {
                    title: "7. International processing and security",
                    paragraphs: [
                        "Cloud and email providers may process information in locations outside your country. We use access controls and provider security features appropriate to the service, but no internet transmission or storage system can be guaranteed completely secure.",
                    ],
                },
                {
                    title: "8. Updates",
                    paragraphs: [
                        "We may revise this notice when service features or legal requirements change. The effective date above identifies the current version. Material changes will be posted on this page.",
                    ],
                },
            ]}
        />
    );
}