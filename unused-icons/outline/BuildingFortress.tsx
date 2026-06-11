import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingFortress = (props: SvgProps) => (
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
    <Path d="M7 21h1a1 1 0 0 0 1 -1v-1a3 3 0 0 1 6 0m3 2h1a1 1 0 0 0 1 -1v-15l-3 -2l-3 2v6h-4v-6l-3 -2l-3 2v15a1 1 0 0 0 1 1h2m8 -2v1a1 1 0 0 0 1 1h2" />
    <Path d="M7 7v.01" />
    <Path d="M7 10v.01" />
    <Path d="M7 13v.01" />
    <Path d="M17 7v.01" />
    <Path d="M17 10v.01" />
    <Path d="M17 13v.01" />
  </Svg>
);
export default SvgBuildingFortress;
