import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const SceneStep2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepBadge = spring({ frame, fps, config: { damping: 12 } });

  const products = [
    { emoji: "👕", name: "T-Shirt Custom", price: "5 000 FCFA" },
    { emoji: "👟", name: "Sneakers Pro", price: "25 000 FCFA" },
    { emoji: "🎒", name: "Sac à dos", price: "15 000 FCFA" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Step badge */}
      <div
        style={{
          transform: `scale(${stepBadge})`,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10B981, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
          boxShadow: "0 10px 40px rgba(16, 185, 129, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 48, fontWeight: 800 }}>2</span>
      </div>

      <h2 style={{
        fontSize: 52,
        fontWeight: 700,
        color: "white",
        textAlign: "center",
        margin: 0,
        marginBottom: 15,
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: { damping: 15 } }), [0, 1], [40, 0])}px)`,
      }}>
        Ajoutez vos produits
      </h2>

      <p style={{
        fontSize: 28,
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        margin: 0,
        marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Créez votre catalogue
      </p>

      {/* Product cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 850 }}>
        {products.map((product, i) => {
          const delay = 15 + i * 15;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const cardOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateX(${interpolate(cardSpring, [0, 1], [i % 2 === 0 ? -80 : 80, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "30px 40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: `linear-gradient(135deg, hsla(${120 + i * 40}, 70%, 50%, 0.2), hsla(${140 + i * 40}, 70%, 40%, 0.1))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 42 }}>{product.emoji}</span>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: "white" }}>{product.name}</div>
                  <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>En stock</div>
                </div>
              </div>
              <div style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.15)",
                padding: "8px 20px",
                borderRadius: 12,
              }}>
                {product.price}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <div
        style={{
          opacity: interpolate(frame, [65, 80], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${spring({ frame: frame - 65, fps, config: { damping: 10 } })})`,
          marginTop: 30,
          background: "linear-gradient(135deg, #10B981, #059669)",
          borderRadius: 20,
          padding: "18px 50px",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
        }}
      >
        <span style={{ color: "white", fontSize: 26, fontWeight: 600 }}>＋ Ajouter un produit</span>
      </div>
    </AbsoluteFill>
  );
};
