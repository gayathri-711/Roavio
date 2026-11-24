import React, { useEffect, useRef } from "react";

/**
 * GlobalAnimatedBackground
 * 
 * An ultra-luxury, high-definition, 60fps living travel skyway animation.
 * Features:
 * 1. Living Aurora Wave Ribbons: Dynamic multi-chromatic waves of Emerald (#10B981),
 *    Celestial Cyan (#06B6D4), Sunset Gold (#F59E0B), and Royal Twilight Violet (#8B5CF6).
 * 2. Cruising Commercial Airplanes: Sleek jetliners with wingtips, tail stabilizers,
 *    blinking navigation strobes (red port, green starboard, white beacon), and expanding contrail trails.
 * 3. Shooting Stars / Comets: Brilliant comets streaking diagonally across the sky with luminous fading tails.
 * 4. Animated Flight Corridors: Arched glowing Great Circle trajectories connecting India hubs with moving light packets.
 * 5. Pulsing Airport Radar Hubs: Dynamic sonar rings expanding from major destination hubs with illuminated IATA tags (DEL, BOM, BLR, GOI, OOTY, JAI, SXR, etc.).
 * 6. Interactive Mouse Stardust: Delicate glowing travel sparkles trailing the user's cursor.
 * 7. Twinkling Diamond Starfield: Sparkling 4-point stars with rotating diamond glints.
 */
