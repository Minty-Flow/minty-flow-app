import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandKotlin = (props: SvgProps) => (
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
    <Path d="M20 20h-16v-16h16" />
    <Path d="M4 20l16 -16" />
    <Path d="M4 12l8 -8" />
    <Path d="M12 12l8 8" />
  </Svg>
);
export default SvgBrandKotlin;
