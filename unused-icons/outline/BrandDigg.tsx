import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDigg = (props: SvgProps) => (
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
    <Path d="M6 15h-3v-4h3" />
    <Path d="M15 15h-3v-4h3" />
    <Path d="M9 15v-4" />
    <Path d="M15 11v7h-3" />
    <Path d="M6 7v8" />
    <Path d="M21 15h-3v-4h3" />
    <Path d="M21 11v7h-3" />
  </Svg>
);
export default SvgBrandDigg;
