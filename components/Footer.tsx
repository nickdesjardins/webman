const SOCIALS = [
  { href: "https://github.com/nickdesjardins", cls: "twitter", icon: "bxl-github" },
  { href: "https://www.facebook.com/desjardins.nick/", cls: "facebook", icon: "bxl-facebook" },
  { href: "https://www.linkedin.com/in/nicolas-desjardins/", cls: "linkedin", icon: "bxl-linkedin" },
  { href: "https://www.youtube.com/channel/UClgIfTUZnrCOw81q-xSOVGA", cls: "instagram", icon: "bxl-youtube" },
  { href: "https://www.twitch.tv/qcteamnick", cls: "google-plus", icon: "bxl-twitch" },
];

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <h3>Nicolas Desjardins</h3>
        <p>
          &quot;&quot;You miss 100% of the shots you don&apos;t take. -Wayne
          Gretzky&quot; -Michael Scott&quot; -Nicolas Desjardins
        </p>
        <div className="social-links">
          {SOCIALS.map((s) => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={s.cls}
            >
              <i className={`bx ${s.icon}`} />
            </a>
          ))}
        </div>
        <div className="copyright">
          Copyright &copy;<strong>{new Date().getFullYear()}</strong>. All Rights
          Reserved
        </div>
        <div className="credits">
          Based on{" "}
          <a href="https://bootstrapmade.com/" target="_blank" rel="noopener noreferrer">
            BootstrapMade
          </a>{" "}
          Design.
        </div>
      </div>
    </footer>
  );
}
