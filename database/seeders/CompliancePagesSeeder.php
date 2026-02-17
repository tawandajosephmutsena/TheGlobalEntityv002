<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class CompliancePagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy',
                'content' => json_encode([
                    [
                        'id' => 'privacy-intro',
                        'type' => 'rich_text',
                        'data' => [
                            'content' => '<h1>Privacy Policy</h1>
<p><strong>Last updated:</strong> ' . date('F j, Y') . '</p>
<p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>

<h2>1. Information We Collect</h2>
<h3>Personal Data</h3>
<p>We may collect personally identifiable information, such as your name, email address, telephone number, and other contact details that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site, such as online chat and message boards.</p>

<h3>Derivative Data</h3>
<p>Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.</p>

<h3>Cookies and Tracking Technologies</h3>
<p>We may use cookies, web beacons, tracking pixels, and other tracking technologies to help customize the site and improve your experience. For more information on how we use cookies, please refer to our Cookie Policy.</p>

<h2>2. Use of Your Information</h2>
<p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:</p>
<ul>
<li>Create and manage your account</li>
<li>Email you regarding your account or order</li>
<li>Compile anonymous statistical data and analysis for internal use</li>
<li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions</li>
<li>Monitor and analyze usage and trends to improve your experience with the site</li>
<li>Notify you of updates to the site</li>
<li>Resolve disputes and troubleshoot problems</li>
</ul>

<h2>3. Disclosure of Your Information</h2>
<p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
<ul>
<li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process or to protect the rights, property, and safety of others.</li>
<li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
<li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
</ul>

<h2>4. Security of Your Information</h2>
<p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

<h2>5. Your Rights (GDPR / POPIA)</h2>
<p>If you are a resident of the European Economic Area (EEA) or South Africa, you have certain data protection rights under GDPR and POPIA respectively. These include:</p>
<ul>
<li>The right to access, update or delete the information we have on you</li>
<li>The right of rectification</li>
<li>The right to object</li>
<li>The right of restriction</li>
<li>The right to data portability</li>
<li>The right to withdraw consent</li>
</ul>

<h2>6. Contact Us</h2>
<p>If you have questions or comments about this Privacy Policy, please contact us using the contact information provided on our website.</p>'
                        ]
                    ]
                ]),
                'is_published' => true,
                'meta_title' => 'Privacy Policy',
                'meta_description' => 'Our privacy policy explains how we collect, use, and protect your personal information.',
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms',
                'content' => json_encode([
                    [
                        'id' => 'terms-intro',
                        'type' => 'rich_text',
                        'data' => [
                            'content' => '<h1>Terms of Service</h1>
<p><strong>Last updated:</strong> ' . date('F j, Y') . '</p>
<p>Please read these Terms of Service carefully before using our website. Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.</p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

<h2>2. Use of the Service</h2>
<p>You agree to use the service only for lawful purposes and in accordance with these Terms. You agree not to use the service:</p>
<ul>
<li>In any way that violates any applicable national or international law or regulation</li>
<li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
<li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
</ul>

<h2>3. Intellectual Property</h2>
<p>The service and its original content, features, and functionality are and will remain the exclusive property of the company and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the company.</p>

<h2>4. User Accounts</h2>
<p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>

<h2>5. Termination</h2>
<p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

<h2>6. Limitation of Liability</h2>
<p>In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

<h2>7. Governing Law</h2>
<p>These Terms shall be governed and construed in accordance with the laws applicable in our jurisdiction, without regard to its conflict of law provisions.</p>

<h2>8. Changes to Terms</h2>
<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>

<h2>9. Contact Us</h2>
<p>If you have any questions about these Terms, please contact us.</p>'
                        ]
                    ]
                ]),
                'is_published' => true,
                'meta_title' => 'Terms of Service',
                'meta_description' => 'Our terms of service outline the rules and regulations for the use of our website.',
            ],
            [
                'title' => 'Cookie Policy',
                'slug' => 'cookies',
                'content' => json_encode([
                    [
                        'id' => 'cookies-intro',
                        'type' => 'rich_text',
                        'data' => [
                            'content' => '<h1>Cookie Policy</h1>
<p><strong>Last updated:</strong> ' . date('F j, Y') . '</p>
<p>This Cookie Policy explains what cookies are and how we use them on our website. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, and how you can control your cookie preferences.</p>

<h2>1. What Are Cookies?</h2>
<p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide reporting information to the website owners.</p>

<h2>2. How We Use Cookies</h2>
<p>We use cookies for several purposes:</p>
<ul>
<li><strong>Essential Cookies:</strong> These are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</li>
<li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.</li>
<li><strong>Marketing Cookies:</strong> These are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
</ul>

<h2>3. Types of Cookies We Use</h2>

<h3>Essential Cookies</h3>
<table>
<thead><tr><th>Cookie Name</th><th>Purpose</th><th>Duration</th></tr></thead>
<tbody>
<tr><td>session</td><td>Maintains your session state</td><td>Session</td></tr>
<tr><td>XSRF-TOKEN</td><td>Security token to prevent CSRF attacks</td><td>Session</td></tr>
<tr><td>cookie_consent</td><td>Stores your cookie consent preferences</td><td>1 year</td></tr>
</tbody>
</table>

<h3>Analytics Cookies</h3>
<table>
<thead><tr><th>Cookie Name</th><th>Purpose</th><th>Duration</th></tr></thead>
<tbody>
<tr><td>_ga</td><td>Google Analytics: Distinguishes unique users</td><td>2 years</td></tr>
<tr><td>_ga_*</td><td>Google Analytics: Maintains session state</td><td>2 years</td></tr>
</tbody>
</table>

<h2>4. Managing Cookies</h2>
<p>You can manage your cookie preferences through our cookie consent banner that appears when you first visit our website. You can also change your preferences at any time by clearing your browser cookies and revisiting the site.</p>
<p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>

<h2>5. Your Rights</h2>
<p>Under GDPR and POPIA, you have the right to:</p>
<ul>
<li>Be informed about our use of cookies</li>
<li>Accept or reject non-essential cookies</li>
<li>Change your cookie preferences at any time</li>
<li>Have your data deleted upon request</li>
</ul>

<h2>6. Updates to This Policy</h2>
<p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business operations. We encourage you to periodically review this page for the latest information on our cookie practices.</p>

<h2>7. Contact Us</h2>
<p>If you have any questions about our use of cookies, please contact us.</p>'
                        ]
                    ]
                ]),
                'is_published' => true,
                'meta_title' => 'Cookie Policy',
                'meta_description' => 'Our cookie policy explains what cookies are, how we use them, and how you can manage your preferences.',
            ],
        ];

        foreach ($pages as $pageData) {
            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }

        $this->command->info('Compliance pages seeded successfully (Privacy Policy, Terms of Service, Cookie Policy).');
    }
}
