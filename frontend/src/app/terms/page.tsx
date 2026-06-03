import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>By accessing or using DataSense AI, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">2. Description of Service</h2>
              <p>DataSense AI provides automated data analysis, machine learning insights, and PDF dashboard generation tools. The service is provided "as is" and may be updated or modified over time without prior notice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">3. User Accounts & Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must create an account to use the platform.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree not to upload datasets that contain illegal, malicious, or highly sensitive confidential information (e.g., classified government data, unencrypted PHI) unless permitted by a separate enterprise agreement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">4. Usage Limits</h2>
              <p>Our free tier imposes daily usage limits (e.g., 3 analyses per day). Attempting to circumvent these limits through automated scripts, multiple accounts, or exploitation of bugs will result in immediate account termination.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">5. Intellectual Property</h2>
              <p>You retain full ownership of the data you upload to DataSense AI. You also own the analytical reports generated from your data. DataSense AI retains all rights, title, and interest in the platform, algorithms, software, and underlying technology.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
              <p>While our AI is highly advanced, data analysis and machine learning are probabilistic in nature. <strong>DataSense AI is not responsible for business decisions made based on our generated reports.</strong> You agree to use the insights provided as advisory information only. In no event shall DataSense AI be liable for any indirect, incidental, or consequential damages.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">7. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes via email or an in-app notification.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">8. Contact Information</h2>
              <p>For legal inquiries or questions regarding these Terms, please contact us at: <a href="mailto:customercare_datasense@gmail.com" className="text-primary hover:underline">customercare_datasense@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
