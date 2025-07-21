import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '905353580985';
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-4 left-4 z-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12">
        <circle cx="12" cy="12" r="12" fill="#25D366" />
        <path
          d="M16.6 13.7c-.2-.1-1.3-.7-1.4-.8-.1-.1-.3-.1-.4.1-.1.2-.5.8-.6.9-.1.1-.2.2-.3.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.2-1.4-1.4-1.6-.1-.1 0-.2.1-.3.1-.1.2-.2.3-.4s.2-.2.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3s0-.3-.1-.4c0-.1-.4-.9-.6-1.3-.2-.4-.5-.3-.7-.3-.2 0-.4 0-.6.1-.2.1-.5.3-.7.5-.2.2-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3.1 4.9 4.4 2.9 1.4 2.9.9 3.4.9.5 0 1.7-.7 2-1.4.3-.7.3-1.4.2-1.5-.2-.1-.3-.1-.5-.2z"
          fill="white"
        />
      </svg>
    </a>
  );
}
