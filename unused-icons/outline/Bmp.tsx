import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBmp = (props: SvgProps) => (
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
    <Path d="M18 16v-8h2a2 2 0 1 1 0 4h-2" />
    <Path d="M6 14a2 2 0 0 1 -2 2h-2v-8h2a2 2 0 1 1 0 4h-2h2a2 2 0 0 1 2 2" />
    <Path d="M9 16v-8l3 6l3 -6v8" />
  </Svg>
);
export default SvgBmp;
