with open('src/styles.css', 'r', encoding='utf-8') as f:
    text = f.read()

card_reveal_styles = """
/* ================= 3D ON-SCROLL CARD REVEAL SYSTEM ================= */
.card-reveal {
  opacity: 0;
  transform: perspective(1200px) translateY(44px) rotateX(7deg) scale(0.96);
  transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s ease,
              border-color 0.4s ease;
  transition-delay: var(--delay, 0s);
  will-change: opacity, transform;
  position: relative;
}

.card-reveal.in {
  opacity: 1;
  transform: perspective(1200px) translateY(0) rotateX(0deg) scale(1);
}

.card-reveal-left {
  transform: perspective(1200px) translateX(-44px) rotateY(-8deg) scale(0.96);
}
.card-reveal-left.in {
  transform: perspective(1200px) translateX(0) rotateY(0deg) scale(1);
}

.card-reveal-right {
  transform: perspective(1200px) translateX(44px) rotateY(8deg) scale(0.96);
}
.card-reveal-right.in {
  transform: perspective(1200px) translateX(0) rotateY(0deg) scale(1);
}

.card-reveal-scale {
  transform: perspective(1200px) translateY(24px) scale(0.92);
}
.card-reveal-scale.in {
  transform: perspective(1200px) translateY(0) scale(1);
}

/* Card Entrance Shimmer Light Beam */
.card-reveal::after {
  content: '';
  position: absolute;
  top: 0;
  left: -160%;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, transparent 20%, rgba(200, 153, 62, 0.14) 42%, rgba(255, 255, 255, 0.4) 50%, rgba(200, 153, 62, 0.14) 58%, transparent 80%);
  transform: skewX(-22deg);
  pointer-events: none;
  z-index: 6;
}
.card-reveal.in::after {
  animation: cardShimmerSweep 1.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--delay, 0s) + 0.3s);
}

@keyframes cardShimmerSweep {
  0% { left: -160%; }
  100% { left: 190%; }
}
"""

if '.card-reveal' not in text:
    text += "\n" + card_reveal_styles
    with open('src/styles.css', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Appended card reveal styles to src/styles.css")
else:
    print("Styles already present.")

