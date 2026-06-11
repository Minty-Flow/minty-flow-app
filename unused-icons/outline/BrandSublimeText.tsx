import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandSublimeText = (props: SvgProps) => (
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
    <Path d="M19 8l-14 4.5v-5.5l14 -4.5l0 5.5" />
    <Path d="M19 17l-14 4.5v-5.5l14 -4.5l0 5.5" />
    <Path d="M19 11.5l-14 -4.5" />
    <Path d="M5 12.5l14 4.5" />
  </Svg>
);
export default SvgBrandSublimeText;
