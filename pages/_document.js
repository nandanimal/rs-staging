import { Html, Head, Main, NextScript } from "next/document";

const loadScreenStyles = `
  @keyframes rs-logo-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  #rs-load-screen img {
    opacity: 0;
  }
  #rs-load-screen.rs-visible img {
    animation: rs-logo-fade 0.8s ease 0.2s forwards;
  }
`;

const loadScreenScript = `
(function() {
  var el = document.getElementById('rs-load-screen');
  if (!sessionStorage.getItem('hasVisited')) {
    sessionStorage.setItem('hasVisited', '1');
    el.style.display = 'flex';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.classList.add('rs-visible');
      });
    });
    setTimeout(function() {
      el.style.transform = 'translateY(-100%)';
      el.addEventListener('transitionend', function() { el.remove(); }, { once: true });
    }, 1500);
  }
})();
`;

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <style dangerouslySetInnerHTML={{ __html: loadScreenStyles }} />
            </Head>
            <body className="antialiased">
                <div
                    id="rs-load-screen"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "#ff68dc",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/lockup.png"
                        alt="Rotten Science"
                        style={{ width: "260px", maxWidth: "70vw", height: "auto" }}
                    />
                </div>
                <script dangerouslySetInnerHTML={{ __html: loadScreenScript }} />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
