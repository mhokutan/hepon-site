import type { Metadata } from "next";
import UrunSayfasi from "../../components/UrunSayfasi";
import { urunVerileri } from "../../components/urun-verileri";

const urun = urunVerileri["trafik-sigortasi"];

export const metadata: Metadata = {
  title: urun.ad + " | Hepon Sigorta",
  description: urun.heroAlt,
};

export default function Sayfa() {
  return <UrunSayfasi urun={urun} />;
}
