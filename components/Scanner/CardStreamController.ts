import { ParticleScanner } from './ParticleScanner';
import { generateCode, calculateCodeDimensions } from './utils';

export class CardStreamController {
  container: HTMLDivElement;
  cardLine: HTMLDivElement;
  speedIndicator: HTMLSpanElement | null;
  scanner: ParticleScanner;

  position: number = 0;
  velocity: number = 120;
  direction: number = -1;
  isAnimating: boolean = true;
  isDragging: boolean = false;
  lastTime: number = 0;
  lastMouseX: number = 0;
  mouseVelocity: number = 0;
  friction: number = 0.95;
  minVelocity: number = 30;
  containerWidth: number = 0;
  cardLineWidth: number = 0;
  autoInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    container: HTMLDivElement,
    cardLine: HTMLDivElement,
    speedIndicator: HTMLSpanElement | null,
    scanner: ParticleScanner
  ) {
    this.container = container;
    this.cardLine = cardLine;
    this.speedIndicator = speedIndicator;
    this.scanner = scanner;
    this.init();
  }

  init() {
    this.populateCardLine();
    this.calculateDimensions();
    this.setupEventListeners();
    this.updateCardPosition();
    this.animate();
    this.startPeriodicUpdates();
  }

  createCardWrapper(index: number) {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";
    const normalCard = document.createElement("div");
    normalCard.className = "card card-normal";
    const cardImages = [
      "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
      "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
      "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
      "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
      "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
    ];
    const cardImage = document.createElement("img");
    cardImage.className = "card-image";
    cardImage.src = cardImages[index % cardImages.length];
    cardImage.alt = "Credit Card";
    cardImage.onerror = () => {
      Object.assign(cardImage.style, { background: 'linear-gradient(45deg, #667eea, #764ba2)' });
    };
    normalCard.appendChild(cardImage);

    const asciiCard = document.createElement("div");
    asciiCard.className = "card card-ascii";
    const asciiContent = document.createElement("div");
    asciiContent.className = "ascii-content";
    const { width, height, fontSize, lineHeight } = calculateCodeDimensions(400, 250);
    asciiContent.style.fontSize = fontSize + "px";
    asciiContent.style.lineHeight = lineHeight + "px";
    asciiContent.textContent = generateCode(width, height);

    asciiCard.appendChild(asciiContent);
    wrapper.appendChild(normalCard);
    wrapper.appendChild(asciiCard);
    return wrapper;
  }

  populateCardLine() {
    this.cardLine.innerHTML = "";
    const cardsCount = 30;
    for (let i = 0; i < cardsCount; i++) {
      this.cardLine.appendChild(this.createCardWrapper(i));
    }
  }

  calculateDimensions() {
    this.containerWidth = this.container.offsetWidth;
    const cardWidth = 400;
    const cardGap = 60;
    const cardCount = this.cardLine.children.length;
    this.cardLineWidth = (cardWidth + cardGap) * cardCount;
  }

  setupEventListeners() {
    this.cardLine.addEventListener("mousedown", this.startDrag);
    document.addEventListener("mousemove", this.onDrag);
    document.addEventListener("mouseup", this.endDrag);
    this.cardLine.addEventListener("touchstart", (e) => this.startDrag(e.touches[0] as unknown as MouseEvent), { passive: false });
    document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0] as unknown as MouseEvent), { passive: false });
    document.addEventListener("touchend", this.endDrag);
    this.cardLine.addEventListener("wheel", this.onWheel, { passive: false });
    this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());
    window.addEventListener("resize", () => { this.calculateDimensions(); });
  }

  startDrag = (e: MouseEvent | Touch) => {
    this.isDragging = true;
    this.isAnimating = false;
    this.lastMouseX = e.clientX;
    this.mouseVelocity = 0;
    this.cardLine.style.animation = "none";
    this.cardLine.classList.add("dragging");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  onDrag = (e: MouseEvent | Touch) => {
    if (!this.isDragging) return;
    const deltaX = e.clientX - this.lastMouseX;
    this.position += deltaX;
    this.mouseVelocity = deltaX * 60;
    this.lastMouseX = e.clientX;

    const patternWidth = (400 + 60) * 5;
    if (this.position <= -patternWidth) {
      this.position += patternWidth;
    } else if (this.position > 0) {
      this.position -= patternWidth;
    }

    this.cardLine.style.transform = `translateX(${this.position}px)`;
    this.updateCardClipping();
  };

  endDrag = () => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.cardLine.classList.remove("dragging");
    if (Math.abs(this.mouseVelocity) > this.minVelocity) {
      this.velocity = Math.abs(this.mouseVelocity);
      this.direction = this.mouseVelocity > 0 ? 1 : -1;
    } else {
      this.velocity = 120;
    }
    this.isAnimating = true;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };

  animate = () => {
    if (this.isAnimating) {
      this.position += this.velocity * this.direction * 0.016;

      const patternWidth = (400 + 60) * 5;
      if (this.position <= -patternWidth) {
        this.position += patternWidth;
      } else if (this.position > 0) {
        this.position -= patternWidth;
      }

      this.cardLine.style.transform = `translateX(${this.position}px)`;
      this.updateCardClipping();
      this.updateSpeedIndicator();
    }
    requestAnimationFrame(this.animate);
  };

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaX || e.deltaY;
    this.position += delta * -0.5;

    const patternWidth = (400 + 60) * 5;
    if (this.position <= -patternWidth) {
      this.position += patternWidth;
    } else if (this.position > 0) {
      this.position -= patternWidth;
    }

    this.cardLine.style.transform = `translateX(${this.position}px)`;
    this.velocity = 0;
    this.isAnimating = false;
    this.updateCardClipping();
    if (this.autoInterval) clearTimeout(this.autoInterval as unknown as number);
  };

  updateCardPosition() {
    const patternWidth = (400 + 60) * 5;
    if (this.position <= -patternWidth) {
      this.position += patternWidth;
    } else if (this.position > 0) {
      this.position -= patternWidth;
    }
    this.cardLine.style.transform = `translateX(${this.position}px)`;
    this.updateCardClipping();
  }

  updateCardClipping() {
    if (!this.scanner) return;
    const scannerX = window.innerWidth / 2;
    const scannerWidth = 8;
    const scannerLeft = scannerX - scannerWidth / 2;
    const scannerRight = scannerX + scannerWidth / 2;
    let anyScanningActive = false;

    const updates: { wrapper: Element; inside: boolean; styles: Record<string, string | boolean | undefined> }[] = [];
    const wrappers = this.cardLine.querySelectorAll(".card-wrapper");

    // READ PHASE
    wrappers.forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect();
      const cardLeft = rect.left;
      const cardRight = rect.right;
      const cardWidth = rect.width;

      const updateData: { wrapper: Element; inside: boolean; styles: Record<string, string | boolean | undefined> } = {
        wrapper,
        inside: false,
        styles: {},
      };

      if (cardLeft < scannerRight && cardRight > scannerLeft) {
        anyScanningActive = true;
        updateData.inside = true;
        const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
        const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

        const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
        const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

        updateData.styles = {
          normalClipRight: `${normalClipRight}% `,
          asciiClipLeft: `${asciiClipLeft}% `
        };

        if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
          updateData.styles.setScanned = "true";
        }
      } else {
        updateData.inside = false;
        if (cardRight < scannerLeft) {
          updateData.styles = { normalClipRight: "100%", asciiClipLeft: "100%" };
        } else if (cardLeft > scannerRight) {
          updateData.styles = { normalClipRight: "0%", asciiClipLeft: "0%" };
        }
        updateData.styles.removeScanned = "true";
      }
      updates.push(updateData);
    });

    // WRITE PHASE
    updates.forEach(({ wrapper, styles }) => {
      const normalCard = wrapper.querySelector(".card-normal") as HTMLElement | null;
      const asciiCard = wrapper.querySelector(".card-ascii") as HTMLElement | null;

      if (normalCard && styles.normalClipRight !== undefined) normalCard.style.setProperty("--clip-right", styles.normalClipRight as string);
      if (asciiCard && styles.asciiClipLeft !== undefined) asciiCard.style.setProperty("--clip-left", styles.asciiClipLeft as string);

      if (styles.setScanned) wrapper.setAttribute("data-scanned", "true");
      if (styles.removeScanned) wrapper.removeAttribute("data-scanned");
    });

    this.scanner.setScanningActive(anyScanningActive);
  }

  updateAsciiContent() {
    const contents = this.cardLine.querySelectorAll(".ascii-content");
    contents.forEach((content) => {
      if (Math.random() < 0.15) {
        const { width, height } = calculateCodeDimensions(400, 250);
        content.textContent = generateCode(width, height);
      }
    });
  }

  updateSpeedIndicator() {
    if (this.speedIndicator) {
      this.speedIndicator.textContent = Math.round(this.velocity).toString();
    }
  }

  startPeriodicUpdates() {
    this.autoInterval = setInterval(() => { this.updateAsciiContent(); }, 200);
    const updateClipping = () => {
      this.updateCardClipping();
      requestAnimationFrame(updateClipping);
    };
    updateClipping();
  }

  toggleAnimation() {
    this.isAnimating = !this.isAnimating;
  }

  resetPosition() {
    this.position = this.containerWidth;
    this.velocity = 120;
    this.direction = -1;
    this.isAnimating = true;
    this.isDragging = false;
    this.cardLine.style.animation = "none";
    this.cardLine.style.transform = `translateX(${this.position}px)`;
    this.cardLine.classList.remove("dragging");
    this.updateSpeedIndicator();
  }

  changeDirection() {
    this.direction *= -1;
    this.updateSpeedIndicator();
  }

  destroy() {
    if (this.autoInterval) clearInterval(this.autoInterval);
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("mouseup", this.endDrag);
    document.removeEventListener("touchmove", this.onDrag as EventListener);
    document.removeEventListener("touchend", this.endDrag);
    this.cardLine.removeEventListener("mousedown", this.startDrag);
    this.cardLine.removeEventListener("wheel", this.onWheel);
  }
}
