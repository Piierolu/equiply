"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  LoaderCircle,
  PackageOpen,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { useEquiplyAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api-client";

type TrackingType = "BULK" | "SERIALIZED";

type EquipmentItem = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  trackingType: TrackingType;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  createdAt: string;
};

type EquipmentForm = {
  sku: string;
  name: string;
  description: string;
  trackingType: TrackingType;
  totalQuantity: string;
};

const emptyForm: EquipmentForm = {
  sku: "",
  name: "",
  description: "",
  trackingType: "BULK",
  totalQuantity: "0",
};

export function InventoryManager() {
  const { status, roles, getAccessToken } = useEquiplyAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EquipmentForm>(emptyForm);
  const canManage = roles.some((role) => role === "OWNER" || role === "MANAGER");

  useEffect(() => {
    if (status !== "authenticated") return;
    const controller = new AbortController();

    void apiRequest<EquipmentItem[]>("/api/v1/equipment", getAccessToken, { signal: controller.signal })
      .then((result) => {
        setItems(result);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(messageFor(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [getAccessToken, status]);

  async function reload() {
    setLoading(true);
    setError("");
    try {
      setItems(await apiRequest<EquipmentItem[]>("/api/v1/equipment", getAccessToken));
    } catch (requestError) {
      setError(messageFor(requestError));
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    dialogRef.current?.showModal();
  }

  function openEditDialog(item: EquipmentItem) {
    setEditingId(item.id);
    setForm({
      sku: item.sku,
      name: item.name,
      description: item.description ?? "",
      trackingType: item.trackingType,
      totalQuantity: String(item.totalQuantity),
    });
    setFormError("");
    dialogRef.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    const request = {
      ...form,
      description: form.description || null,
      totalQuantity: Number(form.totalQuantity),
    };

    try {
      const saved = await apiRequest<EquipmentItem>(
        editingId ? `/api/v1/equipment/${editingId}` : "/api/v1/equipment",
        getAccessToken,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(request),
        },
      );
      setItems((current) => sortByName(editingId ? current.map((item) => (item.id === saved.id ? saved : item)) : [...current, saved]));
      dialogRef.current?.close();
    } catch (requestError) {
      setFormError(messageFor(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: EquipmentItem) {
    if (!window.confirm(`¿Eliminar ${item.name}? Esta acción no se puede deshacer.`)) return;

    try {
      await apiRequest<void>(`/api/v1/equipment/${item.id}`, getAccessToken, { method: "DELETE" });
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    } catch (requestError) {
      setError(messageFor(requestError));
    }
  }

  const totals = items.reduce(
    (result, item) => ({
      total: result.total + item.totalQuantity,
      reserved: result.reserved + item.reservedQuantity,
      available: result.available + item.availableQuantity,
    }),
    { total: 0, reserved: 0, available: 0 },
  );

  return (
    <article id="inventory" className="scroll-mt-24 overflow-hidden rounded-[22px] border border-black/[0.07] bg-white lg:col-span-2">
      <div className="flex flex-col gap-4 border-b border-black/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <Boxes aria-hidden="true" className="size-5 text-black/60" />
            <h2 className="font-heading text-lg font-bold tracking-[-0.025em]">Inventario conectado</h2>
          </div>
          <p className="mt-1 text-xs text-black/65">Datos reales aislados para la organización autenticada.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Actualizar inventario"
            className="grid size-10 place-items-center rounded-xl border border-black/10 text-black/65 hover:bg-black/[0.04]"
            onClick={() => void reload()}
          >
            <RefreshCw aria-hidden="true" className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {canManage ? (
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#171a24] px-4 text-xs font-bold text-white hover:bg-[#2b3041]"
              onClick={openCreateDialog}
            >
              <Plus aria-hidden="true" className="size-4" /> Añadir equipo
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div role="alert" className="m-5 flex items-start gap-3 rounded-xl border border-[#edc8b9] bg-[#fff5f0] p-4 text-sm text-[#7c2d1d] sm:m-6">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" className="font-bold underline underline-offset-2" onClick={() => void reload()}>Reintentar</button>
        </div>
      ) : null}

      <div className="grid grid-cols-3 divide-x divide-black/[0.07] border-b border-black/[0.07] bg-[#faf9f5] px-5 py-4 sm:px-6">
        <InventoryMetric value={totals.total} label="Unidades totales" />
        <InventoryMetric value={totals.available} label="Disponibles" accent="text-[#4d7626]" className="px-4 sm:px-6" />
        <InventoryMetric value={totals.reserved} label="Reservadas" accent="text-[#c44f35]" className="pl-4 sm:pl-6" />
      </div>

      {loading ? (
        <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-black/65">
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> Cargando inventario...
        </div>
      ) : items.length === 0 && !error ? (
        <div className="grid min-h-48 place-items-center p-6 text-center">
          <div>
            <PackageOpen aria-hidden="true" className="mx-auto size-7 text-black/45" />
            <p className="mt-3 text-sm font-bold">Todavía no hay equipos</p>
            <p className="mt-1 text-xs text-black/65">Añade la primera referencia para comenzar.</p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-black/[0.07]">
          {items.map((item) => (
            <li key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(220px,1fr)_auto_auto] sm:items-center sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold">{item.name}</p>
                  <span className="rounded-md bg-[#ece9df] px-2 py-0.5 font-mono text-[10px] font-semibold text-black/70">{item.sku}</span>
                  <span className="rounded-md border border-black/10 px-2 py-0.5 text-[10px] font-semibold text-black/65">
                    {item.trackingType === "SERIALIZED" ? "Serializado" : "Por cantidad"}
                  </span>
                </div>
                {item.description ? <p className="mt-1 truncate text-xs text-black/65">{item.description}</p> : null}
              </div>
              <div className="flex gap-5 text-xs">
                <span><strong className="block text-base text-[#4d7626]">{item.availableQuantity}</strong> disponibles</span>
                <span><strong className="block text-base">{item.totalQuantity}</strong> totales</span>
              </div>
              {canManage ? (
                <div className="flex justify-end gap-1">
                  <button type="button" aria-label={`Editar ${item.name}`} className="grid size-9 place-items-center rounded-lg text-black/60 hover:bg-black/[0.05] hover:text-black" onClick={() => openEditDialog(item)}>
                    <Pencil aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" aria-label={`Eliminar ${item.name}`} className="grid size-9 place-items-center rounded-lg text-[#a23c27] hover:bg-[#fff0e9]" onClick={() => void remove(item)}>
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {!canManage && status === "authenticated" ? (
        <p className="border-t border-black/[0.07] bg-[#faf9f5] px-5 py-3 text-xs text-black/65 sm:px-6">
          Tu rol permite consultar el inventario. Un propietario o gerente puede modificarlo.
        </p>
      ) : null}

      <dialog ref={dialogRef} aria-labelledby="equipment-dialog-title" className="m-auto w-[min(92vw,560px)] rounded-[24px] bg-white p-0 text-[#171a24] shadow-2xl backdrop:bg-black/55">
        <form onSubmit={(event) => void submit(event)}>
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6">
            <h2 id="equipment-dialog-title" className="font-heading text-xl font-bold tracking-[-0.035em]">
              {editingId ? "Editar equipo" : "Añadir equipo"}
            </h2>
            <button type="button" aria-label="Cerrar" className="grid size-9 place-items-center rounded-lg text-black/60 hover:bg-black/[0.05]" onClick={() => dialogRef.current?.close()}>
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <Field label="SKU" htmlFor="equipment-sku">
              <input id="equipment-sku" required maxLength={64} value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} className="field-input" />
            </Field>
            <Field label="Nombre" htmlFor="equipment-name">
              <input id="equipment-name" required maxLength={160} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="field-input" />
            </Field>
            <Field label="Seguimiento" htmlFor="equipment-tracking">
              <select id="equipment-tracking" value={form.trackingType} onChange={(event) => setForm({ ...form, trackingType: event.target.value as TrackingType })} className="field-input">
                <option value="BULK">Por cantidad</option>
                <option value="SERIALIZED">Serializado</option>
              </select>
            </Field>
            <Field label="Cantidad total" htmlFor="equipment-quantity">
              <input id="equipment-quantity" required type="number" min="0" max="1000000" value={form.totalQuantity} onChange={(event) => setForm({ ...form, totalQuantity: event.target.value })} className="field-input" />
            </Field>
            <Field label="Descripción (opcional)" htmlFor="equipment-description" className="sm:col-span-2">
              <textarea id="equipment-description" maxLength={500} rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="field-input resize-none" />
            </Field>
            {formError ? <p role="alert" className="sm:col-span-2 text-sm text-[#a23c27]">{formError}</p> : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-black/10 bg-[#faf9f5] px-5 py-4 sm:px-6">
            <button type="button" className="min-h-10 rounded-xl border border-black/15 px-4 text-xs font-bold hover:bg-black/[0.04]" onClick={() => dialogRef.current?.close()}>Cancelar</button>
            <button type="submit" disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#171a24] px-4 text-xs font-bold text-white hover:bg-[#2b3041] disabled:opacity-60">
              {saving ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {editingId ? "Guardar cambios" : "Crear equipo"}
            </button>
          </div>
        </form>
      </dialog>
    </article>
  );
}

function InventoryMetric({ value, label, accent = "", className = "" }: { value: number; label: string; accent?: string; className?: string }) {
  return (
    <div className={className}>
      <p className={`font-heading text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-[11px] text-black/65">{label}</p>
    </div>
  );
}

function Field({ label, htmlFor, className = "", children }: { label: string; htmlFor: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold text-black/70">{label}</label>
      {children}
    </div>
  );
}

function messageFor(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado";
}

function sortByName(items: EquipmentItem[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name, "es"));
}
