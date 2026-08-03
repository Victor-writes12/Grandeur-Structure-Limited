(function () {
  const SDK_SRC = 'https://cdn.emailjs.com/dist/email.min.js';

  // Helper promise that resolves when the SDK is ready
  let sdkReady = new Promise((resolve, reject) => {
    // If emailjs already present, resolve immediately
    if (window.emailjs && window.emailjs.send) return resolve(window.emailjs);

    const s = document.createElement('script');
    s.src = SDK_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      // emailjs attaches itself to window.emailjs
      if (window.emailjs && window.emailjs.send) {
        resolve(window.emailjs);
      } else {
        reject(new Error('EmailJS SDK loaded but `emailjs` not found'));
      }
    };
    s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(s);
  });

  window.emailHelper = {
    ready: sdkReady,
    init(publicKey) {
      return sdkReady.then((emailjs) => {
        try { emailjs.init(publicKey); } catch (e) { /* ignore */ }
        return emailjs;
      });
    },
    sendForm(serviceId, templateId, formEl, publicKey) {
      return sdkReady.then((emailjs) => {
        if (publicKey) {
          try { emailjs.init(publicKey); } catch (e) { /* ignore */ }
        }
        if (!emailjs || !emailjs.sendForm) {
          return Promise.reject(new Error('EmailJS SDK not available'));
        }
        return emailjs.sendForm(serviceId, templateId, formEl, publicKey);
      });
    }
  };

  // Optional: auto-init if a global placeholder PUBLIC key is available
  if (window.EMAILJS_PUBLIC_KEY && window.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    window.emailHelper.init(window.EMAILJS_PUBLIC_KEY).catch(()=>{});
  }

})();
