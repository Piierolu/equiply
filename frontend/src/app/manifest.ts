import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Equiply",
    short_name: "Equiply",
    description: "Inventario, reservas y logística para empresas de alquiler de eventos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2efe6",
    theme_color: "#171a24",
  };
}
