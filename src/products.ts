// Product catalogue rendered into the "Products" section (src/main.ts → renderProducts).
// Content follows the product pages of the company site (http://www.bl-tech.co.kr/main/sub2_*.php and /eng/).
// Feature titles are English in both languages, as on the company site. Edit text here; images live in public/products.
import type { Lang } from './i18n';

export type TabId = 'cast' | 'splint' | 'compression' | 'hydrogel' | 'industrial' | 'home';

interface Copy {
  tagline: string;
  /** [title, description] */
  features: [string, string][];
  /** [label, bullet points] */
  types?: [string, string[]][];
  /** [label, text] rows such as application / compatible media / pipe types */
  uses?: [string, string][];
}

export interface Product {
  id: string;
  tab: TabId;
  /** small category line above the name */
  sub: string;
  name: string;
  /** relative to the page so it works under any base path */
  img: string;
  ko: Copy;
  en: Copy;
}

export const tabs: { id: TabId; ko: string; en: string }[] = [
  { id: 'cast', ko: '캐스트', en: 'Cast' },
  { id: 'splint', ko: '스플린트', en: 'Splint' },
  { id: 'compression', ko: '압박밴드', en: 'Compression band' },
  { id: 'hydrogel', ko: '하이드로겔', en: 'Hydrogel' },
  { id: 'industrial', ko: '산업용 보수재', en: 'Industrial repair' },
  { id: 'home', ko: '가정용', en: 'Home kit' },
];

export const labels = {
  ko: { features: '특징', types: '타입', uses: '적용', catalog: '카탈로그 다운로드', note: '* 표면 연마·탈지 등 전처리 후 사용 권장' },
  en: { features: 'Features', types: 'Types', uses: 'Applications', catalog: 'Catalog download', note: '* Surface preparation such as grinding and degreasing is recommended.' },
} satisfies Record<Lang, Record<string, string>>;

const customKo: [string, string] = ['Customized Production Solution', '색상·길이·패키징·사양까지 고객 맞춤으로 제조해 시장에 최적화된 차별화 제품을 제공합니다.'];
const customEn: [string, string] = ['Customized Production Solution', 'Customized options for color, length, packaging and specifications deliver market-optimized, differentiated products.'];

// Shared by the PRAX tapes
const pipesKo: [string, string][] = [
  ['적용 대상', '물(염수 포함), 알칼리, 일부 유기용제(에탄올, 에틸아세테이트, 톨루엔 등) 배관 · 황산, 염산 등 산(acid) 계열 불가'],
  ['적용 가능 배관', '일반강관 · 유리섬유관(FRP) · 콘크리트관 · 스테인리스관* · 금속제 파이프*'],
  ['적용 비권장 배관', '연질 PVC관 · 고무관 · 유리 배관'],
];
const pipesEn: [string, string][] = [
  ['Compatible media', 'Piping carrying water (including saline), alkaline solutions and certain organic solvents (ethanol, ethyl acetate, toluene) · not for acids such as sulfuric or hydrochloric acid'],
  ['Recommended pipes', 'Carbon steel · FRP · Concrete · Stainless steel* · Metal pipes*'],
  ['Not recommended', 'Flexible PVC · Rubber pipe / hose · Glass pipe'],
];
const praxTypesKo = (hd: string[], fg: string[]): [string, string[]][] => [
  ['High Density', ['286 Tex 고밀도 원사 적용', ...hd]],
  ['Fiberglass', ['68 Tex 경량·유연 원사 적용', ...fg]],
];
const praxTypesEn = (hd: string[], fg: string[]): [string, string[]][] => [
  ['High Density', ['286 Tex high-density yarn', ...hd]],
  ['Fiberglass', ['68 Tex lightweight, flexible yarn', ...fg]],
];

