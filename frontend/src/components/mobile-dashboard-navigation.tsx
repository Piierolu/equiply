"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Settings,
  UsersRound,
  X,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";

const items = [
  { label: "Resumen", icon: LayoutDashboard, href: "/dashboard#overview" },
  { label: "Reservas", icon: CalendarDays, href: "/dashboard#operations", count: "12" },
  { label: "Inventario", icon: Boxes, href: "/dashboard#inventory" },
  { label: "Pedidos", icon: ClipboardList, href: "/dashboard#operations" },
  { label: "Clientes", icon: UsersRound, href: "/dashboard#operations" },
  { label: "Suscripción", icon: ReceiptText, href: "/dashboard#billing" },
];

export function MobileDashboardNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeNavigation() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Abrir navegación"
        className="grid size-10 place-items-center rounded-xl border border-black/10 bg-white"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Navegación de Equiply"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(86vw,320px)] max-w-none bg-[#151824] p-0 text-white shadow-2xl backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeNavigation();
        }}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div className="flex items-center gap-3 px-2">
            <Link href="/" aria-label="Equiply, inicio" onClick={closeNavigation}>
              <BrandMark />
            </Link>
            <span className="font-heading text-xl font-bold tracking-[-0.04em]">Equiply</span>
            <button
              type="button"
              aria-label="Cerrar navegación"
              className="ml-auto grid size-10 place-items-center rounded-xl text-white/75 hover:bg-white/10 hover:text-white"
              onClick={closeNavigation}
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-[#b8e845] text-xs font-bold text-[#171a24]">NE</span>
            <span>
              <span className="block text-sm font-semibold">Northstar Events</span>
              <span className="block text-[11px] text-white/70">Plan Growth</span>
            </span>
          </div>

          <nav aria-label="Navegación móvil" className="mt-7">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-white/70 uppercase">Operaciones</p>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeNavigation}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white"
                  >
                    <item.icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.count ? <span className="rounded-full bg-[#ff7657] px-2 py-0.5 text-[10px] font-bold">{item.count}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/dashboard#attention"
            onClick={closeNavigation}
            className="mt-auto flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white"
          >
            <Settings aria-hidden="true" className="size-[18px]" />
            Configuración
          </Link>
        </div>
      </dialog>
    </>
  );
}
