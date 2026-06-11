import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHelicopter = (props: SvgProps) => (
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
    <Path d="M3 10l1 2h6" />
    <Path d="M12 9a2 2 0 0 0 -2 2v3c0 1.1 .9 2 2 2h7a2 2 0 0 0 2 -2c0 -3.31 -3.13 -5 -7 -5h-2" />
    <Path d="M13 9l0 -3" />
    <Path d="M5 6l15 0" />
    <Path d="M15 9.1v3.9h5.5" />
    <Path d="M15 19l0 -3" />
    <Path d="M19 19l-8 0" />
  </Svg>
);
export default SvgHelicopter;
