import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextGrammar = (props: SvgProps) => (
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
    <Path d="M14 9a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M4 12v-5a3 3 0 1 1 6 0v5" />
    <Path d="M4 9h6" />
    <Path d="M20 6v6" />
    <Path d="M4 16h12" />
    <Path d="M4 20h6" />
    <Path d="M14 20l2 2l5 -5" />
  </Svg>
);
export default SvgTextGrammar;
