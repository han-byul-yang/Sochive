// 배경 카테고리 정의
export const BACKGROUND_CATEGORIES = [
  { id: "lovely", label: "Lovely", icon: "favorite" },
  { id: "bling", label: "Bling", icon: "favorite" },
  { id: "pattern", label: "Pattern", icon: "palette" },
  { id: "pattern2", label: "Pattern2", icon: "camera" },
  { id: "fabric", label: "Fabric", icon: "favorite" },
  { id: "pastel", label: "Pastel", icon: "favorite" },
  { id: "simple", label: "Simple", icon: "favorite" },
] as const;

// 샘플 배경 이미지 (실제 앱에서는 서버에서 가져오거나 로컬 에셋으로 대체)
export const SAMPLE_BACKGROUNDS = {
  lovely: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152706/KakaoTalk_20250606_033729754_05_ymvedb.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_08_djf9ik.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152705/KakaoTalk_20250606_033729754_nht6ye.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152706/KakaoTalk_20250606_033729754_04_jbdgsv.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152705/KakaoTalk_20250606_033729754_01_mqeaol.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_06_cuwen9.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152708/KakaoTalk_20250606_033729754_24_qopns0.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152708/KakaoTalk_20250606_033729754_25_iwwvte.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152709/KakaoTalk_20250606_033729754_27_gbuslx.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152709/KakaoTalk_20250606_033729754_28_ayjxkw.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153329/KakaoTalk_20250606_033734859_02_u2xbl5.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153370/KakaoTalk_20250606_033734859_29_ywyf9c.jpg",
  ],
  bling: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152705/KakaoTalk_20250606_033729754_17_dydats.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152706/KakaoTalk_20250606_033729754_03_v61ib1.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152706/KakaoTalk_20250606_033729754_19_ff56d9.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_21_tetzmy.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_22_bqqn9u.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_07_vqzsit.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152708/KakaoTalk_20250606_033729754_23_dgjqne.jpg",
  ],
  pattern: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153357/KakaoTalk_20250606_033734859_24_ixk7ps.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153365/KakaoTalk_20250606_033734859_26_hci3mm.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153345/KakaoTalk_20250606_033734859_17_emnouo.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153344/KakaoTalk_20250606_033734859_15_b1x5uv.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153344/KakaoTalk_20250606_033734859_16_rhmcmw.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153350/KakaoTalk_20250606_033734859_18_m6cwzb.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153343/KakaoTalk_20250606_033734859_14_bd2ds6.jpg",
  ],
  pattern2: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153339/KakaoTalk_20250606_033734859_12_ejsszk.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153337/KakaoTalk_20250606_033734859_09_dyljh2.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153338/KakaoTalk_20250606_033734859_11_stmwtw.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153337/KakaoTalk_20250606_033734859_10_u8c07i.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153337/KakaoTalk_20250606_033734859_08_bzhlo2.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153331/KakaoTalk_20250606_033734859_07_rrvx7d.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153343/KakaoTalk_20250606_033734859_13_duvb7h.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153329/KakaoTalk_20250606_033734859_01_jgrwwa.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153329/KakaoTalk_20250606_033734859_mvjmrg.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152705/KakaoTalk_20250606_033729754_02_hxkvzo.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152705/KakaoTalk_20250606_033729754_16_lfl2cf.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153330/KakaoTalk_20250606_033734859_04_q9vihz.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153329/KakaoTalk_20250606_033734859_05_vc6vwc.jpg",
  ],
  fabric: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153356/KakaoTalk_20250606_033734859_21_rcdyoe.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153351/KakaoTalk_20250606_033734859_20_as3yyy.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153350/KakaoTalk_20250606_033734859_19_cpkosv.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152706/KakaoTalk_20250606_033729754_15_hbrwog.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152708/KakaoTalk_20250606_033729754_11_nenuru.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152708/KakaoTalk_20250606_033729754_10_iyfyzd.jpg",
  ],
  pastel: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153365/KakaoTalk_20250606_033734859_27_na23a2.jpg",
  ],
  simple: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153357/KakaoTalk_20250606_033734859_23_djhuns.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_09_muyyde.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152707/KakaoTalk_20250606_033729754_20_luk9bf.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749152708/KakaoTalk_20250606_033729754_13_cslhqt.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153356/KakaoTalk_20250606_033734859_22_dnomi2.jpg",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1749153365/KakaoTalk_20250606_033734859_28_flw1yx.jpg",
  ],
};
