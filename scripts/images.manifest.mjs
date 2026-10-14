// Image generation manifest.
// Each entry is generated to assets-src/generated/<id>.png (scripts/generate-images.mjs),
// then converted for the site into public/images/ by scripts/process-images.mjs according to `post`.
//   refs: files in assets-src/refs used as reference images (sent to /v1/images/edits)
//   post: line | photo | dither-beige | dither-grey | portrait

const PHOTO =
  'Editorial product photography, calm minimal composition, generous negative space, photorealistic, sharp focus. No text, no letters, no logos, no labels, no watermarks.';
const DITHER_SRC =
  'High-contrast studio photograph, hard directional light with crisp shadows, plain very light background, subject clearly separated from the background. No text, no letters, no logos.';
const LINE =
  'Technical isometric (axonometric) line illustration: thin uniform black strokes, no fills, no shading, no gradients, no text, no letters, no labels, no dimension lines, isolated on a fully transparent background, generous empty margin around the object.';
const PORTRAIT =
  'Professional corporate headshot of a fictional person (not a real individual), head and shoulders, facing the camera, neutral mid-grey seamless studio background, soft even light, natural relaxed expression, photorealistic. No text.';
const REF =
  'Depict exactly the product shown in the reference image(s) — same material, knit or texture, color and form — in a completely new photograph.';

