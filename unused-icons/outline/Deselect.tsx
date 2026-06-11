import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeselect = (props: SvgProps) => (
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
    <Path d="M12 8h3a1 1 0 0 1 1 1v3" />
    <Path d="M16 16h-7a1 1 0 0 1 -1 -1v-7" />
    <Path d="M12 20v.01" />
    <Path d="M16 20v.01" />
    <Path d="M8 20v.01" />
    <Path d="M4 20v.01" />
    <Path d="M4 16v.01" />
    <Path d="M4 12v.01" />
    <Path d="M4 8v.01" />
    <Path d="M8 4v.01" />
    <Path d="M12 4v.01" />
    <Path d="M16 4v.01" />
    <Path d="M20 4v.01" />
    <Path d="M20 8v.01" />
    <Path d="M20 12v.01" />
    <Path d="M20 16v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeselect;
