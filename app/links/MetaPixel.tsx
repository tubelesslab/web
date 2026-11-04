"use client";

// Meta Pixel restrito a /links (pagina de divulgacao dos anuncios).
// - Nao carrega sem NEXT_PUBLIC_META_PIXEL_ID.
// - Respeita Do Not Track / Global Privacy Control do navegador.
// - Dispara PageView e, ao clicar num botao de loja (a[data-store]),
//   o evento customizado StoreClick com a loja e as UTMs da visita.

import Script from "next/script";
import { useEffect, useState } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = (...args: unknown[]) => void;

function optedOut(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
}

export default function MetaPixel() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (PIXEL_ID && !optedOut()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-store]");
      if (!el) return;
      const fbq = (window as unknown as { fbq?: Fbq }).fbq;
      if (!fbq) return;
      const q = new URLSearchParams(window.location.search);
      fbq("trackCustom", "StoreClick", {
        store: el.dataset.store,
        utm_source: q.get("utm_source") ?? "",
        utm_medium: q.get("utm_medium") ?? "",
        utm_campaign: q.get("utm_campaign") ?? "",
        utm_content: q.get("utm_content") ?? "",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
