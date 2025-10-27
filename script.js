const container = document.getElementById('map-container');
const wrapper = document.getElementById('map-wrapper');
const image = document.getElementById('map-image');
const markers = document.querySelectorAll('.marker');

let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX, startY;

image.onload = () => {
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  scale = Math.min(cw / iw, ch / ih);
  translateX = (cw - iw * scale) / 2;
  translateY = (ch - ih * scale) / 2;

  updateTransform();
};

function updateTransform() {
  wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  updateMarkers();
}

function updateMarkers() {
  const dampening = 0;
  markers.forEach(marker => {
    const x = parseFloat(marker.dataset.x);
    const y = parseFloat(marker.dataset.y);
    const screenX = (x + 2115) * scale + translateX;
    const screenY = (y + 3152) * scale + translateY;

    marker.style.left = `${screenX}px`;
    marker.style.top = `${screenY}px`;
    marker.style.transform = `translate(-50%, -50%) scale(${Math.pow(1 / scale, dampening)})`;
  });
}

container.addEventListener('wheel', e => {
  e.preventDefault();
  const zoomFactor = 0.1;
  const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;

  const rect = container.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - translateX;
  const offsetY = e.clientY - rect.top - translateY;

  translateX -= offsetX * (delta - 1);
  translateY -= offsetY * (delta - 1);
  scale *= delta;

  updateTransform();
});

container.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  container.classList.add('grabbing');
});

container.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  translateX += dx;
  translateY += dy;
  startX = e.clientX;
  startY = e.clientY;
  updateTransform();
});

container.addEventListener('mouseup', () => {
  isDragging = false;
  container.classList.remove('grabbing');
});

container.addEventListener('mouseleave', () => {
  isDragging = false;
  container.classList.remove('grabbing');
});
