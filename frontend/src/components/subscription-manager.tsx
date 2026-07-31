"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, CreditCard, LoaderCircle, Sparkles, X } from "lucide-react";

import { useEquiplyAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api-client";

type SubscriptionPlan = "STARTER" | "GROWTH" | "PRO";
type SubscriptionStatus = "ACTIVE" | "CANCELED";

type Subscription = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  maxBranches: number;
  maxUsers: number;
  currentPeriodEndsAt: string;
  updatedAt: string;
  simulated: boolean;
};

const plans: Array<{ id: SubscriptionPlan; name: string; price: string; description: string }> = [
  { id: "STARTER", name: "Starter", price: "$29", description: "1 sucursal · 3 usuarios" },
  { id: "GROWTH", name: "Growth", price: "$79", description: "5 sucursales · 20 usuarios" },
  { id: "PRO", name: "Pro", price: "$149", description: "25 sucursales · 100 usuarios" },
];

export function SubscriptionManager() {
  const { status, roles, getAccessToken } = useEquiplyAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("GROWTH");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canManage = roles.includes("OWNER");

  useEffect(() => {
    if (status !== "authenticated") return;
    const controller = new AbortController();

    void apiRequest<Subscription>("/api/v1/subscriptions/current", getAccessToken, { signal: controller.signal })
      .then((result) => {
        setSubscription(result);
        setSelectedPlan(result.plan);
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

  async function changePlan() {
    setSaving(true);
    setError("");
    try {
      const updated = await apiRequest<Subscription>("/api/v1/subscriptions/current", getAccessToken, {
        method: "PUT",
        body: JSON.stringify({ plan: selectedPlan }),
      });
      setSubscription(updated);
      dialogRef.current?.close();
    } catch (requestError) {
      setError(messageFor(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function cancelSubscription() {
    if (!window.confirm("¿Cancelar la suscripción al final del período simulado?")) return;
    setSaving(true);
    setError("");
    try {
      setSubscription(await apiRequest<Subscription>("/api/v1/subscriptions/current", getAccessToken, { method: "DELETE" }));
      dialogRef.current?.close();
    } catch (requestError) {
      setError(messageFor(requestError));
    } finally {
      setSaving(false);
    }
  }

  const plan = plans.find((candidate) => candidate.id === subscription?.plan);

  return (
    <article id="billing" className="scroll-mt-24 rounded-[22px] border border-black/[0.07] bg-[#202432] p-5 text-white sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard aria-hidden="true" className="size-5 text-[#b8e845]" />
            <h2 className="font-heading text-lg font-bold tracking-[-0.025em]">Suscripción</h2>
          </div>
          <p className="mt-1 text-xs text-white/70">Flujo de cobro simulado, sin dinero real.</p>
        </div>
        <span className="rounded-full border border-[#b8e845]/30 bg-[#b8e845]/10 px-2.5 py-1 text-[10px] font-bold text-[#b8e845]">SIMULACIÓN</span>
      </div>

      {loading ? (
        <div role="status" className="flex min-h-36 items-center justify-center gap-2 text-sm text-white/70">
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> Cargando plan...
        </div>
      ) : error ? (
        <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-[#ff7657]/30 bg-[#ff7657]/10 p-4 text-sm text-[#ffc4b5]">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> {error}
        </div>
      ) : subscription ? (
        <>
          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-white/65 uppercase">Plan actual</p>
              <p className="mt-2 font-heading text-3xl font-bold tracking-[-0.05em]">{plan?.name}</p>
              <p className="mt-1 text-xs text-white/70">{plan?.price}/mes · valor demostrativo</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${subscription.status === "ACTIVE" ? "bg-[#b8e845] text-[#171a24]" : "bg-[#ffdfb5] text-[#725400]"}`}>
              {subscription.status === "ACTIVE" ? "Activa" : "Cancelada"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
              <p className="font-heading text-xl font-bold">{subscription.maxBranches}</p>
              <p className="mt-1 text-[11px] text-white/70">Sucursales incluidas</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
              <p className="font-heading text-xl font-bold">{subscription.maxUsers}</p>
              <p className="mt-1 text-[11px] text-white/70">Usuarios incluidos</p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-white/65">
            {subscription.status === "ACTIVE" ? "Próxima renovación" : "Acceso disponible hasta"}: {formatDate(subscription.currentPeriodEndsAt)}
          </p>

          {canManage ? (
            <button type="button" className="mt-5 min-h-10 w-full rounded-xl bg-white px-4 text-xs font-bold text-[#171a24] hover:bg-[#f2efe6]" onClick={() => dialogRef.current?.showModal()}>
              Gestionar plan simulado
            </button>
          ) : (
            <p className="mt-5 rounded-xl border border-white/10 p-3 text-xs text-white/70">Sólo el propietario puede cambiar la suscripción.</p>
          )}
        </>
      ) : null}

      <dialog ref={dialogRef} aria-labelledby="subscription-dialog-title" className="m-auto w-[min(92vw,620px)] rounded-[24px] bg-white p-0 text-[#171a24] shadow-2xl backdrop:bg-black/55">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6">
          <div>
            <h2 id="subscription-dialog-title" className="font-heading text-xl font-bold tracking-[-0.035em]">Elige un plan</h2>
            <p className="mt-1 text-xs text-black/65">La operación es demostrativa y no genera ningún cargo.</p>
          </div>
          <button type="button" aria-label="Cerrar" className="grid size-9 place-items-center rounded-lg text-black/60 hover:bg-black/[0.05]" onClick={() => dialogRef.current?.close()}>
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
          {plans.map((candidate) => {
            const selected = candidate.id === selectedPlan;
            return (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={selected}
                className={`relative rounded-2xl border p-4 text-left ${selected ? "border-[#171a24] bg-[#f2efe6] ring-2 ring-[#b8e845]" : "border-black/10 hover:border-black/30"}`}
                onClick={() => setSelectedPlan(candidate.id)}
              >
                {selected ? <Check aria-hidden="true" className="absolute top-3 right-3 size-4" /> : null}
                <p className="text-xs font-bold">{candidate.name}</p>
                <p className="mt-4 font-heading text-2xl font-bold">{candidate.price}<span className="text-xs font-normal text-black/60">/mes</span></p>
                <p className="mt-2 text-[11px] leading-4 text-black/65">{candidate.description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/10 bg-[#faf9f5] px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
          {subscription?.status === "ACTIVE" ? (
            <button type="button" disabled={saving} className="min-h-10 rounded-xl px-3 text-xs font-bold text-[#a23c27] hover:bg-[#fff0e9]" onClick={() => void cancelSubscription()}>
              Cancelar al final del período
            </button>
          ) : <span />}
          <button type="button" disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#171a24] px-4 text-xs font-bold text-white hover:bg-[#2b3041] disabled:opacity-60" onClick={() => void changePlan()}>
            {saving ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Sparkles aria-hidden="true" className="size-4" />}
            Aplicar plan
          </button>
        </div>
      </dialog>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function messageFor(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado";
}
