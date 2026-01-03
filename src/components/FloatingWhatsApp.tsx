const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M16.04 4c-6.64 0-12.04 5.26-12.04 11.74 0 2.07.57 4.08 1.67 5.86L4 28l6.56-1.86a12.2 12.2 0 0 0 5.48 1.32h.01c6.64 0 12.04-5.26 12.04-11.74S22.68 4 16.04 4Zm0 21.37h-.01c-1.75 0-3.46-.47-4.96-1.36l-.35-.2-3.89 1.11 1.04-3.66-.23-.38A9.59 9.59 0 0 1 6.42 15.7c0-5.06 4.26-9.17 9.5-9.17 2.53 0 4.91.97 6.69 2.73a9.21 9.21 0 0 1 2.77 6.44c0 5.06-4.26 9.17-9.34 9.17Zm5.26-7.17c-.29-.15-1.72-.84-1.98-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.43-1.72-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.52.14-.19.19-.29.29-.48.1-.19.05-.36-.02-.52-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.49-.64-.5h-.55c-.19 0-.5.07-.75.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.81 1.17 3 .15.19 2.03 3.09 4.91 4.21.69.3 1.23.48 1.65.61.7.22 1.33.19 1.83.12.56-.08 1.72-.7 1.96-1.38.24-.67.24-1.24.17-1.36-.07-.12-.26-.2-.55-.35Z"
    />
  </svg>
);

const FloatingWhatsApp = () => {
  const phoneNumber = "919193022033";
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 sm:px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};

export default FloatingWhatsApp;
