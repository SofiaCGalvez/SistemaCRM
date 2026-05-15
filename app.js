document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');

    if (!mobileMenuButton || !mobileMenu || !mobileMenuIcon) {
        return;
    }

    mobileMenuButton.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');

        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));
        mobileMenuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
        mobileMenuIcon.classList.toggle('ri-menu-line', isOpen);
        mobileMenuIcon.classList.toggle('ri-close-line', !isOpen);
    });
});
