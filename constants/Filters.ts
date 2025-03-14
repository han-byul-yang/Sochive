// 필터 카테고리 및 필터 목록
export const FILTER_CATEGORIES = [
  { id: "basic", name: "기본" },
  { id: "vintage", name: "빈티지" },
  { id: "mono", name: "모노톤" },
  { id: "warm", name: "따뜻한" },
  { id: "cool", name: "차가운" },
  { id: "bright", name: "밝게" },
];

// 필터 데이터
export const FILTERS = {
  basic: [
    { id: "normal", name: "원본", value: "normal" },
    { id: "brightness", name: "밝게", value: "brightness" },
    { id: "contrast", name: "대비", value: "contrast" },
  ],
  vintage: [
    { id: "sepia", name: "세피아", value: "sepia" },
    { id: "vignette", name: "비네트", value: "vignette" },
    { id: "oldfilm", name: "오래된 필름", value: "oldfilm" },
  ],
  mono: [
    { id: "grayscale", name: "흑백", value: "grayscale" },
    { id: "blackwhite", name: "흑백 강조", value: "blackwhite" },
    { id: "noir", name: "누아르", value: "noir" },
  ],
  warm: [
    { id: "warm1", name: "따뜻함 1", value: "warm1" },
    { id: "warm2", name: "따뜻함 2", value: "warm2" },
    { id: "warm3", name: "따뜻함 3", value: "warm3" },
  ],
  cool: [
    { id: "cool1", name: "차가움 1", value: "cool1" },
    { id: "cool2", name: "차가움 2", value: "cool2" },
    { id: "cool3", name: "차가움 3", value: "cool3" },
  ],
  bright: [{ id: "highteen", name: "하이틴 1", value: "highteen" }],
};
