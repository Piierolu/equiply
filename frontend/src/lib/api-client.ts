export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type TokenProvider = () => Promise<string>;

export async function apiRequest<T>(path: string, getAccessToken: TokenProvider, init: RequestInit = {}) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return demoRequest<T>(path, init);
  }

  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(await errorMessage(response), response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const demoEquipmentKey = "equiply.demo.equipment";
const demoSubscriptionKey = "equiply.demo.subscription";

function demoRequest<T>(path: string, init: RequestInit) {
  const method = init.method ?? "GET";

  if (path === "/api/v1/equipment" && method === "GET") {
    return demoEquipment() as T;
  }

  if (path === "/api/v1/equipment" && method === "POST") {
    const request = requestBody(init);
    const item: DemoEquipment = {
      id: crypto.randomUUID(),
      sku: String(request.sku),
      name: String(request.name),
      description: typeof request.description === "string" ? request.description : null,
      trackingType: String(request.trackingType),
      totalQuantity: Number(request.totalQuantity),
      reservedQuantity: 0,
      availableQuantity: Number(request.totalQuantity),
      createdAt: new Date().toISOString(),
    };
    saveDemoEquipment([...demoEquipment(), item]);
    return item as T;
  }

  const equipmentId = path.match(/^\/api\/v1\/equipment\/([^/]+)$/)?.[1];
  if (equipmentId && method === "PUT") {
    const request = requestBody(init);
    const items = demoEquipment();
    const current = items.find((item) => item.id === equipmentId);
    if (!current) throw new ApiError("Equipment item not found", 404);
    const updated = {
      ...current,
      ...request,
      availableQuantity: Number(request.totalQuantity) - current.reservedQuantity,
    };
    saveDemoEquipment(items.map((item) => (item.id === equipmentId ? updated : item)));
    return updated as T;
  }

  if (equipmentId && method === "DELETE") {
    saveDemoEquipment(demoEquipment().filter((item) => item.id !== equipmentId));
    return undefined as T;
  }

  if (path === "/api/v1/subscriptions/current" && method === "GET") {
    return demoSubscription() as T;
  }

  if (path === "/api/v1/subscriptions/current" && method === "PUT") {
    const plan = String(requestBody(init).plan) as keyof typeof planLimits;
    const limits = planLimits[plan];
    if (!limits) throw new ApiError("Unknown subscription plan", 400);
    const subscription = {
      plan,
      status: "ACTIVE",
      ...limits,
      currentPeriodEndsAt: inThirtyDays(),
      updatedAt: new Date().toISOString(),
      simulated: true,
    };
    localStorage.setItem(demoSubscriptionKey, JSON.stringify(subscription));
    return subscription as T;
  }

  if (path === "/api/v1/subscriptions/current" && method === "DELETE") {
    const subscription = { ...demoSubscription(), status: "CANCELED", updatedAt: new Date().toISOString() };
    localStorage.setItem(demoSubscriptionKey, JSON.stringify(subscription));
    return subscription as T;
  }

  throw new ApiError("Demo endpoint not found", 404);
}

type DemoEquipment = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  trackingType: string;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  createdAt: string;
};

const seedEquipment: DemoEquipment[] = [
  {
    id: "demo-atlas",
    sku: "AUD-SPK-12",
    name: "Altavoz Atlas 12",
    description: "Altavoz activo de 12 pulgadas para recintos medianos",
    trackingType: "SERIALIZED",
    totalQuantity: 12,
    reservedQuantity: 4,
    availableQuantity: 8,
    createdAt: "2026-07-31T12:00:00Z",
  },
  {
    id: "demo-luma",
    sku: "LGT-BAR-RGB",
    name: "Barra de luz Luma RGB",
    description: "Barra RGB inalámbrica con soporte de suelo",
    trackingType: "SERIALIZED",
    totalQuantity: 24,
    reservedQuantity: 6,
    availableQuantity: 18,
    createdAt: "2026-07-31T12:00:00Z",
  },
  {
    id: "demo-chair",
    sku: "FUR-CHA-BLK",
    name: "Silla plegable negra",
    description: "Silla plegable reforzada para eventos",
    trackingType: "BULK",
    totalQuantity: 180,
    reservedQuantity: 42,
    availableQuantity: 138,
    createdAt: "2026-07-31T12:00:00Z",
  },
];

const planLimits = {
  STARTER: { maxBranches: 1, maxUsers: 3 },
  GROWTH: { maxBranches: 5, maxUsers: 20 },
  PRO: { maxBranches: 25, maxUsers: 100 },
};

function demoEquipment(): DemoEquipment[] {
  const stored = localStorage.getItem(demoEquipmentKey);
  if (stored) return JSON.parse(stored) as DemoEquipment[];
  saveDemoEquipment(seedEquipment);
  return [...seedEquipment];
}

function saveDemoEquipment(items: DemoEquipment[]) {
  localStorage.setItem(demoEquipmentKey, JSON.stringify(items));
}

function demoSubscription() {
  const stored = localStorage.getItem(demoSubscriptionKey);
  if (stored) return JSON.parse(stored) as Record<string, unknown>;
  const subscription = {
    plan: "GROWTH",
    status: "ACTIVE",
    ...planLimits.GROWTH,
    currentPeriodEndsAt: inThirtyDays(),
    updatedAt: new Date().toISOString(),
    simulated: true,
  };
  localStorage.setItem(demoSubscriptionKey, JSON.stringify(subscription));
  return subscription;
}

function requestBody(init: RequestInit) {
  if (typeof init.body !== "string") throw new ApiError("A JSON request body is required", 400);
  return JSON.parse(init.body) as Record<string, unknown>;
}

function inThirtyDays() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

async function errorMessage(response: Response) {
  try {
    const problem = (await response.json()) as { detail?: string; message?: string; title?: string };
    return problem.detail || problem.message || problem.title || `La solicitud falló (${response.status})`;
  } catch {
    return `La solicitud falló (${response.status})`;
  }
}
