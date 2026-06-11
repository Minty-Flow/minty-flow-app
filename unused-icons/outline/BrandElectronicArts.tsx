import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandElectronicArts = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M17.5 15l-3 -6l-3 6h-5l1.5 -3" />
    <Path d="M17 14h-2" />
    <Path d="M6.5 12h3.5" />
    <Path d="M8 9h3" />
  </Svg>
);
export default SvgBrandElectronicArts;
