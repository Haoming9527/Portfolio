import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="text-sm text-blue-600 font-medium">
            These terms are governed by Singapore law and comply with local regulations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              These Terms of Service govern your use of this portfolio website. By accessing and using this site, you agree to comply with these terms and all applicable Singapore laws and regulations.
            </p>
          </div>
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing and using this website, you accept and agree to be bound by these terms 
              and all applicable laws and regulations of Singapore. If you do not agree with any part 
              of these terms, you must not use this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Use License</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Permission is granted to temporarily download one copy of the materials on this website 
              for personal, non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">User Content</h2>
            <p className="text-gray-700 dark:text-gray-300">
              When you submit content through our guestbook, you grant us a non-exclusive, 
              royalty-free license to use, display, and distribute such content on our website. 
              By submitting content, you agree to our <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a> and these Terms of Service.
              You are responsible for ensuring that any content you submit does not violate 
              any third-party rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Prohibited Uses</h2>
            <p className="text-gray-700 dark:text-gray-300">You may not use this website:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any applicable laws, rules, or regulations of Singapore</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate against any person</li>
              <li>To transmit or procure the sending of any unsolicited or unauthorized advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate another person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The materials on this website are provided on an &apos;as is&apos; basis. We make no warranties, 
              expressed or implied, and hereby disclaim and negate all other warranties including, 
              without limitation, implied warranties or conditions of merchantability, fitness for 
              a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
             <p className="text-gray-700 dark:text-gray-300 mt-3">
               In no event shall we be liable for any direct, indirect, incidental, special, consequential, 
               or punitive damages arising out of or relating to your use of this website, even if we have 
               been advised of the possibility of such damages.
             </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms of Service shall be governed by and construed in accordance with the laws of Singapore. 
              Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction 
              of the courts of Singapore.
            </p>
          </section>


          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Termination</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to terminate or suspend your access to this website immediately, 
              without prior notice or liability, for any reason whatsoever, including without limitation 
              if you breach these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to modify or replace these Terms of Service at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to 
              any new terms taking effect. Your continued use of the website after any such changes 
              constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-3">
              <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> lbb54188@gmail.com</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Location:</strong> Singapore</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
