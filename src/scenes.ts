import AlienPlanetSurface from './components/AlienPlanetSurface'
import AntColonyCrossSection from './components/AntColonyCrossSection'
import ArtDecoSkyscraper from './components/ArtDecoSkyscraper'
import AsteroidMiningRig from './components/AsteroidMiningRig'
import AuroraBorealisTundra from './components/AuroraBorealisTundra'
import AutumnPark from './components/AutumnPark'
import BambooForest from './components/BambooForest'
import BioluminescentGrotto from './components/BioluminescentGrotto'
import BrutalistMonument from './components/BrutalistMonument'
import CactusDesertGarden from './components/CactusDesertGarden'
import CanyonRiver from './components/CanyonRiver'
import CherryBlossomPath from './components/CherryBlossomPath'
import ChinatownGate from './components/ChinatownGate'
import CloudCastle from './components/CloudCastle'
import CoralAtoll from './components/CoralAtoll'
import CoveredBridge from './components/CoveredBridge'
import CrystalCave from './components/CrystalCave'
import CrystalThroneRoom from './components/CrystalThroneRoom'
import CyberpunkAlley from './components/CyberpunkAlley'
import DamAndReservoir from './components/DamAndReservoir'
import DerelictSpaceship from './components/DerelictSpaceship'
import DesertOasis from './components/DesertOasis'
import DnaDoubleHelix from './components/DnaDoubleHelix'
import DragonsHoard from './components/DragonsHoard'
import DriveInTheater from './components/DriveInTheater'
import DysonSphereFragment from './components/DysonSphereFragment'
import EgyptianPyramids from './components/EgyptianPyramids'
import EnchantedWell from './components/EnchantedWell'
import EscherStaircase from './components/EscherStaircase'
import FairyRing from './components/FairyRing'
import FloatingIslands from './components/FloatingIslands'
import FloatingLanternFestival from './components/FloatingLanternFestival'
import FractalTree from './components/FractalTree'
import FrozenWaterfall from './components/FrozenWaterfall'
import GearCathedral from './components/GearCathedral'
import GeodesicDomeVillage from './components/GeodesicDomeVillage'
import GiantSequoiaHollow from './components/GiantSequoiaHollow'
import GiantsKitchen from './components/GiantsKitchen'
import GlacierValley from './components/GlacierValley'
import GothicCathedral from './components/GothicCathedral'
import GreekParthenon from './components/GreekParthenon'
import HavanaStreet from './components/HavanaStreet'
import HolographicControlRoom from './components/HolographicControlRoom'
import JapaneseTemple from './components/JapaneseTemple'
import KaleidoscopeTunnel from './components/KaleidoscopeTunnel'
import LavaFields from './components/LavaFields'
import LavenderFieldAtSunset from './components/LavenderFieldAtSunset'
import LighthouseOnCliff from './components/LighthouseOnCliff'
import LocomotiveOnTrestle from './components/LocomotiveOnTrestle'
import LunarColony from './components/LunarColony'
import MangroveSwamp from './components/MangroveSwamp'
import MayanStepPyramid from './components/MayanStepPyramid'
import MedievalCastle from './components/MedievalCastle'
import MiniatureTrainSet from './components/MiniatureTrainSet'
import MobiusStripWorld from './components/MobiusStripWorld'
import MondrianBlocks from './components/MondrianBlocks'
import MoorishCourtyard from './components/MoorishCourtyard'
import MoroccanMarket from './components/MoroccanMarket'
import MushroomForest from './components/MushroomForest'
import MusicBoxBallerina from './components/MusicBoxBallerina'
import NeonCityRooftop from './components/NeonCityRooftop'
import OilRig from './components/OilRig'
import OrbitalRing from './components/OrbitalRing'
import ParticleFountain from './components/ParticleFountain'
import PendulumRoom from './components/PendulumRoom'
import PirateShip from './components/PirateShip'
import PotionWorkshop from './components/PotionWorkshop'
import RadioTelescopeArray from './components/RadioTelescopeArray'
import RedwoodGrove from './components/RedwoodGrove'
import RomanAqueduct from './components/RomanAqueduct'
import RooftopWaterTowers from './components/RooftopWaterTowers'
import RunicStandingStones from './components/RunicStandingStones'
import SailingRegatta from './components/SailingRegatta'
import SnowGlobeVillage from './components/SnowGlobeVillage'
import SolarSailShip from './components/SolarSailShip'
import SpaceStationInterior from './components/SpaceStationInterior'
import SpiralMinaret from './components/SpiralMinaret'
import SteampunkClocktower from './components/SteampunkClocktower'
import Stonehenge from './components/Stonehenge'
import SubwayPlatform from './components/SubwayPlatform'
import SunflowerMaze from './components/SunflowerMaze'
import SunkenCityRuins from './components/SunkenCityRuins'
import SuspensionBridge from './components/SuspensionBridge'
import TerraformingDome from './components/TerraformingDome'
import Terrarium from './components/Terrarium'
import TidePools from './components/TidePools'
import TopiaryGarden from './components/TopiaryGarden'
import ToriiGatePath from './components/ToriiGatePath'
import TreeOfLife from './components/TreeOfLife'
import UnderwaterCoralReef from './components/UnderwaterCoralReef'
import VeniceCanal from './components/VeniceCanal'
import VikingLongship from './components/VikingLongship'
import VineyardHillside from './components/VineyardHillside'
import VolcanicIsland from './components/VolcanicIsland'
import VoxelLandscape from './components/VoxelLandscape'
import WaterMill from './components/WaterMill'
import WindmillFarm from './components/WindmillFarm'
import WizardsTower from './components/WizardsTower'
import ZenRockGarden from './components/ZenRockGarden'
import EmptyScene from './EmptyScene'
import type { VisualizerEntry } from './types'

