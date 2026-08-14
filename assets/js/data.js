/* ==========================================================================
   ALLAI — catalog data + illustration engine
   All artwork is generated as inline SVG line-art, so the mockup needs
   no external image hosting.
   ========================================================================== */

const CATEGORIES = [
  { slug: 'tops',    name: 'เสื้อ',        en: 'Tops',        garment: 'blouse' },
  { slug: 'dresses', name: 'เดรส',         en: 'Dresses',     garment: 'dress'  },
  { slug: 'skirts',  name: 'กระโปรง',      en: 'Skirts',      garment: 'skirt'  },
  { slug: 'pants',   name: 'กางเกง',       en: 'Trousers',    garment: 'pants'  },
  { slug: 'outer',   name: 'เสื้อคลุม',    en: 'Outerwear',   garment: 'coat'   },
  { slug: 'knit',    name: 'ไหมพรม',       en: 'Knitwear',    garment: 'knit'   },
  { slug: 'acc',     name: 'แอคเซสซอรี่',  en: 'Accessories', garment: 'bag'    }
];

const PALETTE = {
  blush:  { hex: '#F2BFCF', name: 'Blush Pink' },
  rose:   { hex: '#D9708E', name: 'Rose'       },
  cream:  { hex: '#F6EFE7', name: 'Cream'      },
  ivory:  { hex: '#FFFFFF', name: 'Ivory'      },
  sand:   { hex: '#E3D3C2', name: 'Sand'       },
  ash:    { hex: '#CFC7C9', name: 'Ash Grey'   },
  ink:    { hex: '#2C2328', name: 'Ink Black'  },
  sage:   { hex: '#C7D2C4', name: 'Sage'       }
};

