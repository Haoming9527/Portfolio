import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="text-sm text-blue-600 font-medium">
            This policy complies with Singapore&apos;s <a href="https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Personal Data Protection Act (PDPA) 2012</a>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                This Privacy Policy outlines how personal data is collected, processed, and safeguarded when you interact with this portfolio website. We are committed to collecting only essential information and maintaining the highest standards of data security.
              </p>
            </div>
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Personal Data We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300">
              In compliance with Singapore&apos;s PDPA, this portfolio website collects minimal personal data. 
              We may collect information you voluntarily provide through the guestbook, as well as basic 
              technical information for website functionality and security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use the information we collect to display guestbook entries, moderate content for appropriateness, 
              improve the website, and ensure security. By signing up, you agree to our Privacy Policy 
              and consent to the collection and use of your personal data for these purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Data Protection and Security</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We implement appropriate security measures to protect your personal data, including 
              encryption for data transmission and secure hosting through trusted providers. 
              However, no method of transmission over the internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300">
              This website uses the following third-party services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Vercel</a></strong> - For website hosting and performance optimization</li>
              <li><strong><a href="https://docs.kinde.com/trust-center/privacy-and-compliance/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Kinde Auth</a></strong> - For user authentication in the guestbook</li>
              <li><strong><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Supabase</a></strong> - For database hosting and data storage</li>
              <li><strong><a href="https://www.prisma.io/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Prisma</a></strong> - For database operations</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              These services have their own privacy policies and data handling practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300">
              This website may use cookies for essential functionality and analytics. 
              You can disable cookies in your browser settings, though this may affect 
              some website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We retain personal data only for as long as necessary to fulfill the purposes for which it was collected. 
              We will securely dispose of personal data when it is no longer needed or upon your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Under Singapore&apos;s PDPA, you have rights regarding your personal data, including 
              access, correction, withdrawal of consent, and deletion. If you wish to exercise 
              any of these rights, please contact us using the information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact for Data Protection Matters</h2>
            <p className="text-gray-700 dark:text-gray-300">
              For any questions about this Privacy Policy, data protection matters, or to exercise your rights under PDPA, please contact me:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-3">
              <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> lbb54188@gmail.com</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Response time:</strong> I will respond to your inquiry within 30 days as required by PDPA</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by posting the updated policy on this website with a new &quot;Last updated&quot; date.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
