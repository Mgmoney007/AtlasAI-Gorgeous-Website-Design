import * as THREE from 'three';

export class ParticleSystem {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  particles: THREE.Points | null = null;
  particleCount = 400;
  velocities: Float32Array | null = null;
  alphas: Float32Array | null = null;
  texture: THREE.CanvasTexture | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    const w = window.innerWidth;

    this.camera = new THREE.OrthographicCamera(
      -w / 2, w / 2, 125, -125, 1, 1000
    );
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(w, 250);
    this.renderer.setClearColor(0x000000, 0);

    this.createParticles(w);
    this.animate();
    window.addEventListener("resize", this.onWindowResize);
  }

  createParticles(width: number) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    const velocities = new Float32Array(this.particleCount);

    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d")!;
    const half = canvas.width / 2;
    const hue = 217;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, "#fff");
    gradient.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
    gradient.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    this.texture = texture;
    texture.flipY = false;

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
      const orbitRadius = Math.random() * 200 + 100;
      sizes[i] = (Math.random() * (orbitRadius - 60) + 60) / 8;
      velocities[i] = Math.random() * 60 + 30;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    this.velocities = velocities;

    const alphas = new Float32Array(this.particleCount);
    for (let i = 0; i < this.particleCount; i++) {
      alphas[i] = (Math.random() * 8 + 2) / 10;
    }
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    this.alphas = alphas;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: texture },
        size: { value: 15.0 }
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        varying vec3 vColor;
        uniform float size;
        void main() {
          vAlpha = alpha;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene!.add(this.particles);
  }

  animate = () => {
    if (!this.renderer) return;
    requestAnimationFrame(this.animate);
    if (this.particles && this.velocities && this.alphas) {
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.001;
      const w = window.innerWidth;

      for (let i = 0; i < this.particleCount; i++) {
        positions[i * 3] += this.velocities[i] * 0.016;
        if (positions[i * 3] > w / 2 + 100) {
          positions[i * 3] = -w / 2 - 100;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
        }
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
        const twinkle = Math.floor(Math.random() * 10);
        if (twinkle === 1 && this.alphas[i] > 0) this.alphas[i] -= 0.05;
        else if (twinkle === 2 && this.alphas[i] < 1) this.alphas[i] += 0.05;
        this.alphas[i] = Math.max(0, Math.min(1, this.alphas[i]));
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.geometry.attributes.alpha.needsUpdate = true;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  onWindowResize = () => {
    if (this.camera && this.renderer) {
      const w = window.innerWidth;
      this.camera.left = -w / 2;
      this.camera.right = w / 2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, 250);
    }
  };

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.particles) {
      this.particles.geometry.dispose();
      if (Array.isArray(this.particles.material)) {
        this.particles.material.forEach(m => m.dispose());
      } else {
        (this.particles.material as THREE.Material).dispose();
      }
    }
    if (this.texture) {
      this.texture.dispose();
    }
    window.removeEventListener("resize", this.onWindowResize);
  }
}
