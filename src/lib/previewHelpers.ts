export type ImageAlphaBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Computes the opaque (alpha) bounding box of `img` as fractions of its
 * natural dimensions. Used to derive a printable text area from a layer mask.
 * Returns `undefined` when the image has no visible pixels.
 */
export const getImageAlphaBounds = (
  img: HTMLImageElement,
): ImageAlphaBounds | undefined => {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return undefined;

  const canvas = document.createElement("canvas");
  canvas.width = iw;
  canvas.height = ih;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.drawImage(img, 0, 0, iw, ih);

  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(0, 0, iw, ih);
  } catch {
    return undefined;
  }

  const pixels = imageData.data;
  let minX = iw;
  let minY = ih;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < ih; y++) {
    for (let x = 0; x < iw; x++) {
      const alpha = pixels[(y * iw + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return undefined;

  return {
    left: minX / iw,
    top: minY / ih,
    width: (maxX - minX + 1) / iw,
    height: (maxY - minY + 1) / ih,
  };
};

type DrawFittedParams = {
  targetCtx: CanvasRenderingContext2D;
  img: HTMLImageElement;
  offsetX: number;
  offsetY: number;
  drawnW: number;
  drawnH: number;
};

export const drawFitted = ({
  targetCtx,
  img,
  offsetX,
  offsetY,
  drawnW,
  drawnH,
}: DrawFittedParams) => {
  if (!img.naturalWidth || !img.naturalHeight) return;
  targetCtx.drawImage(img, offsetX, offsetY, drawnW, drawnH);
};

const MAX_DPR = 2;

const getEffectiveDpr = (dpr: number) => Math.min(dpr || 1, MAX_DPR);

type DrawUploadIntoLayerBoundsParams = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layerImg: HTMLImageElement;
  uploadImg: HTMLImageElement;
  dpr: number;
  cw: number;
  ch: number;
  offsetX: number;
  offsetY: number;
  drawnW: number;
  drawnH: number;
};

export const drawUploadIntoLayerBounds = async ({
  canvas,
  ctx,
  layerImg,
  uploadImg,
  dpr,
  cw,
  ch,
  offsetX,
  offsetY,
  drawnW,
  drawnH,
}: DrawUploadIntoLayerBoundsParams) => {
  const effDpr = getEffectiveDpr(dpr);

  // Work in a smaller offscreen canvas (capped DPR) to limit memory.
  const offW = Math.max(1, Math.round(cw * effDpr));
  const offH = Math.max(1, Math.round(ch * effDpr));
  const offscreen = document.createElement("canvas");
  offscreen.width = offW;
  offscreen.height = offH;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return;

  offCtx.setTransform(effDpr, 0, 0, effDpr, 0, 0);

  offCtx.clearRect(0, 0, cw, ch);
  offCtx.globalCompositeOperation = "source-over";
  drawFitted({
    targetCtx: offCtx,
    img: layerImg,
    offsetX,
    offsetY,
    drawnW,
    drawnH,
  });

  // Only read the region that actually contains the layer (bounded by the
  // drawn image area), not the whole canvas. This keeps getImageData small.
  const fx = Math.max(0, Math.round(offsetX * effDpr));
  const fy = Math.max(0, Math.round(offsetY * effDpr));
  const fw = Math.max(1, Math.round(drawnW * effDpr));
  const fh = Math.max(1, Math.round(drawnH * effDpr));

  const imageData = offCtx.getImageData(fx, fy, fw, fh);
  const pixels = imageData.data;

  let minX = fw,
    minY = fh,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < fh; y++) {
    for (let x = 0; x < fw; x++) {
      const alpha = pixels[(y * fw + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX <= minX || maxY <= minY) return;

  const bx = offsetX + minX / effDpr;
  const by = offsetY + minY / effDpr;
  const bw = (maxX - minX + 1) / effDpr;
  const bh = (maxY - minY + 1) / effDpr;

  offCtx.clearRect(0, 0, cw, ch);

  const uiw = uploadImg.naturalWidth;
  const uih = uploadImg.naturalHeight;

  const uScale = Math.min(bw / uiw, bh / uih);
  const udw = uiw * uScale;
  const udh = uih * uScale;

  const ux = bx + (bw - udw) / 2;
  const uy = by + (bh - udh) / 2;

  offCtx.drawImage(uploadImg, ux, uy, udw, udh);

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
  ctx.restore();
};

type DrawTintedLayerParams = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layerImg: HTMLImageElement;
  tintHex: string;
  dpr: number;
  cw: number;
  ch: number;
  offsetX: number;
  offsetY: number;
  drawnW: number;
  drawnH: number;
};

export const drawTintedLayer = async ({
  canvas,
  ctx,
  layerImg,
  tintHex,
  dpr,
  cw,
  ch,
  offsetX,
  offsetY,
  drawnW,
  drawnH,
}: DrawTintedLayerParams) => {
  const effDpr = getEffectiveDpr(dpr);

  // Work in a smaller offscreen canvas (capped DPR) to limit memory.
  const offW = Math.max(1, Math.round(cw * effDpr));
  const offH = Math.max(1, Math.round(ch * effDpr));
  const offscreen = document.createElement("canvas");
  offscreen.width = offW;
  offscreen.height = offH;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return;

  offCtx.setTransform(effDpr, 0, 0, effDpr, 0, 0);

  offCtx.globalCompositeOperation = "source-over";
  drawFitted({
    targetCtx: offCtx,
    img: layerImg,
    offsetX,
    offsetY,
    drawnW,
    drawnH,
  });

  offCtx.globalCompositeOperation = "source-in";
  offCtx.fillStyle = tintHex;
  offCtx.fillRect(0, 0, cw, ch);

  offCtx.globalCompositeOperation = "multiply";
  drawFitted({
    targetCtx: offCtx,
    img: layerImg,
    offsetX,
    offsetY,
    drawnW,
    drawnH,
  });

  offCtx.globalCompositeOperation = "destination-in";
  drawFitted({
    targetCtx: offCtx,
    img: layerImg,
    offsetX,
    offsetY,
    drawnW,
    drawnH,
  });

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
  ctx.restore();
};
