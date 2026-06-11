import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleDotted = (props: SvgProps) => (
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
    <Path d="M7.5 4.21l0 .01" />
    <Path d="M4.21 7.5l0 .01" />
    <Path d="M3 12l0 .01" />
    <Path d="M4.21 16.5l0 .01" />
    <Path d="M7.5 19.79l0 .01" />
    <Path d="M12 21l0 .01" />
    <Path d="M16.5 19.79l0 .01" />
    <Path d="M19.79 16.5l0 .01" />
    <Path d="M21 12l0 .01" />
    <Path d="M19.79 7.5l0 .01" />
    <Path d="M16.5 4.21l0 .01" />
    <Path d="M12 3l0 .01" />
  </Svg>
);
export default SvgCircleDotted;
