// components/GoogleAnalytics

import Script from 'next/script'

export default function GoogleAnalytics() {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HMQHSS2YZE"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-HMQHSS2YZE');
        `}
      </Script>
    </>
  )
}