export const products: Product[] = [
  // ── Cast ────────────────────────────────────────────────────────────────
  {
    id: 'neal-cast-plus',
    tab: 'cast',
    sub: 'Cast · Rigid',
    name: 'NEAL Cast PLUS',
    img: 'products/neal-cast-plus.webp',
    ko: {
      tagline: '끈적임 없는 레진, 고품질 원단, 최적화된 길이로 시술 효율성과 환자 만족도를 높인 글로벌 스탠다드 캐스트입니다.',
      features: [
        ['Low Stickiness', '끈적임이 적은 수경화성 폴리우레탄 레진을 사용해 몰딩이 매끄럽고 용이합니다.'],
        ['No Resin Bleeding', '레진의 칙소성(Thixotropy)을 정밀하게 제어해 사용 중 수지가 한쪽으로 치우치거나 흘러내리지 않습니다.'],
        ['Premium Fabric', '독자적인 기술로 직접 직조한 프리미엄 원단이 레진을 안정적으로 흡수해 우수한 강도를 보입니다.'],
        customKo,
      ],
      types: [
        ['Fiberglass', ['가장 범용적으로 사용되는 유리섬유 캐스트', '가장 우수한 강도', '캐스트 쏘(Cast Saw)로 제거 용이', '타사 대비 가벼운 중량으로 착용감 개선']],
        ['Polyester', ['타사 420D보다 부드러운 300D 원사', '내구성은 그대로, 절단 용이성은 크게 향상', '유리섬유 캐스트보다 가벼운 중량', '유리섬유로 인한 알러지 위험 최소화']],
      ],
    },
    en: {
      tagline: 'A global-standard cast that enhances clinical efficiency and patient satisfaction with a non-sticky resin, high-quality fabric and an optimized length.',
      features: [
        ['Low Stickiness', 'Uses a low-tack, water-activated polyurethane resin for smooth and easy molding.'],
        ['No Resin Bleeding', 'Precisely controlled thixotropy prevents resin migration or run-off during use.'],
        ['Premium Fabric', 'Premium in-house woven fabric ensures stable resin absorption and high strength.'],
        customEn,
      ],
      types: [
        ['Fiberglass', ['Woven with lightweight 50 Tex yarn', 'Superior strength', 'Easy removal with a cast saw', 'Lighter weight for improved patient comfort']],
        ['Polyester', ['Softer 300D yarn (vs. 420D)', 'Durable, yet easier to cut', 'Lighter than fiberglass', 'Reduced fiberglass allergy risk']],
      ],
    },
  },
  {
    id: 'neal-cast-alpha',
    tab: 'cast',
    sub: 'Cast · Rigid',
    name: 'NEAL Cast ALPHA',
    img: 'products/neal-cast-alpha.webp',
    ko: {
      tagline: '층간 접착력이 탁월한 유리섬유 캐스트로, 견고한 몰딩과 강한 고정이 특징입니다.',
      features: [
        ['Flexible Molding', '수분과 반응하면 즉시 미끄러운 촉감을 제공해 유연한 몰딩이 가능합니다.'],
        ['Strong Adhesion', 'PLUS 라인 대비 강한 층간 밀착력으로 층간 박리나 들뜸 현상을 최소화합니다.'],
        ['Stable Fixation', '특수 폴리우레탄 레진으로 여러 겹을 감아도 단단한 고정이 형성됩니다.'],
        customKo,
      ],
      types: [['Fiberglass', ['강한 접착력의 유리섬유 캐스트', '우수한 강도', '특유의 매끄러운 촉감과 유연한 몰딩', '캐스트 쏘(Cast Saw)로 제거 용이']]],
    },
    en: {
      tagline: 'A fiberglass cast with excellent interlayer adhesion, featuring firm molding and strong immobilization.',
      features: [
        ['Flexible Molding', 'When activated by moisture, it immediately provides a smooth, slippery surface for flexible molding.'],
        ['Strong Adhesion', 'Enhanced interlayer adhesion compared to the PLUS line minimizes delamination and lifting.'],
        ['Stable Fixation', 'A special polyurethane resin ensures firm fixation even when wrapped in multiple layers.'],
        customEn,
      ],
      types: [['Fiberglass', ['Fiberglass cast with strong adhesion', 'Excellent strength', 'Smooth surface with flexible molding', 'Easy removal with a cast saw']]],
    },
  },
  {
    id: 'smile-cast-premium',
    tab: 'cast',
    sub: 'Cast · Rigid',
    name: 'SMILE Cast PREMIUM',
    img: 'products/smile-cast-premium.webp',
    ko: {
      tagline: '비엘테크 독자 직조 기술과 PU 레진 제조 노하우로 기존 대비 약 10% 더 가볍고 강도는 더 높은 프리미엄 캐스트입니다.',
      features: [
        ['Professional-grade Cast', '타사 68Tex 대비 더 얇은 50Tex 유리섬유를 직접 직조해 가볍고 유연하면서 시술이 쉬운 전문형 캐스트입니다.'],
        ['Enhanced Quality Stability', '원단 유연성과 최적의 레진 균형으로 기포나 접착 불량 등 적층 이슈를 최소화했습니다.'],
        ['Reduces Sharp Edges', '얇은 실 구조로 날카로운 모서리 발생을 줄여 2차 부상 위험을 낮췄습니다.'],
        ['Lightweight & Improved Comfort', '더 얇고 부드러운 원단으로 착용감을 높여 유럽, 일본 등 글로벌 시장에서 경쟁력을 입증했습니다.'],
      ],
      types: [
        ['Fiberglass', ['50Tex 경량 원사로 직조', '전문적인 몰딩', '유연한 원단으로 환자 착용감 개선']],
        ['Polyester', ['우수한 통기성', '더 얇은 폴리에스터 원사로 제거 용이', '유리섬유로 인한 알러지 위험 최소화']],
      ],
    },
    en: {
      tagline: 'A premium cast about 10% lighter yet stronger than before, built on BL Tech’s proprietary weaving technology and PU resin know-how.',
      features: [
        ['Professional-grade Cast', 'Woven in-house from 50 Tex fiberglass, thinner than the usual 68 Tex, for a light, flexible cast that is easy to apply.'],
        ['Enhanced Quality Stability', 'Balanced fabric flexibility and resin content minimize lamination issues such as air bubbles and poor adhesion.'],
        ['Reduces Sharp Edges', 'The fine yarn structure reduces sharp edges and lowers the risk of secondary injury.'],
        ['Lightweight & Improved Comfort', 'A thinner, softer fabric improves comfort and has proven competitive in Europe, Japan and other global markets.'],
      ],
      types: [
        ['Fiberglass', ['Woven with lightweight 50 Tex yarn', 'Professional molding', 'Flexible fabric for patient comfort']],
        ['Polyester', ['Excellent breathability', 'Thin polyester yarn for easy removal', 'Reduced fiberglass allergy risk']],
      ],
    },
  },
  {
    id: 'neal-cast-soft',
    tab: 'cast',
    sub: 'Cast · Soft',
    name: 'NEAL Cast SOFT',
    img: 'products/neal-cast-soft.webp',
    ko: {
      tagline: '가위로 쉽게 제거할 수 있는 반경질형 캐스트로, 캐스트 쏘(Saw)에 거부감이 있는 환자에게도 부담 없이 적용할 수 있습니다.',
      features: [
        ['Custom Bracing', '부드럽고 탄성이 우수해 리지드 캐스트와 함께 쓰면 편안한 맞춤 고정이 가능합니다.'],
        ['Adjustable Support Level', '감는 겹수로 지지력과 움직임을 단계별로 조절할 수 있습니다.'],
        ['Cast-Saw-Free Removal', '손이나 밴디지 시저로 쉽게 제거되어 캐스트 쏘를 꺼리는 환자에게 적합합니다.'],
        ['Semi-Rigid Support with Mobility', '완전히 경화된 뒤에도 반경질이라 착용 중 어느 정도의 운동성을 줍니다.'],
      ],
      types: [
        ['Fiberglass', ['50Tex 경량 원사로 직조', '유럽에서 경쟁력이 입증된 제품']],
        ['Polyester', ['우수한 통기성', '더 얇은 폴리에스터 원사로 제거 용이', '유리섬유로 인한 알러지 위험 최소화']],
      ],
    },
    en: {
      tagline: 'A semi-rigid casting tape that stays flexible after curing, giving patients supportive stability with limited mobility.',
      features: [
        ['Custom Bracing', 'Soft and highly elastic, it allows comfortable, customized fixation together with rigid casts.'],
        ['Adjustable Support Level', 'Support and mobility can be adjusted step by step through the number of layers.'],
        ['Cast-Saw-Free Removal', 'Easily removed by hand or with bandage scissors, suitable for patients uncomfortable with cast saws.'],
        ['Semi-Rigid Support with Mobility', 'Remains semi-rigid after full curing, giving patients a degree of mobility.'],
      ],
      types: [
        ['Fiberglass', ['Woven with lightweight 50 Tex yarn', 'Proven competitiveness in Europe']],
        ['Polyester', ['Excellent breathability', 'Thin polyester yarn for easy removal', 'Reduced fiberglass allergy risk']],
      ],
    },
  },
  {
    id: 'neal-cast-flex',
    tab: 'cast',
    sub: 'Cast · Flex',
    name: 'NEAL Cast FLEX',
    img: 'products/neal-cast-flex.webp',
    ko: {
      tagline: '굴곡 부위에 최적화된 탄력 폴리에스터 원단으로, 고정 중에도 움직임이 편안한 캐스팅 테이프입니다.',
      features: [
        ['Flexible Cast for Curved Areas', '스판덱스 혼용 폴리에스터 원단으로 기존 폴리에스터 캐스트 대비 신율을 최대 50% 높였습니다.'],
        ['Soft Support & Mobility', '완전 고정이 필요하지 않은 장기요양 환자에게 부드러운 지지와 활동성을 제공합니다.'],
        ['Cast-Saw-Free Removal', '높은 신율과 복원력이 겹 사이 들뜸이나 형태 틀어짐을 줄여 시술 완성도를 높입니다.'],
        ['Global Key Product', '다양한 시술 방법에 적용할 수 있어 독일 의료기기 전문 유통사의 메인 제품으로 판매되고 있습니다.'],
      ],
      types: [
        ['SS', ['슬림한 착용감', '뛰어난 탄성 복원력', '들뜸 방지, 시술 완성도 향상']],
        ['DTY', ['쿠션감, 충격 흡수, 압력 분산', '재활 단계 환자에게 유용', '독일 등 유럽 유통 주력 제품']],
      ],
    },
    en: {
      tagline: 'Elastic polyester casting tape optimized for joints, for comfortable movement during immobilization.',
      features: [
        ['Flexible Cast for Curved Areas', 'A spandex-blend polyester fabric raises elongation by up to 50% over conventional polyester casts.'],
        ['Soft Support & Mobility', 'Gentle support and better mobility for long-term care patients who do not need full immobilization.'],
        ['Cast-Saw-Free Removal', 'High stretch and recovery reduce interlayer lifting and distortion for consistent clinical results.'],
        ['Global Key Product', 'Its versatility made it a main product of a leading German medical device distributor.'],
      ],
      types: [
        ['SS', ['Slim, low-profile fit', 'Excellent elastic recovery', 'High interlayer adhesion']],
        ['DTY', ['Cushioning, shock absorption and pressure distribution', 'Ideal for rehabilitation patients', 'Key product in the European market']],
      ],
    },
  },

  // ── Splint ──────────────────────────────────────────────────────────────
  {
    id: 'neal-splint-f-plus',
    tab: 'splint',
    sub: 'Splint · Fiberglass',
    name: 'NEAL Splint F PLUS',
    img: 'products/neal-splint-f-plus.webp',
    ko: {
      tagline: '강도가 뛰어난 유리섬유 기재와 부드러운 피부보호용 패딩으로 이루어진 반고정형 경질 부목입니다.',
      features: [
        ['Lightweight & High-Strength', '기존 7~8겹 기재와 달리 독자 기술의 1겹 유리섬유 기재가 레진을 효과적으로 흡수해 가볍고 강합니다.'],
        ['Clinician & Patient Convenience', '피부 접촉면은 소수성 원단으로 쾌적하고, 외측은 친수성 원단이라 수분이 빠르게 침투합니다.'],
        ['Soft & Comfortable Wear', '피부 접촉면이 두껍고 부드러운 부직포라 장시간 착용에도 부담이 적습니다.'],
        ['Resin Bleeding Control', '수경화 PU 레진의 흐름을 정밀 제어해 흘러내림, 끈적임, 피부 자극을 줄였습니다.'],
      ],
      types: [['F PLUS', ['혁신적인 1겹 유리섬유 기재', '우수한 강도', '타사 대비 가벼운 중량', '장기 착용 편의성']]],
    },
    en: {
      tagline: 'A splint combining high-strength fiberglass reinforcement with soft, skin-friendly padding.',
      features: [
        ['Lightweight & High-Strength', 'A proprietary single-layer fiberglass substrate absorbs resin efficiently — lighter and stronger than 7–8 layer designs.'],
        ['Clinician & Patient Convenience', 'A hydrophobic inner layer keeps skin dry; the hydrophilic outer layer absorbs water fast for quicker application.'],
        ['Soft & Comfortable Wear', 'A soft nonwoven skin-contact surface for comfortable long-term wear.'],
        ['Resin Bleeding Control', 'Precisely controlled water-curing PU resin minimizes run-off, tackiness and skin irritation.'],
      ],
      types: [['F PLUS', ['Single-layer fiberglass substrate', 'High strength', 'Lighter than conventional products', 'Comfortable for long-term wear']]],
    },
  },
  {
    id: 'smile-splint-fg',
    tab: 'splint',
    sub: 'Splint · Fiberglass',
    name: 'SMILE Splint FG',
    img: 'products/smile-splint-fg.webp',
    ko: {
      tagline: '강도가 뛰어난 유리섬유 기재와 분리·재부착 가능한 피부보호용 패딩으로 이루어진 반고정형 경질 부목입니다.',
      features: [
        ['Detachable Padding Structure', '상·하부 패딩 접합부를 분리하고 다시 붙일 수 있어 환자 상태에 맞춘 재단과 추가 가공이 가능합니다.'],
        ['Clinician-Oriented Design', '시술자의 작업 흐름을 고려한 패딩 분리 설계로 임상 적용성과 완성도를 높입니다.'],
        ['Lightweight & High-Strength', '1겹 유리섬유 기재가 레진을 효과적으로 흡수해 타사 대비 가볍고 강합니다.'],
        ['Clinician & Patient Convenience', '피부 접촉면은 소수성 원단, 외측은 친수성 원단으로 시술 효율과 착용 만족을 함께 높였습니다.'],
      ],
      types: [['FG', ['섬세한 재단, 2차 가공 가능', '패딩 접합부 탈착 가능', '혁신적인 1겹 유리섬유 기재', '유연한 몰딩']]],
    },
    en: {
      tagline: 'A semi-rigid splint of high-strength fiberglass with skin-protective padding that can be detached and reattached.',
      features: [
        ['Detachable Padding Structure', 'The upper and lower padding can be separated and reattached for precise trimming to each patient.'],
        ['Clinician-Oriented Design', 'Padding designed around the clinician’s workflow improves clinical usability and finish.'],
        ['Lightweight & High-Strength', 'A single-layer fiberglass substrate absorbs resin efficiently — lighter and stronger than competing splints.'],
        ['Clinician & Patient Convenience', 'Hydrophobic skin side and hydrophilic outer side raise both application efficiency and comfort.'],
      ],
      types: [['FG', ['Precise trimming and further processing', 'Detachable padding joint', 'Single-layer fiberglass substrate', 'Flexible molding']]],
    },
  },
  {
    id: 'neal-splint-n-plus',
    tab: 'splint',
    sub: 'Splint · Non-woven',
    name: 'NEAL Splint N PLUS',
    img: 'products/neal-splint-n-plus.webp',
    ko: {
      tagline: '가볍고 경화 후에도 찔림이 없는 부직포 기재와 피부보호용 패딩으로 이루어진 반고정형 경질 부목입니다.',
      features: [
        ['Safety-Oriented Design', '유리섬유로 인한 피부 자극과 날카로운 모서리 가능성을 없애 2차 부상 위험을 최소화했습니다.'],
        ['Ultra-Lightweight Structure', '내부 기재 설계로 레진 물성과 함량을 최적화해 강도는 유지하면서 무게를 줄였습니다.'],
        ['Patient-Friendly Wearability', '가벼운 구조로 장시간 착용 부담을 낮추고 착용 순응도를 높입니다.'],
        ['Soft & Easy Molding', '부드럽고 유연한 피부 접촉면으로 불편감을 줄이고 정밀한 몰딩이 쉽습니다.'],
      ],
      types: [['N PLUS', ['날카로운 절단면이 생기지 않음', '유리섬유로 인한 피부 알러지 방지', '유리섬유 대비 가벼운 중량', '1겹 부직포 기재']]],
    },
    en: {
      tagline: 'A splint combining a lightweight, non-irritating nonwoven substrate with skin-protective padding.',
      features: [
        ['Safety-Oriented Design', 'Eliminates fiberglass skin irritation and sharp edges, minimizing the risk of secondary injury.'],
        ['Ultra-Lightweight Structure', 'Optimized substrate design balances resin content to keep strength while significantly reducing weight.'],
        ['Patient-Friendly Wearability', 'The light structure reduces burden during long-term wear and improves compliance.'],
        ['Soft & Easy Molding', 'A soft, flexible skin-contact surface minimizes discomfort and allows precise molding.'],
      ],
      types: [['N PLUS', ['No sharp cut edges', 'Prevents fiberglass-related skin allergies', 'Lighter than fiberglass', 'Single-layer nonwoven substrate']]],
    },
  },
  {
    id: 'smile-splint-sp',
    tab: 'splint',
    sub: 'Splint · Single Polyester',
    name: 'SMILE Splint SP',
    img: 'products/smile-splint-sp.webp',
    ko: {
      tagline: '유리섬유·부직포 타입의 장점은 살리고 단점은 보완한 차세대 소재 스플린트로, 일본·독일 등에서 수요가 빠르게 늘고 있습니다.',
      features: [
        ['Enhanced Safety', '유리섬유 대비 피부 자극과 분진이 없고, 절단해도 날카로운 모서리가 생기지 않습니다.'],
        ['Ultra-Lightweight Structure', '유연하고 질긴 기재로 섬세한 몰딩이 가능하며, 유리섬유 수준의 강도로 고하중에서도 형태를 유지합니다.'],
        ['Clinician-Centered Design', '상·하부 패딩의 양면 접합 구조로 재단과 위치 조정이 자유롭습니다.'],
        ['Proven Global Competitiveness', '일본 시장 브랜드 점유율 1위를 달성했고, 독일 전문 유통망을 통해 글로벌 병원에 진입하고 있습니다.'],
      ],
      types: [['SP', ['가장 강한 강도', '유연하고 질겨 부러지지 않음', '글로벌 경쟁력 입증', '피부 자극, 분진, 알러지 Free']]],
    },
    en: {
      tagline: 'A next-generation splint that keeps the strengths of fiberglass and nonwoven types while offsetting their limits, with fast-growing demand worldwide.',
      features: [
        ['Enhanced Safety', 'No skin irritation or dust compared to fiberglass, and no sharp edges when cut.'],
        ['Ultra-Lightweight Structure', 'A flexible, tough substrate allows precise molding while fiberglass-level strength holds shape under load.'],
        ['Clinician-Centered Design', 'Double-sided bonded padding allows easy trimming and positioning.'],
        ['Proven Global Competitiveness', 'Leads the Japanese market and is expanding globally through specialized European distribution.'],
      ],
      types: [['SP', ['Highest strength', 'Flexible and tough without breakage', 'Globally proven performance', 'No skin irritation, dust or allergy risk']]],
    },
  },
  {
    id: 'neal-premold',
    tab: 'splint',
    sub: 'Splint · Pre-mold',
    name: 'NEAL Pre-mold Splint',
    img: 'products/neal-premold.webp',
    ko: {
      tagline: '미리 성형된 정형외과용 부목으로 신속한 처치가 가능하며, 착용과 해체가 간편한 벨크로·스프린트 세트 제품입니다.',
      features: [
        ['Easy Application with Velcro', '압박 붕대 없이 벨크로로 빠르게 고정해 초보자도 쉽게 쓸 수 있고 응급 처치에 적합합니다.'],
        ['Multiple Size Options', '다양한 규격으로 제공되어 환자 상태와 적용 부위에 맞게 고를 수 있습니다.'],
        ['Comfort & Durability', '부직포 패딩, 고정 벨트, 꺾임부 보호 커버로 편안함과 안정적인 고정을 함께 제공합니다.'],
        ['Reduced Secondary Injury Risk', '경화 후에도 날카로운 모서리가 생기지 않는 부직포 지지체로 피부 손상 위험을 낮춥니다.'],
      ],
    },
    en: {
      tagline: 'A pre-molded orthopedic splint for quick treatment, supplied as a Velcro and splint set for easy application and removal.',
      features: [
        ['Easy Application with Velcro', 'Secured quickly with Velcro and no compression bandage — easy for beginners and ideal for first aid.'],
        ['Multiple Size Options', 'Available in a wide range of sizes to suit the patient and the area of application.'],
        ['Comfort & Durability', 'Nonwoven padding, straps and a bend-protection cover provide comfort and stable fixation.'],
        ['Reduced Secondary Injury Risk', 'The nonwoven support forms no sharp edges after hardening, reducing the risk of skin damage.'],
      ],
    },
  },

  // ── Compression band ────────────────────────────────────────────────────
  {
    id: 'neal-cover',
    tab: 'compression',
    sub: 'Other · Compression Band',
    name: 'NEAL Cover',
    img: 'products/neal-cover.webp',
    ko: {
      tagline: '사지나 원하는 부위에 적절한 압박을 주어 부기 완화와 혈액순환 보조, 안정적인 지지를 돕는 1등급 비급여 의료기기입니다.',
      features: [
        ['Certified Sterile', '의료기기안전정보원에 정식 신고된 의료기기이며 EO 가스로 멸균 처리된 압박용 밴드입니다.'],
        ['Targeted Fit', '압박이 필요한 부위와 사이즈에 맞춰 골라 착용할 수 있습니다.'],
        ['Breathable Knit', '원통형 니트 구조로 직물 밀도가 균일하고 통기성이 좋아 장시간 착용에도 쾌적합니다.'],
        ['Circulation Support', '혈액순환과 부기 완화에 도움이 되는 압박으로 일상·회복 관리에 적합합니다.'],
      ],
    },
    en: {
      tagline: 'A Class I medical device that applies appropriate compression to limbs and other areas to ease swelling, support circulation and provide stable support.',
      features: [
        ['Certified Sterile', 'A registered medical device, EO-gas sterilized for safe use.'],
        ['Targeted Fit', 'Chosen and worn according to the area and size that needs compression.'],
        ['Breathable Knit', 'A tubular knit with uniform density and good breathability stays comfortable for long wear.'],
        ['Circulation Support', 'Compression that helps circulation and reduces swelling, suited to daily and recovery care.'],
      ],
    },
  },

  // ── Hydrogel ────────────────────────────────────────────────────────────
  {
    id: 'hydrogel-patch',
    tab: 'hydrogel',
    sub: 'BEODERM · Medical device',
    name: 'Hydrogel Patch',
    img: 'products/hydrogel-patch.webp',
    ko: {
      tagline: 'TDS(Transdermal Delivery System) 기술을 활용한 의료기기 1등급 하이드로겔 피부보호대입니다.',
      features: [
        ['Biocompatibility & Safety', '생체적합성 시험을 통과한 의료기기 1등급으로 안전성이 검증된 제품입니다.'],
        ['Patented Hydrogel', '특허받은 독보적 고분자 하이드로겔로 민감한 피부에도 자극 없이 붙습니다.'],
        ['Regulatory Options', '의료기기와 화장품 제조 허가를 모두 보유해 원하는 트랙으로 선택·개발할 수 있습니다.'],
      ],
      types: [
        ['Face', ['썬번 수딩 패치 — 자연유래 추출물로 자외선·열에 자극받은 피부를 빠르게 진정']],
        ['Body', ['힙 튼살 패치 — 피부 탄력 개선과 손상 부위 보호', '맘 튼살 패치 — 임산부 복부·옆구리 집중 보습과 탄력 케어']],
        ['All-Purpose', ['트러블 케어 패치 — 항균·진정 성분으로 건조함으로 인한 가려움과 피부염 완화', '스카 케어 패치 — 상처 치유 후 흉터 완화']],
      ],
    },
    en: {
      tagline: 'A Class I medical device hydrogel skin protector utilizing Transdermal Delivery System (TDS) technology.',
      features: [
        ['Biocompatibility & Safety', 'A Class I medical device that has passed biocompatibility testing.'],
        ['Patented Hydrogel', 'A patented polymer hydrogel that adheres gently without irritation, even on sensitive skin.'],
        ['Regulatory Options', 'Manufacturing licenses for both medical devices and cosmetics allow either regulatory pathway.'],
      ],
      types: [
        ['Face', ['Sunburn Soothing Patch — naturally derived extracts calm skin exposed to UV or heat']],
        ['Body', ['Hip Stretchmarks Patch — improves elasticity and protects affected areas', 'Pregnancy Stretchmarks Patch — targeted hydration and elasticity care for the abdomen and sides']],
        ['All-Purpose', ['Trouble Patch — antibacterial, soothing ingredients calm dryness-related itching and irritation', 'Scar Care Patch — helps improve the appearance of scars after healing']],
      ],
    },
  },
  {
    id: 'hydrogel-oem',
    tab: 'hydrogel',
    sub: 'Hydrogel · OEM / ODM',
    name: 'OEM / ODM Total Solution',
    img: 'images/derma-shapes-dark.webp',
    ko: {
      tagline: 'ISO 22716·CPNP 체계와 인하우스 원스톱 공정으로 일관된 품질과 정밀한 커스터마이징을 실현합니다.',
      features: [
        ['Step 1 · 영업 & 마케팅', '고객사의 시장과 니즈를 분석하고 최적의 제품 콘셉트를 기획합니다.'],
        ['Step 2 · R&D 센터', '최신 기술을 적용한 포뮬레이션을 개발하고 글로벌 트렌드와 규제에 맞춰 설계합니다.'],
        ['Step 3 · 생산 & QM', '시제품 제작과 품질 테스트를 진행하고 고객 피드백을 반영해 개선합니다.'],
        ['Step 4 · 영업 & R&D', '실제 시장 테스트와 소비자 반응 분석으로 제품을 최적화합니다.'],
        ['Step 5 · 생산 & 마케팅 & 영업', '대량 생산과 브랜드 맞춤형 패키징, 해외 시장 진출과 지속적인 품질 관리를 진행합니다.'],
      ],
      types: [
        ['Face', ['리프팅 패치', '아웃도어 패치', '풀커버 패치', '하프 커버 패치', '쿨 아이 패치', '안티 링클 패치']],
        ['Body', ['왁싱 진정 패치']],
        ['All-Purpose', ['쿨링 패치']],
      ],
    },
    en: {
      tagline: 'An ISO 22716 and CPNP-compliant system with an in-house, one-stop process for consistent quality and precise customization.',
      features: [
        ['Step 1 · Sales & Marketing', 'Market and needs analysis, product concept design.'],
        ['Step 2 · R&D Center', 'Proprietary formulation designed for global trends and regulations.'],
        ['Step 3 · Production & QM', 'Prototyping and QC testing, refined with client feedback.'],
        ['Step 4 · Sales & R&D', 'Market validation and product optimization.'],
        ['Step 5 · Production, Marketing & Sales', 'Mass production, brand packaging, global launch and ongoing quality control.'],
      ],
      types: [
        ['Face', ['Lifting Patch', 'Outdoor Patch', 'Full Cover Patch', 'Half Cover Patch', 'Cool Eye Patch', 'Anti-wrinkle Patch']],
        ['Body', ['Post Wax Care Patch']],
        ['All-Purpose', ['Cool Down Patch']],
      ],
    },
  },

  // ── Industrial repair ───────────────────────────────────────────────────
  {
    id: 'prax-industrial',
    tab: 'industrial',
    sub: 'Industrial · Pipe Repair',
    name: 'PRAX Industrial',
    img: 'products/prax-industrial.webp',
    ko: {
      tagline: '수분과 반응해 경화되는 테이프형 보수재로 배관·구조물의 누수나 손상을 보강합니다.',
      uses: [['용도', '배관의 파손, 균열, 누수, 보호 등 다양한 소재의 보수 작업'], ...pipesKo],
      features: [
        ['Easy Application', '수경화성 폴리우레탄 수지로 코팅된 유리섬유 테이프로 물에 쉽게 경화되어 시공이 간편합니다.'],
        ['Semi-Permanent Repair Effect', '임시용 보수테이프와 달리 1회 시공으로 반영구적으로 쓸 수 있어 경제적입니다.'],
        ['Excellent Chemical Resistance', 'KS M ISO 175:2011 침지시험(23 °C, 7일)에서 물, 10% NaCl, 10% KOH, 29% NH₄OH, 50% 에탄올, 에틸아세테이트, 톨루엔에 대한 내화학성이 우수했습니다.'],
        ['Customized Production Solution', '고객사의 요청에 따라 시공 환경에 맞춘 설계 변경과 주문 제작이 가능합니다.'],
      ],
      types: praxTypesKo(['고압·누수 부위 보강에 최적', '직선 배관·플랜지 구간에 유리', '강성 유지로 형태 변형 최소화'], ['굴곡 구간 밀착력과 감김 편의성 우수', '협소 공간 작업에 유리', '곡관·엘보·밸브 주변 적용 최적']),
    },
    en: {
      tagline: 'A moisture-activated repair tape for industrial and facility maintenance, reinforcing leaks and structural damage.',
      uses: [['Application', 'Repair and reinforcement of pipe damage, cracks, leaks and surface protection on various materials'], ...pipesEn],
      features: [
        ['Easy Application', 'Fiberglass tape coated with water-curable polyurethane resin hardens on contact with water for fast application.'],
        ['Semi-Permanent Repair Effect', 'Unlike temporary repair tapes, a single application lasts semi-permanently — excellent cost efficiency.'],
        ['Excellent Chemical Resistance', 'In KS M ISO 175:2011 immersion tests (23 °C, 7 days) it resisted water, 10% NaCl, 10% KOH, 29% NH₄OH, 50% ethanol, ethyl acetate and toluene.'],
        ['Customized Production Solution', 'Design changes and made-to-order production for the customer’s application environment.'],
      ],
      types: praxTypesEn(['Reinforces high-pressure leaks', 'Ideal for straight pipes and flanges', 'Rigid and shape-stable'], ['High conformability', 'Ideal for tight spaces', 'Best for bends, elbows and valves']),
    },
  },
  {
    id: 'prax-anti-corrosion',
    tab: 'industrial',
    sub: 'Industrial · Anti-Corrosion',
    name: 'PRAX Anti-Corrosion',
    img: 'products/prax-anti-corrosion.webp',
    ko: {
      tagline: '해양·담수 구조물용 부식 방지 랩핑 시스템입니다.',
      uses: [['용도', '해상 구조물, 교량, 플랜트 배관, 해안 배수라인 등 부식과 손상이 잦은 산업설비 보수'], ...pipesKo],
      features: [
        ['Underwater Application', '수중·습윤 환경에서도 바로 감아 시공할 수 있고 방청 차단막을 형성합니다.'],
        ['Composite Reinforcement', '섬유 보강층과 방청 레진 구조로 별도 FRP 없이 테이핑만으로 보호와 보강을 함께 구현합니다.'],
        ['Project Efficiency', '교체·도장 공정을 줄여 공기 단축과 총비용 절감이 가능합니다.'],
        ['Harsh Environment Durability', '염수 환경에서도 내구성이 우수해 장기 보수에 적합합니다.'],
      ],
      types: praxTypesKo(['교각 하부·조위변화 구간의 고하중·고마찰 환경에 적합', '평면·직선 구조물 표면 보강에 유리'], ['불규칙한 콘크리트 면 밀착력 우수', '수중·습윤 환경에서도 시공성 확보', '교각 모서리·곡면 구간 적용 최적']),
    },
    en: {
      tagline: 'A corrosion protection wrapping system for marine and freshwater structures.',
      uses: [['Application', 'Repair and protection of corrosion-prone facilities such as offshore structures, bridges, plant piping and coastal drainage lines'], ...pipesEn],
      features: [
        ['Underwater Application', 'Applied immediately in underwater or wet conditions, forming an anti-corrosion barrier.'],
        ['Composite Reinforcement', 'Protection and reinforcement in one wrap, without additional FRP.'],
        ['Project Efficiency', 'Minimizes replacement and coating work, reducing project time and total cost.'],
        ['Harsh Environment Durability', 'Excellent durability in saltwater for long-term repair.'],
      ],
      types: praxTypesEn(['Suited to high-load, high-friction tidal zones under piers', 'Reinforces flat and straight surfaces'], ['Adheres well to irregular concrete', 'Workable underwater and in wet conditions', 'Best for pier edges and curved areas']),
    },
  },
  {
    id: 'prax-anti-flame',
    tab: 'industrial',
    sub: 'Industrial · Anti-Flame',
    name: 'PRAX Anti-Flame',
    img: 'products/prax-anti-flame.webp',
    ko: {
      tagline: '난연·고내열 파이프 사전 보호 및 사후 보수 테이프입니다.',
      uses: [['용도', '공장·발전소·화학플랜트 등 고온·화염 노출, 용접·스파크 환경에서 연소와 화재 확산을 억제하는 난연 보수'], ...pipesKo],
      features: [
        ['Flame Retardancy', '우수한 난연 성능으로 화염 확산을 효과적으로 억제합니다.'],
        ['Heat Resistance (Up to 300 °C)', '고온 환경에서도 열안정성을 유지하며 장시간 사용해도 성능 저하가 거의 없습니다.'],
        ['Fast Curing', '빠르게 경화되어 긴급 보수 작업에 바로 적용할 수 있습니다.'],
        ['Environmental Durability', '고온·습기 등 열악한 산업 환경에서도 안정적인 내구성을 제공합니다.'],
      ],
      types: praxTypesKo(['마모와 외부 충격에 대한 내구성 강화', '평면·직선 구조물 표면 보강에 유리'], ['인장강도와 형태 유지력 우수', '수중·습윤 환경에서도 시공성 확보', '곡면과 모서리 구간 적용성 우수']),
    },
    en: {
      tagline: 'A flame-retardant, high-heat-resistant tape for pre-protection and post-repair of pipes.',
      uses: [['Application', 'Flame-retardant repair that prevents ignition and fire spread in hot, spark-prone sites such as factories, power plants and chemical plants'], ...pipesEn],
      features: [
        ['Flame Retardancy', 'Effectively suppresses flame spread.'],
        ['Heat Resistance (Up to 300 °C)', 'Keeps thermal stability at high temperatures with minimal degradation over long use.'],
        ['Fast Curing', 'Rapid curing allows immediate application, ideal for emergency repairs.'],
        ['Environmental Durability', 'Stable durability in harsh conditions such as heat and humidity.'],
      ],
      types: praxTypesEn(['Higher resistance to abrasion and impact', 'Reinforces flat and straight surfaces'], ['High tensile strength and shape retention', 'Workable underwater and in wet conditions', 'Conforms well to curves and edges']),
    },
  },

  // ── Home kit ────────────────────────────────────────────────────────────
  {
    id: 'drpipe-home-kit',
    tab: 'home',
    sub: 'Consumer · Home Kit',
    name: 'Dr.pipe Home Kit',
    img: 'products/drpipe-home-kit.webp',
    ko: {
      tagline: '누수·균열에는 에폭시 퍼티를, 임시 차수에는 러버 밴드 타입을 쓰도록 구성된 가정용 배관 보수 키트입니다.',
      uses: [
        ['용도', '집에서 배관에 물이 새거나 균열이 생겼을 때 새는 부위를 감아 응급으로 막는 보수 키트'],
        ['적용 대상', '주방, 욕실, 세탁실, 베란다 등 가정용 급수·배수 배관의 누수 부위'],
      ],
      features: [],
      types: [
        ['FB type · 닥터파이프(F), 고무밴드, 장갑', ['수압을 멈추지 않고 사용(가정용 수도압력 2 kgf/㎠ 이하)', '핀홀로 인한 누수 보수', '가늘거나 꺾임이 심한 파이프', '소구경 파이프(Ø50mm 이하)에 적합']],
        ['HP type · 닥터파이프(H), 퍼티, 장갑', ['파이프 내 압력을 멈춘 뒤 시공', '압력이 높은 배관', '연결부·핀홀 부분의 누수', '가정용 및 산업용 배관']],
        ['FP type · 닥터파이프(F), 퍼티, 장갑', ['파이프 내 압력을 멈춘 뒤 시공', '연결부 단차가 크거나 표면 요철이 심할 때', '가늘거나 꺾임이 심한 파이프', '소구경 파이프(Ø50mm 이하)에 적합']],
      ],
    },
    en: {
      tagline: 'A household pipe repair kit: epoxy putty for leaks and cracks, a rubber band type for temporary water shut-off.',
      uses: [
        ['Application', 'Emergency repair kit that seals leaking or cracked pipes at home by wrapping the affected area'],
        ['Applicable areas', 'Leaks in household water supply and drainage pipes in kitchens, bathrooms, laundry rooms and balconies'],
      ],
      features: [],
      types: [
        ['FB type · Doctor Pipe (F), rubber band, gloves', ['Use without stopping water pressure (household up to 2 kgf/cm²)', 'Repairs pinhole leaks', 'Thin pipes or sharp bends', 'Small-diameter pipes (Ø50 mm or less)']],
        ['HP type · Doctor Pipe (H), putty, gloves', ['Apply after stopping internal pressure', 'High-pressure piping', 'Leaks at joints and pinholes', 'Household and industrial piping']],
        ['FP type · Doctor Pipe (F), putty, gloves', ['Apply after stopping internal pressure', 'Large steps at joints or rough surfaces', 'Thin pipes or sharp bends', 'Small-diameter pipes (Ø50 mm or less)']],
      ],
    },
  },
];
