/**
 * Footer layout wrapper. Uses children prop for composition.
 * Avoids prop drilling Timer and NextButtong props through Footer.
 * @param {React.ReactNode} children - Timer and NextButton
 * @returns
 */
function Footer({ children }) {
  return <footer className="Footer">{children}</footer>;
}

export default Footer;
