// --- Laptop rotation by drag + smooth return ---
const laptop = document.querySelector(".laptop");

if (laptop) {
  const startRotX = -120;
  const startRotZ = 180;
  const minRotX = -180;
  const maxRotX = 0;
  const dragSpeed = 0.7;
  const idleSpeed = 45;
  const returnSpeed = 5;
  const snapThreshold = 0.15;

  let isDragging = false;
  let isReturning = false;
  let lastX = 0;
  let lastY = 0;
  let rotX = startRotX;
  let rotZ = startRotZ;
  let lastFrameTime = performance.now();

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const wrapAngle = (angle) => {
    const wrapped = angle % 360;
    return wrapped < 0 ? wrapped + 360 : wrapped;
  };

  const shortestAngleDelta = (from, to) => ((to - from + 540) % 360) - 180;

  const renderLaptop = () => {
    laptop.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
  };

  const stopDragging = () => {
    if (!isDragging) return;

    isDragging = false;
    isReturning = true;
    laptop.classList.remove("dragging");
  };

  const animateLaptop = (now) => {
    const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    if (!isDragging) {
      if (isReturning) {
        const easing = 1 - Math.exp(-returnSpeed * deltaTime);
        rotX += (startRotX - rotX) * easing;
        rotZ += shortestAngleDelta(rotZ, startRotZ) * easing;

        if (
          Math.abs(rotX - startRotX) < snapThreshold &&
          Math.abs(shortestAngleDelta(rotZ, startRotZ)) < snapThreshold
        ) {
          rotX = startRotX;
          rotZ = startRotZ;
          isReturning = false;
        }
      } else {
        rotZ = wrapAngle(rotZ + idleSpeed * deltaTime);
      }

      renderLaptop();
    }

    requestAnimationFrame(animateLaptop);
  };

  laptop.addEventListener("mousedown", (event) => {
    isDragging = true;
    isReturning = false;
    lastX = event.clientX;
    lastY = event.clientY;

    laptop.classList.add("dragging");
    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    rotZ = wrapAngle(rotZ + dx * dragSpeed);
    rotX = clamp(rotX - dy * dragSpeed, minRotX, maxRotX);

    lastX = event.clientX;
    lastY = event.clientY;

    renderLaptop();
  });

  document.addEventListener("mouseup", () => {
    stopDragging();
  });

  renderLaptop();
  requestAnimationFrame(animateLaptop);
}
