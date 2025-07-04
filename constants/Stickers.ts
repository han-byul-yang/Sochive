// 스티커 카테고리 정의
export const STICKER_CATEGORIES = [
  { id: "kitschPop", label: "Kitsch Pop", icon: "favorite" },
  { id: "vintageCottage", label: "Vintage Cottage", icon: "favorite" },
  { id: "greenZing", label: "Green Zing", icon: "favorite" },
  { id: "metalPop", label: "Metal Pop", icon: "favorite" },
  { id: "blueHour", label: "Blue Hour", icon: "favorite" },
  { id: "sunnyMood", label: "Sunny Mood", icon: "favorite" },
  { id: "pinkBlush", label: "Pink Blush", icon: "favorite" },
  { id: "cakeSweets", label: "Cake Sweets", icon: "favorite" },
  { id: "floralLetter", label: "Floral Letter", icon: "favorite" },
  { id: "monoMidnight", label: "Mono Midnight", icon: "favorite" },
  { id: "everydayObject", label: "Everyday Object", icon: "favorite" },
  { id: "chocoDrip", label: "Choco Drip", icon: "favorite" },
] as const;

// 샘플 스티커 이미지 (실제 앱에서는 서버에서 가져오거나 로컬 에셋으로 대체)
export const SAMPLE_STICKERS = {
  kitschPop: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409805/Clipped_image_20250620_015326_tt5uqk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409805/Clipped_image_20250620_015320_xk1m2b.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409805/Clipped_image_20250620_015316_iq3agz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409805/Clipped_image_20250620_015311_qg3ixu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409805/Clipped_image_20250620_015307_zbszot.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409804/Clipped_image_20250620_015259_mplpth.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409804/Clipped_image_20250620_015253_nwvalr.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409804/Clipped_image_20250620_015256_nty1sy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409804/Clipped_image_20250620_015250_uuhkzd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409804/Clipped_image_20250620_015247_zfqxsv.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409792/Clipped_image_20250620_015244_ecxuie.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409792/Clipped_image_20250620_015237_aoprho.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409792/Clipped_image_20250620_015220_xxp101.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409792/Clipped_image_20250620_015225_eocwii.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409791/Clipped_image_20250620_015156_jkyqyf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409791/Clipped_image_20250620_015215_nhjklk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409791/Clipped_image_20250620_015209_nvhpqa.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409791/Clipped_image_20250620_015151_txldna.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409791/Clipped_image_20250620_015203_llsldc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_015145_lnrr2g.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_015141_vjqikk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_015110_osrdze.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_014234_m2jn6f.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409789/Clipped_image_20250620_014202_d1suoj.png",
  ],
  vintageCottage: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409892/Clipped_image_20250620_015454_vsjgpy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409885/Clipped_image_20250620_015452_wvlgcw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409884/Clipped_image_20250620_015445_ovne6w.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409884/Clipped_image_20250620_015448_aryd11.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409883/Clipped_image_20250620_015437_tfh3x1.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409883/Clipped_image_20250620_015441_c5znys.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409883/Clipped_image_20250620_015435_nzixws.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409883/Clipped_image_20250620_015430_f4kwi6.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409876/Clipped_image_20250620_015419_zo1p3a.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409876/Clipped_image_20250620_015405_nhuznl.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409876/Clipped_image_20250620_015410_r7gobi.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409875/Clipped_image_20250620_015402_uvxhtj.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409875/Clipped_image_20250620_015348_lxpo2n.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409875/Clipped_image_20250620_015355_fa7kqf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409867/Clipped_image_20250620_015346_o5gprq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409866/Clipped_image_20250620_015342_mbobpl.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409866/Clipped_image_20250620_015344_chrnfo.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409866/Clipped_image_20250620_015339_ldn67o.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409866/Clipped_image_20250620_015337_tjlxu5.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409866/Clipped_image_20250620_015335_kiyjku.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409865/Clipped_image_20250620_015330_kotlme.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409865/Clipped_image_20250620_015333_gotjox.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411365/Clipped_image_20250620_022734_qheyqu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022712_yuc7k5.png",
  ],
  metalPop: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410033/Clipped_image_20250620_021914_mxgwa7.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410033/Clipped_image_20250620_021912_teykvp.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410032/Clipped_image_20250620_021903_fqtl53.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410023/Clipped_image_20250620_021857_uligg0.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410023/Clipped_image_20250620_021854_croii2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410022/Clipped_image_20250620_021849_fxjzmm.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410022/Clipped_image_20250620_021843_bqctde.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410022/Clipped_image_20250620_021838_kqrnw6.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410021/Clipped_image_20250620_021835_cb6r0n.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410013/Clipped_image_20250620_021832_h29dem.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410012/Clipped_image_20250620_021815_jdhdxm.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410011/Clipped_image_20250620_021810_znze3q.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410011/Clipped_image_20250620_021807_rlrvxd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410011/Clipped_image_20250620_021802_erpxf3.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410010/Clipped_image_20250620_015804_ym3qpq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410004/Clipped_image_20250620_015646_szqprd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410003/Clipped_image_20250620_015635_bmlz6y.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410003/Clipped_image_20250620_015628_pndieq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410002/Clipped_image_20250620_015626_aqctqz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410002/Clipped_image_20250620_015622_la9gyz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409995/Clipped_image_20250620_015619_cyr8gx.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409995/Clipped_image_20250620_015617_gcqead.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409994/Clipped_image_20250620_015543_xvpq8b.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409994/Clipped_image_20250620_015541_wupnwu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409985/Clipped_image_20250620_015539_l2kyry.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409984/Clipped_image_20250620_015535_zgymyw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409984/Clipped_image_20250620_015530_o5hflz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409984/Clipped_image_20250620_015528_z6ithv.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409983/Clipped_image_20250620_015519_wr2kwj.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409983/Clipped_image_20250620_015514_x436d1.png",
  ],
  greenZing: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410571/Clipped_image_20250620_021753_vv5vl7.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410570/Clipped_image_20250620_021750_sppggn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410570/Clipped_image_20250620_021746_booyqc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410570/Clipped_image_20250620_021748_cmc6gf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410563/Clipped_image_20250620_021742_uvjglb.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410563/Clipped_image_20250620_021740_siccqo.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410562/Clipped_image_20250620_021730_ebokwh.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410562/Clipped_image_20250620_021727_xgjnrs.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410561/Clipped_image_20250620_021724_ms9lpe.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410556/Clipped_image_20250620_021721_u75u5l.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410555/Clipped_image_20250620_021719_mszair.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410554/Clipped_image_20250620_021717_jrcgbx.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410548/Clipped_image_20250620_021712_p1tuod.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410546/Clipped_image_20250620_020640_fed0te.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410546/Clipped_image_20250620_020636_nnr3na.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410546/Clipped_image_20250620_020634_vnfc9a.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410546/Clipped_image_20250620_020629_sdyltm.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410545/Clipped_image_20250620_020613_cufqt1.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410545/Clipped_image_20250620_020610_zhfej2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410538/Clipped_image_20250620_020550_i143qc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410538/Clipped_image_20250620_020547_nbjttn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410535/Clipped_image_20250620_020543_duzowc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410535/Clipped_image_20250620_020536_gmoee2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410535/Clipped_image_20250620_020541_haxwsd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410534/Clipped_image_20250620_020533_rvivt5.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410534/Clipped_image_20250620_020531_bbgzxc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410534/Clipped_image_20250620_020528_s2fqxo.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_014222_alzgwp.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_014241_mnhrjw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750409790/Clipped_image_20250620_014238_qzxikm.png",
  ],
  blueHour: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410454/Clipped_image_20250620_020151_bxxoej.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410454/Clipped_image_20250620_020138_cfacqu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410453/Clipped_image_20250620_020136_lkywrk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410453/Clipped_image_20250620_020132_yec0rg.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410445/Clipped_image_20250620_020018_ir2qs9.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410444/Clipped_image_20250620_020129_aiogpw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410444/Clipped_image_20250620_020114_ec3nhh.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410444/Clipped_image_20250620_020106_zi1kqu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410444/Clipped_image_20250620_020103_ycexyj.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410444/Clipped_image_20250620_020022_arrnmk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410444/Clipped_image_20250620_020033_ztwbnu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410443/Clipped_image_20250620_020015_ywykrs.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410443/Clipped_image_20250620_015956_jegehk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015953_xi7czc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015950_chirez.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015947_xilaka.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015942_rq4kfn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015911_v1twsh.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015938_myhfdp.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015904_itm276.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410431/Clipped_image_20250620_015932_afgoxw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015929_nasyeh.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015847_kw4wjd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015840_jwbjup.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015834_ra3l2x.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015837_dva0ub.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410430/Clipped_image_20250620_015829_ek8djd.png",
  ],
  sunnyMood: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410702/Clipped_image_20250620_020814_oreslr.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410702/Clipped_image_20250620_020812_vifra1.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410702/Clipped_image_20250620_020809_gytmem.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410701/Clipped_image_20250620_020807_ebsine.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410701/Clipped_image_20250620_020804_nhmctf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410691/Clipped_image_20250620_020802_qowwcy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410689/Clipped_image_20250620_020800_xnixf2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410689/Clipped_image_20250620_020757_aubvvk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410688/Clipped_image_20250620_020754_oud5xn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410688/Clipped_image_20250620_020752_adhzb0.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410688/Clipped_image_20250620_020750_wfljdq.png",
  ],
  pinkBlush: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410830/Clipped_image_20250620_021044_gpjusd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410830/Clipped_image_20250620_021037_braroa.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410830/Clipped_image_20250620_021034_fbrgcl.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410821/Clipped_image_20250620_021032_vrwegc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410818/Clipped_image_20250620_021017_pnbsmn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410817/Clipped_image_20250620_021005_mursme.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410816/Clipped_image_20250620_020955_oenqlp.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410806/Clipped_image_20250620_020933_j2peql.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410805/Clipped_image_20250620_020928_wt7lfc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410805/Clipped_image_20250620_020925_aeuupw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410805/Clipped_image_20250620_020920_koflf3.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410791/Clipped_image_20250620_020917_iq3mal.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410788/Clipped_image_20250620_020913_j7x1mf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410788/Clipped_image_20250620_020911_lyos8d.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410788/Clipped_image_20250620_020902_lnccji.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410778/Clipped_image_20250620_020855_fmkhak.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410778/Clipped_image_20250620_020850_jr8a92.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410777/Clipped_image_20250620_020847_ixtikx.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410767/Clipped_image_20250620_020842_oisduv.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410767/Clipped_image_20250620_020837_evqygb.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410766/Clipped_image_20250620_020835_dgqjwb.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410766/Clipped_image_20250620_020833_kkaxkr.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410754/Clipped_image_20250620_020831_psbukj.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410753/Clipped_image_20250620_020829_r15i3a.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410753/Clipped_image_20250620_020825_qtecle.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410752/Clipped_image_20250620_020823_vxnq6c.png",
  ],
  cakeSweets: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410928/Clipped_image_20250620_021528_kqinfy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410927/Clipped_image_20250620_021526_fvwhbk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410927/Clipped_image_20250620_021524_fa8gpx.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410913/Clipped_image_20250620_021522_fp8oeq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410913/Clipped_image_20250620_021520_iacnjo.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410912/Clipped_image_20250620_021513_kkvd8p.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410912/Clipped_image_20250620_021511_l554ws.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410902/Clipped_image_20250620_021506_qdagad.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410901/Clipped_image_20250620_021505_vpwbdl.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410900/Clipped_image_20250620_021502_czd6kf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410887/Clipped_image_20250620_021500_fs1ppe.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410887/Clipped_image_20250620_021457_enjdtu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410886/Clipped_image_20250620_021449_ety3uk.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410886/Clipped_image_20250620_021447_a3dt7n.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410873/Clipped_image_20250620_021441_jxrdvx.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410872/Clipped_image_20250620_021437_hsruxf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410872/Clipped_image_20250620_021435_xjojip.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410871/Clipped_image_20250620_021432_ursgyc.png",
  ],
  floralLetter: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411048/Clipped_image_20250620_021637_wdufdw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411037/Clipped_image_20250620_021635_gznpc0.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411033/Clipped_image_20250620_021633_nvomyr.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411033/Clipped_image_20250620_021629_mkptct.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411032/Clipped_image_20250620_021627_viks2w.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411016/Clipped_image_20250620_021616_e9bwx5.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411003/Clipped_image_20250620_021605_gfkj49.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411021/Clipped_image_20250620_021623_jqbplt.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411017/Clipped_image_20250620_021621_zb3qdz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411016/Clipped_image_20250620_021619_g0vfxu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411004/Clipped_image_20250620_021614_li8620.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411003/Clipped_image_20250620_021605_gfkj49.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411002/Clipped_image_20250620_021603_zobwjy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410990/Clipped_image_20250620_021601_j3or52.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410985/Clipped_image_20250620_021553_xaf70s.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410984/Clipped_image_20250620_021549_fxtdme.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410973/Clipped_image_20250620_021547_vu2jfd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410968/Clipped_image_20250620_021544_d9hcia.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410967/Clipped_image_20250620_021538_qgkada.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750410967/Clipped_image_20250620_021534_tzgm7e.png",
  ],
  monoMidnight: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411132/Clipped_image_20250620_022108_ucgcew.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411132/Clipped_image_20250620_022104_sjvujm.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411120/Clipped_image_20250620_022036_lojkvs.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411116/Clipped_image_20250620_022032_vk59do.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411116/Clipped_image_20250620_022011_vvus0c.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411115/Clipped_image_20250620_022001_bqnjy1.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411104/Clipped_image_20250620_021939_miuw1u.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411104/Clipped_image_20250620_021932_cf70r3.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411103/Clipped_image_20250620_021930_yje7va.png",
  ],
  everydayObject: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411365/Clipped_image_20250620_022741_xjsqu7.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411365/Clipped_image_20250620_022736_s7lvcf.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411365/Clipped_image_20250620_022726_qqvy1h.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411365/Clipped_image_20250620_022729_pq1zne.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411365/Clipped_image_20250620_022732_hsgypz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022724_os6eux.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022701_rytuux.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022722_r6k7qq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022657_smjym3.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022654_rrsctm.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022638_wwsdko.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411348/Clipped_image_20250620_022636_kz5vgw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411347/Clipped_image_20250620_022634_hfmc3d.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411347/Clipped_image_20250620_022644_eyrb4c.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411347/Clipped_image_20250620_022632_v4u53d.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411333/Clipped_image_20250620_022625_rrpluc.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411333/Clipped_image_20250620_022622_hsbols.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411333/Clipped_image_20250620_022615_bo07oq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411332/Clipped_image_20250620_022620_v8wfav.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411332/Clipped_image_20250620_022601_lrslem.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411332/Clipped_image_20250620_022617_jg5i7c.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411332/Clipped_image_20250620_022612_trhyae.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411332/Clipped_image_20250620_022605_jnutba.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411331/Clipped_image_20250620_022559_nmvkgd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411331/Clipped_image_20250620_022603_mu1i63.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411331/Clipped_image_20250620_022557_d8p2m8.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411331/Clipped_image_20250620_022555_qwxhct.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411321/Clipped_image_20250620_022553_fxqbzd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411321/Clipped_image_20250620_022548_o60evv.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022541_seeotp.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022534_em6flv.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022544_eny2aq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022520_izxxr8.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022536_gklvrw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022522_kbkgqg.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411320/Clipped_image_20250620_022516_cjmcix.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411310/Clipped_image_20250620_022514_wavcll.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411310/Clipped_image_20250620_022507_aepxqa.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411309/Clipped_image_20250620_022505_hojjdn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411309/Clipped_image_20250620_022502_czy7v2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411309/Clipped_image_20250620_022459_ahusmy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411308/Clipped_image_20250620_022449_wun92p.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411308/Clipped_image_20250620_022453_ghskat.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411308/Clipped_image_20250620_022446_w4kzzs.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411308/Clipped_image_20250620_022444_jmumpy.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411296/Clipped_image_20250620_022440_prm09k.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411296/Clipped_image_20250620_022437_ytyjs5.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411296/Clipped_image_20250620_022442_zlavsl.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411296/Clipped_image_20250620_022431_fpabqw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411296/Clipped_image_20250620_022423_stpkbt.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411296/Clipped_image_20250620_022425_kzvw2h.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411295/Clipped_image_20250620_022421_latusb.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411295/Clipped_image_20250620_022414_egccet.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411295/Clipped_image_20250620_022416_lmvvor.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411295/Clipped_image_20250620_022412_at3weo.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411295/Clipped_image_20250620_022409_hm9zp3.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411294/Clipped_image_20250620_022407_b3boar.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411294/Clipped_image_20250620_022404_c6s6ad.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411294/Clipped_image_20250620_022406_ldaurh.png",
  ],
  chocoDrip: [
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411637/Clipped_image_20250620_023254_tlpyxj.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411637/Clipped_image_20250620_023249_cag2zu.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411637/Clipped_image_20250620_023242_jxsupq.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411637/Clipped_image_20250620_023245_mocu07.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411637/Clipped_image_20250620_023240_xnuhrj.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411637/Clipped_image_20250620_023238_nhh4ib.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411636/Clipped_image_20250620_023224_og4krp.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023220_zsuomd.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023210_wlq5io.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023217_awpke0.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023214_mtti6e.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023202_qjbfci.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023159_t3g4yz.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411624/Clipped_image_20250620_023155_adotl2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411623/Clipped_image_20250620_023151_hdcjrl.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411623/Clipped_image_20250620_023143_pudwqw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411612/Clipped_image_20250620_023135_iiudw7.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411612/Clipped_image_20250620_023127_olnbm2.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411612/Clipped_image_20250620_023129_kb6uuw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411612/Clipped_image_20250620_023120_jex17m.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411612/Clipped_image_20250620_023125_jomdrn.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411611/Clipped_image_20250620_023118_uojogm.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411611/Clipped_image_20250620_023116_vyhkzo.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411611/Clipped_image_20250620_023114_kdkttr.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411611/Clipped_image_20250620_023112_iwbm66.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411611/Clipped_image_20250620_023109_mhf4al.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411611/Clipped_image_20250620_023106_uylc4a.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411598/Clipped_image_20250620_023055_zgbykt.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411598/Clipped_image_20250620_023105_iklxym.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411597/Clipped_image_20250620_023035_u0s4u7.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411597/Clipped_image_20250620_023049_pwqaf7.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411597/Clipped_image_20250620_023045_dt46mb.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411597/Clipped_image_20250620_023039_dekop6.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411597/Clipped_image_20250620_023030_sxn28s.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411597/Clipped_image_20250620_023028_ydpfoe.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411596/Clipped_image_20250620_023027_ovpd69.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411596/Clipped_image_20250620_023023_mueffw.png",
    "https://res.cloudinary.com/ddcuocopj/image/upload/v1750411596/Clipped_image_20250620_023021_mebsf3.png",
  ],
};
