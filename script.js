const typedPhrases = [
  'APIs that scale smoothly.',
  'backend systems with confidence.',
  'automation for smarter workflows.'
];
const typedText = document.getElementById('typed-text');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, header');
const form = document.getElementById('form');
const formStatus = document.getElementById('form-status');
let typeIndex = 0;
let charIndex = 0;
let deleting = false;

async function typeLoop() {
  const phrase = typedPhrases[typeIndex];
  if (!deleting) {
    typedText.textContent = phrase.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === phrase.length) {
      deleting = true;
      await wait(1600);
    }
  } else {
    typedText.textContent = phrase.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      typeIndex = (typeIndex + 1) % typedPhrases.length;
    }
  }
  await wait(deleting ? 80 : 120);
  typeLoop();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

typeLoop();

function handleScrollReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach((section) => revealObserver.observe(section));
}

function handleNavHighlight() {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!id) return;
      const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => sectionObserver.observe(section));
}

function trimInput(value) {
  return value.trim();
}

const splashScreen = document.getElementById('splash-screen');

window.addEventListener('load', () => {
  setTimeout(() => {
    splashScreen.classList.add('hidden');
  }, 800);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = '';
  const name = trimInput(document.getElementById('name').value);
  const email = trimInput(document.getElementById('email').value);
  const message = trimInput(document.getElementById('message').value);

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete all fields before sending.';
    return;
  }

  const button = form.querySelector('button');
  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const text = await response.text();
    formStatus.textContent = response.ok ? 'Message sent successfully!' : 'Submission failed. Try again later.';
    if (response.ok) form.reset();
    console.log('Send email response:', text);
  } catch (error) {
    formStatus.textContent = 'Could not reach the server. Please try again later.';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Send Message';
  }
});

handleScrollReveal();
handleNavHighlight();