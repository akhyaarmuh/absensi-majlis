const getYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const Footer = () => {
  return (
    <footer className="flex items-center justify-center border-t border-frenchgray px-4 text-sm text-stategray dark:border-charcoal tablet:justify-end">
      <p>
        Build by.{' '}
        <a
          rel="noreferrer"
          href="https://wa.me/6285161713161"
          target="_blank"
          className="font-bold text-primary hover:underline"
        >
          NW-Dev
        </a>{' '}
        Copyright© 2023-{getYear()}.
      </p>
    </footer>
  );
};

export default Footer;