export default function GlobalAnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, lastX: 0, lastY: 0 };
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse movement with interactive stardust generation
    const mouseStardust = [];
    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX - width / 2) * 0.03;
      mouse.targetY = (e.clientY - height / 2) * 0.03;

      // Spawn 1-2 interactive cursor sparkle particles
      if (Math.hypot(e.clientX - mouse.lastX, e.clientY - mouse.lastY) > 18) {
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;
        if (mouseStardust.length < 30) {
          mouseStardust.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.5,
            size: 2 + Math.random() * 3,
            alpha: 0.9,
            color: Math.random() > 0.5 ? "#10B981" : "#F59E0B",
            char: Math.random() > 0.6 ? "✦" : null
          });
        }
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 12 Key Travel Destination Hubs across India
    const HUB_DEFINITIONS = [
      { id: "del", code: "DEL", name: "New Delhi", nx: 0.44, ny: 0.25, color: "#10B981" },
      { id: "bom", code: "BOM", name: "Mumbai", nx: 0.28, ny: 0.54, color: "#06B6D4" },
      { id: "blr", code: "BLR", name: "Bengaluru", nx: 0.42, ny: 0.74, color: "#10B981" },
      { id: "goi", code: "GOI", name: "Goa", nx: 0.31, ny: 0.66, color: "#F59E0B" },
      { id: "jai", code: "JAI", name: "Jaipur", nx: 0.38, ny: 0.34, color: "#F59E0B" },
      { id: "oty", code: "OOTY", name: "Ooty", nx: 0.39, ny: 0.82, color: "#10B981" },
      { id: "sxr", code: "SXR", name: "Srinagar", nx: 0.40, ny: 0.12, color: "#06B6D4" },
      { id: "vns", code: "VNS", name: "Varanasi", nx: 0.60, ny: 0.36, color: "#F59E0B" },
      { id: "ccu", code: "CCU", name: "Kolkata", nx: 0.72, ny: 0.46, color: "#06B6D4" },
      { id: "cok", code: "COK", name: "Munnar", nx: 0.42, ny: 0.88, color: "#10B981" },
      { id: "maa", code: "MAA", name: "Chennai", nx: 0.52, ny: 0.76, color: "#10B981" },
      { id: "khi", code: "MAN", name: "Manali", nx: 0.46, ny: 0.17, color: "#06B6D4" }
    ];

    // Flight Corridors
    const ROUTE_PAIRS = [
      ["del", "bom"],
      ["del", "goi"],
      ["del", "sxr"],
      ["del", "vns"],
      ["bom", "blr"],
      ["bom", "goi"],
      ["blr", "oty"],
      ["blr", "cok"],
      ["jai", "del"],
      ["jai", "bom"],
      ["vns", "ccu"],
      ["del", "khi"],
      ["maa", "blr"],
      ["goi", "cok"]
    ];

    // Sonar radar pulses for each airport hub
    const pulses = HUB_DEFINITIONS.map(() => ({
      radius: Math.random() * 26,
      speed: 0.45 + Math.random() * 0.3,
      maxRadius: 36 + Math.random() * 12
    }));

    // Commercial Passenger Aircraft
    const planes = [
      { routeIdx: 0, t: 0.12, speed: 0.0016, trail: [], color: "#059669" },
      { routeIdx: 1, t: 0.55, speed: 0.0013, trail: [], color: "#D97706" },
      { routeIdx: 2, t: 0.32, speed: 0.0018, trail: [], color: "#0284C7" },
      { routeIdx: 4, t: 0.75, speed: 0.0015, trail: [], color: "#059669" },
      { routeIdx: 6, t: 0.42, speed: 0.0020, trail: [], color: "#10B981" },
      { routeIdx: 10, t: 0.25, speed: 0.0014, trail: [], color: "#D97706" },
      { routeIdx: 12, t: 0.85, speed: 0.0017, trail: [], color: "#059669" }
    ];

    // Shooting Stars / Meteors
    const shootingStars = [];
    let nextShootingStarTime = 1.5;

    const spawnShootingStar = () => {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // diagonal down-right
      const speed = 12 + Math.random() * 8;
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 120 + Math.random() * 80,
        width: 2 + Math.random() * 1.5,
        alpha: 1,
        fadeSpeed: 0.016 + Math.random() * 0.012,
        color: Math.random() > 0.4 ? "#FFFFFF" : "#6EE7B7"
      });
    };

    // Twinkling Starfield
    const stars = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.6,
      pulseSpeed: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      char: Math.random() > 0.5 ? (Math.random() > 0.5 ? "✦" : "★") : null,
      color: Math.random() > 0.6 ? "#10B981" : Math.random() > 0.5 ? "#F59E0B" : "#38BDF8"
    }));

    // Math helpers for curves
    const getPoint = (p0, p1, p2, t) => {
      const inv = 1 - t;
      return {
        x: inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x,
        y: inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y
      };
    };

    const getTangent = (p0, p1, p2, t) => {
      const inv = 1 - t;
      return {
        dx: 2 * inv * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
        dy: 2 * inv * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
      };
    };

    // Draw Realistic Airliner Jet
    const drawAirplane = (x, y, angle, color, flashTick) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Jet Glow Aura
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      // 1. Fuselage
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(16, 0); // Nose tip
      ctx.bezierCurveTo(12, -3.5, 4, -4, -10, -3.5); // Top fuselage
      ctx.lineTo(-16, -2); // Tail base top
      ctx.lineTo(-20, -10); // Fin top
      ctx.lineTo(-18, -10);
      ctx.lineTo(-14, 0); // Fin trailing edge
      ctx.lineTo(-18, 10); // Bottom fin
      ctx.lineTo(-20, 10);
      ctx.lineTo(-16, 2); // Tail base bottom
      ctx.lineTo(-10, 3.5);
      ctx.bezierCurveTo(4, 4, 12, 3.5, 16, 0); // Bottom fuselage
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. Wings (Swept back)
      ctx.fillStyle = color;
      // Starboard (Right) Wing
      ctx.beginPath();
      ctx.moveTo(4, 3);
      ctx.lineTo(-4, 18);
      ctx.lineTo(-8, 18);
      ctx.lineTo(-3, 3);
      ctx.closePath();
      ctx.fill();

      // Port (Left) Wing
      ctx.beginPath();
      ctx.moveTo(4, -3);
      ctx.lineTo(-4, -18);
      ctx.lineTo(-8, -18);
      ctx.lineTo(-3, -3);
      ctx.closePath();
      ctx.fill();

      // 3. Jet Engines
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(-2, 8, 8, 3.5, 2);
      ctx.roundRect(-2, -11.5, 8, 3.5, 2);
      ctx.fill();

      // Engine Afterburner Glow
      ctx.fillStyle = "#38BDF8";
      ctx.shadowColor = "#38BDF8";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-2.5, 9.75, 1.8, 0, Math.PI * 2);
      ctx.arc(-2.5, -9.75, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 4. Cockpit Glass
      ctx.fillStyle = "#0F172A";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(8, 0, 3.5, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // 5. Blinking Navigation Strobes
      const isStrobeOn = Math.sin(flashTick * 6) > 0.1;
      if (isStrobeOn) {
        // Starboard (Green strobe at right wingtip)
        ctx.fillStyle = "#22C55E";
        ctx.shadowColor = "#22C55E";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-6, 18, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Port (Red strobe at left wingtip)
        ctx.fillStyle = "#EF4444";
        ctx.shadowColor = "#EF4444";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-6, -18, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Tail (White flashing beacon)
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(-19, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Main 60fps Animation Loop
    const render = () => {
      time += 0.018;

      // Mouse parallax smooth lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Living Aurora Gradient Billows (High Dynamic Range)
      ctx.save();
      const aurora1 = ctx.createRadialGradient(
        width * 0.22 + Math.sin(time * 0.45) * 90 + mouse.x * 2.5,
        height * 0.22 + Math.cos(time * 0.38) * 80 + mouse.y * 2.5,
        25,
        width * 0.22,
        height * 0.22,
        width * 0.55
      );
      aurora1.addColorStop(0, "rgba(16, 185, 129, 0.35)"); // Rich Emerald
      aurora1.addColorStop(0.45, "rgba(5, 150, 105, 0.14)");
      aurora1.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = aurora1;
      ctx.fillRect(0, 0, width, height);

      const aurora2 = ctx.createRadialGradient(
        width * 0.82 + Math.cos(time * 0.4) * 85 - mouse.x * 2,
        height * 0.32 + Math.sin(time * 0.48) * 75 - mouse.y * 2,
        30,
        width * 0.82,
        height * 0.32,
        width * 0.52
      );
      aurora2.addColorStop(0, "rgba(245, 158, 11, 0.32)"); // Warm Sunset Amber
      aurora2.addColorStop(0.5, "rgba(217, 119, 6, 0.12)");
      aurora2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = aurora2;
      ctx.fillRect(0, 0, width, height);

      const aurora3 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.32) * 110 + mouse.x,
        height * 0.78 + Math.cos(time * 0.35) * 85 + mouse.y,
        40,
        width * 0.5,
        height * 0.78,
        width * 0.6
      );
      aurora3.addColorStop(0, "rgba(6, 182, 212, 0.32)"); // Electric Oceanic Cyan
      aurora3.addColorStop(0.45, "rgba(14, 165, 233, 0.12)");
      aurora3.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = aurora3;
      ctx.fillRect(0, 0, width, height);

      const aurora4 = ctx.createRadialGradient(
        width * 0.7 + Math.sin(time * 0.5) * 70,
        height * 0.85 + Math.cos(time * 0.42) * 60,
        20,
        width * 0.7,
        height * 0.85,
        width * 0.4
      );
      aurora4.addColorStop(0, "rgba(139, 92, 246, 0.22)"); // Royal Twilight Violet
      aurora4.addColorStop(0.5, "rgba(99, 102, 241, 0.08)");
      aurora4.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = aurora4;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Compute pixel positions for Hubs
      const hubMap = {};
      HUB_DEFINITIONS.forEach((h) => {
        const x = h.nx * width + mouse.x * 0.8;
        const y = h.ny * height + mouse.y * 0.8;
        hubMap[h.id] = { ...h, x, y };
      });

      // 2. Draw Flight Route Arcs (Curves) with Neon Corridors & Moving Pulses
      ROUTE_PAIRS.forEach(([fromId, toId], rIdx) => {
        const h1 = hubMap[fromId];
        const h2 = hubMap[toId];
        if (!h1 || !h2) return;

        const midX = (h1.x + h2.x) / 2;
        const midY = (h1.y + h2.y) / 2;
        const dx = h2.x - h1.x;
        const dy = h2.y - h1.y;
        const dist = Math.hypot(dx, dy);
        const normalX = -dy / dist;
        const normalY = dx / dist;
        const curvature = Math.min(dist * 0.2, 60);
        const ctrlX = midX + normalX * curvature;
        const ctrlY = midY + normalY * curvature;

        // Route Arch Glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(h1.x, h1.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, h2.x, h2.y);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.24)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 8]);
        ctx.lineDashOffset = -time * 15;
        ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Moving Flight Pulse along Route
        const pulseT = ((time * 0.35 + rIdx * 0.18) % 1);
        const pulsePt = getPoint(h1, { x: ctrlX, y: ctrlY }, h2, pulseT);
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#10B981";
        ctx.shadowColor = "#10B981";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Cruising Airplanes & Contrails
      planes.forEach((p) => {
        const [fromId, toId] = ROUTE_PAIRS[p.routeIdx];
        const h1 = hubMap[fromId];
        const h2 = hubMap[toId];
        if (!h1 || !h2) return;

        const midX = (h1.x + h2.x) / 2;
        const midY = (h1.y + h2.y) / 2;
        const dx = h2.x - h1.x;
        const dy = h2.y - h1.y;
        const dist = Math.hypot(dx, dy);
        const normalX = -dy / dist;
        const normalY = dx / dist;
        const curvature = Math.min(dist * 0.2, 60);
        const ctrl = { x: midX + normalX * curvature, y: midY + normalY * curvature };

        const pos = getPoint(h1, ctrl, h2, p.t);
        const tangent = getTangent(h1, ctrl, h2, p.t);
        const angle = Math.atan2(tangent.dy, tangent.dx);

        // Append to Jet Contrail trail
        p.trail.push({ x: pos.x, y: pos.y, alpha: 0.85, size: 3.5 });
        if (p.trail.length > 28) p.trail.shift();

        // Draw Contrail (Engine Smoke Trail)
        ctx.save();
        p.trail.forEach((pt, idx) => {
          pt.alpha -= 0.025;
          pt.size += 0.25;
          if (pt.alpha <= 0) return;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, pt.alpha * 0.7)})`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        });
        ctx.restore();

        // Draw Plane
        drawAirplane(pos.x, pos.y, angle, p.color, time);

        // Advance plane
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.trail = [];
          p.routeIdx = (p.routeIdx + 1 + Math.floor(Math.random() * 3)) % ROUTE_PAIRS.length;
        }
      });

      // 4. Draw Shooting Stars / Comets
      if (time > nextShootingStarTime) {
        spawnShootingStar();
        nextShootingStarTime = time + 2.5 + Math.random() * 2.5; // Every 2.5-5 seconds
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += star.vx;
        star.y += star.vy;
        star.alpha -= star.fadeSpeed;

        if (star.alpha <= 0 || star.x > width + 100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        const grad = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - star.vx * (star.len / 12),
          star.y - star.vy * (star.len / 12)
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
        grad.addColorStop(0.3, `rgba(110, 231, 183, ${star.alpha * 0.8})`);
        grad.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * (star.len / 12), star.y - star.vy * (star.len / 12));
        ctx.strokeStyle = grad;
        ctx.lineWidth = star.width;
        ctx.lineCap = "round";
        ctx.shadowColor = "#6EE7B7";
        ctx.shadowBlur = 14;
        ctx.stroke();

        // Meteor Head Star Spark
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.width * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#FFFFFF";
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Travel Destination Hubs & Dual Radar Sonar Rings
      HUB_DEFINITIONS.forEach((h, i) => {
        const hub = hubMap[h.id];
        const pulse = pulses[i];

        pulse.radius += pulse.speed;
        if (pulse.radius > pulse.maxRadius) pulse.radius = 4;
        const pulseAlpha = Math.max(0, 1 - pulse.radius / pulse.maxRadius) * 0.65;

        ctx.save();
        // Expanding Radar Ring 1
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = hub.color;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = pulseAlpha;
        ctx.stroke();

        // Expanding Radar Ring 2 (Offset phase)
        const radius2 = (pulse.radius + pulse.maxRadius / 2) % pulse.maxRadius;
        const pulseAlpha2 = Math.max(0, 1 - radius2 / pulse.maxRadius) * 0.45;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, radius2, 0, Math.PI * 2);
        ctx.strokeStyle = hub.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = pulseAlpha2;
        ctx.stroke();

        // Hub Core Beacon
        ctx.shadowColor = hub.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 1;
        ctx.fillStyle = hub.color;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Hub Center Spark
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Airport Code Badge
        ctx.shadowBlur = 0;
        ctx.font = "800 10px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = "#0F172A";
        ctx.textAlign = "center";
        ctx.fillText(h.code, hub.x, hub.y - 10);

        ctx.font = "600 11px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = "#475569";
        ctx.fillText(hub.name, hub.x, hub.y + 16);
        ctx.restore();
      });

      // 6. Draw Interactive Mouse Stardust Particles
      for (let i = mouseStardust.length - 1; i >= 0; i--) {
        const p = mouseStardust[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.022;
        if (p.alpha <= 0) {
          mouseStardust.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        if (p.char) {
          ctx.font = "800 13px sans-serif";
          ctx.fillStyle = p.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. Draw Twinkling Diamond Starfield
      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;

        const px = s.x * width + mouse.x * 0.5;
        const py = s.y * height + mouse.y * 0.5;
        const currentAlpha = s.alpha + Math.sin(time * 3 + s.phase) * 0.25;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        if (s.char) {
          ctx.font = "800 13px sans-serif";
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(s.char, px, py);
        } else {
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(px, py, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="roavio-luxury-canvas-wrapper" aria-hidden="true">
      <div className="roavio-ambient-mesh-glow"></div>
      <canvas ref={canvasRef} className="roavio-travel-sky-canvas" />
      <style>{`
        .roavio-luxury-canvas-wrapper {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          pointer-events: none !important;
          z-index: -1 !important;
          overflow: hidden !important;
          background: linear-gradient(135deg, #ECFDF5 0%, #F0F9FF 30%, #F5F3FF 65%, #FFFBEB 100%) !important;
        }

        .roavio-ambient-mesh-glow {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: 
            radial-gradient(circle at 18% 25%, rgba(16, 185, 129, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 82% 35%, rgba(245, 158, 11, 0.16) 0%, transparent 45%),
            radial-gradient(circle at 45% 80%, rgba(6, 182, 212, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 75% 85%, rgba(139, 92, 246, 0.14) 0%, transparent 45%);
          filter: blur(40px);
          animation: roavioMeshFloat 18s ease-in-out infinite alternate;
        }

        @keyframes roavioMeshFloat {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(25px, -20px) scale(1.04);
          }
          100% {
            transform: translate(-20px, 25px) scale(0.98);
          }
        }

        .roavio-travel-sky-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
}
