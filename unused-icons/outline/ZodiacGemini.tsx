import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacGemini = (props: SvgProps) => (
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
    <Path d="M3 3a21 21 0 0 0 18 0" />
    <Path d="M3 21a21 21 0 0 1 18 0" />
    <Path d="M7 4.5l0 15" />
    <Path d="M17 4.5l0 15" />
  </Svg>
);
export default SvgZodiacGemini;