const scenes: VisualizerEntry[] = [
  { name: 'Empty Scene', component: EmptyScene },
  { name: 'Japanese Temple', component: JapaneseTemple },
  { name: 'Underwater Coral Reef', component: UnderwaterCoralReef },
  { name: 'Volcanic Island', component: VolcanicIsland },
  { name: 'Crystal Cave', component: CrystalCave },
  { name: 'Bioluminescent Grotto', component: BioluminescentGrotto },
  { name: 'Desert Oasis', component: DesertOasis },
  { name: 'Frozen Waterfall', component: FrozenWaterfall },
  { name: 'Bamboo Forest', component: BambooForest },
  { name: 'Redwood Grove', component: RedwoodGrove },
  { name: 'Mangrove Swamp', component: MangroveSwamp },
  { name: 'Canyon River', component: CanyonRiver },
  { name: 'Glacier Valley', component: GlacierValley },
  { name: 'Tide Pools', component: TidePools },
  { name: 'Lava Fields', component: LavaFields },
  { name: 'Mushroom Forest', component: MushroomForest },
  { name: 'Giant Sequoia Hollow', component: GiantSequoiaHollow },
  { name: 'Aurora Borealis Tundra', component: AuroraBorealisTundra },
  { name: 'Gothic Cathedral', component: GothicCathedral },
  { name: 'Egyptian Pyramids', component: EgyptianPyramids },
  { name: 'Greek Parthenon', component: GreekParthenon },
  { name: 'Medieval Castle', component: MedievalCastle },
  { name: 'Mayan Step Pyramid', component: MayanStepPyramid },
  { name: 'Roman Aqueduct', component: RomanAqueduct },
  { name: 'Stonehenge', component: Stonehenge },
  { name: 'Moorish Courtyard', component: MoorishCourtyard },
  { name: 'Art Deco Skyscraper', component: ArtDecoSkyscraper },
  { name: 'Brutalist Monument', component: BrutalistMonument },
  { name: 'Geodesic Dome Village', component: GeodesicDomeVillage },
  { name: 'Spiral Minaret', component: SpiralMinaret },
  { name: 'Covered Bridge', component: CoveredBridge },
  { name: 'Suspension Bridge', component: SuspensionBridge },
  { name: 'Space Station Interior', component: SpaceStationInterior },
  { name: 'Alien Planet Surface', component: AlienPlanetSurface },
  { name: 'Asteroid Mining Rig', component: AsteroidMiningRig },
  { name: 'Orbital Ring', component: OrbitalRing },
  { name: 'Dyson Sphere Fragment', component: DysonSphereFragment },
  { name: 'Terraforming Dome', component: TerraformingDome },
  { name: 'Cyberpunk Alley', component: CyberpunkAlley },
  { name: 'Neon City Rooftop', component: NeonCityRooftop },
  { name: 'Holographic Control Room', component: HolographicControlRoom },
  { name: 'Derelict Spaceship', component: DerelictSpaceship },
  { name: 'Lunar Colony', component: LunarColony },
  { name: 'Solar Sail Ship', component: SolarSailShip },
  { name: 'Floating Islands', component: FloatingIslands },
  { name: "Wizard's Tower", component: WizardsTower },
  { name: "Dragon's Hoard", component: DragonsHoard },
  { name: 'Enchanted Well', component: EnchantedWell },
  { name: 'Fairy Ring', component: FairyRing },
  { name: 'Cloud Castle', component: CloudCastle },
  { name: 'Crystal Throne Room', component: CrystalThroneRoom },
  { name: "Giant's Kitchen", component: GiantsKitchen },
  { name: 'Potion Workshop', component: PotionWorkshop },
  { name: 'Runic Standing Stones', component: RunicStandingStones },
  { name: 'Tree of Life', component: TreeOfLife },
  { name: 'Floating Lantern Festival', component: FloatingLanternFestival },
  { name: 'Steampunk Clocktower', component: SteampunkClocktower },
  { name: 'Windmill Farm', component: WindmillFarm },
  { name: 'Locomotive on Trestle', component: LocomotiveOnTrestle },
  { name: 'Radio Telescope Array', component: RadioTelescopeArray },
  { name: 'Dam and Reservoir', component: DamAndReservoir },
  { name: 'Oil Rig', component: OilRig },
  { name: 'Water Mill', component: WaterMill },
  { name: 'Gear Cathedral', component: GearCathedral },
  { name: 'Pendulum Room', component: PendulumRoom },
  { name: 'Zen Rock Garden', component: ZenRockGarden },
  { name: 'Lavender Field at Sunset', component: LavenderFieldAtSunset },
  { name: 'Sunflower Maze', component: SunflowerMaze },
  { name: 'Autumn Park', component: AutumnPark },
  { name: 'Cherry Blossom Path', component: CherryBlossomPath },
  { name: 'Topiary Garden', component: TopiaryGarden },
  { name: 'Terrarium', component: Terrarium },
  { name: 'Vineyard Hillside', component: VineyardHillside },
  { name: 'Cactus Desert Garden', component: CactusDesertGarden },
  { name: 'Moroccan Market', component: MoroccanMarket },
  { name: 'Venice Canal', component: VeniceCanal },
  { name: 'Torii Gate Path', component: ToriiGatePath },
  { name: 'Havana Street', component: HavanaStreet },
  { name: 'Rooftop Water Towers', component: RooftopWaterTowers },
  { name: 'Subway Platform', component: SubwayPlatform },
  { name: 'Chinatown Gate', component: ChinatownGate },
  { name: 'Drive-In Theater', component: DriveInTheater },
  { name: 'Pirate Ship', component: PirateShip },
  { name: 'Lighthouse on Cliff', component: LighthouseOnCliff },
  { name: 'Viking Longship', component: VikingLongship },
  { name: 'Coral Atoll', component: CoralAtoll },
  { name: 'Sailing Regatta', component: SailingRegatta },
  { name: 'Sunken City Ruins', component: SunkenCityRuins },
  { name: 'Escher Staircase', component: EscherStaircase },
  { name: 'Mondrian Blocks', component: MondrianBlocks },
  { name: 'DNA Double Helix', component: DnaDoubleHelix },
  { name: 'Fractal Tree', component: FractalTree },
  { name: 'Mobius Strip World', component: MobiusStripWorld },
  { name: 'Voxel Landscape', component: VoxelLandscape },
  { name: 'Particle Fountain', component: ParticleFountain },
  { name: 'Kaleidoscope Tunnel', component: KaleidoscopeTunnel },
  { name: 'Snow Globe Village', component: SnowGlobeVillage },
  { name: 'Music Box Ballerina', component: MusicBoxBallerina },
  { name: 'Ant Colony Cross-Section', component: AntColonyCrossSection },
  { name: 'Miniature Train Set', component: MiniatureTrainSet },
]

export default scenes
