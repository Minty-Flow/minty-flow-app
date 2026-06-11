import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTex = (props: SvgProps) => (
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
    <Path d="M9 8v-1h-6v1" />
    <Path d="M6 15v-8" />
    <Path d="M21 15l-5 -8" />
    <Path d="M16 15l5 -8" />
    <Path d="M14 11h-4v8h4" />
    <Path d="M10 15h3" />
  </Svg>
);
export default SvgTex;
