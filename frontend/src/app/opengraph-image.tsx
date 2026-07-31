import { ImageResponse } from "next/og";

export const alt = "Equiply, cada equipo y cada fecha bajo control";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#171a24",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "780px" }}>
          <div style={{ color: "#b8e845", display: "flex", fontSize: 28, fontWeight: 700 }}>EQUIPLY</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: "-4px", lineHeight: 0.95, marginTop: 42 }}>
            Cada equipo. Cada fecha. Bajo control.
          </div>
          <div style={{ color: "#c8cad1", display: "flex", fontSize: 25, marginTop: 38 }}>
            Inventario, reservas, entregas y devoluciones en un solo lugar.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#b8e845",
            borderRadius: 46,
            color: "#171a24",
            display: "flex",
            fontSize: 76,
            fontWeight: 900,
            height: 220,
            justifyContent: "center",
            transform: "rotate(5deg)",
            width: 220,
          }}
        >
          EQ
        </div>
      </div>
    ),
    size,
  );
}
