import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextIncrease = (props: SvgProps) => (
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
    <Path d="M4 19v-10.5a3.5 3.5 0 1 1 7 0v10.5" />
    <Path d="M4 13h7" />
    <Path d="M18 9v6" />
    <Path d="M21 12h-6" />
  </Svg>
);
export default SvgTextIncrease;
