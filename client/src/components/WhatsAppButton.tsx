import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '905307885676';
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-4 left-4 z-50"
    >
      <img src="/images/whatsapp.webp" alt="WhatsApp logo" className="w-12 h-12" />
    </a>
  );
}