const PRODUCTS = [
  {
    id: 'aw-101', name: 'Aria Slip Dress', th: 'เดรสสลิปผ้าซาติน',
    cat: 'dresses', garment: 'dress', price: 1890, old: 2390, tag: 'sale',
    colors: ['blush', 'ivory', 'ink'], sizes: ['XS', 'S', 'M', 'L'],
    material: 'ซาตินวิสคอส 100%', rating: 4.8, reviews: 126, isNew: false,
    desc: 'เดรสสลิปทรงเข้ารูปเล็กน้อย ผ้าซาตินทิ้งตัวสวย สายเสปกเก็ตตี้ปรับระดับได้ ใส่เดี่ยว ๆ หรือซ้อนกับเสื้อยืดก็ได้'
  },
  {
    id: 'aw-102', name: 'Mira Cotton Shirt', th: 'เชิ้ตคอตตอนโอเวอร์ไซส์',
    cat: 'tops', garment: 'blouse', price: 1290, old: null, tag: 'new',
    colors: ['ivory', 'blush', 'sand'], sizes: ['S', 'M', 'L', 'XL'],
    material: 'คอตตอนป็อปลิน 100%', rating: 4.9, reviews: 214, isNew: true,
    desc: 'เชิ้ตทรงโอเวอร์ไซส์ ไหล่ตก กระดุมหอยมุก ผ้าคอตตอนป็อปลินเนื้อแน่นแต่ระบายอากาศดี'
  },
  {
    id: 'aw-103', name: 'Lune Pleated Skirt', th: 'กระโปรงจีบรอบตัว',
    cat: 'skirts', garment: 'skirt', price: 1490, old: null, tag: null,
    colors: ['blush', 'cream', 'ash'], sizes: ['XS', 'S', 'M', 'L'],
    material: 'โพลีเอสเตอร์รีไซเคิล 92% / สแปนเด็กซ์ 8%', rating: 4.7, reviews: 88, isNew: false,
    desc: 'กระโปรงจีบรอบตัวความยาวมิดิ เอวสูงยางยืดด้านหลัง เคลื่อนไหวพลิ้วสวยทุกก้าว'
  },
  {
    id: 'aw-104', name: 'Nova Wide Trousers', th: 'กางเกงขากว้างเอวสูง',
    cat: 'pants', garment: 'pants', price: 1690, old: null, tag: 'best',
    colors: ['ink', 'sand', 'ivory'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'เทนเซล 68% / วิสคอส 32%', rating: 4.9, reviews: 302, isNew: false,
    desc: 'กางเกงขากว้างเอวสูง จีบหน้า 2 จีบ ช่วยให้ขาดูยาว มีกระเป๋าข้างใช้งานได้จริง'
  },
  {
    id: 'aw-105', name: 'Soleil Trench Coat', th: 'เทรนช์โค้ทน้ำหนักเบา',
    cat: 'outer', garment: 'coat', price: 3290, old: 3890, tag: 'sale',
    colors: ['sand', 'blush', 'ash'], sizes: ['S', 'M', 'L'],
    material: 'คอตตอนเคลือบกันน้ำ 100%', rating: 4.8, reviews: 74, isNew: false,
    desc: 'เทรนช์โค้ทตัวยาว น้ำหนักเบา ผ้าเคลือบกันละอองน้ำ มาพร้อมเข็มขัดผูกเอวถอดได้'
  },
  {
    id: 'aw-106', name: 'Pia Knit Cardigan', th: 'คาร์ดิแกนไหมพรมนุ่ม',
    cat: 'knit', garment: 'knit', price: 1990, old: null, tag: 'new',
    colors: ['blush', 'cream', 'sage'], sizes: ['S', 'M', 'L'],
    material: 'เมอริโนวูล 70% / อะคริลิก 30%', rating: 4.6, reviews: 51, isNew: true,
    desc: 'คาร์ดิแกนถักเนื้อนุ่ม ทรงตรงพอดีตัว กระดุมเรียบ ใส่ทับได้ทุกลุคในห้องแอร์'
  },
  {
    id: 'aw-107', name: 'Ines Tote Bag', th: 'กระเป๋าโท้ทหนังนิ่ม',
    cat: 'acc', garment: 'bag', price: 2290, old: null, tag: null,
    colors: ['cream', 'ink', 'blush'], sizes: ['One Size'],
    material: 'หนังวีแกนเกรดพรีเมียม', rating: 4.7, reviews: 143, isNew: false,
    desc: 'กระเป๋าโท้ททรงสี่เหลี่ยม ใส่โน้ตบุ๊ก 14 นิ้วได้ ซับในผ้าคอตตอน มีช่องซิปด้านใน'
  },
  {
    id: 'aw-108', name: 'Elle Ribbed Top', th: 'เสื้อยืดร่องริ้ว',
    cat: 'tops', garment: 'tee', price: 690, old: 890, tag: 'sale',
    colors: ['ivory', 'blush', 'ink', 'sage'], sizes: ['XS', 'S', 'M', 'L'],
    material: 'คอตตอนออร์แกนิก 95% / อีลาสเทน 5%', rating: 4.5, reviews: 268, isNew: false,
    desc: 'เสื้อยืดผ้าร่องริ้วเข้ารูป คอกลมเก็บทรง ยืดหยุ่นสูง เป็นเบสิกที่ควรมีทุกสี'
  },
  {
    id: 'aw-109', name: 'Vera Midi Dress', th: 'เดรสมิดิแขนพอง',
    cat: 'dresses', garment: 'dress', price: 2190, old: null, tag: 'best',
    colors: ['blush', 'ivory', 'sage'], sizes: ['S', 'M', 'L'],
    material: 'คอตตอนวอยล์ 100%', rating: 4.9, reviews: 187, isNew: false,
    desc: 'เดรสมิดิแขนพองเล็ก เก็บเอวด้วยยางยืดด้านหลัง ผ้าคอตตอนวอยล์บางเบาใส่สบาย'
  },
  {
    id: 'aw-110', name: 'Coco Linen Shirt', th: 'เชิ้ตลินินแขนยาว',
    cat: 'tops', garment: 'blouse', price: 1390, old: null, tag: 'new',
    colors: ['ivory', 'sand', 'sage'], sizes: ['S', 'M', 'L', 'XL'],
    material: 'ลินินฝรั่งเศส 100%', rating: 4.8, reviews: 96, isNew: true,
    desc: 'เชิ้ตลินินแท้ 100% ระบายอากาศดีเยี่ยม เหมาะกับอากาศร้อน ยิ่งซักยิ่งนุ่ม'
  },
  {
    id: 'aw-111', name: 'Sora Slit Skirt', th: 'กระโปรงผ่าข้าง',
    cat: 'skirts', garment: 'skirt', price: 1590, old: null, tag: null,
    colors: ['ink', 'blush', 'ash'], sizes: ['XS', 'S', 'M', 'L'],
    material: 'วิสคอสทวิล 100%', rating: 4.6, reviews: 62, isNew: false,
    desc: 'กระโปรงยาวผ่าข้าง เอวสูงเรียบ ซิปซ่อนด้านหลัง ทิ้งตัวสวยเมื่อเดิน'
  },
  {
    id: 'aw-112', name: 'Juno Straight Jeans', th: 'ยีนส์ทรงตรง',
    cat: 'pants', garment: 'pants', price: 1890, old: 2290, tag: 'sale',
    colors: ['ash', 'ink', 'cream'], sizes: ['25', '26', '27', '28', '29', '30'],
    material: 'เดนิมคอตตอน 98% / อีลาสเทน 2%', rating: 4.7, reviews: 221, isNew: false,
    desc: 'ยีนส์ทรงตรงเอวสูง เนื้อผ้ามีความยืดเล็กน้อย ใส่สบายทั้งวันไม่รั้ง'
  },
  {
    id: 'aw-113', name: 'Amelie Blazer', th: 'เบลเซอร์ทรงหลวม',
    cat: 'outer', garment: 'coat', price: 2790, old: null, tag: 'new',
    colors: ['blush', 'ink', 'cream'], sizes: ['S', 'M', 'L'],
    material: 'โพลีเอสเตอร์รีไซเคิล 64% / วิสคอส 36%', rating: 4.8, reviews: 109, isNew: true,
    desc: 'เบลเซอร์ทรงหลวมไหล่ตก กระดุมเม็ดเดียว ซับในเต็มตัว ใส่ทำงานหรือแมตช์ลุคลำลอง'
  },
  {
    id: 'aw-114', name: 'Fleur Knit Vest', th: 'เสื้อกั๊กไหมพรม',
    cat: 'knit', garment: 'knit', price: 1190, old: null, tag: null,
    colors: ['cream', 'blush', 'sage'], sizes: ['S', 'M', 'L'],
    material: 'คอตตอนถัก 80% / ไนลอน 20%', rating: 4.4, reviews: 43, isNew: false,
    desc: 'เสื้อกั๊กไหมพรมคอวี ใส่ทับเชิ้ตให้ลุคดูมีเลเยอร์ น้ำหนักเบาใส่ได้ทั้งปี'
  },
  {
    id: 'aw-115', name: 'Lyra Silk Scarf', th: 'ผ้าพันคอไหม',
    cat: 'acc', garment: 'bag', price: 890, old: null, tag: null,
    colors: ['blush', 'rose', 'cream'], sizes: ['One Size'],
    material: 'ไหมมัลเบอร์รี่ 100%', rating: 4.9, reviews: 77, isNew: false,
    desc: 'ผ้าพันคอไหมแท้ ขนาด 70x70 ซม. พิมพ์ลายเฉพาะของ ALLAI เก็บริมด้วยมือ'
  },
  {
    id: 'aw-116', name: 'Nori Boxy Tee', th: 'เสื้อยืดทรงกล่อง',
    cat: 'tops', garment: 'tee', price: 590, old: null, tag: 'best',
    colors: ['ivory', 'blush', 'ink', 'sand'], sizes: ['S', 'M', 'L', 'XL'],
    material: 'คอตตอนหวี 100%', rating: 4.6, reviews: 341, isNew: false,
    desc: 'เสื้อยืดทรงกล่อง คอริบหนา ผ้าคอตตอนหวีเนื้อแน่น 240 แกรม ไม่บางไม่ย้วย'
  }
];

/* ---------------------------------------------------------- artwork -- */

const GARMENT_PATHS = {
  dress: `
    <path d="M112 66 L150 88 L188 66 L206 78 C198 130 190 170 196 210 C204 262 216 306 224 336 L76 336 C84 306 96 262 104 210 C110 170 102 130 94 78 Z"/>
    <path d="M112 66 C124 92 176 92 188 66" fill="none"/>
    <path d="M104 210 C136 224 164 224 196 210" fill="none"/>`,
  blouse: `
    <path d="M114 70 L150 90 L186 70 L214 84 L236 152 L206 166 L204 268 L96 268 L94 166 L64 152 L86 84 Z"/>
    <path d="M114 70 C126 96 174 96 186 70" fill="none"/>
    <path d="M150 90 L150 268" fill="none"/>`,
  tee: `
    <path d="M116 76 L150 96 L184 76 L218 96 L234 146 L204 160 L202 264 L98 264 L96 160 L66 146 L82 96 Z"/>
    <path d="M116 76 C128 102 172 102 184 76" fill="none"/>`,
  skirt: `
    <path d="M104 104 L196 104 L200 132 L226 316 L74 316 L100 132 Z"/>
    <path d="M104 132 L196 132" fill="none"/>
    <path d="M124 140 L110 312 M150 140 L150 312 M176 140 L190 312" fill="none"/>`,
  pants: `
    <path d="M104 100 L196 100 L202 320 L162 320 L150 190 L138 320 L98 320 Z"/>
    <path d="M104 126 L196 126" fill="none"/>
    <path d="M150 132 L150 190" fill="none"/>`,
  coat: `
    <path d="M112 68 L150 86 L188 68 L216 82 L240 160 L210 174 L208 320 L92 320 L90 174 L60 160 L84 82 Z"/>
    <path d="M112 68 L150 132 L188 68" fill="none"/>
    <path d="M150 132 L150 320" fill="none"/>
    <path d="M96 200 L124 200 M204 200 L176 200" fill="none"/>`,
  knit: `
    <path d="M116 74 L150 92 L184 74 L214 88 L234 158 L204 170 L202 276 L98 276 L96 170 L66 158 L86 88 Z"/>
    <path d="M116 74 C128 100 172 100 184 74" fill="none"/>
    <path d="M110 120 L110 264 M130 120 L130 264 M150 120 L150 264 M170 120 L170 264 M190 120 L190 264" fill="none" stroke-width="1"/>`,
  bag: `
    <path d="M84 140 L216 140 L228 312 L72 312 Z"/>
    <path d="M118 140 C118 96 182 96 182 140" fill="none"/>
    <path d="M84 176 L216 176" fill="none"/>`
};

/**
 * Line-art garment illustration.
 * @param {string} type  key of GARMENT_PATHS
 * @param {string} color hex of the fabric colour
 */
function garmentSVG(type, color = '#F2BFCF') {
  const paths = GARMENT_PATHS[type] || GARMENT_PATHS.dress;
  const light = color.toUpperCase() === '#FFFFFF';
  return `
<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
  <rect width="300" height="400" fill="#FFF8FA"/>
  <circle cx="232" cy="74" r="66" fill="#FDEDF2"/>
  <g fill="${color}" fill-opacity="${light ? .5 : .82}" stroke="#2C2328" stroke-opacity=".5"
     stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
    ${paths}
  </g>
</svg>`;
}

/** Editorial "lookbook" scene — abstract figure + backdrop. */
function sceneSVG(variant = 0) {
  const bg = ['#FDEDF2', '#FFF8FA', '#F9DBE4', '#F6EFE7'][variant % 4];
  const fg = ['#F2BFCF', '#E795AF', '#FFFFFF', '#D9708E'][variant % 4];
  return `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="${bg}"/>
  <circle cx="${90 + variant * 40}" cy="70" r="58" fill="#FFFFFF" fill-opacity=".55"/>
  <path d="M0 300 C90 210 150 250 210 190 C270 130 330 160 400 96 L400 300 Z" fill="${fg}" fill-opacity=".55"/>
  <g stroke="#2C2328" stroke-opacity=".38" stroke-width="1.5" fill="none">
    <circle cx="286" cy="112" r="20"/>
    <path d="M266 148 L286 134 L306 148 L318 208 L300 214 L296 286 L276 286 L272 214 L254 208 Z"/>
  </g>
</svg>`;
}

/** Round portrait for the team section. */
function avatarSVG(i = 0) {
  const bg = ['#FDEDF2', '#F9DBE4', '#F6EFE7'][i % 3];
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <rect width="200" height="200" fill="${bg}"/>
  <circle cx="100" cy="82" r="34" fill="#FFFFFF" fill-opacity=".85"/>
  <path d="M40 200 C40 148 68 124 100 124 C132 124 160 148 160 200 Z" fill="#FFFFFF" fill-opacity=".85"/>
</svg>`;
}

const formatTHB = n => '฿' + n.toLocaleString('th-TH');
