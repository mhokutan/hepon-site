"use client";

import { useEffect, useRef } from "react";

// Teklif modali (demo mod): kaynak public/modal/ altindaki uc parca dosyadir
// (~/temiz-modal.txt'den bolunmustur). Sayfadaki .hepon-teklif-trigger sinifli
// ve data-product="trafik|kasko|imm|dask|tss" nitelikli her eleman modali acar.
export default function TeklifModal() {
  const kutu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("heponQuoteModal")) return;
    const hedef = kutu.current;
    if (!hedef) return;

    fetch("/modal/modal.html")
      .then((r) => r.text())
      .then((html) => {
        hedef.innerHTML = html;
        const s = document.createElement("script");
        s.src = "/modal/modal.js";
        document.body.appendChild(s);
      });
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/modal/modal.css" />
      <div ref={kutu} />
    </>
  );
}
