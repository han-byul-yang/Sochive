// 배경 카테고리 정의
export const BACKGROUND_CATEGORIES = [
  { id: "favorite", label: "Favorite", icon: "favorite" },
  { id: "hot", label: "Hot", icon: "whatshot", isActive: true },
  { id: "foundation", label: "Foundation", icon: "palette" },
  { id: "camera", label: "Camera", icon: "camera" },
  { id: "spring", label: "Spring", icon: "eco" },
] as const;

// 샘플 배경 이미지 (실제 앱에서는 서버에서 가져오거나 로컬 에셋으로 대체)
export const SAMPLE_BACKGROUNDS = {
  favorite: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591003/2b3879f32112e93b469de456cd72bfd9_wuldeu.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591003/8f1b6bd31e2db05d42259e382bf4c080_kybjyd.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591003/b5950f6e17a645ed4d3541b0e2c0e6ac_txp2ft.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591002/b79abca0fb2470ba2c9d5c06724e90bf_k5rbpe.jpg",
  ],
  hot: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591003/e4f9867012eaa4c66dd2ac09a5c70216_qmrchk.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591003/b4c17b4dbee0ae76cc330b7ae91ffd06_jeb5ui.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591002/d6e0260de6c462959df00f6d5b87fac6_wttekh.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591002/762223128229789b60a3c5bda85ac834_tmmo9e.jpg",
  ],
  foundation: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591002/352ba024ecd7cfb2d1f76a900fbe448e_qa111x.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591001/33b16a67d5e7746fff95300600ecaad4_u1o2tk.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591002/1d3ca72c6aa541ef3d9f086efcb124cc_gejt3x.jpg",
  ],
  camera: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591003/66fab719cb42a7e7cd8f0aa1c15937f8_g6pgo6.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1741591002/3969c48c08bd8f1677f134b692a506e1_lcwqrg.jpg",
  ],
  spring: Array.from(
    { length: 5 },
    (_, i) => `https://source.unsplash.com/random/300x200?spring,${i}`
  ),
};
