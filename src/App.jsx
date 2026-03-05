import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TYPE_META = {
  AMS:        { color:"#f97316", bg:"rgba(249,115,22,0.10)", border:"rgba(249,115,22,0.28)", label:"🎨 AMS" },
  Functional: { color:"#60a5fa", bg:"rgba(96,165,250,0.10)", border:"rgba(96,165,250,0.28)", label:"⚙️ Functional" },
  Scale:      { color:"#a78bfa", bg:"rgba(167,139,250,0.10)", border:"rgba(167,139,250,0.28)", label:"🏛 Scale" },
  Build:      { color:"#34d399", bg:"rgba(52,211,153,0.10)", border:"rgba(52,211,153,0.28)", label:"🔧 Build" },
  Fun:        { color:"#f472b6", bg:"rgba(244,114,182,0.10)", border:"rgba(244,114,182,0.28)", label:"✨ Fun" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_THEMES = [
  "AMS Multi-Colour Showcase","Engineering Materials","Architectural Scale Models","Mechanisms & Print-in-Place",
  "Testing & Data","Documentary & Commission","Historical Aircraft Reconstruction","Fun, Novelty & Visual Spectacle",
  "Workflow & Process","Advanced Techniques","Scale Models — Military & Naval","Year Review & Reflection"
];

// ─── 365 UNIQUE IDEAS ─────────────────────────────────────────────────────────
const IDEAS = [
{id:1,m:0,t:"AMS",title:"8-colour gradient vase lit from within on a black background",fil:"Silk PLA — 8 tones, deep indigo to warm gold"},
{id:2,m:0,t:"AMS",title:"AMS filament buffer mechanism filmed in macro during a live colour switch",fil:"Any multi-colour PLA"},
{id:3,m:0,t:"Scale",title:"Topographic map from USGS open data — 6 elevation colour bands",fil:"PLA — blue/green low elevation through orange/red summit"},
{id:4,m:0,t:"AMS",title:"Structural load path bridge: compression red, tension blue, zero-force white",fil:"PLA Matte — red, blue, white"},
{id:5,m:0,t:"Scale",title:"Gothic vault: silk gold ribs printed into matte stone-grey webs",fil:"Silk PLA Gold, Matte PLA stone grey"},
{id:6,m:0,t:"Scale",title:"Tiger I late-war ambush camouflage in 3 AMS colours — no airbrush",fil:"PLA — Dunkelgelb, Rotbraun, Dunkelgrün"},
{id:7,m:0,t:"Scale",title:"Fallingwater at 1:100 — concrete, glass, and steel each a different filament",fil:"Matte PLA grey, PETG warm white, Silk PLA silver"},
{id:8,m:0,t:"Build",title:"AMS purge tower waste reduction — the settings that cut filament waste by 60%",fil:"PLA across 12 colour combinations"},
{id:9,m:0,t:"Fun",title:"1,000 digits of Pi as a colour-coded physical helix — one digit group per AMS slot",fil:"PLA — 8 colours mapped to digit groups"},
{id:10,m:0,t:"Build",title:"Silk PLA photography: the £40 lighting rig that transforms your print photos",fil:"Silk PLA — multiple colours, same form"},
{id:11,m:0,t:"Build",title:"AMS colour flush matrix — minimum purge volume for all 12 dark-to-light transitions",fil:"PLA across 12 colour pair combinations"},
{id:12,m:0,t:"AMS",title:"Urban massing model: 50 buildings in 5 height-band colours across two machines",fil:"PLA — 5 colours light to dark with building height"},
{id:13,m:0,t:"Functional",title:"Assembly jig in 4 AMS colours — makes assembly mistakes physically impossible",fil:"PLA — blue (locate), red (clamp), yellow (inspect), grey (body)"},
{id:14,m:0,t:"Scale",title:"Building section 1:50 — orange MEP, grey structure, white envelope",fil:"PLA Matte — orange, grey, white"},
{id:15,m:0,t:"Scale",title:"Geological cross-section: 8 strata in silk, matte, and sparkle surface textures",fil:"Silk PLA (igneous), Matte PLA (sedimentary), Sparkle PLA (metamorphic)"},
{id:16,m:0,t:"Scale",title:"HMS Warrior 1860 hull planking — alternating wood-tone filaments, no paint",fil:"PLA — dark and light teak alternating, black waterline stripe"},
{id:17,m:0,t:"Scale",title:"Apollo Lunar Module with deployable legs: gold descent, silver ascent, black bell",fil:"PLA — gold texture, silver, black"},
{id:18,m:0,t:"AMS",title:"Star Destroyer in 6 ILM-style grey panel variation tones",fil:"PLA — 6 subtly different grey and off-white tones"},
{id:19,m:0,t:"Scale",title:"Tatlin's Tower from Soviet archive drawings — 1:500 grey and red AMS chambers",fil:"PLA — structural grey, red accent for rotating chambers"},
{id:20,m:0,t:"AMS",title:"Elevation globe from NASA SRTM data — 8 silk PLA gradient colours",fil:"Silk PLA — 8 colours, deep blue to mountain red"},
{id:21,m:0,t:"Scale",title:"Gothic cathedral flying buttresses at structural limits — limestone at 1:300",fil:"PLA Matte — limestone grey, off-white buttresses, dark grey roof"},
{id:22,m:0,t:"Scale",title:"Cable-stayed bridge with dual-colour PETG stay cables showing tension distribution",fil:"PLA grey (deck/pylons), dual-colour PETG for cables"},
{id:23,m:0,t:"Scale",title:"Roman Colosseum: all 80 arched bays in travertine cream and darker concrete",fil:"PLA Matte — travertine cream, darker concrete, ochre awning posts"},
{id:24,m:0,t:"Fun",title:"Bioluminescent deep-sea creatures in glow PLA with AMS spot colour markings",fil:"Glow-in-the-dark PLA + AMS spot colours for markings"},
{id:25,m:0,t:"Fun",title:"Mechanical perpetual calendar — 7 print-in-place parts in red, blue, and silk gold",fil:"PLA — red (date), blue (day), Silk Gold (month)"},
{id:26,m:0,t:"Fun",title:"Planetary gearbox that ships assembled — AMS colour per moving component",fil:"PLA — separate AMS colour per gear component"},
{id:27,m:0,t:"Fun",title:"Overengineered letter opener — 14 articulating joints, spring-loaded retraction",fil:"PLA — body, joint, accent end caps in 3 AMS colours"},
{id:28,m:0,t:"Scale",title:"Victorian conservatory at 1:20 — cast iron separated from glass and masonry",fil:"PLA black cast iron, clear PETG glass, warm grey masonry"},
{id:29,m:0,t:"Build",title:"AMS humidity card vs sealed dry box — 8-week moisture test on PETG and PA12",fil:"PETG and PA12 — wet and stored specimens compared"},
{id:30,m:0,t:"Build",title:"Year-of-filament data — every spool, material, colour, weight tracked for 365 days",fil:"N/A — data visualisation episode"},
{id:31,m:0,t:"Scale",title:"SS Thistlegorm ghost ship from Barclay Curle shipyard records at 1:350",fil:"PLA — hull grey, rust red waterline, deck tan, superstructure lighter grey"},
{id:32,m:1,t:"Functional",title:"PA12-CF structural cable management bracket that replaced a steel fabrication",fil:"PA12-CF carbon-fibre nylon (enclosed P1S chamber required)"},
{id:33,m:1,t:"Functional",title:"Polycarbonate on the P1S — strength, heat deflection, surface quality tested",fil:"Polycarbonate (PC) — enclosed chamber at 45°C ambient"},
{id:34,m:1,t:"Functional",title:"TPU 95A seals co-printed inside PETG housing — 48-cycle fatigue tested",fil:"PETG (housing), TPU 95A (flex seals)"},
{id:35,m:1,t:"Functional",title:"ABS vs ASA in enclosed P1S — 6 tests: UV, impact, tensile, chemical, thermal, dimensional",fil:"ABS black, ASA white — identical geometry"},
{id:36,m:1,t:"Build",title:"Filament moisture study — wet vs dried across 4 materials, strength compared",fil:"PLA, PETG, PA12, TPU — wet and dried conditions"},
{id:37,m:1,t:"Build",title:"P1S speed modes — tensile strength across Silent, Standard, Sport, Ludicrous",fil:"PLA — identical specimens all four speed modes"},
{id:38,m:1,t:"Build",title:"9 infill patterns under load — the 340% performance gap between best and worst",fil:"PLA — 9 infill patterns at identical density"},
{id:39,m:1,t:"Functional",title:"Thermal camera on a live P1S print — FLIR imaging of layer bonding events",fil:"Any — the content is the thermal profile"},
{id:40,m:1,t:"Build",title:"Bambu Studio: 9 features most users never enable — fuzzy skin, adaptive layers",fil:"PLA — features apply universally"},
{id:41,m:1,t:"Build",title:"First layer on textured PEI — 11 failure modes with diagnosis and fix",fil:"PLA, PETG, ABS, ASA, PA12 — adhesion varies by material"},
{id:42,m:1,t:"Build",title:"Enclosed chamber vs open door — ABS, ASA, and PA12 warp test",fil:"ABS, ASA, PA12 — three enclosed states"},
{id:43,m:1,t:"Build",title:"Silk PLA surface rendering — why standard photography fails and the specific fix",fil:"Silk PLA — multiple colours, same test form"},
{id:44,m:1,t:"Build",title:"P1S acoustic diagnostic guide — every abnormal sound and its mechanical cause",fil:"N/A — sound diagnostic content"},
{id:45,m:1,t:"Functional",title:"Dual P1S overnight — 14 hours, 47 parts, 3 jobs, 1 failure, full data",fil:"Mixed — PLA, PETG, ASA across overnight run"},
{id:46,m:1,t:"Build",title:"Adaptive layer height — same curved surface at fixed 0.2mm vs adaptive",fil:"PLA — same model, fixed vs adaptive layer profile"},
{id:47,m:1,t:"Build",title:"PETG bed adhesion on textured PEI — temperature, cooling speed, and release",fil:"PETG — multiple temperatures and cooling profiles"},
{id:48,m:1,t:"Build",title:"Nozzle wear over 50kg of carbon-fibre filament — documented at 10kg intervals",fil:"PA-CF across 50kg of documented wear"},
{id:49,m:1,t:"Build",title:"Infill density vs strength — 6 density levels, 3 patterns, tensile tested",fil:"PLA — 18 specimens across density and pattern variables"},
{id:50,m:1,t:"Build",title:"First-print checklist for a new P1S — every step before layer one, filmed live",fil:"PLA — calibration print"},
{id:51,m:1,t:"Build",title:"Cooling fan speed vs layer quality — 6 speeds tested on overhangs and bridges",fil:"PLA — identical geometry across cooling speeds"},
{id:52,m:1,t:"Build",title:"Retraction calibration across 6 materials — what Bambu Studio defaults get wrong",fil:"PLA, PETG, ABS, ASA, PA12, TPU"},
{id:53,m:1,t:"Build",title:"Layer adhesion at different chamber temperatures — 5 temperatures, PA12 tensile",fil:"PA12 — 5 temperature conditions"},
{id:54,m:1,t:"Build",title:"Brim, raft, and no adhesion aid — which works for which geometry and material",fil:"PLA, ABS, PETG across 6 test geometries"},
{id:55,m:1,t:"Build",title:"ABS without an enclosure — deliberate warping study with photographic documentation",fil:"ABS — open-air printing, documented failure"},
{id:56,m:1,t:"Build",title:"TPU hardness comparison — 85A vs 92A vs 95A vs 98A printed on P1S AMS",fil:"TPU — 85A, 92A, 95A, 98A grades"},
{id:57,m:1,t:"Build",title:"Wood-fill PLA on a 0.6mm nozzle — the surface finish that stops people in the street",fil:"Wood-fill PLA (requires 0.6mm+ nozzle)"},
{id:58,m:1,t:"Build",title:"Matte vs silk vs sparkle — same model in 3 surface finish types, photographed correctly",fil:"Matte, Silk, Sparkle PLA — same grey form"},
{id:59,m:1,t:"AMS",title:"Multi-colour seam placement — hiding seams vs celebrating them with colour boundaries",fil:"PLA — 6 example prints with seam placement varied"},
{id:60,m:2,t:"Scale",title:"Superstudio Continuous Monument at 1:2000 — the anti-architecture made physical",fil:"PLA Matte — grid white and structural grey"},
{id:61,m:2,t:"Scale",title:"de Havilland Comet 1A at 1:72 — pre-disaster variant from period BOAC drawings",fil:"PLA — BOAC white and blue livery in AMS"},
{id:62,m:2,t:"Scale",title:"Baroque church ceiling at 1:20 — stucco white, silk gold ornament, fresco panels",fil:"PLA white, Silk Gold, pastel blue"},
{id:63,m:2,t:"Scale",title:"Villa Savoye at 1:50 — white pilotis, green roof garden, ribbon windows",fil:"PLA white, green AMS accent, black window frames"},
{id:64,m:2,t:"Scale",title:"Nakagin Capsule Tower single unit at 1:20 — one Kurokawa capsule in full detail",fil:"PLA — capsule grey, porthole ring silver, interior cream"},
{id:65,m:2,t:"Scale",title:"Buckminster Fuller geodesic dome at 1:100 — triangulated structural logic",fil:"PLA — strut grey, node points in contrasting silver"},
{id:66,m:2,t:"Scale",title:"Zaha Hadid MAXXI Rome at 1:200 — compound curves and colour-coded structural lanes",fil:"PLA Matte — concrete white, structural concrete grey, AMS lane colours"},
{id:67,m:2,t:"Scale",title:"Alvar Aalto Finlandia Hall at 1:200 — Carrara marble cladding in matte white PLA",fil:"Matte PLA white (marble), light grey (concrete)"},
{id:68,m:2,t:"Scale",title:"Peter Zumthor Vals Thermal Baths at 1:100 — quartzite grey strata in matte PLA",fil:"Matte PLA — 3 grey tones representing quartzite strata"},
{id:69,m:2,t:"Scale",title:"Liverpool Metropolitan Cathedral — cone and lantern with AMS stained glass sections",fil:"PLA grey cone, AMS coloured lantern glass panels"},
{id:70,m:2,t:"Scale",title:"Jørn Utzon Sydney Opera House shells — the geometry that nearly killed the project",fil:"PLA — ceramic white shells, concrete podium grey"},
{id:71,m:2,t:"Scale",title:"Centre Pompidou — services in AMS: red HVAC, blue water, yellow electrical, green circulation",fil:"PLA — 4 AMS service colours on steel grey structure"},
{id:72,m:2,t:"Scale",title:"Tadao Ando Church of Light at 1:20 — concrete grey with cross as physical void",fil:"PLA Matte — single concrete grey, the cross is void"},
{id:73,m:2,t:"Scale",title:"Louis Kahn Salk Institute at 1:200 — concrete and teak by AMS filament texture",fil:"Matte PLA concrete grey, warm wood-fill PLA teak"},
{id:74,m:2,t:"Scale",title:"Renzo Piano Menil Collection at 1:100 — silk silver roof louvres against warm concrete",fil:"Silk PLA silver (louvres), Matte PLA warm grey (concrete)"},
{id:75,m:2,t:"Scale",title:"Eero Saarinen TWA Terminal at 1:200 — the reinforced concrete shell at its most dramatic",fil:"PLA warm white — single material, the geometry is the content"},
{id:76,m:2,t:"Scale",title:"Denys Lasdun National Theatre at 1:200 — brutalist board-marked concrete in layered PLA",fil:"Matte PLA — 3 concrete tones for the terraced strata"},
{id:77,m:2,t:"Scale",title:"Paul Rudolph Art & Architecture building — corduroy concrete surface in textured PLA",fil:"Matte PLA — ribbed surface finish approximating board-marked concrete"},
{id:78,m:2,t:"Scale",title:"Sir John Soane Museum interior section at 1:20 — every surface a different AMS material",fil:"PLA — 6 surface colours for stone, plaster, wood, and glass"},
{id:79,m:2,t:"Scale",title:"Hans Hollein Haas Haus Vienna at 1:100 — mirror cladding in silk silver PLA",fil:"Silk PLA silver (cladding), PLA stone grey (base)"},
{id:80,m:2,t:"Scale",title:"Rem Koolhaas CCTV Beijing at 1:300 — structural diagrid made visible by AMS colour",fil:"PLA — grey body, contrasting colour for diagrid structure"},
{id:81,m:2,t:"Scale",title:"Santiago Calatrava Turning Torso at 1:200 — each floor plate at a different rotation",fil:"PLA white — the twist geometry is the entire content"},
{id:82,m:2,t:"Scale",title:"Frank Gehry Guggenheim Bilbao at 1:200 — titanium panels in silk silver and blue",fil:"Silk PLA silver and blue-grey tones"},
{id:83,m:2,t:"Scale",title:"Bjarke Ingels Mountain Dwellings at 1:200 — cascading profile with AMS green roofs",fil:"PLA — concrete grey, AMS green roof terraces"},
{id:84,m:2,t:"Scale",title:"SOM Lever House at 1:100 — the curtain wall that changed Manhattan's skyline",fil:"PLA — green glass curtain wall, steel grey frame in AMS"},
{id:85,m:2,t:"Scale",title:"Philip Johnson Glass House at 1:20 — transparent PETG walls against black steel frame",fil:"Clear PETG (glass walls), black PLA (steel frame), brick red (floor)"},
{id:86,m:2,t:"Scale",title:"Mies Barcelona Pavilion at 1:50 — onyx, marble, water as AMS filament materials",fil:"Silk PLA (onyx), warm grey PLA (marble), blue PETG (water)"},
{id:87,m:2,t:"Scale",title:"Frei Otto Munich Olympic Stadium at 1:500 — tensile roof in translucent PETG",fil:"Translucent PETG (membrane), steel grey PLA (masts and cables)"},
{id:88,m:2,t:"Scale",title:"Arne Jacobsen Rødovre Town Hall at 1:200 — curtain wall precision in matte green",fil:"PLA — matte green curtain wall, grey structural frame"},
{id:89,m:2,t:"Scale",title:"Sverre Fehn Norwegian Glacier Museum at 1:100 — concrete bridge over moraine",fil:"Matte PLA — concrete grey, stone brown moraine, water blue"},
{id:90,m:2,t:"Scale",title:"Carlo Scarpa Brion Cemetery at 1:100 — the concrete landscape architects make pilgrimages to",fil:"Matte PLA — warm concrete grey, water blue, grass green"},
{id:91,m:3,t:"Fun",title:"Geneva drive mechanism — 4-slot intermittent rotation, prints assembled in 2 AMS colours",fil:"PLA — driving wheel one colour, Geneva wheel contrasting"},
{id:92,m:3,t:"Fun",title:"Rack and pinion steering linkage at 1:5 — the automotive mechanism explained physically",fil:"PLA — rack in one colour, pinion and column in another"},
{id:93,m:3,t:"Fun",title:"Harmonic drive gear reducer — zero-backlash mechanism prints in place, 3 AMS components",fil:"PLA — flex spline, wave generator, circular spline in 3 colours"},
{id:94,m:3,t:"Fun",title:"Ratchet wrench mechanism — one-way drive, AMS colour per functional component",fil:"PLA — pawl, ratchet wheel, housing in separate AMS colours"},
{id:95,m:3,t:"Build",title:"Living hinge array — 6 geometry variables tested to failure for cycle life comparison",fil:"PETG — 6 hinge geometries at varying wall thickness"},
{id:96,m:3,t:"Fun",title:"Ball-and-socket joint array — 5 socket geometries tested for range of motion",fil:"PLA — 5 socket geometries each a different AMS colour"},
{id:97,m:3,t:"Fun",title:"Snap-fit chain — 50-link print-in-place, stress tested at 5-link increments",fil:"PLA — alternating two AMS colours for visual link separation"},
{id:98,m:3,t:"Fun",title:"Scissor linkage — 8-bar four-point lift mechanism at 1:2, prints assembled",fil:"PLA — fixed links one colour, moving links another"},
{id:99,m:3,t:"Fun",title:"Compliant mechanism gripper — single-piece flex mechanism, no assembly, no fasteners",fil:"PETG — single material, the compliance is geometric"},
{id:100,m:3,t:"Fun",title:"Worm gear drive — self-locking, AMS colour per shaft, entire assembly prints together",fil:"PLA — worm shaft, worm gear, housing in 3 AMS colours"},
{id:101,m:3,t:"Fun",title:"Differential gear — automotive centre diff, 5-colour AMS, ships moving without assembly",fil:"PLA — 5 AMS colours, one per moving component class"},
{id:102,m:3,t:"Fun",title:"Bevel gear pair — 90° drive at 1:1, print-in-place with 0.25mm clearance tested",fil:"PLA — each gear a different AMS colour"},
{id:103,m:3,t:"Fun",title:"Oldham coupling — three-piece misalignment compensator, prints as one assembled object",fil:"PLA — driver, slider, driven each a different AMS colour"},
{id:104,m:3,t:"Fun",title:"Scroll cam mechanism — continuous motion converter, AMS per cam lobe to show phase",fil:"PLA — cam disc, follower arm, base in separate AMS colours"},
{id:105,m:3,t:"Fun",title:"Detent mechanism — indexed positioning, prints assembled, the satisfying click",fil:"PLA — detent wheel and spring-pawl in contrasting AMS colours"},
{id:106,m:3,t:"Fun",title:"Epicyclic gear train — 3-stage compound planetary, each stage a different AMS colour",fil:"PLA — 3 stage colours plus carrier and ring gear"},
{id:107,m:3,t:"Build",title:"Flexure pivot — spring-steel analogue in PLA, zero friction, zero wear, single piece",fil:"PETG — single piece flexure, the spring geometry is designed in"},
{id:108,m:3,t:"Functional",title:"Bowden cable routing jig — precise path geometry, cable installed during print pause",fil:"PLA — jig body, PTFE tube insert during mid-print pause"},
{id:109,m:3,t:"Fun",title:"Peristaltic pump — rotating mechanism for fluid transfer, prints assembled on P1S",fil:"PLA — rotor, tube housing, base in 3 AMS colours"},
{id:110,m:3,t:"Functional",title:"Rack-mounted cable management panel — 19-inch rack format, snap-fit, no fasteners",fil:"PLA — panel body, snap-fit clips in contrasting AMS colour"},
{id:111,m:3,t:"Fun",title:"Magnetic levitation base — FDM-printed holder that positions N42 magnets for stable levitation",fil:"PLA — magnet capture geometry, embedded during print pause"},
{id:112,m:3,t:"Fun",title:"Ackermann steering geometry — correct scale car front axle, exactly right at 1:10",fil:"PLA — stub axles, track rod, steering arm in 3 AMS colours"},
{id:113,m:3,t:"Fun",title:"Toggle clamp mechanism — over-centre locking, print-in-place, locks with one finger",fil:"PLA — toggle arm and base in 2 AMS colours"},
{id:114,m:3,t:"Fun",title:"Geneva stop mechanism — the film projector intermittent drive at 1:1, printed assembled",fil:"PLA — drive disc and Geneva wheel in 2 AMS colours"},
{id:115,m:3,t:"Fun",title:"Clock escapement — anchor escapement, each part a different AMS colour, prints and ticks",fil:"PLA — escape wheel, anchor, pallet in 3 AMS colours"},
{id:116,m:3,t:"Fun",title:"Cycloidal drive — eccentric mechanism, hypnotic rotation, ships assembled",fil:"PLA — eccentric disc, ring pins, output in 3 AMS colours"},
{id:117,m:3,t:"Fun",title:"Centrifugal clutch — fly-weights engage at speed, spring-return at rest, print-in-place",fil:"PLA — fly-weights one colour, drum and shaft another"},
{id:118,m:3,t:"Fun",title:"Cam-follower with spring return — automotive valve train logic at 1:2",fil:"PLA — cam, follower, spring-stand in 3 AMS colours"},
{id:119,m:3,t:"Fun",title:"Nutation drive — wobble plate mechanism, nearly zero parts, surprisingly high ratio",fil:"PLA — wobble disc and output in 2 AMS colours"},
{id:120,m:3,t:"Fun",title:"Hoberman sphere — expand and collapse, AMS colour per scissor layer, ultimate desk toy",fil:"PLA — 4–6 AMS colours, one per scissor link layer"},
{id:121,m:4,t:"Build",title:"PLA annealing — 6 temperature-time combinations: 31% strength gain, 18% brittleness gain",fil:"PLA — 6 annealing profiles, same tensile geometry"},
{id:122,m:4,t:"Build",title:"UV degradation — 6 materials after 90 days outdoor exposure, colour and strength compared",fil:"PLA, PETG, ABS, ASA, PLA+, PETG-CF"},
{id:123,m:4,t:"Build",title:"Chemical resistance — 8 FDM materials vs 10 household chemicals, visual and dimensional",fil:"PLA, PETG, ABS, ASA, PA12, PC, TPU, PETG-CF"},
{id:124,m:4,t:"Build",title:"Print orientation vs strength — same geometry, 3 orientations, tensile compared",fil:"PLA — flat, on-edge, and upright orientations"},
{id:125,m:4,t:"Build",title:"Seam placement effect on mechanical strength — 4 seam positions under tensile load",fil:"PLA — 4 seam placement specimens, identical geometry"},
{id:126,m:4,t:"Build",title:"Bed levelling mesh resolution — 3×3 vs 5×5 vs 7×7, first layer quality compared",fil:"PLA — first layer comparison across mesh resolutions"},
{id:127,m:4,t:"Build",title:"Wall count vs structural performance — 2 to 6 perimeter walls in flexural loading",fil:"PLA — 5 wall count specimens, identical infill"},
{id:128,m:4,t:"Build",title:"Top surface quality across 4 infill patterns — ironing on vs off, 8 combinations",fil:"PLA — 8 specimens across infill and ironing variables"},
{id:129,m:4,t:"Build",title:"Temperature tower analysis — the actual optimal nozzle temperature, not the label",fil:"PLA, PETG — temperature towers 5°C increments"},
{id:130,m:4,t:"Build",title:"Extrusion multiplier calibration — the single-wall cube method, every step filmed",fil:"PLA — calibration cube, single-wall, measured with calipers"},
{id:131,m:4,t:"Build",title:"Elephant foot compensation — measuring the dimensional error and applying the correction",fil:"PLA — dimensional test geometry before and after compensation"},
{id:132,m:4,t:"Build",title:"Z-offset precision — the difference each 0.05mm increment makes to first layer",fil:"PLA — first layer comparison 0.05mm increments"},
{id:133,m:4,t:"Build",title:"Gyroid vs lightning infill — structural performance per gram of filament used",fil:"PLA — gyroid and lightning at identical print weight"},
{id:134,m:4,t:"Build",title:"Perimeter overlap vs strength — where wall bonds to infill determines inter-layer strength",fil:"PLA — 5 overlap values, tensile tested to failure"},
{id:135,m:4,t:"Build",title:"Gap fill quality across 3 Bambu Studio slicer profiles — the fine detail that matters",fil:"PLA — gap fill test geometry across 3 profiles"},
{id:136,m:4,t:"Build",title:"AMS transition quality across 8 purge volumes — contamination vs waste graph",fil:"PLA — black to white transition at 8 purge volumes"},
{id:137,m:4,t:"Build",title:"Bridge length vs success rate — maximum unsupported span on P1S at 4 speed modes",fil:"PLA — bridge test geometry 10mm to 100mm spans"},
{id:138,m:4,t:"Build",title:"Overhang angle at 4 cooling settings — the real support-free maximum angle for P1S",fil:"PLA — overhang tower 30° to 80° at 4 cooling speeds"},
{id:139,m:4,t:"Build",title:"Support interface material effect — 8 AMS material combinations, surface quality compared",fil:"PLA body + 7 different interface materials via AMS"},
{id:140,m:4,t:"Build",title:"Minimum wall thickness at 0.4mm nozzle — the real printable limit photographed",fil:"PLA — wall thickness test from 0.4mm to 2.0mm"},
{id:141,m:4,t:"Build",title:"First layer squish vs z-offset — photographed at every 0.01mm step",fil:"PLA — first layer photography study"},
{id:142,m:4,t:"Build",title:"Stringing comparison across 10 materials at identical retraction — the honest ranking",fil:"10 materials — retraction tower geometry"},
{id:143,m:4,t:"Build",title:"Speed creep test — print quality at 10% speed increments from 50% to 300%",fil:"PLA — same geometry at 26 speed settings"},
{id:144,m:4,t:"Build",title:"Inter-colour adhesion — tensile test on AMS prints at the two-filament boundary",fil:"PLA — 6 colour pairs, tensile tested at the boundary"},
{id:145,m:4,t:"Build",title:"Enclosure passive temperature over 1-hour prints — heat soak with thermal camera",fil:"ABS — passive enclosure temperature rise over print duration"},
{id:146,m:4,t:"Build",title:"Filament diameter consistency — 5 brands of same PLA across 10-metre samples",fil:"PLA — 5 brand comparison, micrometer measurements"},
{id:147,m:4,t:"Build",title:"Input shaping (vibration compensation) — before and after surface quality at Ludicrous",fil:"PLA — surface quality comparison, input shaping on vs off"},
{id:148,m:4,t:"Build",title:"Multi-material interface geometry — 12 joint designs for inter-material bond strength",fil:"PLA + PETG — 12 interface geometries, tensile tested"},
{id:149,m:4,t:"Functional",title:"Thread insert vs printed thread — M3 to M8 pull-out strength, 5 installation methods",fil:"PLA and PETG — 5 thread types per size"},
{id:150,m:4,t:"Build",title:"Printed vs machined tolerance — P1S dimensional accuracy across 20 calibration geometries",fil:"PLA — 20 dimensional test pieces measured with calipers"},
{id:151,m:4,t:"Build",title:"Layer height vs strength — complete profile from 0.05mm to 0.3mm every 0.05mm step",fil:"PLA — 6 layer heights, tensile tested to failure"},
{id:152,m:5,t:"Scale",title:"Commission diary: listed building heritage model for a planning conservation application",fil:"Project-dependent — document the actual commission"},
{id:153,m:5,t:"Functional",title:"Commission diary: product design prototype for a Kickstarter hardware campaign",fil:"Project-dependent — document the actual commission"},
{id:154,m:5,t:"Scale",title:"Commission diary: theatrical prop for a professional stage production",fil:"Project-dependent — document the actual commission"},
{id:155,m:5,t:"Scale",title:"Commission diary: educational museum model for a natural history collection",fil:"Project-dependent — document the actual commission"},
{id:156,m:5,t:"Scale",title:"Commission diary: a customer's childhood home at 1:100 as a bespoke gift",fil:"Project-dependent — document the actual commission"},
{id:157,m:5,t:"Functional",title:"Commission diary: industrial assembly jig for a manufacturer reducing errors",fil:"Project-dependent — document the actual commission"},
{id:158,m:5,t:"Scale",title:"Commission diary: vehicle scale model for an automotive design studio",fil:"Project-dependent — document the actual commission"},
{id:159,m:5,t:"Scale",title:"Commission diary: art installation component for a contemporary gallery",fil:"Project-dependent — document the actual commission"},
{id:160,m:5,t:"Functional",title:"Commission diary: medical training model for a hospital simulation centre",fil:"Project-dependent — document the actual commission"},
{id:161,m:5,t:"Scale",title:"Commission diary: architectural competition entry model under time pressure",fil:"Project-dependent — document the actual commission"},
{id:162,m:5,t:"Build",title:"Day in the life — full dual P1S print day from 8am to 8pm",fil:"Mixed — whatever is actually running that day"},
{id:163,m:5,t:"Build",title:"Studio tour — physical setup, organisation, and tools for dual-machine production",fil:"N/A — environment and equipment tour"},
{id:164,m:5,t:"Build",title:"Tool kit — every non-printer tool in the FDM studio and what it replaces",fil:"N/A — equipment and tooling tour"},
{id:165,m:5,t:"Build",title:"Workflow walkthrough — from client email to shipped model, every decision documented",fil:"N/A — process documentation"},
{id:166,m:5,t:"Build",title:"Pricing methodology — how to price FDM commissions without losing money",fil:"N/A — business methodology"},
{id:167,m:5,t:"Build",title:"Iteration discipline — knowing when to print again vs when to declare done",fil:"N/A — decision framework"},
{id:168,m:5,t:"Build",title:"Photography setup tour — complete studio lighting for product photography",fil:"N/A — photography equipment tour"},
{id:169,m:5,t:"Build",title:"File organisation system — managing hundreds of print jobs across two printers",fil:"N/A — digital workflow"},
{id:170,m:5,t:"Build",title:"Client communication — managing expectations around FDM tolerances and lead times",fil:"N/A — business methodology"},
{id:171,m:5,t:"Build",title:"Failure library — documenting every print failure systematically for future reference",fil:"N/A — failure documentation methodology"},
{id:172,m:5,t:"Build",title:"Post-processing without paint — acetone smoothing, heat-gun texturing, sanding",fil:"ABS (acetone), PLA (heat gun), PETG (wet sand)"},
{id:173,m:5,t:"Build",title:"Best free STL sources for professional FDM work — a curated and tested shortlist",fil:"N/A — resource guide"},
{id:174,m:5,t:"Functional",title:"Reverse engineering a part from caliper measurements alone — the methodology",fil:"PETG-CF — reverse-engineered functional replacement"},
{id:175,m:5,t:"Build",title:"Designing for FDM — 12 geometric rules that prevent print failures before they happen",fil:"PLA — 12 rule demonstration geometry"},
{id:176,m:5,t:"Build",title:"Support-free design principles — how to orient and modify geometry to eliminate supports",fil:"PLA — before-and-after redesign for support-free printing"},
{id:177,m:5,t:"Build",title:"AMS workflow optimisation — sequencing a week of multi-colour jobs across both machines",fil:"Mixed — production scheduling methodology"},
{id:178,m:5,t:"Build",title:"Batch production planning — how to fill a build plate intelligently for maximum yield",fil:"PLA — plate-packing methodology with visual examples"},
{id:179,m:5,t:"Build",title:"Material stock management — what to keep on the shelf, FIFO rotation protocols",fil:"N/A — inventory methodology"},
{id:180,m:5,t:"Build",title:"The FDM business model — what clients pay for vs what they think they want",fil:"N/A — business methodology"},
{id:181,m:5,t:"Build",title:"Dual printer coordination — how to assign jobs across two P1S machines without conflicts",fil:"Mixed — scheduling and coordination methodology"},
{id:182,m:6,t:"Scale",title:"Blohm & Voss BV 141 asymmetric WWII aircraft — the plane that shouldn't have flown",fil:"PLA — RLM grey 75/76 upper, light blue underside"},
{id:183,m:6,t:"Scale",title:"Messerschmitt Me 323 Gigant at 1:200 — the largest land-based aircraft of WWII",fil:"PLA — RLM 70/71 splinter camo in AMS"},
{id:184,m:6,t:"Scale",title:"Heinkel He 177 Grief at 1:144 — the heavy bomber with twin-coupled engines",fil:"PLA — RLM grey scheme, distinctive exhaust stains in AMS"},
{id:185,m:6,t:"Scale",title:"Vought V-173 Flying Pancake at 1:48 — the disc-wing experimental aircraft",fil:"PLA — US Navy blue-grey scheme"},
{id:186,m:6,t:"Scale",title:"Northrop YB-49 Flying Wing at 1:144 — the jet bomber 50 years ahead of its time",fil:"PLA — natural metal finish in Silk Silver PLA"},
{id:187,m:6,t:"Scale",title:"Convair XB-53 swept-forward-wing bomber at 1:72 — 1948, never built",fil:"PLA — USAF bare metal finish in Silk Silver"},
{id:188,m:6,t:"Scale",title:"Martin Mars flying boat at 1:200 — the largest operational flying boat",fil:"PLA — RCAF white and red scheme"},
{id:189,m:6,t:"Scale",title:"Saunders-Roe Princess flying boat at 1:200 — the luxury liner that never flew passengers",fil:"PLA — BOAC white and Speedbird blue"},
{id:190,m:6,t:"Scale",title:"Bristol Brabazon at 1:200 — the British Empire airliner that arrived too late",fil:"PLA — BOAC white upper, grey lower, Speedbird blue cheatline"},
{id:191,m:6,t:"Scale",title:"Avro Canada CF-105 Arrow at 1:72 — the supersonic interceptor Canada destroyed",fil:"PLA — RCAF natural metal finish, Silk Silver"},
{id:192,m:6,t:"Scale",title:"TSR-2 British strike aircraft at 1:72 — cancelled the year it proved itself fastest",fil:"PLA — RAF white and grey scheme"},
{id:193,m:6,t:"Scale",title:"P-1154 supersonic Harrier at 1:72 — the aircraft that would have simplified the Falklands",fil:"PLA — RAF Harrier grey-green scheme, AMS roundels"},
{id:194,m:6,t:"Scale",title:"Hawker Siddeley HS.681 jet transport at 1:144 — cancelled the same week as TSR-2",fil:"PLA — RAF Transport Command grey and white"},
{id:195,m:6,t:"Scale",title:"Concorde B stretched variant at 1:144 — the extended-range version never produced",fil:"PLA — British Airways white with Silk Silver Concorde nose"},
{id:196,m:6,t:"Scale",title:"Boeing 2707 SST at 1:144 — the American supersonic transport that lost to Concorde",fil:"PLA — American Airlines livery in AMS"},
{id:197,m:6,t:"Scale",title:"Lockheed L-2000 SST at 1:144 — the alternative to the 2707 not chosen",fil:"PLA — delta-wing natural metal finish"},
{id:198,m:6,t:"Scale",title:"McDonnell Douglas DC-10 original proposal at 1:200 — before the cargo door decision",fil:"PLA — launch customer livery in AMS"},
{id:199,m:6,t:"Scale",title:"Junkers Ju 390 at 1:144 — the transatlantic bomber that reached New York",fil:"PLA — Luftwaffe day bomber scheme, AMS crosses"},
{id:200,m:6,t:"Scale",title:"Dornier Do 214 at 1:200 — the flying boat for 100 passengers across the Atlantic",fil:"PLA — Lufthansa pre-war livery"},
{id:201,m:6,t:"Scale",title:"Heinkel He 274 at 1:72 — the altitude bomber built in occupied France",fil:"PLA — Luftwaffe high-altitude grey scheme"},
{id:202,m:6,t:"Scale",title:"Lippisch P.13 ramjet delta at 1:48 — the ancestor of Concorde",fil:"PLA — unpainted aluminium construction, Silk Silver"},
{id:203,m:6,t:"Scale",title:"Horten Ho 229 flying wing jet fighter at 1:48 — from surviving drawings",fil:"PLA — RLM 76/75 scheme on the flying wing form"},
{id:204,m:6,t:"Scale",title:"Blohm & Voss P.188 offset-cockpit jet bomber at 1:72 — the 1943 Hamburg design",fil:"PLA — Luftwaffe night scheme, RLM 76/74"},
{id:205,m:6,t:"Scale",title:"Focke-Wulf Fw 300 intercontinental airliner design of 1939 — never built",fil:"PLA — Lufthansa pre-war silver livery"},
{id:206,m:6,t:"Scale",title:"Arado Ar 234 C four-engine jet bomber variant at 1:72 — never entered service",fil:"PLA — Luftwaffe late-war scheme, AMS crosses"},
{id:207,m:6,t:"Scale",title:"BMW Schnellbomber jet bomber design at 1:72 — the 1944 study influencing all postwar jets",fil:"PLA — Luftwaffe unpainted aluminium scheme"},
{id:208,m:6,t:"Scale",title:"Junkers EF 132 swept-wing jet bomber at 1:144 — the German design that became Soviet",fil:"PLA — Luftwaffe scheme reconstructed from blueprints"},
{id:209,m:6,t:"Scale",title:"Bachem Ba 349 Natter rocket interceptor at 1:24 — the pilot's worst nightmare",fil:"PLA — bare spruce wood finish in wood-fill PLA"},
{id:210,m:6,t:"Scale",title:"Heinkel He 162 B enlarged Volksjäger variant at 1:48 — stayed on the drawing board",fil:"PLA — Luftwaffe multi-colour mottled scheme in AMS"},
{id:211,m:6,t:"Scale",title:"Gotha Go 229 V3 production prototype at 1:48 — the third aircraft that would have served",fil:"PLA — RLM 76/75/74 scheme on the flying wing"},
{id:212,m:6,t:"Scale",title:"Messerschmitt P.1101 variable-sweep wing at 1:48 — the jet that became the F-111",fil:"PLA — Luftwaffe test aircraft scheme"},
{id:213,m:7,t:"Fun",title:"Möbius strip — one-sided surface with 360° twist, printed in silk copper PLA",fil:"Silk Copper PLA"},
{id:214,m:7,t:"Fun",title:"Klein bottle — the surface with no inside, printed as two halves",fil:"Clear PETG or translucent PLA"},
{id:215,m:7,t:"Fun",title:"Tensegrity table — floating top held by compression struts and tension strings",fil:"PLA — white compression struts, grey top and base"},
{id:216,m:7,t:"Fun",title:"Voronoi lamp shade — generative structure in translucent PETG for maximum light scatter",fil:"Translucent PETG — single material"},
{id:217,m:7,t:"Fun",title:"Gyroid infinity cube — the standard infill pattern used as the entire object, lit from within",fil:"Clear or translucent PETG"},
{id:218,m:7,t:"Fun",title:"Impossible triangle — Penrose tribar at 1:1, printed for a single correct viewing angle",fil:"PLA — single colour, the geometry is the trick"},
{id:219,m:7,t:"Fun",title:"Self-folding origami — living hinges enabling a flat-printed sheet to assemble in 3D",fil:"PETG — flat print, hinge geometry enables 3D form"},
{id:220,m:7,t:"Fun",title:"Nested dodecahedra — 5 concentric shells, all print-in-place, each a different AMS colour",fil:"PLA — 5 AMS colours, one per nested shell"},
{id:221,m:7,t:"Fun",title:"Escher tessellation tile set — MC Escher interlocking bird and fish tiles at 1:1",fil:"PLA — two contrasting AMS colours, bird and fish differentiated"},
{id:222,m:7,t:"Fun",title:"Spirograph geometry — parametric rose curves as a functional drawing instrument",fil:"PLA — gears and template in 2 AMS colours"},
{id:223,m:7,t:"Fun",title:"Archimedes screw at 1:5 — the functional model that actually lifts water",fil:"PLA — screw in one colour, housing in another"},
{id:224,m:7,t:"Scale",title:"Turbine blade at 1:1 from aeronautical specification — the surface finish that stuns",fil:"PA12-CF — for correct stiffness and surface quality"},
{id:225,m:7,t:"Fun",title:"Hyperbolic paraboloid — the saddle surface every architecture student draws but never holds",fil:"PLA — single colour, the geometry is the entire content"},
{id:226,m:7,t:"Fun",title:"Reuleaux triangle — the shape that rotates inside a square and drills square holes",fil:"PLA — the triangle in one colour, the square housing in another"},
{id:227,m:7,t:"Fun",title:"Weaire-Phelan foam structure — the most efficient space-filling geometry",fil:"Translucent PLA or PETG"},
{id:228,m:7,t:"Fun",title:"Fibonacci spiral array — 34 spirals at 137.5° golden angle, the sunflower seed pattern",fil:"PLA — gradient of AMS colours from centre outward"},
{id:229,m:7,t:"Fun",title:"Lissajous curve sculpture — 3D parametric curves at 5 frequency ratios",fil:"PLA — 5 AMS colours, one per frequency ratio"},
{id:230,m:7,t:"Fun",title:"Schwarz minimal surface — the surface that minimises area for a given boundary",fil:"Translucent PETG — single material"},
{id:231,m:7,t:"Fun",title:"Clifford torus cross-section — a 4-dimensional object rendered in 3D at a specific angle",fil:"Silk PLA — the 4D geometry needs a surface that catches light"},
{id:232,m:7,t:"Fun",title:"Seashell parametric series — 6 mollusc morphologies from a single equation varied",fil:"PLA — 6 AMS colours, one per species morphology"},
{id:233,m:7,t:"Fun",title:"Crystal lattice structures — 8 unit cells in glass-clear PETG showing cubic and hexagonal packing",fil:"Clear PETG — 8 unit cell geometries"},
{id:234,m:7,t:"Fun",title:"Human cochlea at 10:1 scale — the spiral canal of the inner ear, anatomically accurate",fil:"PLA Matte — anatomical cream"},
{id:235,m:7,t:"Fun",title:"Tree branch fractal — L-system generated, 6 iterations, branching in all 3 axes",fil:"PLA — green branch tips, brown trunk, bark texture"},
{id:236,m:7,t:"Fun",title:"Penrose tiling set — the aperiodic tile set that tiles the plane without ever repeating",fil:"PLA — two AMS colours for the two tile types"},
{id:237,m:7,t:"Scale",title:"Antikythera mechanism gear train at 2:1 — the first known geared computing machine",fil:"PLA Bronze or Silk Gold"},
{id:238,m:7,t:"Fun",title:"Biomimetic cellular structure — biological growth simulation as load-optimised geometry",fil:"PLA — single matte colour, the structure is the content"},
{id:239,m:7,t:"Functional",title:"Weaving pattern generator — printed shuttle and loom components for actual textile production",fil:"PLA — shuttle, heddle frames, reed in 3 AMS colours"},
{id:240,m:7,t:"Fun",title:"Dragon curve fractal — 12 iterations of the paper-folding sequence as a physical object",fil:"PLA — AMS gradient from start to end of the curve"},
{id:241,m:7,t:"Fun",title:"Gosper island space-filling curve at iteration 4 — fractal geometry you can hold",fil:"PLA — single colour, the self-similarity is the content"},
{id:242,m:7,t:"Fun",title:"Sierpinski triangle at recursion depth 6 — infinite complexity you can hold",fil:"PLA — two AMS colours for occupied vs void triangles"},
{id:243,m:7,t:"Fun",title:"Snowflake crystal series — 6 hexagonal ice crystal morphologies at 10:1 scale",fil:"PLA or PETG in ice white and clear"},
{id:244,m:8,t:"Build",title:"G-code exposed — split screen showing machine language commands executing live",fil:"PLA — any test print, the content is the code"},
{id:245,m:8,t:"Build",title:"Layer 0 analysis — what P1S firmware does before layer 1 ever begins printing",fil:"PLA — calibration print, firmware trace"},
{id:246,m:8,t:"Build",title:"Print start sequence decoded — every G-code command from homing to first extrusion",fil:"PLA — any standard print start"},
{id:247,m:8,t:"Build",title:"Slicer preview vs reality — 11 cases where Bambu Studio's preview misleads",fil:"PLA — 11 specific geometry types"},
{id:248,m:8,t:"Build",title:"Printer calibration sequence — the full P1S routine before a production run",fil:"PLA — calibration cube, flow test, first layer test"},
{id:249,m:8,t:"Build",title:"Build plate selection guide — which Bambu surface for which material and geometry",fil:"PLA, PETG, ABS, ASA — all 4 plate surfaces tested"},
{id:250,m:8,t:"Build",title:"Part orientation decision tree — the 6 questions that determine optimal print orientation",fil:"PLA — 6 example geometries, correct and incorrect orientation"},
{id:251,m:8,t:"Build",title:"Support strategy matrix — optimal configuration for 8 geometry types in Bambu Studio",fil:"PLA — 8 geometry types, before and after support comparison"},
{id:252,m:8,t:"Build",title:"AMS slot assignment strategy — sequencing colours for minimum purge tower waste",fil:"PLA — multi-colour print, AMS slot sequence optimised"},
{id:253,m:8,t:"Build",title:"Print time estimation accuracy — how wrong Bambu Studio's estimates are and exactly why",fil:"PLA — 10 prints, estimated vs actual time recorded"},
{id:254,m:8,t:"Build",title:"Multi-part assembly tolerance guide — clearances required for different fit types in FDM",fil:"PLA — clearance fit, press fit, and slip fit test pieces"},
{id:255,m:8,t:"Build",title:"Finishing workflow — the 5-step post-print process for commission-grade surface quality",fil:"PLA, PETG — finishing sequence documented on same print"},
{id:256,m:8,t:"Build",title:"Photography workflow — from print to final image in under 30 minutes, every step shown",fil:"Any — the content is the photography process"},
{id:257,m:8,t:"Build",title:"File naming and archiving system — a structure that works across hundreds of print jobs",fil:"N/A — digital workflow system"},
{id:258,m:8,t:"Build",title:"Quality control checklist — 12 things to check before shipping any commission",fil:"N/A — QC methodology applied to a real print"},
{id:259,m:8,t:"Build",title:"Material selection decision tree — choosing between 8 FDM materials for any application",fil:"PLA, PETG, ABS, ASA, PA12, PC, TPU, PETG-CF"},
{id:260,m:8,t:"AMS",title:"Colour strategy for multi-colour prints — design rules that make AMS decisions work",fil:"PLA — 6 example prints with colour strategy annotated"},
{id:261,m:8,t:"Build",title:"Print farm economics — at what production volume does a second printer pay for itself",fil:"N/A — economic analysis with real cost data"},
{id:262,m:8,t:"Build",title:"Filament inventory management — FIFO rotation, minimum stock, humidity protocols",fil:"N/A — inventory methodology"},
{id:263,m:8,t:"Build",title:"Client brief template — the 8 questions that prevent every common misunderstanding",fil:"N/A — brief template methodology"},
{id:264,m:8,t:"Build",title:"Iteration log system — documenting every print version and the specific change tested",fil:"N/A — applied to a real 4-iteration commission"},
{id:265,m:8,t:"Build",title:"Time tracking methodology — measuring actual vs estimated print time over 30 prints",fil:"N/A — time tracking system applied to 30 real prints"},
{id:266,m:8,t:"Build",title:"Packaging for shipping — protecting printed objects for courier delivery without damage",fil:"N/A — packaging methodology with 3 fragility levels"},
{id:267,m:8,t:"Build",title:"Studio organisation — the physical layout that makes dual P1S work efficient",fil:"N/A — studio setup and organisation tour"},
{id:268,m:8,t:"Build",title:"Social media content capture — what to film during a print session for a full week",fil:"N/A — content capture methodology"},
{id:269,m:8,t:"Build",title:"Content planning system — the weekly workflow behind consistent posting on all 4 platforms",fil:"N/A — content planning methodology"},
{id:270,m:8,t:"Build",title:"Editing workflow — voiceover video from raw footage to published in under 2 hours",fil:"N/A — video editing workflow"},
{id:271,m:8,t:"Build",title:"Analytics review — which content type generates commissions vs views vs followers",fil:"N/A — platform analytics interpretation"},
{id:272,m:8,t:"Build",title:"Annual planning — how to map 52 weeks of content around a real print schedule",fil:"N/A — annual content planning system"},
{id:273,m:8,t:"Build",title:"The £340 commercial architectural part — printed in PLA-CF for £6.20, both tested",fil:"PLA-CF — the FDM print vs the commercial equivalent"},
{id:274,m:9,t:"Build",title:"Variable infill density — modifier meshes creating reinforced zones within a single print",fil:"PLA — modifier mesh with high infill at stress concentration zones"},
{id:275,m:9,t:"AMS",title:"Multi-body STL workflow — designing for AMS colour in 3 different CAD packages",fil:"PLA — same design in 3 CAD tools, AMS assignment compared"},
{id:276,m:9,t:"AMS",title:"Colour mapping from 2D artwork to 3D surface — the complete conversion workflow",fil:"PLA — 2D image translated to AMS colour zones on 3D geometry"},
{id:277,m:9,t:"Functional",title:"Embedded magnets — printing cavities that capture N42 magnets mid-print",fil:"PLA — designed cavities, magnets inserted at layer pause"},
{id:278,m:9,t:"Functional",title:"Pause-and-insert workflow — adding threaded nuts, copper inserts, electronics during print",fil:"PLA — mid-print pause demonstrated for 3 insert types"},
{id:279,m:9,t:"Functional",title:"Thread-on-print technique — tapping directly into PLA, PETG, and PA12",fil:"PLA, PETG, PA12 — tapped thread pull-out tested"},
{id:280,m:9,t:"Functional",title:"Heat-set insert installation — correct soldering tip, temperature, and insertion",fil:"PLA, PETG — M2 to M6 inserts, pull-out tested"},
{id:281,m:9,t:"Functional",title:"Dovetail joint geometry for FDM — specific dimensions and tolerances that actually hold",fil:"PLA — dovetail geometry series tested in shear"},
{id:282,m:9,t:"Build",title:"Snap-fit design rules — the cantilever beam geometry behind a satisfying and reliable click",fil:"PLA — 5 snap-fit geometries, cycle tested"},
{id:283,m:9,t:"Build",title:"Living hinge optimisation — wall thickness, width, and layer orientation for cycle life",fil:"PETG — 6 hinge geometry variables, cycle tested"},
{id:284,m:9,t:"Build",title:"Painting over FDM — primer, paint, and clear coat sequence for professional results",fil:"PLA — model painted through full sequence"},
{id:285,m:9,t:"Build",title:"Resin coating over FDM — XTC-3D application and sanding sequence for glass finish",fil:"PLA — XTC-3D applied, sanding and finish documented"},
{id:286,m:9,t:"Build",title:"Acetone vapour smoothing of ABS — the sealed chamber technique and result quality",fil:"ABS — before and after acetone vapour, measured surface roughness"},
{id:287,m:9,t:"Build",title:"Electroplating FDM prints — conductive paint, copper plating bath, the actual process",fil:"PLA — conductive primer, copper plated to 0.1mm"},
{id:288,m:9,t:"Functional",title:"Silicone moulding from FDM masters — from P1S print to flexible production mould",fil:"PLA master, platinum silicone mould material"},
{id:289,m:9,t:"Functional",title:"Vacuum forming over FDM tooling — temperature, draft angles, tooling surface requirements",fil:"PLA tooling — HIPS vacuum formed over the FDM master"},
{id:290,m:9,t:"Functional",title:"FDM jig for desktop CNC machining — printed workholding that replaces machined aluminium",fil:"PLA — workholding jig tested on a desktop CNC"},
{id:291,m:9,t:"Functional",title:"Printed PCB enclosures — tolerances for connectors, buttons, and displays",fil:"PETG — enclosure with USB, button, and OLED cutouts"},
{id:292,m:9,t:"Build",title:"Waterproofing FDM prints — 4 methods tested for submersion at 1 metre for 24 hours",fil:"PETG — 4 waterproofing methods on identical geometry"},
{id:293,m:9,t:"Build",title:"6-month outdoor weathering — 6 materials exposed to UK weather, tested monthly",fil:"PLA, PETG, ABS, ASA, PLA+, PETG-CF — 6-month study"},
{id:294,m:9,t:"Build",title:"Fatigue life testing — cycles to failure for living hinges across 4 FDM materials",fil:"PLA, PETG, ABS, PETG-CF — hinge geometry, cycle tested"},
{id:295,m:9,t:"Build",title:"Acoustic properties of FDM infill patterns — vibration damping across 6 patterns",fil:"PLA — 6 infill patterns, vibration transmission measured"},
{id:296,m:9,t:"Build",title:"Thermal conductivity through infill patterns — heat transfer measured with thermocouples",fil:"PLA — 6 infill patterns at 2 densities, thermal gradient measured"},
{id:297,m:9,t:"Build",title:"Electrically conductive PLA — resistance per centimetre tested, use cases demonstrated",fil:"Conductive PLA — resistance measured across 5 geometries"},
{id:298,m:9,t:"Build",title:"Magnetic iron-fill PLA — actual magnetic response measured, print quality documented",fil:"Iron-fill PLA — magnetic field strength measured"},
{id:299,m:9,t:"Build",title:"Glow-in-the-dark charge time — UV, sunlight, white LED, and darkness decay compared",fil:"Glow PLA — 4 charge sources, brightness decay timed"},
{id:300,m:9,t:"Build",title:"TPU Shore hardness demonstrated — 4 grades felt, compressed, and bent on camera",fil:"TPU — 85A, 92A, 95A, 98A on identical geometry"},
{id:301,m:9,t:"Build",title:"Wood-fill PLA sanding and finishing — the sequence that produces furniture-grade quality",fil:"Wood-fill PLA — sanding sequence 80 to 3000 grit"},
{id:302,m:9,t:"Build",title:"Metal-fill cold casting — bronze, copper, and iron fill polished to near-mirror finish",fil:"Bronze-fill, copper-fill, iron-fill PLA — polished to finish"},
{id:303,m:9,t:"Build",title:"Marble-fill polishing sequence — the finish that passes as stone to touch",fil:"Marble-fill PLA — polishing sequence to stone-like finish"},
{id:304,m:9,t:"Build",title:"Carbon-fibre fill vs chopped CF-reinforced nylon — strength per gram compared",fil:"PLA-CF vs PA12-CF — identical geometry, tensile compared"},
{id:305,m:10,t:"Scale",title:"Spitfire Mk IX at 1:35 with D-Day invasion stripes — no decals, pure AMS",fil:"PLA — RAF temperate sea scheme, AMS invasion stripes"},
{id:306,m:10,t:"Scale",title:"Lancaster bomb bay detail at 1:72 — open bomb doors with a Tallboy inside",fil:"PLA — RAF black underside, bomb bay interior detail"},
{id:307,m:10,t:"Scale",title:"Me 262 twin-engine jet at 1:100 — engine nacelles in contrasting grey",fil:"PLA — RLM 76/75 upper, light blue lower, darker nacelles"},
{id:308,m:10,t:"Scale",title:"Focke-Wulf Fw 190 D at 1:48 — the long-nose Dora in RLM 82/83/76",fil:"PLA — RLM 82 green, 83 dark green, 76 light blue in AMS"},
{id:309,m:10,t:"Scale",title:"P-51D Mustang at 1:72 — natural metal finish in Silk Silver, no paint required",fil:"Silk Silver PLA — natural metal, AMS invasion stripes"},
{id:310,m:10,t:"Scale",title:"Boeing B-29 Superfortress at 1:200 — the bomber that changed the Pacific war",fil:"PLA — bare metal Silk Silver, black undersides"},
{id:311,m:10,t:"Scale",title:"Short Sunderland flying boat at 1:144 — maritime patrol with gun turrets in AMS",fil:"PLA — RAF Coastal Command white/grey scheme, turrets contrasting"},
{id:312,m:10,t:"Scale",title:"de Havilland Mosquito at 1:72 — the wooden wonder in AMS brown and green",fil:"PLA — RAF dark earth and dark green scheme in AMS"},
{id:313,m:10,t:"Scale",title:"Hawker Typhoon at 1:48 — the tank-buster with rocket rails in contrasting colour",fil:"PLA — RAF dark green/ocean grey, AMS invasion stripes and rockets"},
{id:314,m:10,t:"Scale",title:"Vickers Wellington at 1:100 — the geodesic basket-weave airframe exposed",fil:"PLA — geodesic structure in AMS contrasting colour to fabric"},
{id:315,m:10,t:"Scale",title:"HMS Hood battlecruiser at 1:350 — Royal Navy interwar prestige defined",fil:"PLA — Admiralty grey, teak deck AMS colour, RN ensign"},
{id:316,m:10,t:"Scale",title:"USS Missouri battleship at 1:700 — the ship on whose deck the Pacific war ended",fil:"PLA — US Navy Measure 22 camouflage in AMS"},
{id:317,m:10,t:"Scale",title:"Bismarck at 1:350 — the German battleship in full beam from Kriegsmarine records",fil:"PLA — Kriegsmarine grey scheme"},
{id:318,m:10,t:"Scale",title:"HMS Dreadnought 1906 at 1:700 — the ship that made every existing navy obsolete",fil:"PLA — Edwardian RN grey, distinctive cage mast structure"},
{id:319,m:10,t:"Scale",title:"Graf Spee pocket battleship at 1:350 — the ship that ended itself in Montevideo",fil:"PLA — Kriegsmarine scheme, the scuttled waterline state"},
{id:320,m:10,t:"Scale",title:"Yamato at 1:700 — the largest battleship ever built from IJN specification drawings",fil:"PLA — IJN grey scheme, distinctive superstructure in AMS"},
{id:321,m:10,t:"Scale",title:"SMS Seydlitz at 1:700 — the battlecruiser that survived Jutland against all odds",fil:"PLA — Imperial German Navy grey, distinctive mast arrangement"},
{id:322,m:10,t:"Scale",title:"HMS Ark Royal 1941 at 1:350 — the carrier sunk by a single torpedo",fil:"PLA — RN carrier scheme, flight deck painted in AMS"},
{id:323,m:10,t:"Scale",title:"DUKW amphibious vehicle at 1:35 — the 2.5-ton amphibian that crossed rivers and oceans",fil:"PLA — US Army olive drab, waterline detail in AMS"},
{id:324,m:10,t:"Scale",title:"Sdkfz 251 half-track at 1:35 — workhorse of German motorised infantry in full detail",fil:"PLA — Dunkelgelb/Rotbraun/Dunkelgrün ambush scheme in AMS"},
{id:325,m:10,t:"Scale",title:"Churchill AVRE at 1:35 — the engineer tank with petard mortar and fascine carrier",fil:"PLA — RAC bronze green, NW Europe mud weathering scheme"},
{id:326,m:10,t:"Scale",title:"M4 Sherman Firefly at 1:35 — the 17-pounder answer to the Tiger tank problem",fil:"PLA — British desert yellow, invasion markings in AMS"},
{id:327,m:10,t:"Scale",title:"Jagdpanther at 1:35 — the tank destroyer that terrified Sherman crews",fil:"PLA — Henschel factory finish scheme, AMS camo scheme"},
{id:328,m:10,t:"Scale",title:"IS-2 Soviet heavy tank at 1:35 — the hammer that cracked German fortifications",fil:"PLA — Soviet 4BO green, Guards unit tactical marking in AMS"},
{id:329,m:10,t:"Scale",title:"Cromwell Cruiser tank at 1:35 — the British tank that finally matched German armour",fil:"PLA — RAC olive drab, NW Europe scheme with AMS markings"},
{id:330,m:10,t:"Scale",title:"T-34/85 at 1:35 — the production achievement that changed the eastern front mathematics",fil:"PLA — Soviet green, white winter wash weathering scheme"},
{id:331,m:10,t:"Scale",title:"King Tiger at 1:35 — the heaviest production tank in history from Henschel drawings",fil:"PLA — three-tone ambush scheme, AMS Zimmerit texture"},
{id:332,m:10,t:"Scale",title:"Panzer IV Ausf H at 1:35 — the backbone of the German Panzer arm",fil:"PLA — Africa Korps desert yellow, Eastern Front grey, AMS marks"},
{id:333,m:10,t:"Scale",title:"Matilda II infantry tank at 1:35 — invulnerable to almost everything in 1940",fil:"PLA — BEF dark green and dark earth scheme, AMS markings"},
{id:334,m:10,t:"Scale",title:"Universal Carrier Bren Gun Carrier at 1:35 — most produced armoured vehicle of WWII",fil:"PLA — RAC olive drab, stowage detail in contrasting AMS"},
{id:335,m:11,t:"Build",title:"The commission that opened a new category — the print that changed what you offer",fil:"Project-dependent — the actual transformative commission"},
{id:336,m:11,t:"Build",title:"Every empty AMS spool from the year — the physical weight of 365 days of printing",fil:"N/A — the empty spools are the content"},
{id:337,m:11,t:"Build",title:"The failure library — every print that failed this year with cause and lesson",fil:"Various — the actual failed prints lined up"},
{id:338,m:11,t:"AMS",title:"Best AMS colour combination of the year — the gradient nobody expected to work",fil:"The actual best-performing colour sequence of the year"},
{id:339,m:11,t:"Functional",title:"Most useful functional part this year — the one that solved a real problem",fil:"The actual most-useful commission or in-house print"},
{id:340,m:11,t:"Scale",title:"The scale model that pushed the P1S hardest — at the absolute detail limit",fil:"The actual most technically demanding scale model"},
{id:341,m:11,t:"Build",title:"Fastest turnaround commission — from brief to delivered, the record time",fil:"The actual fastest commission documented"},
{id:342,m:11,t:"Fun",title:"Most complex mechanism this year — the print that worked and the one that didn't",fil:"The actual most complex mechanism attempted"},
{id:343,m:11,t:"Build",title:"The material test with the most surprising result — the data nobody predicted",fil:"The actual most surprising test result of the year"},
{id:344,m:11,t:"Build",title:"Best photograph of the year — the lighting setup and subject that made it",fil:"Any — the photography methodology behind the best image"},
{id:345,m:11,t:"Build",title:"Most-shared post of the year — what made it travel beyond the printing community",fil:"Any — the content analysis of the highest-reach post"},
{id:346,m:11,t:"Build",title:"The client who understood the technology best — the brief that made work straightforward",fil:"Project-dependent — the best client brief of the year"},
{id:347,m:11,t:"Build",title:"The print that required the most iterations — version history from first to final",fil:"The actual most-iterated commission or project"},
{id:348,m:11,t:"Build",title:"The material that performed best beyond its specification sheet this year",fil:"The actual over-performing material with test data"},
{id:349,m:11,t:"Build",title:"The print that was most satisfying to destroy — the destruction test with the clearest result",fil:"The actual best destruction footage of the year"},
{id:350,m:11,t:"Build",title:"The workflow improvement that saved the most time this year",fil:"N/A — process improvement methodology"},
{id:351,m:11,t:"Build",title:"The tool that earned its bench space — what bought it and exactly why it stayed",fil:"N/A — the specific non-printer tool that proved itself"},
{id:352,m:11,t:"Build",title:"The knowledge gap that hurt this year — what you wish you knew on January 1st",fil:"N/A — honest reflection on what was missing"},
{id:353,m:11,t:"Build",title:"The most educational content this year — the video that taught people the most",fil:"Any — content analysis of the highest-education post"},
{id:354,m:11,t:"Build",title:"The community question that sparked the best conversation — and the answer",fil:"N/A — community engagement review"},
{id:355,m:11,t:"Fun",title:"The print a non-printing person understood immediately — no explanation needed",fil:"The actual self-explanatory print of the year"},
{id:356,m:11,t:"Scale",title:"The project requiring the most research — and where the primary sources were found",fil:"The actual most research-intensive project"},
{id:357,m:11,t:"Build",title:"The print that aged best — the object that looks better after 6 months than new",fil:"6-month-old prints pulled out and re-photographed"},
{id:358,m:11,t:"AMS",title:"The colour decision that worked best this year — the theory behind the choice",fil:"The actual best-performing colour strategy of the year"},
{id:359,m:11,t:"Build",title:"The print that surprised the client most — the moment they understood FDM",fil:"Project-dependent — the actual surprise commission moment"},
{id:360,m:11,t:"Build",title:"Year-end inventory — what is on the shelf, what has been used, what needs restocking",fil:"N/A — physical inventory documented on camera"},
{id:361,m:11,t:"Build",title:"The creative brief for Year Two — what changes, what stays, what new territory to explore",fil:"N/A — year-two planning methodology"},
{id:362,m:11,t:"Build",title:"Setting up both P1S machines for the first print of next year — the new start ritual",fil:"The first filament of the new year loaded in both machines"},
{id:363,m:11,t:"Build",title:"The final print of the year completing — time-lapse of the last layer of 365 days",fil:"The actual final print of the year"},
{id:364,m:11,t:"Build",title:"What the printers printed this year — hours, grams, jobs, and failures in numbers",fil:"N/A — annual data summary"},
{id:365,m:11,t:"AMS",title:"Day 365: The single object that best represents what two Bambu P1S machines can do",fil:"The most representative print of the year — the capstone"},
];

// ─── PERSISTENT STORAGE ───────────────────────────────────────────────────────
const SK = "bambu365-v2";
const DK = (id) => `bambu365-detail-${id}`;

async function loadState() {
  try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : { done:{}, notes:{} }; }
  catch { return { done:{}, notes:{} }; }
}
async function saveState(s) { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} }
async function loadDetail(id) {
  try { const r = localStorage.getItem(DK(id)); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
async function saveDetail(id, detail) {
  try { localStorage.setItem(DK(id), JSON.stringify(detail)); } catch {}
}

// ─── AI BRIEF GENERATOR ───────────────────────────────────────────────────────
async function generateBrief(idea) {
  const prompt = `You are a professional FDM 3D printing content creator with two Bambu Lab P1S Combo printers with AMS (Automatic Material System). You produce voiceover-only content — no face cam. You are writing a detailed production brief for Day ${idea.id} of your 365-day content calendar.

The idea for this day:
Title: "${idea.title}"
Content type: ${idea.t} (${TYPE_META[idea.t]?.label})
Filaments: ${idea.fil}
Month theme: ${MONTH_THEMES[idea.m]}

Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble. Use this exact structure:
{
  "shootFormat": "1-2 sentences describing the overall filming format and camera approach",
  "shotList": ["Shot 1 description", "Shot 2 description", "Shot 3 description", "Shot 4 description", "Shot 5 description"],
  "lightingSetup": "Specific lighting description — equipment, angle, colour temperature",
  "voiceoverStyle": "Tone and pacing guidance for the narration (e.g. calm and clinical / deadpan / enthusiastic but precise)",
  "script": "Full voiceover script, 150-250 words. Write it exactly as it should be spoken — natural, confident, informative. Include natural pauses marked with [pause]. No intro or outro music cues needed.",
  "coloursRequired": ["Colour 1 — specific filament description", "Colour 2 — specific filament description"],
  "equipmentRequired": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "proTips": ["Specific tip 1 for this exact content", "Specific tip 2", "Specific tip 3"],
  "estimatedShootTime": "e.g. 2 hours including print setup",
  "estimatedPrintTime": "e.g. 4-6 hours"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  const raw = data.content?.find(b => b.type === "text")?.text || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── SECTION COMPONENT ────────────────────────────────────────────────────────
function Section({ icon, label, color, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color, marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
        <span>{icon}</span>{label}
      </div>
      {children}
    </div>
  );
}

// ─── IDEA DETAIL PANEL ────────────────────────────────────────────────────────
function IdeaDetail({ idea, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const meta = TYPE_META[idea.t];
  const font = "'Rajdhani','Trebuchet MS',sans-serif";
  const mono = "'Space Mono',monospace";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const cached = await loadDetail(idea.id);
      if (cached && !cancelled) { setDetail(cached); return; }
      setLoading(true);
      try {
        const d = await generateBrief(idea);
        if (!cancelled) { setDetail(d); saveDetail(idea.id, d); }
      } catch(e) { if (!cancelled) setError("Generation failed. Tap retry."); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [idea.id]);

  const retry = async () => {
    setError(null); setDetail(null); setLoading(true);
    try { const d = await generateBrief(idea); setDetail(d); saveDetail(idea.id, d); }
    catch { setError("Generation failed. Try again."); }
    finally { setLoading(false); }
  };

  const pill = (txt, col) => (
    <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700,
      background:`${col}18`, border:`1px solid ${col}44`, color:col, marginRight:5, marginBottom:4 }}>
      {txt}
    </span>
  );

  const listItem = (txt, col="#94a3b8") => (
    <div style={{ display:"flex", gap:8, marginBottom:6 }}>
      <div style={{ color:"#f97316", fontSize:11, flexShrink:0, marginTop:1 }}>▸</div>
      <div style={{ fontSize:12, color:col, lineHeight:1.6 }}>{txt}</div>
    </div>
  );

  return (
    <div style={{ fontFamily:font, background:"#090b10", border:"1px solid #1a2030", borderRadius:8,
      margin:"4px 0 8px", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ background:meta.bg, borderBottom:`1px solid ${meta.border}`, padding:"12px 14px",
        display:"flex", alignItems:"flex-start", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ padding:"2px 8px", borderRadius:10, fontSize:9, fontWeight:700, color:meta.color,
              background:"rgba(0,0,0,0.3)", border:`1px solid ${meta.border}` }}>{meta.label}</span>
            <span style={{ padding:"2px 8px", borderRadius:10, fontSize:9, fontWeight:700, color:"#f97316",
              background:"rgba(0,0,0,0.3)", border:"1px solid rgba(249,115,22,0.3)" }}>🎙 VOICEOVER ONLY</span>
            <span style={{ padding:"2px 8px", borderRadius:10, fontSize:9, fontWeight:700, color:"#94a3b8",
              background:"rgba(0,0,0,0.3)", border:"1px solid #1a2030", fontFamily:mono }}>D{idea.id}</span>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", lineHeight:1.4 }}>{idea.title}</div>
          {idea.fil && <div style={{ fontSize:10, color:"#f97316", marginTop:5, opacity:0.8 }}>🧵 {idea.fil}</div>}
        </div>
        <div onClick={onClose} style={{ color:"#475569", cursor:"pointer", fontSize:18, padding:"0 4px",
          flexShrink:0, lineHeight:1, marginTop:-2 }}>×</div>
      </div>

      {/* Content */}
      <div style={{ padding:"14px", maxHeight:520, overflowY:"auto" }}>
        {loading && (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:11, color:"#f97316", fontFamily:mono, marginBottom:8 }}>
              ✦ Generating production brief…
            </div>
            <div style={{ fontSize:10, color:"#334155" }}>This takes about 10 seconds and is cached for next time.</div>
          </div>
        )}
        {error && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:11, color:"#ef4444", marginBottom:10 }}>{error}</div>
            <button onClick={retry} style={{ padding:"7px 18px", background:"#f97316", border:"none",
              borderRadius:5, color:"white", fontSize:11, cursor:"pointer", fontFamily:font, fontWeight:700 }}>
              Retry
            </button>
          </div>
        )}
        {detail && (
          <div>
            {/* Row: Shoot time + Print time */}
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              {[["🎬 SHOOT TIME", detail.estimatedShootTime, "#60a5fa"],
                ["🖨️ PRINT TIME", detail.estimatedPrintTime, "#a78bfa"]].map(([l,v,c]) => (
                <div key={l} style={{ flex:1, minWidth:140, padding:"8px 12px", borderRadius:6,
                  background:`${c}0d`, border:`1px solid ${c}33` }}>
                  <div style={{ fontSize:8, fontFamily:mono, fontWeight:700, color:c, letterSpacing:"0.12em", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:12, color:"#d4dbe5", fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Shoot format */}
            <Section icon="📷" label="SHOOT FORMAT" color="#60a5fa">
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7, padding:"8px 10px",
                background:"rgba(96,165,250,0.06)", borderRadius:5, border:"1px solid rgba(96,165,250,0.15)" }}>
                {detail.shootFormat}
              </div>
            </Section>

            {/* Lighting */}
            <Section icon="💡" label="LIGHTING SETUP" color="#fbbf24">
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7, padding:"8px 10px",
                background:"rgba(251,191,36,0.05)", borderRadius:5, border:"1px solid rgba(251,191,36,0.15)" }}>
                {detail.lightingSetup}
              </div>
            </Section>

            {/* Shot list */}
            <Section icon="🎞️" label="SHOT LIST" color="#a78bfa">
              <div style={{ background:"rgba(167,139,250,0.05)", borderRadius:5, border:"1px solid rgba(167,139,250,0.15)", padding:"8px 10px" }}>
                {(detail.shotList||[]).map((s,i) => listItem(`${i+1}. ${s}`, "#c4b5fd"))}
              </div>
            </Section>

            {/* Voiceover style */}
            <Section icon="🎙️" label="VOICEOVER STYLE" color="#f472b6">
              <div style={{ fontSize:12, color:"#f9a8d4", lineHeight:1.7, padding:"8px 10px",
                background:"rgba(244,114,182,0.05)", borderRadius:5, border:"1px solid rgba(244,114,182,0.15)" }}>
                {detail.voiceoverStyle}
              </div>
            </Section>

            {/* Script */}
            <Section icon="📝" label="VOICEOVER SCRIPT" color="#34d399">
              <div style={{ background:"rgba(52,211,153,0.05)", border:"1px solid rgba(52,211,153,0.2)",
                borderRadius:5, padding:"12px 14px" }}>
                <div style={{ fontSize:12, color:"#a7f3d0", lineHeight:1.9, whiteSpace:"pre-wrap",
                  fontStyle:"italic" }}>
                  {detail.script}
                </div>
              </div>
            </Section>

            {/* Colours */}
            <Section icon="🎨" label="COLOURS / FILAMENTS REQUIRED" color="#f97316">
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(detail.coloursRequired||[]).map((c,i) => pill(c, "#f97316"))}
              </div>
            </Section>

            {/* Equipment */}
            <Section icon="🧰" label="EQUIPMENT REQUIRED" color="#60a5fa">
              <div style={{ background:"rgba(96,165,250,0.05)", borderRadius:5, border:"1px solid rgba(96,165,250,0.15)", padding:"8px 10px" }}>
                {(detail.equipmentRequired||[]).map((e,i) => listItem(e))}
              </div>
            </Section>

            {/* Pro tips */}
            <Section icon="⚡" label="PRO TIPS" color="#fbbf24">
              <div style={{ background:"rgba(251,191,36,0.05)", borderRadius:5, border:"1px solid rgba(251,191,36,0.15)", padding:"8px 10px" }}>
                {(detail.proTips||[]).map((t,i) => listItem(t, "#fde68a"))}
              </div>
            </Section>

            {/* Regenerate */}
            <div style={{ textAlign:"right", marginTop:4 }}>
              <button onClick={retry} style={{ padding:"5px 12px", background:"transparent",
                border:"1px solid #1a2030", borderRadius:4, color:"#334155", fontSize:10,
                cursor:"pointer", fontFamily:font }}>
                ↻ Regenerate brief
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState({ done:{}, notes:{} });
  const [loaded, setLoaded] = useState(false);
  const [activeMonth, setActiveMonth] = useState(0);
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [noteOpen, setNoteOpen] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadState().then(s => { setState(s); setLoaded(true); });
    const check = () => setIsMobile(window.innerWidth < 680);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = useCallback(async (id) => {
    setState(prev => {
      const next = { ...prev, done: { ...prev.done, [id]: !prev.done[id] } };
      saveState(next);
      return next;
    });
  }, []);

  const openNote = useCallback((id, e) => {
    e.stopPropagation();
    setNoteText(state.notes[id] || "");
    setNoteOpen(id);
  }, [state.notes]);

  const saveNote = useCallback(async (id) => {
    setState(prev => {
      const next = { ...prev, notes: { ...prev.notes, [id]: noteText } };
      saveState(next);
      return next;
    });
    setNoteOpen(null);
  }, [noteText]);

  const clearNote = useCallback((id) => {
    setState(prev => {
      const next = { ...prev, notes: { ...prev.notes } };
      delete next.notes[id];
      saveState(next);
      return next;
    });
    setNoteOpen(null);
  }, []);

  const monthIdeas = useMemo(() => IDEAS.filter(i => i.m === activeMonth), [activeMonth]);
  const totalDone = useMemo(() => Object.values(state.done).filter(Boolean).length, [state.done]);
  const monthDone = useMemo(() => monthIdeas.filter(i => state.done[i.id]).length, [monthIdeas, state.done]);

  const visible = useMemo(() => monthIdeas.filter(idea => {
    if (filter !== "All" && idea.t !== filter) return false;
    if (statusFilter === "Done" && !state.done[idea.id]) return false;
    if (statusFilter === "Todo" && state.done[idea.id]) return false;
    if (search && !idea.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [monthIdeas, filter, statusFilter, search, state.done]);

  const pct = Math.round((totalDone / 365) * 100);
  const font = "'Rajdhani','Trebuchet MS',sans-serif";
  const mono = "'Space Mono',monospace";
  const bg = "#090b10";
  const border = "#1a2030";

  if (!loaded) return (
    <div style={{ background:bg, minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", color:"#f97316", fontFamily:mono, fontSize:13 }}>
      Loading calendar…
    </div>
  );

  return (
    <div style={{ fontFamily:font, background:bg, minHeight:"100vh", color:"#e2e8f0",
      backgroundImage:"linear-gradient(rgba(249,115,22,0.01) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.01) 1px,transparent 1px)",
      backgroundSize:"50px 50px" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"rgba(9,11,16,0.98)", borderBottom:`1px solid ${border}`, position:"sticky", top:0, zIndex:200 }}>
        <div style={{ padding: isMobile ? "10px 13px" : "12px 20px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ width:40, height:40, borderRadius:7, background:"linear-gradient(135deg,#f97316,#ea580c)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            fontSize:9, fontWeight:700, color:"white", fontFamily:mono, lineHeight:1.2, flexShrink:0 }}>
            <span>2×</span><span>P1S</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize: isMobile ? 13 : 15, fontWeight:700, letterSpacing:"0.06em", color:"#f1f5f9" }}>
              365 DAYS OF FDM CONTENT
            </div>
            <div style={{ fontSize:9, color:"#475569", letterSpacing:"0.11em", fontFamily:mono }}>
              BAMBU P1S · AMS · VOICEOVER ONLY · TAP ANY IDEA FOR A FULL PRODUCTION BRIEF
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:mono, fontSize:11, color:"#f97316", fontWeight:700 }}>{totalDone}/365</div>
            <div style={{ fontFamily:mono, fontSize:9, color:"#334155" }}>{pct}% complete</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:3, background:"#0e1018" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#f97316,#ea580c)", transition:"width 0.4s" }} />
        </div>
        {/* Month tabs */}
        <div style={{ display:"flex", overflowX:"auto", padding:"0 " + (isMobile ? "13px" : "20px"), borderBottom:`1px solid ${border}` }}>
          {MONTHS.map((m, i) => {
            const mi = IDEAS.filter(x => x.m === i);
            const md = mi.filter(x => state.done[x.id]).length;
            const active = activeMonth === i;
            return (
              <div key={m} onClick={() => { setActiveMonth(i); setFilter("All"); setStatusFilter("All"); setSearch(""); setExpanded(null); }}
                style={{ padding: isMobile ? "7px 8px" : "8px 11px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                  borderBottom:`2px solid ${active ? "#f97316" : "transparent"}`, marginBottom:-1,
                  color: active ? "#f97316" : "#475569" }}>
                <div style={{ fontSize:10, fontWeight:active?700:500, letterSpacing:"0.06em" }}>{m.slice(0,3).toUpperCase()}</div>
                <div style={{ fontSize:8, fontFamily:mono, color: md===mi.length ? "#34d399" : active ? "#f97316" : "#2d3a50", marginTop:1 }}>
                  {md}/{mi.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{ padding: isMobile ? "8px 13px" : "9px 20px", borderBottom:`1px solid ${border}`,
        background:"#0c0e15", display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
        {["All","AMS","Functional","Scale","Build","Fun"].map(f => {
          const meta = TYPE_META[f];
          const on = filter === f;
          const col = f==="All" ? "#94a3b8" : meta.color;
          return <div key={f} onClick={() => setFilter(f)}
            style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer",
              border:`1px solid ${on?col:border}`, background:on?`${col}18`:"transparent",
              color:on?col:"#475569", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
            {f==="All" ? "ALL" : meta.label}
          </div>;
        })}
        <div style={{ width:1, height:18, background:border }} />
        {["All","Todo","Done"].map(s => {
          const on = statusFilter === s;
          const col = s==="Done"?"#34d399":s==="Todo"?"#f472b6":"#94a3b8";
          return <div key={s} onClick={() => setStatusFilter(s)}
            style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer",
              border:`1px solid ${on?col:border}`, background:on?`${col}18`:"transparent",
              color:on?col:"#475569" }}>
            {s==="All"?"ALL":s==="Done"?"✓ Done":"○ Todo"}
          </div>;
        })}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{ marginLeft:"auto", background:"#0f1520", border:`1px solid ${border}`, borderRadius:20,
            padding:"3px 12px", color:"#94a3b8", fontSize:11, outline:"none", fontFamily:font,
            width: isMobile ? "100%" : 160 }} />
      </div>

      {/* ── MONTH HEADER ── */}
      <div style={{ padding: isMobile ? "10px 13px 5px" : "11px 20px 5px", display:"flex", alignItems:"center", gap:12 }}>
        <div>
          <div style={{ fontSize: isMobile ? 17 : 20, fontWeight:700, color:"#f1f5f9", letterSpacing:"0.02em" }}>{MONTHS[activeMonth]}</div>
          <div style={{ fontSize:10, color:"#475569" }}>{MONTH_THEMES[activeMonth]}</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ fontFamily:mono, fontSize:11, fontWeight:700, color: monthDone===monthIdeas.length?"#34d399":"#f97316" }}>
            {monthDone}/{monthIdeas.length}
          </div>
          <div style={{ width:70, height:4, background:"#1a2030", borderRadius:2 }}>
            <div style={{ height:"100%", width:`${monthDone/monthIdeas.length*100}%`, background:"#f97316", borderRadius:2, transition:"width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* ── LIST ── */}
      <div style={{ padding: isMobile ? "3px 10px 90px" : "4px 16px 90px" }}>
        {visible.length === 0 && (
          <div style={{ textAlign:"center", color:"#334155", padding:"50px 0", fontFamily:mono, fontSize:11 }}>
            No ideas match this filter.
          </div>
        )}
        {visible.map(idea => {
          const meta = TYPE_META[idea.t];
          const done = !!state.done[idea.id];
          const hasNote = !!(state.notes[idea.id]?.trim());
          const isOpen = expanded === idea.id;

          return (
            <div key={idea.id} style={{ marginBottom:3 }}>
              {/* Row */}
              <div style={{ borderRadius: isOpen ? "6px 6px 0 0" : 6,
                border:`1px solid ${isOpen ? meta.color : done ? "#1c2a1a" : border}`,
                borderBottom: isOpen ? `1px solid ${meta.border}` : undefined,
                background: isOpen ? meta.bg : done ? "#0a110a" : "#0e1018",
                transition:"all 0.15s", opacity: done ? 0.65 : 1 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:9, padding: isMobile ? "10px 11px" : "10px 13px" }}>

                  {/* Checkbox */}
                  <div onClick={(e) => { e.stopPropagation(); toggle(idea.id); }}
                    style={{ width:22, height:22, borderRadius:5,
                      border:`2px solid ${done?"#34d399":"#2d3a50"}`,
                      background:done?"#34d399":"transparent", flexShrink:0, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, transition:"all 0.15s" }}>
                    {done && <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0a110a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>

                  {/* Main content — clickable to expand */}
                  <div style={{ flex:1, minWidth:0, cursor:"pointer" }}
                    onClick={() => setExpanded(isOpen ? null : idea.id)}>
                    <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap", marginBottom:3 }}>
                      <span style={{ fontFamily:mono, fontSize:9, color:"#334155", minWidth:30 }}>D{idea.id}</span>
                      <span style={{ padding:"1px 7px", borderRadius:10, fontSize:9, fontWeight:700,
                        color:meta.color, background:meta.bg, border:`1px solid ${meta.border}`, whiteSpace:"nowrap" }}>
                        {meta.label}
                      </span>
                      {hasNote && <span style={{ fontSize:9, color:"#60a5fa" }}>📝</span>}
                    </div>
                    <div style={{ fontSize: isMobile ? 12 : 13, lineHeight:1.45, color:done?"#475569":"#d4dbe5",
                      textDecoration:done?"line-through":"none" }}>
                      {idea.title}
                    </div>
                    {idea.fil && (
                      <div style={{ fontSize:10, color:"#f97316", marginTop:3, opacity:0.65 }}>
                        🧵 {idea.fil}
                      </div>
                    )}
                    {hasNote && (
                      <div style={{ fontSize:10, color:"#60a5fa", marginTop:3, fontStyle:"italic",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        "{state.notes[idea.id]}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:5, flexShrink:0, alignItems:"flex-start" }}>
                    <div onClick={(e) => openNote(idea.id, e)}
                      style={{ padding:"4px 8px", borderRadius:4, fontSize:10, cursor:"pointer",
                        border:`1px solid ${hasNote?"#60a5fa44":border}`,
                        color:hasNote?"#60a5fa":"#334155",
                        background:hasNote?"rgba(96,165,250,0.07)":"transparent",
                        fontFamily:mono, whiteSpace:"nowrap" }}>
                      {hasNote?"📝":"+ Note"}
                    </div>
                    <div onClick={() => setExpanded(isOpen ? null : idea.id)}
                      style={{ padding:"4px 8px", borderRadius:4, fontSize:10, cursor:"pointer",
                        border:`1px solid ${isOpen?meta.color:border}`,
                        color:isOpen?meta.color:"#334155",
                        background:isOpen?meta.bg:"transparent",
                        fontFamily:mono, whiteSpace:"nowrap" }}>
                      {isOpen ? "▲ Close" : "▼ Brief"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && <IdeaDetail idea={idea} onClose={() => setExpanded(null)} />}
            </div>
          );
        })}
      </div>

      {/* ── NOTE MODAL ── */}
      {noteOpen !== null && (() => {
        const idea = IDEAS.find(i => i.id === noteOpen);
        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:500,
            display:"flex", alignItems:"flex-end", justifyContent:"center" }}
            onClick={() => setNoteOpen(null)}>
            <div onClick={e => e.stopPropagation()}
              style={{ background:"#0e1018", border:`1px solid ${border}`,
                borderRadius:"12px 12px 0 0", width:"100%", maxWidth:600, padding:"18px", paddingBottom:30 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:9, color:"#334155", fontFamily:mono, letterSpacing:"0.12em" }}>DAY {noteOpen} — NOTE</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", marginTop:3, lineHeight:1.3 }}>{idea?.title}</div>
                </div>
                <div onClick={() => setNoteOpen(null)} style={{ color:"#475569", cursor:"pointer", fontSize:18, padding:"0 4px" }}>×</div>
              </div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add notes, filming reminders, AMS slot assignments, links to reference images…"
                autoFocus
                style={{ width:"100%", minHeight:100, background:"#090b10", border:`1px solid ${border}`,
                  borderRadius:6, color:"#d4dbe5", fontSize:13, fontFamily:font, padding:"10px 12px",
                  resize:"vertical", outline:"none", boxSizing:"border-box", lineHeight:1.7 }} />
              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                <button onClick={() => saveNote(noteOpen)}
                  style={{ flex:1, padding:"10px", background:"#f97316", border:"none", borderRadius:6,
                    color:"white", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:font }}>
                  Save Note
                </button>
                {state.notes[noteOpen] && (
                  <button onClick={() => clearNote(noteOpen)}
                    style={{ padding:"10px 14px", background:"transparent", border:`1px solid ${border}`,
                      borderRadius:6, color:"#ef4444", fontSize:12, cursor:"pointer", fontFamily:font }}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── STATS BAR ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(9,11,16,0.97)",
        borderTop:`1px solid ${border}`, padding: isMobile ? "7px 13px" : "8px 20px",
        display:"flex", gap:12, alignItems:"center", zIndex:100, flexWrap:"wrap" }}>
        {Object.entries(TYPE_META).map(([t, meta]) => {
          const total = IDEAS.filter(i => i.t === t).length;
          const done = IDEAS.filter(i => i.t === t && state.done[i.id]).length;
          return (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:meta.color }} />
              <div style={{ fontFamily:mono, fontSize:9, color:"#475569" }}>
                {done}<span style={{ color:"#2d3a50" }}>/{total}</span>
              </div>
            </div>
          );
        })}
        <div style={{ marginLeft:"auto", fontFamily:mono, fontSize:10, color:"#f97316", fontWeight:700 }}>
          {totalDone}/365 · {pct}%
        </div>
      </div>
    </div>
  );
}
