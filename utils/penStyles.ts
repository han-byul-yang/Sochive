import { Skia } from "@shopify/react-native-skia";

export const normalPath = (points: { x: number; y: number }[]) => {
  const path = Skia.Path.Make();
  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const midPoint = {
      x: (points[i].x + points[i - 1].x) / 2,
      y: (points[i].y + points[i - 1].y) / 2,
    };
    path.quadTo(points[i - 1].x, points[i - 1].y, midPoint.x, midPoint.y);
  }

  return path;
};

export const jitterPoint = (p: { x: number; y: number }, amount = 1.5) => {
  return {
    x: p.x + (Math.random() - 0.5) * amount * 2,
    y: p.y + (Math.random() - 0.5) * amount * 2,
  };
};

export const makeSketchPath = (points: { x: number; y: number }[]) => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;

  //const jittered = points.map((p) => jitterPoint(p, 1.5));
  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }

  return path;
};

export const generateSprayDots = (
  center: { x: number; y: number },
  count = 40,
  radius = 8
) => {
  const dots = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const x = center.x + Math.cos(angle) * r;
    const y = center.y + Math.sin(angle) * r;
    dots.push({ x, y });
  }

  return dots;
};

export function makeDotLinePoints(
  points: { x: number; y: number }[],
  spacing = 6
): { x: number; y: number }[] {
  if (points.length < 2) return [];

  const dotPoints = [];
  let accDist = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    let t = 0;
    while (accDist + spacing <= segmentLength) {
      t += spacing / segmentLength;
      const x = prev.x + dx * t;
      const y = prev.y + dy * t;
      dotPoints.push({ x, y });
      accDist += spacing;
    }

    accDist = (accDist + segmentLength) % spacing;
  }

  return dotPoints;
}

export const smokeJitterPoint = (p: { x: number; y: number }, amount = 2.5) => {
  return {
    x: p.x + (Math.random() - 0.5) * amount * 2,
    y: p.y + (Math.random() - 0.5) * amount * 2,
  };
};

export const makeSmokePath = (points: { x: number; y: number }[]) => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;

  //const jittered = points.map((p) => smokeJitterPoint(p, 2.5));

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }

  return path;
};

export const makeWavePath = (
  points: { x: number; y: number }[],
  amplitude = 10, // 진폭: 얼마나 많이 흔들릴지
  frequency = 0.4 // 주기: 몇 번 흔들릴지
) => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const base = points[i];
    const offset = Math.sin(i * frequency) * amplitude;

    // x축을 흔들면 wave가 좌우로
    path.lineTo(base.x + offset, base.y);

    // y축을 흔들면 위아래 물결
    // path.lineTo(base.x, base.y + offset);
  }

  return path;
};

export function makeDoubleLinePath(
  points: { x: number; y: number }[],
  offset = 2.5
): { path1: any; path2: any } {
  const path1 = Skia.Path.Make();
  const path2 = Skia.Path.Make();

  if (points.length === 0) return { path1, path2 };

  // 기준 경로에서 좌우 offset 적용
  path1.moveTo(points[0].x - offset, points[0].y - offset);
  path2.moveTo(points[0].x + offset, points[0].y + offset);

  for (let i = 1; i < points.length; i++) {
    path1.lineTo(points[i].x - offset, points[i].y - offset);
    path2.lineTo(points[i].x + offset, points[i].y + offset);
  }

  return { path1, path2 };
}

export function makeAngleBasedPath(
  points: { x: number; y: number }[],
  minWidth = 2,
  maxWidth = 10
): { paths: any[]; widths: number[] } {
  const paths: any[] = [];
  const widths: number[] = [];

  if (points.length < 2) return { paths, widths };

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;

    const ratio = Math.abs(dy) / (Math.abs(dx) + Math.abs(dy) + 1e-5); // 0~1
    const stroke = minWidth + (maxWidth - minWidth) * ratio;

    const p = Skia.Path.Make();
    p.moveTo(prev.x, prev.y);
    p.lineTo(curr.x, curr.y);

    paths.push(p);
    widths.push(stroke);
  }

  return { paths, widths };
}

export function makeOutlinePath(points: { x: number; y: number }[]) {
  const basePath = Skia.Path.Make();

  if (points.length === 0) return basePath;

  basePath.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    basePath.lineTo(points[i].x, points[i].y);
  }

  return basePath;
}

export const penStyles: any = {
  zigzag: {
    path: "path",
    style: makeSketchPath,
  },
  // spray: {
  //   path: "circle",
  //   style: generateSprayDots,
  // },
  // dot: {
  //   path: "circle",
  //   style: makeDotLinePoints,
  // },
  smokeNormal: {
    path: "blur",
    option: "normal",
    blur: 3,
    style: makeSmokePath,
  },
  smokeSolid: {
    path: "blur",
    option: "solid",
    blur: 2,
    style: makeSmokePath,
  },
  smokeInner: {
    path: "blur",
    option: "inner",
    blur: 4,
    style: makeSmokePath,
  },
  smokeOuter: {
    path: "blur",
    option: "outer",
    blur: 5,
    style: makeSmokePath,
  },
  wave: {
    path: "path",
    style: makeWavePath,
  },
  doubleLine: {
    path: "path2",
    width1: 3,
    width2: 1,
    color1: "selectedColor",
    color2: "#ffffff",
    style: makeDoubleLinePath,
  },
  outlineWhite: {
    path: "path2",
    width1: 1,
    width2: 0.6,
    color1: "#ffffff",
    color2: "selectedColor",
    style: makeOutlinePath,
  },
  outlineColorThin: {
    path: "path2",
    width1: 3,
    width2: 0.3,
    color1: "selectedColor",
    color2: "#ffffff",
    style: makeOutlinePath,
  },
  outlineColorThick: {
    path: "path2",
    width1: 3,
    width2: 1,
    color1: "selectedColor",
    color2: "#ffffff",
    style: makeOutlinePath,
  },
};
