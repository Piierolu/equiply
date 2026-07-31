import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  MapPin,
  PackageOpen,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";

import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { DashboardUser } from "@/components/dashboard-user";
import { InventoryManager } from "@/components/inventory-manager";
import { SubscriptionManager } from "@/components/subscription-manager";
import { MobileDashboardNavigation } from "@/components/mobile-dashboard-navigation";
import { buttonVariants } from "@/components/ui/button";

const navigation = [
  { label: "Resumen", icon: LayoutDashboard, href: "/dashboard#overview", active: true },
  { label: "Reservas", icon: CalendarDays, href: "/dashboard#operations", count: "12" },
  { label: "Inventario", icon: Boxes, href: "/dashboard#inventory" },
  { label: "Pedidos", icon: ClipboardList, href: "/dashboard#operations" },
  { label: "Clientes", icon: UsersRound, href: "/dashboard#operations" },
  { label: "Suscripción", icon: ReceiptText, href: "/dashboard#billing" },
];

const metrics = [
  {
    label: "Ingresos este mes",
    value: "$ 18,420",
    detail: "+12.4% frente a junio",
    tone: "lime",
  },
  {
    label: "Reservas activas",
    value: "28",
    detail: "8 salen esta semana",
    tone: "ink",
  },
  {
    label: "Equipos en alquiler",
    value: "146",
    detail: "68% del inventario",
    tone: "coral",
  },
];

const operations = [
  {
    id: "EQ-1048",
    client: "Nómada Producciones",
    event: "Conferencia anual",
    date: "Hoy, 14:30",
    status: "Preparando",
    statusClass: "bg-[#fff1c7] text-[#725400]",
    initials: "NP",
    color: "bg-[#ff7657]",
  },
  {
    id: "EQ-1047",
    client: "Casa Lumen",
    event: "Boda · 180 invitados",
    date: "Hoy, 17:00",
    status: "Listo para salir",
    statusClass: "bg-[#dff7d4] text-[#245319]",
    initials: "CL",
    color: "bg-[#b8e845]",
  },
  {
    id: "EQ-1042",
    client: "Marea Studio",
    event: "Rodaje publicitario",
    date: "Mañana, 08:00",
    status: "Confirmado",
    statusClass: "bg-[#e6e7ff] text-[#383a8f]",
    initials: "MS",
    color: "bg-[#7679e8]",
  },
];

