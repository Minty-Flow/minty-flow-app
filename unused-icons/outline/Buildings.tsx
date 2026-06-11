import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildings = (props: SvgProps) => (
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
    <Path d="M4 21v-15c0 -1 1 -2 2 -2h5c1 0 2 1 2 2v15" />
    <Path d="M16 8h2c1 0 2 1 2 2v11" />
    <Path d="M3 21h18" />
    <Path d="M10 12v.01" />
    <Path d="M10 16v.01" />
    <Path d="M10 8v.01" />
    <Path d="M7 12v.01" />
    <Path d="M7 16v.01" />
    <Path d="M7 8v.01" />
    <Path d="M17 12v.01" />
    <Path d="M17 16v.01" />
  </Svg>
);
export default SvgBuildings;
