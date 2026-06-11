import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBorderRightPlus = (props: SvgProps) => (
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
    <Path d="M20 20v-16" />
    <Path d="M16 4v.01" />
    <Path d="M12 4v.01" />
    <Path d="M8 4v.01" />
    <Path d="M4 4v.01" />
    <Path d="M4 8v.01" />
    <Path d="M4 12v.01" />
    <Path d="M4 16v.01" />
    <Path d="M16 20v.01" />
    <Path d="M12 20v.01" />
    <Path d="M8 20v.01" />
    <Path d="M4 20v.01" />
    <Path d="M15 12h-6" />
    <Path d="M12 9v6" />
  </Svg>
);
export default SvgBorderRightPlus;
