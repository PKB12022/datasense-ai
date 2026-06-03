import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
              <p>Welcome to DataSense AI. We respect your privacy and are committed to protecting your personal and professional data. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> When you register, we collect your name, email address, and authentication data provided by Supabase.</li>
                <li><strong>Uploaded Datasets:</strong> We temporarily process the CSV and Excel files you upload to generate analytical insights. <strong>We do not permanently store your raw datasets</strong> or use your proprietary data to train our foundational models. Data is processed ephemerally in memory or securely cached for immediate retrieval and deleted upon session termination.</li>
                <li><strong>Usage Data:</strong> We collect non-identifying telemetry regarding how you interact with our platform to enforce daily usage limits and improve our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
              <p>We use your information exclusively to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve the DataSense AI service.</li>
                <li>Generate automated analytical reports and interactive chat insights.</li>
                <li>Communicate with you regarding account updates, security alerts, and support messages.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
              <p>We implement enterprise-grade security measures to protect your data. All data transfers are encrypted via TLS/SSL. Our backend infrastructure utilizes secure environments isolated from unauthorized external access. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">5. Third-Party Services</h2>
              <p>We may share anonymous metadata or prompts with third-party AI providers (e.g., Google Gemini, OpenAI) strictly for the purpose of generating insights. We configure our APIs to ensure that your data is <strong>not</strong> used to train their models.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">6. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time. You may request full deletion of your account and associated metadata by contacting our support team.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">7. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:customercare_datasense@gmail.com" className="text-primary hover:underline">customercare_datasense@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
