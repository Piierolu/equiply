import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CalendarCheck2,
  Check,
  ClipboardCheck,
  PackageCheck,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Truck,
  UsersRound,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software de alquiler de equipamiento para eventos",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: siteConfig.name,
    title: "Equiply | Control total para empresas de alquiler",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Equiply | Control total para empresas de alquiler",
    description: siteConfig.description,
  },
};

const workflow = [
  {
    number: "01",
    title: "Reserva sin conflictos",
    description: "Comprueba disponibilidad por fecha y sucursal antes de confirmar.",
    icon: CalendarCheck2,
  },
  {
    number: "02",
    title: "Prepara cada salida",
    description: "Asigna unidades, escanea equipos y entrega pedidos completos.",
    icon: PackageCheck,
  },
  {
    number: "03",
    title: "Cierra cada retorno",
    description: "Registra devoluciones parciales, retrasos, daños y mantenimiento.",
    icon: RotateCcw,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Equiply",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteConfig.url,
  description: siteConfig.description,
};

export default function Home() {
  const publicDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <div className="overflow-hidden bg-[#f2efe6] text-[#171a24]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="relative z-20 border-b border-[#171a24]/10">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label="Equiply, inicio">
            <BrandMark />
            <span className="font-heading text-xl font-bold tracking-[-0.045em]">Equiply</span>
          </Link>
          <nav aria-label="Navegación principal" className="mx-auto hidden items-center gap-8 md:flex">
            <a className="text-sm font-semibold text-[#3f424a] hover:text-[#171a24]" href="#producto">Producto</a>
            <a className="text-sm font-semibold text-[#3f424a] hover:text-[#171a24]" href="#flujo">Cómo funciona</a>
            <a className="text-sm font-semibold text-[#3f424a] hover:text-[#171a24]" href="#seguridad">Seguridad</a>
          </nav>
          <Link
            href="/dashboard"
            className="ml-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171a24] px-4 text-sm font-bold text-white shadow-[0_6px_18px_rgba(23,26,36,0.18)] transition-transform hover:-translate-y-0.5"
          >
            Ver demo <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="relative mx-auto grid min-h-[700px] max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-24">
          <div className="hero-orbit pointer-events-none absolute top-12 -left-52 size-[520px] rounded-full border border-[#171a24]/10" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#171a24]/15 bg-white/55 px-3 py-1.5 text-xs font-bold text-[#343741]">
              <Sparkles aria-hidden="true" className="size-3.5 text-[#c45136]" />
              Operaciones de alquiler, sin hojas de cálculo
            </div>
            <h1 className="font-heading text-[clamp(3.2rem,7.2vw,7rem)] leading-[0.87] font-bold tracking-[-0.075em]">
              Cada equipo.
              <span className="block text-[#d6593d]">Cada fecha.</span>
              Bajo control.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-[#555861] sm:text-lg">
              Equiply conecta inventario, reservas, preparación y devoluciones para que tu empresa entregue a tiempo y deje de perder equipos.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b8e845] px-6 text-sm font-extrabold text-[#171a24] shadow-[0_7px_0_#171a24] transition-transform hover:-translate-y-1"
              >
                Explorar la demo <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <a
                href="#flujo"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#171a24]/20 bg-white/45 px-6 text-sm font-bold hover:bg-white/80"
              >
                Ver el flujo operativo
              </a>
            </div>
            <ul aria-label="Ventajas principales" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#555861]">
              <li className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-[#4d7626]" /> Multiempresa</li>
              <li className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-[#4d7626]" /> Roles y permisos</li>
              <li className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-[#4d7626]" /> Trazabilidad completa</li>
            </ul>
            <p className="mt-5 text-xs text-[#555861]">
              {publicDemo ? (
                <>Demo pública con datos simulados guardados en tu navegador.</>
              ) : (
                <>Acceso demo: <strong>owner@equiply.local</strong> / <strong>Equiply123!</strong></>
              )}
            </p>
          </div>

          <div id="producto" className="relative mx-auto w-full max-w-[610px] lg:mx-0">
            <div className="absolute -inset-8 rotate-3 rounded-[42px] bg-[#b8e845]" />
            <div className="relative overflow-hidden rounded-[28px] border-2 border-[#171a24] bg-[#202432] p-4 shadow-[18px_22px_0_rgba(23,26,36,0.16)] sm:p-6">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <BrandMark className="size-8" />
                  <div>
                    <p className="text-xs font-bold text-white">Salida EQ-1048</p>
                    <p className="mt-0.5 text-[10px] text-white/70">Nómada Producciones</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#fff1c7] px-3 py-1 text-[10px] font-bold text-[#725400]">Preparando</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_0.78fr]">
                <div className="rounded-2xl bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#555861] uppercase">Lista de carga</p>
                    <span className="font-mono text-[10px] text-[#555861]">18 / 24</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[
                      ["Altavoces Atlas 12", "8", true],
                      ["Barras Luma RGB", "6", true],
                      ["Trípodes reforzados", "4", true],
                      ["Consola Nova X32", "1", false],
                    ].map(([name, quantity, complete]) => (
                      <div key={String(name)} className="flex items-center gap-3 rounded-xl bg-[#f4f2ec] p-2.5">
                        <span className={`grid size-7 place-items-center rounded-lg ${complete ? "bg-[#b8e845]" : "bg-[#ffdfb5]"}`}>
                          {complete ? <Check aria-hidden="true" className="size-3.5" /> : <ScanLine aria-hidden="true" className="size-3.5" />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] font-bold">{name}</span>
                        <span className="font-mono text-[10px] text-[#555861]">x{quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl bg-[#ff7657] p-4 text-[#171a24]">
                    <Truck aria-hidden="true" className="size-5" />
                    <p className="mt-8 font-heading text-2xl font-bold tracking-[-0.05em]">14:30</p>
                    <p className="mt-1 text-[10px] font-bold">Recogida programada</p>
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white">
                    <p className="text-[10px] font-bold text-white/70">PROGRESO</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-[#b8e845]" />
                    </div>
                    <p className="mt-3 text-xs font-semibold">75% preparado</p>
                    <p className="mt-1 text-[10px] leading-4 text-white/70">6 unidades pendientes de escaneo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="flujo" aria-labelledby="workflow-title" className="bg-[#171a24] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1344px]">
            <div className="grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <p className="text-xs font-bold tracking-[0.2em] text-[#b8e845] uppercase">Un solo flujo operativo</p>
              <h2 id="workflow-title" className="font-heading text-4xl leading-[0.95] font-bold tracking-[-0.055em] sm:text-6xl">
                De la reserva al retorno, sin puntos ciegos.
              </h2>
            </div>
            <ol className="grid divide-y divide-white/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {workflow.map((step) => (
                <li key={step.number} className="group py-10 lg:px-8 lg:py-14 first:lg:pl-0 last:lg:pr-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/70">/{step.number}</span>
                    <step.icon aria-hidden="true" className="size-6 text-[#b8e845] transition-transform group-hover:rotate-6 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-16 font-heading text-2xl font-bold tracking-[-0.035em]">{step.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="seguridad" aria-labelledby="control-title" className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="landing-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className="relative mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#ff7657] text-[#171a24]">
                <ShieldCheck aria-hidden="true" className="size-6" />
              </span>
              <h2 id="control-title" className="mt-7 max-w-xl font-heading text-4xl leading-[0.96] font-bold tracking-[-0.055em] sm:text-6xl">
                Una operación compartida. Datos siempre separados.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#555861]">
                Equiply combina organizaciones, sucursales y permisos por rol con aislamiento multi-tenant probado automáticamente.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Boxes, "Inventario por sucursal", "Disponibilidad y movimientos con contexto de organización."],
                [UsersRound, "Permisos por rol", "Propietarios, gerentes y empleados ven sólo lo necesario."],
                [ClipboardCheck, "Historial operativo", "Cada preparación, entrega y retorno deja trazabilidad."],
                [ShieldCheck, "Aislamiento verificado", "Tests negativos impiden lecturas entre organizaciones."],
              ].map(([Icon, title, description], index) => {
                const FeatureIcon = Icon as typeof Boxes;
                return (
                  <article key={String(title)} className={`rounded-[22px] border border-[#171a24]/12 p-6 ${index === 1 ? "bg-[#b8e845]" : "bg-white/70"}`}>
                    <FeatureIcon aria-hidden="true" className="size-5" />
                    <h3 className="mt-10 font-heading text-xl font-bold tracking-[-0.03em]">{String(title)}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#4b4e56]">{String(description)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="cta-title" className="px-5 pb-8 sm:px-8 lg:px-12">
          <div className="relative mx-auto max-w-[1344px] overflow-hidden rounded-[30px] bg-[#ff7657] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <div className="metric-grid pointer-events-none absolute inset-0 opacity-25" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-extrabold tracking-[0.16em] uppercase">Demo pública</p>
                <h2 id="cta-title" className="mt-4 max-w-3xl font-heading text-4xl leading-[0.95] font-bold tracking-[-0.06em] sm:text-6xl">
                  Mira cómo se siente una operación bajo control.
                </h2>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#171a24] px-6 text-sm font-bold text-white hover:bg-[#2b3041]"
              >
                Abrir Equiply <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-5 border-t border-[#171a24]/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label="Equiply, inicio">
            <BrandMark className="size-8" />
            <span className="font-heading text-lg font-bold tracking-[-0.04em]">Equiply</span>
          </Link>
          <p className="text-xs text-[#555861]">Software operativo para empresas de alquiler de eventos.</p>
          <Link href="/dashboard" className="text-xs font-bold underline decoration-[#ff7657] decoration-2 underline-offset-4">Ver demo</Link>
        </div>
      </footer>
    </div>
  );
}
