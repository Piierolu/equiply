"use client";

import { LogOut } from "lucide-react";

import { useEquiplyAuth } from "@/components/auth-provider";

export function DashboardUser() {
  const { user, roles, logout } = useEquiplyAuth();
  const primaryRole = roles.includes("OWNER") ? "Propietario" : roles.includes("MANAGER") ? "Gerente" : "Empleado";

  return (
    <div className="ml-1 flex items-center gap-2 rounded-xl p-1">
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg bg-[#242837] text-xs font-bold text-white">
        {user?.initials || "EQ"}
      </span>
      <span className="hidden min-w-0 text-left md:block">
        <span className="block max-w-32 truncate text-xs font-semibold">{user?.name || "Usuario Equiply"}</span>
        <span className="block text-[10px] text-black/65">{primaryRole}</span>
      </span>
      <button
        type="button"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="ml-1 grid size-9 place-items-center rounded-lg text-black/60 hover:bg-black/[0.06] hover:text-black"
        onClick={() => void logout()}
      >
        <LogOut aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
