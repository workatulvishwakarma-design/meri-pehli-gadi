import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | MeriPehli Gadi',
  description: 'Learn about MeriPehli Gadi\'s refund and cancellation policy for our used car marketplace services.',
}

export default function RefundPolicyRoute() {
  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8">Refund Policy</h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-slate-600 leading-relaxed">
              <strong>Last Updated:</strong> May 2026
            </p>
            <p className="text-slate-600 leading-relaxed">
              MeriPehli Gadi is committed to providing a transparent and fair marketplace for used car transactions. This refund policy outlines our guidelines for refunds and cancellations.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">1. Marketplace Platform</h2>
            <p className="text-slate-600 leading-relaxed">
              MeriPehli Gadi operates as a marketplace connecting buyers, sellers, and dealers. We do not directly sell vehicles. Transactions are conducted between the respective parties. As such, refund policies for vehicle purchases are governed by the individual seller or dealer.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">2. Service Fees</h2>
            <p className="text-slate-600 leading-relaxed">
              If MeriPehli Gadi charges any service or listing fees:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Service fees are non-refundable once the service has been rendered.</li>
              <li>If a paid listing is removed due to policy violations, no refund will be provided.</li>
              <li>Refund requests for unused services must be submitted within 7 days of payment.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">3. Financing &amp; Insurance</h2>
            <p className="text-slate-600 leading-relaxed">
              For loan and insurance products facilitated through our platform:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Refund policies are governed by the respective financial institution (Shani Finserve) or insurance provider.</li>
              <li>Cancellation of loan or insurance applications may be subject to processing fees as per the provider&apos;s terms.</li>
              <li>Contact the respective service provider directly for refund-related queries.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">4. Booking Amount / Token Money</h2>
            <p className="text-slate-600 leading-relaxed">
              Any booking amount or token money paid to a seller or dealer is governed by the agreement between the buyer and the seller/dealer. MeriPehli Gadi is not liable for refund of any such amounts. We recommend:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Always get a written agreement before paying any advance amount.</li>
              <li>Inspect the vehicle thoroughly before making any payment.</li>
              <li>Verify all documents and ownership details before completing a purchase.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">5. Dispute Resolution</h2>
            <p className="text-slate-600 leading-relaxed">
              If you encounter any issues with a transaction facilitated through our platform, please contact us. While we cannot guarantee refunds for third-party transactions, we will make reasonable efforts to mediate and resolve disputes between parties.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">6. Contact Us</h2>
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