const schedule = [
  { time: "09:00", title: "Entrega · Hotel Ámbar", meta: "EQ-1039 · 24 artículos", type: "delivery" },
  { time: "14:30", title: "Recogida · Nómada", meta: "EQ-1048 · Almacén central", type: "pickup" },
  { time: "18:00", title: "Devolución · Casa Lumen", meta: "EQ-1031 · Revisión pendiente", type: "return" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f2ec] text-[#171a24]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-[#151824] px-4 py-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2">
          <Link href="/" aria-label="Equiply, inicio"><BrandMark /></Link>
          <span className="font-heading text-xl font-bold tracking-[-0.04em]">Equiply</span>
        </div>

        <div className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-2.5 text-left">
          <span className="grid size-9 place-items-center rounded-lg bg-[#b8e845] text-xs font-bold text-[#171a24]">NE</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">Northstar Events</span>
            <span className="block text-[11px] text-white/70">Plan Growth</span>
          </span>
        </div>

        <nav aria-label="Navegación del panel" className="mt-7">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-white/70 uppercase">Operaciones</p>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
                    item.active ? "bg-white text-[#171a24] shadow-sm" : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <item.icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.count ? (
                    <span className="rounded-full bg-[#ff7657] px-2 py-0.5 text-[10px] font-bold text-white">{item.count}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold">Uso del plan</span>
              <span className="text-[11px] text-[#b8e845]">68%</span>
            </div>
            <div role="progressbar" aria-label="Uso del plan" aria-valuenow={68} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-[#b8e845]" />
            </div>
            <p className="mt-3 text-[11px] leading-4 text-white/70">3 de 5 sucursales activas</p>
          </div>
          <Link href="/dashboard#attention" className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/75 hover:bg-white/[0.06] hover:text-white">
            <Settings aria-hidden="true" className="size-[18px]" />
            Configuración
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center border-b border-black/[0.07] bg-[#f4f2ec]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <MobileDashboardNavigation />
            <Link href="/" aria-label="Equiply, inicio"><BrandMark /></Link>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/60" />
              <label htmlFor="dashboard-search" className="sr-only">Buscar reserva o cliente</label>
              <input
                id="dashboard-search"
                type="search"
                placeholder="Buscar reserva, cliente..."
                className="h-10 w-64 rounded-xl border border-black/[0.12] bg-white/70 pr-3 pl-10 text-sm placeholder:text-black/60 focus:border-black/40"
              />
            </div>
            <button type="button" aria-label="Notificaciones, una pendiente" className="relative grid size-10 place-items-center rounded-xl border border-black/[0.12] bg-white/70 text-black/65">
              <Bell aria-hidden="true" className="size-[18px]" />
              <span aria-hidden="true" className="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-[#ff7657]" />
            </button>
            <DashboardUser />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          <section id="overview" className="flex scroll-mt-24 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-black/65 uppercase">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#4d7626]" /> Viernes, 31 de julio
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-[-0.045em] sm:text-[40px]">Buenos días, Luis.</h1>
              <p className="mt-2 text-sm text-black/65">Este es el pulso de tus operaciones para hoy.</p>
            </div>
            <Link href="/dashboard#operations" className={buttonVariants({ className: "h-11 rounded-xl bg-[#171a24] px-4 text-white shadow-[0_6px_18px_rgba(23,26,36,0.18)] hover:bg-[#2b3041]" })}>
              <Plus aria-hidden="true" className="size-4" /> Nueva reserva
            </Link>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {metrics.map((metric, index) => (
              <article
                key={metric.label}
                className={`relative overflow-hidden rounded-[22px] border p-5 sm:p-6 ${
                  metric.tone === "lime"
                    ? "border-[#a4d434] bg-[#b8e845]"
                    : metric.tone === "coral"
                      ? "border-[#f5d7cd] bg-[#fff7f3]"
                      : "border-black/[0.07] bg-white"
                }`}
              >
                {index === 0 ? <div className="metric-grid absolute inset-0 opacity-25" /> : null}
                <div className="relative flex items-start justify-between">
                  <p className="text-xs font-semibold text-black/65">{metric.label}</p>
                  <span aria-hidden="true" className="grid size-8 place-items-center rounded-full border border-black/10 bg-white/50">
                    {index === 0 ? <ArrowUpRight className="size-4" /> : index === 1 ? <CalendarDays className="size-4" /> : <PackageOpen className="size-4" />}
                  </span>
                </div>
                <p className="relative mt-7 font-heading text-[34px] font-bold tracking-[-0.05em]">{metric.value}</p>
                <p className="relative mt-1 text-xs text-black/65">{metric.detail}</p>
              </article>
            ))}
          </section>

          <section id="operations" aria-labelledby="operations-title" className="mt-4 grid scroll-mt-24 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.8fr)]">
            <article className="overflow-hidden rounded-[22px] border border-black/[0.07] bg-white">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h2 id="operations-title" className="font-heading text-lg font-bold tracking-[-0.025em]">Operaciones próximas</h2>
                  <p className="mt-1 text-xs text-black/65">Pedidos que requieren atención</p>
                </div>
                <span className="text-xs font-semibold text-black/65">3 próximas</span>
              </div>
              <div className="divide-y divide-black/[0.06]">
                {operations.map((operation) => (
                  <div key={operation.id} className="grid gap-4 px-5 py-4 transition-colors hover:bg-[#faf9f5] sm:grid-cols-[minmax(190px,1.2fr)_1fr_auto] sm:items-center sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-[#171a24] ${operation.color}`}>
                        {operation.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{operation.client}</p>
                        <p className="mt-0.5 truncate text-xs text-black/65">{operation.id} · {operation.event}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/65">
                      <Clock3 aria-hidden="true" className="size-3.5" /> {operation.date}
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${operation.statusClass}`}>{operation.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[22px] border border-black/[0.07] bg-[#202432] p-5 text-white sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-white/70 uppercase">Agenda logística</p>
                  <h2 className="mt-2 font-heading text-xl font-bold tracking-[-0.035em]">Ruta de hoy</h2>
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/75">3 paradas</span>
              </div>
              <div className="relative mt-7 space-y-5 before:absolute before:top-2 before:bottom-5 before:left-[54px] before:w-px before:bg-white/10">
                {schedule.map((item) => (
                  <div key={item.time} className="relative grid grid-cols-[42px_1fr] gap-7">
                    <span className="pt-0.5 font-mono text-[11px] text-white/75">{item.time}</span>
                    <span aria-hidden="true" className={`absolute top-1 left-[50px] z-10 size-2.5 rounded-full border-2 border-[#202432] ${
                      item.type === "delivery" ? "bg-[#b8e845]" : item.type === "pickup" ? "bg-[#ff7657]" : "bg-[#8f92ff]"
                    }`} />
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="mt-1 text-[11px] text-white/70">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-xs font-semibold text-white/75">
                <MapPin aria-hidden="true" className="size-3.5" /> Ruta coordinada desde almacén central
              </p>
            </article>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <InventoryManager />
            <SubscriptionManager />

            <article id="attention" className="scroll-mt-24 rounded-[22px] border border-[#f1d9c7] bg-[#fff8ed] p-5 sm:p-6">
              <div className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ffdfb5] text-[#9a5920]">
                  <AlertTriangle aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-lg font-bold tracking-[-0.025em]">Atención requerida</h2>
                    <span className="rounded-full bg-[#ff7657] px-2 py-0.5 text-[10px] font-bold text-white">4</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-xs">
                      <RotateCcw aria-hidden="true" className="size-4 text-black/60" />
                      <span className="flex-1">2 devoluciones con retraso</span>
                      <ArrowUpRight aria-hidden="true" className="size-3.5 text-black/60" />
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <PackageOpen aria-hidden="true" className="size-4 text-black/60" />
                      <span className="flex-1">2 artículos con stock bajo</span>
                      <ArrowUpRight aria-hidden="true" className="size-3.5 text-black/60" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#4d7626]">
                      <Check aria-hidden="true" className="size-4" />
                      <span className="flex-1">Sin pagos vencidos</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
