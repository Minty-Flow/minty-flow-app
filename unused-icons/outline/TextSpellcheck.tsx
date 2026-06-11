import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextSpellcheck = (props: SvgProps) => (
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
    <Path d="M5 15v-7.5a3.5 3.5 0 0 1 7 0v7.5" />
    <Path d="M5 10h7" />
    <Path d="M10 18l3 3l7 -7" />
  </Svg>
);
export default SvgTextSpellcheck;