export const images = [
  // Brand
  {
    id: 'brand-symbol-line',
    refs: ['BL_tech_ci.png'],
    size: '1024x1024',
    background: 'transparent',
    post: 'line',
    prompt: `Redraw ONLY the ribbon symbol on the right side of the reference logo (a twisted Möbius-strip ribbon forming a "B"; ignore all lettering) as a 3D isometric wireframe: the ribbon extruded with thickness, visible edges as thin black lines, hidden edges as fainter thin lines. ${LINE}`,
  },
  {
    id: 'contact-platform-line',
    size: '1536x1024',
    background: 'transparent',
    post: 'line',
    prompt: `A square technical platform seen in isometric view, with engraved channel pathways, small components and connectors along its edges, and a small twisted ribbon-loop sculpture standing at its center. ${LINE}`,
  },

  // 01 Orthopedic — casting tape, splint, cast cover
  {
    id: 'ortho-cast-dither',
    refs: ['prd1.png', 'img2_1_1_1_1_pic1.png'],
    size: '1536x1024',
    post: 'dither-beige',
    prompt: `${REF} Side view of a lower leg wearing a knitted fiberglass casting-tape cast, the foot lifted mid-step, placed on the left third of the frame. ${DITHER_SRC}`,
  },
  {
    id: 'ortho-rolls',
    refs: ['img2_1_1_1_1_pic1.png'],
    size: '1024x1024',
    post: 'photo',
    prompt: `Sculptural still life of rolls of knitted fiberglass casting tape in saturated colors (cobalt blue, cyan, emerald green, red, violet, yellow) stacked at different heights on clear acrylic risers, light grey seamless background, soft diffused light. ${PHOTO}`,
  },
  {
    id: 'ortho-macro',
    refs: ['img2_1_1_1_1_pic1.png'],
    size: '1024x1536',
    post: 'photo',
    prompt: `Extreme macro close-up of the knitted fiberglass casting-tape fabric in cobalt blue, showing the knit loops and the glossy resin coating, raking light. ${PHOTO}`,
  },
  {
    id: 'ortho-roll-line',
    size: '1536x1024',
    background: 'transparent',
    post: 'line',
    prompt: `Exploded view of an orthopedic casting-tape roll: a plastic core, the knitted tape partly unrolled in a long ribbon, and a separate sealed pouch beside it. ${LINE}`,
  },
  {
    id: 'ortho-splint-dither',
    refs: ['prd2.png'],
    size: '1024x1024',
    post: 'dither-grey',
    prompt: `${REF} A padded orthopedic leg splint on its own (no person), lying diagonally on a flat surface, three-quarter top view. ${DITHER_SRC}`,
  },
  {
    id: 'ortho-cover',
    refs: ['prd3.png'],
    size: '1536x1024',
    post: 'photo',
    prompt: `${REF} A clinician's gloved hands sliding the white open-mesh cast cover sleeve onto a patient's forearm in a bright clinic, soft window light, shallow depth of field. ${PHOTO}`,
  },

  // 02 Derma care — hydrogel
  {
    id: 'derma-peel',
    refs: ['img2_2_1_1_1_pic1.png', 'prd4.png'],
    size: '1536x1024',
    post: 'photo',
    prompt: `${REF} Macro photograph of fingertips peeling a translucent hydrogel sheet with an embossed micro-dot pattern away from its clear liner, soft pastel light, very clean. ${PHOTO}`,
  },
  {
    id: 'derma-hand-dither',
    refs: ['prd4.png'],
    size: '1024x1024',
    post: 'dither-beige',
    prompt: `${REF} The back of a hand with a clear rectangular hydrogel patch applied, fingers relaxed, side light. ${DITHER_SRC}`,
  },
  {
    id: 'derma-shapes-dark',
    size: '1536x1024',
    post: 'photo',
    prompt: `Translucent glossy hydrogel patches in several shapes (round dot, oval, under-eye crescent, long strip) floating in mid-air against a pure black background, dramatic rim light highlighting the gel edges. ${PHOTO}`,
  },
  {
    id: 'derma-lab',
    size: '1024x1536',
    post: 'photo',
    prompt: `In a clean-room laboratory, nitrile-gloved hands pour a clear viscous hydrogel into a shallow stainless-steel casting tray, cool soft light, white and pale mint tones. ${PHOTO}`,
  },
  {
    id: 'derma-layers-line',
    size: '1536x1024',
    background: 'transparent',
    post: 'line',
    prompt: `Exploded view of a transdermal hydrogel patch: a thin backing film on top, a hydrogel layer with a micro-dot texture in the middle, and a release liner with a peel tab at the bottom, the three layers floating apart. ${LINE}`,
  },

  // 03 Industrial repair — water-activated pipe repair tape
  {
    id: 'industrial-wrap',
    size: '1536x1024',
    post: 'photo',
    prompt: `A worker's gloved hands wrapping a water-activated, resin-coated fiberglass repair tape tightly around a leaking steel pipe elbow in an industrial plant, droplets of water, moody natural light. ${PHOTO}`,
  },
  {
    id: 'industrial-flange-dither',
    size: '1024x1024',
    post: 'dither-grey',
    prompt: `A short section of steel pipe with a bolted flange joint, the joint neatly wrapped with a hardened fiberglass repair tape, isolated object. ${DITHER_SRC}`,
  },
  {
    id: 'industrial-pipes-line',
    size: '1536x1024',
    background: 'transparent',
    post: 'line',
    prompt: `A small industrial pipe network with elbows, tees, valves and bolted flanges on low supports; one elbow is wrapped with repair tape, drawn with a diagonal hatch. ${LINE}`,
  },
  {
    id: 'industrial-racks',
    size: '1536x1024',
    post: 'photo',
    prompt: `Wide view along a long pipe rack in a chemical plant at dusk, parallel steel pipes receding into the distance, cool blue-hour tones with a few warm lights. ${PHOTO}`,
  },
  {
    id: 'industrial-roll-dark',
    size: '1024x1024',
    post: 'photo',
    prompt: `A single roll of resin-coated fiberglass repair tape emerging from a torn-open foil pouch, on a pure black background, dramatic top light. ${PHOTO}`,
  },

  // 04 Plant — production line export
  {
    id: 'plant-line',
    size: '1536x1024',
    post: 'photo',
    prompt: `A modern, very clean production line that coats knitted fabric rolls with resin: stainless steel rollers, conveyors and enclosed coating units, bright even lighting, two workers in white clean-room suits in the distance. ${PHOTO}`,
  },
  {
    id: 'plant-floor-line',
    size: '1536x1024',
    background: 'transparent',
    post: 'line',
    prompt: `A compact factory floor on a square base: coating machines, a conveyor line, partitioned clean-room zones, dehumidifier ducts and piping along the walls. ${LINE}`,
  },
  {
    id: 'plant-rollers-dither',
    size: '1024x1024',
    post: 'dither-beige',
    prompt: `Close-up of the steel rollers of a roll-to-roll coating machine with a sheet of fabric running through them. ${DITHER_SRC}`,
  },
  {
    id: 'plant-qc',
    size: '1024x1536',
    post: 'photo',
    prompt: `Quality inspection in a laboratory: a technician's gloved hands clamping a strip of cured casting tape into a tensile testing machine, clean white lab, soft light. ${PHOTO}`,
  },

  // Team — placeholder portraits of fictional people (replace with real photos before launch)
  { id: 'team-1', size: '1024x1024', quality: 'medium', post: 'portrait', prompt: `${PORTRAIT} A Korean man in his late 50s with short grey hair, navy blazer, open-collar white shirt.` },
  { id: 'team-2', size: '1024x1024', quality: 'medium', post: 'portrait', prompt: `${PORTRAIT} A Korean woman in her 40s with a chin-length bob, white blouse.` },
  { id: 'team-3', size: '1024x1024', quality: 'medium', post: 'portrait', prompt: `${PORTRAIT} A Korean man in his 40s with thin-rimmed glasses, dark knit sweater.` },
  { id: 'team-4', size: '1024x1024', quality: 'medium', post: 'portrait', prompt: `${PORTRAIT} A Korean woman in her 30s with long hair tied back, beige blazer.` },
  { id: 'team-5', size: '1024x1024', quality: 'medium', post: 'portrait', prompt: `${PORTRAIT} A Korean man in his early 30s with a clean short haircut, light blue shirt.` },
  { id: 'team-6', size: '1024x1024', quality: 'medium', post: 'portrait', prompt: `${PORTRAIT} A Korean man in his 60s with rimless glasses and a dark suit.` },
];
