import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | MeriPehli Gadi',
  description: 'Read the terms and conditions of using MeriPehli Gadi\'s used car marketplace platform.',
}

export default function TermsRoute() {
  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-slate-600 leading-relaxed">
              <strong>Last Updated:</strong> May 2026
            </p>
            <p className="text-slate-600 leading-relaxed">
              Welcome to MeriPehli Gadi. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">1. About Our Services</h2>
            <p className="text-slate-600 leading-relaxed">
              MeriPehli Gadi is an online marketplace that connects used car buyers, sellers, and dealers across Assam and Northeast India. Our platform also facilitates car financing through our partner Shani Finserve and assists with insurance services.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">2. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>You must provide accurate and truthful information when listing a car or submitting any form.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree not to use the platform for any fraudulent, illegal, or unauthorized purpose.</li>
              <li>All vehicle listings must represent cars that you legally own or are authorized to sell.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">3. Car Listings</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>All car listings must contain accurate information including make, model, year, mileage, condition, and price.</li>
              <li>MeriPehli Gadi reserves the right to remove listings that violate our guidelines or contain misleading information.</li>
              <li>We are not responsible for the condition or quality of vehicles listed by third-party sellers.</li>
              <li>All transactions between buyers and sellers are conducted at their own risk.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">4. Financing &amp; Insurance</h2>
            <p className="text-slate-600 leading-relaxed">
              Financing services are provided through our partner Shani Finserve and are subject to their separate terms and conditions. MeriPehli Gadi acts as a facilitator and does not directly provide loans or insurance. Loan approval, terms, and interest rates are determined by the financing partner based on individual eligibility.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">5. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              All content on this website, including text, graphics, logos, and software, is the property of MeriPehli Gadi and is protected by intellectual property laws. You may not reproduce, distribute, or modify any content without our prior written consent.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">6. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              MeriPehli Gadi is a marketplace platform and does not guarantee the accuracy of listings, the condition of vehicles, or the outcome of any transaction. We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">7. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">8. Contact</h2>
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
