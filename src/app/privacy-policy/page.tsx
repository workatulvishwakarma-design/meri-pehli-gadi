import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | MeriPehli Gadi',
  description: 'Read the privacy policy of MeriPehli Gadi. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyRoute() {
  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-slate-600 leading-relaxed">
              <strong>Last Updated:</strong> May 2026
            </p>
            <p className="text-slate-600 leading-relaxed">
              MeriPehli Gadi (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), a venture powered by Shani Finserve, is committed to protecting and respecting your privacy. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">1. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, city/location when you register, list a car, or submit a lead.</li>
              <li><strong>Vehicle Information:</strong> Car details including make, model, year, condition, and images when you list a car for sale.</li>
              <li><strong>Financial Information:</strong> Income details and employment information when applying for car loans through our platform.</li>
              <li><strong>Usage Data:</strong> Pages visited, search queries, interaction patterns, and device information collected through cookies and analytics.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>To facilitate car buying, selling, and financing services</li>
              <li>To process loan and insurance applications through our partner Shani Finserve</li>
              <li>To connect buyers with sellers and dealers in Assam</li>
              <li>To improve our website experience and services</li>
              <li>To send relevant updates, promotional offers, and service notifications</li>
              <li>To comply with legal obligations and prevent fraudulent activity</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">3. Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Our financing partner Shani Finserve for loan processing</li>
              <li>Insurance providers when you request insurance quotes</li>
              <li>Verified dealers when you express interest in a listed car</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">4. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures to protect your data including encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">5. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">6. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed">
              You have the right to access, correct, or delete your personal information at any time. You may also opt out of promotional communications. To exercise these rights, contact us at info@shanifinserve.com.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">7. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions about this Privacy Policy, contact us at:
            </p>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-slate-700 font-semibold">MeriPehli Gadi (Shani Finserve)</p>
              <p className="text-slate-600">MUKUL SHAH, C/O, opposite Vishal Mega Mart, KARTIC PARA, Dibrugarh, Assam 786001</p>
              <p className="text-slate-600">Email: info@shanifinserve.com</p>
              <p className="text-slate-600">Phone: 087219 32757</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
