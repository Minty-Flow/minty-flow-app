import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToml = (props: SvgProps) => (
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
    <Path d="M1.499 8h3" />
    <Path d="M2.999 8v8" />
    <Path d="M8.5 8a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1 -3 0v-5a1.5 1.5 0 0 1 1.5 -1.5" />
    <Path d="M13 16v-8l2 5l2 -5v8" />
    <Path d="M20 8v8h2.5" />
  </Svg>
);
export default SvgToml;
