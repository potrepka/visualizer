# Plan: Create 99 3D Scene Components in `src/components/` + Register in `src/scenes.ts`

## Context

A previous session generated scene component files in `src/components/`, but they've all been lost. Only `EmptyScene.tsx` remains (in `src/`). This plan creates 99 scene components one at a time in `src/components/` and registers them in `src/scenes.ts`.

## Pattern

Each component is a React Three Fiber scene exported as a default function component (`FC` with no props). Components use:

- `three`, `@react-three/fiber` (useFrame, useThree), and `@react-three/drei`
- Procedural geometry only (no model loading)
- Reusable helper sub-components for DRY code, but all in the same file (no imports from other files)
- Optional: animation using `useFrame` (not required, but encouraged for visual interest)

## Files to Modify

- `src/scenes.ts` — add imports and array entries for all 99 new components

## Files to Create (99 total, one at a time)

Each file: `src/components/<ComponentName>.tsx`

| #   | File                        | Display Name              |
| --- | --------------------------- | ------------------------- |
| 1   | JapaneseTemple.tsx          | Japanese Temple           |
| 2   | UnderwaterCoralReef.tsx     | Underwater Coral Reef     |
| 3   | VolcanicIsland.tsx          | Volcanic Island           |
| 4   | CrystalCave.tsx             | Crystal Cave              |
| 5   | BioluminescentGrotto.tsx    | Bioluminescent Grotto     |
| 6   | DesertOasis.tsx             | Desert Oasis              |
| 7   | FrozenWaterfall.tsx         | Frozen Waterfall          |
| 8   | BambooForest.tsx            | Bamboo Forest             |
| 9   | RedwoodGrove.tsx            | Redwood Grove             |
| 10  | MangroveSwamp.tsx           | Mangrove Swamp            |
| 11  | CanyonRiver.tsx             | Canyon River              |
| 12  | GlacierValley.tsx           | Glacier Valley            |
| 13  | TidePools.tsx               | Tide Pools                |
| 14  | LavaFields.tsx              | Lava Fields               |
| 15  | MushroomForest.tsx          | Mushroom Forest           |
| 16  | GiantSequoiaHollow.tsx      | Giant Sequoia Hollow      |
| 17  | AuroraBorealisTundra.tsx    | Aurora Borealis Tundra    |
| 18  | GothicCathedral.tsx         | Gothic Cathedral          |
| 19  | EgyptianPyramids.tsx        | Egyptian Pyramids         |
| 20  | GreekParthenon.tsx          | Greek Parthenon           |
| 21  | MedievalCastle.tsx          | Medieval Castle           |
| 22  | MayanStepPyramid.tsx        | Mayan Step Pyramid        |
| 23  | RomanAqueduct.tsx           | Roman Aqueduct            |
| 24  | Stonehenge.tsx              | Stonehenge                |
| 25  | MoorishCourtyard.tsx        | Moorish Courtyard         |
| 26  | ArtDecoSkyscraper.tsx       | Art Deco Skyscraper       |
| 27  | BrutalistMonument.tsx       | Brutalist Monument        |
| 28  | GeodesicDomeVillage.tsx     | Geodesic Dome Village     |
| 29  | SpiralMinaret.tsx           | Spiral Minaret            |
| 30  | CoveredBridge.tsx           | Covered Bridge            |
| 31  | SuspensionBridge.tsx        | Suspension Bridge         |
| 32  | SpaceStationInterior.tsx    | Space Station Interior    |
| 33  | AlienPlanetSurface.tsx      | Alien Planet Surface      |
| 34  | AsteroidMiningRig.tsx       | Asteroid Mining Rig       |
| 35  | OrbitalRing.tsx             | Orbital Ring              |
| 36  | DysonSphereFragment.tsx     | Dyson Sphere Fragment     |
| 37  | TerraformingDome.tsx        | Terraforming Dome         |
| 38  | CyberpunkAlley.tsx          | Cyberpunk Alley           |
| 39  | NeonCityRooftop.tsx         | Neon City Rooftop         |
| 40  | HolographicControlRoom.tsx  | Holographic Control Room  |
| 41  | DerelictSpaceship.tsx       | Derelict Spaceship        |
| 42  | LunarColony.tsx             | Lunar Colony              |
| 43  | SolarSailShip.tsx           | Solar Sail Ship           |
| 44  | FloatingIslands.tsx         | Floating Islands          |
| 45  | WizardsTower.tsx            | Wizard's Tower            |
| 46  | DragonsHoard.tsx            | Dragon's Hoard            |
| 47  | EnchantedWell.tsx           | Enchanted Well            |
| 48  | FairyRing.tsx               | Fairy Ring                |
| 49  | CloudCastle.tsx             | Cloud Castle              |
| 50  | CrystalThroneRoom.tsx       | Crystal Throne Room       |
| 51  | GiantsKitchen.tsx           | Giant's Kitchen           |
| 52  | PotionWorkshop.tsx          | Potion Workshop           |
| 53  | RunicStandingStones.tsx     | Runic Standing Stones     |
| 54  | TreeOfLife.tsx              | Tree of Life              |
| 55  | FloatingLanternFestival.tsx | Floating Lantern Festival |
| 56  | SteampunkClocktower.tsx     | Steampunk Clocktower      |
| 57  | WindmillFarm.tsx            | Windmill Farm             |
| 58  | LocomotiveOnTrestle.tsx     | Locomotive on Trestle     |
| 59  | RadioTelescopeArray.tsx     | Radio Telescope Array     |
| 60  | DamAndReservoir.tsx         | Dam and Reservoir         |
| 61  | OilRig.tsx                  | Oil Rig                   |
| 62  | WaterMill.tsx               | Water Mill                |
| 63  | GearCathedral.tsx           | Gear Cathedral            |
| 64  | PendulumRoom.tsx            | Pendulum Room             |
| 65  | ZenRockGarden.tsx           | Zen Rock Garden           |
| 66  | LavenderFieldAtSunset.tsx   | Lavender Field at Sunset  |
| 67  | SunflowerMaze.tsx           | Sunflower Maze            |
| 68  | AutumnPark.tsx              | Autumn Park               |
| 69  | CherryBlossomPath.tsx       | Cherry Blossom Path       |
| 70  | TopiaryGarden.tsx           | Topiary Garden            |
| 71  | Terrarium.tsx               | Terrarium                 |
| 72  | VineyardHillside.tsx        | Vineyard Hillside         |
| 73  | CactusDesertGarden.tsx      | Cactus Desert Garden      |
| 74  | MoroccanMarket.tsx          | Moroccan Market           |
| 75  | VeniceCanal.tsx             | Venice Canal              |
| 76  | ToriiGatePath.tsx           | Torii Gate Path           |
| 77  | HavanaStreet.tsx            | Havana Street             |
| 78  | RooftopWaterTowers.tsx      | Rooftop Water Towers      |
| 79  | SubwayPlatform.tsx          | Subway Platform           |
| 80  | ChinatownGate.tsx           | Chinatown Gate            |
| 81  | DriveInTheater.tsx          | Drive-In Theater          |
| 82  | PirateShip.tsx              | Pirate Ship               |
| 83  | LighthouseOnCliff.tsx       | Lighthouse on Cliff       |
| 84  | VikingLongship.tsx          | Viking Longship           |
| 85  | CoralAtoll.tsx              | Coral Atoll               |
| 86  | SailingRegatta.tsx          | Sailing Regatta           |
| 87  | SunkenCityRuins.tsx         | Sunken City Ruins         |
| 88  | EscherStaircase.tsx         | Escher Staircase          |
| 89  | MondrianBlocks.tsx          | Mondrian Blocks           |
| 90  | DnaDoubleHelix.tsx          | DNA Double Helix          |
| 91  | FractalTree.tsx             | Fractal Tree              |
| 92  | MobiusStripWorld.tsx        | Mobius Strip World        |
| 93  | VoxelLandscape.tsx          | Voxel Landscape           |
| 94  | ParticleFountain.tsx        | Particle Fountain         |
| 95  | KaleidoscopeTunnel.tsx      | Kaleidoscope Tunnel       |
| 96  | SnowGlobeVillage.tsx        | Snow Globe Village        |
| 97  | MusicBoxBallerina.tsx       | Music Box Ballerina       |
| 98  | AntColonyCrossSection.tsx   | Ant Colony Cross-Section  |
| 99  | MiniatureTrainSet.tsx       | Miniature Train Set       |

## Execution Approach

1. Generate each component **one at a time** (not batched) as a separate Write call
2. Each component should be a self-contained, visually rich 3D scene that demonstrates a unique environment or structure
3. After all 99 are created, update `src/scenes.ts` to import and register all 100 entries (1 existing + 99 new)
4. At the end, run all verification steps to confirm the code is correct and the scenes render properly:

- `bun run lint` — confirm code has no lint errors
- `bun run format` — confirm code is properly formatted
- `bun run typecheck` - confirm code has no TypeScript errors
- `bun run build` — confirm production build succeeds
- `bun test` — confirm all tests pass

## Verification

1. `bun run lint` — confirm no lint errors
2. `bun run format:check` — confirm code is properly formatted
3. `bun run typecheck` - confirm no TypeScript errors
4. `npm run build` — confirm production build succeeds
5. `npm run dev` — manually verify scenes render and cycle with arrow keys
6. Confirm HUD shows 100 total scenes
