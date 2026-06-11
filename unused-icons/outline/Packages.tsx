import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPackages = (props: SvgProps) => (
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
    <Path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" />
    <Path d="M2 13.5v5.5l5 3" />
    <Path d="M7 16.545l5 -3.03" />
    <Path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" />
    <Path d="M12 19l5 3" />
    <Path d="M17 16.5l5 -3" />
    <Path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" />
    <Path d="M7 5.03v5.455" />
    <Path d="M12 8l5 -3" />
  </Svg>
);
export default SvgPackages;
