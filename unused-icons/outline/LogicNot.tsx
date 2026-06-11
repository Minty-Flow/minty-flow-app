import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogicNot = (props: SvgProps) => (
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
    <Path d="M22 12h-3" />
    <Path d="M2 9h3" />
    <Path d="M2 15h3" />
    <Path d="M5 5l10 7l-10 7l0 -14" />
    <Path d="M15 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgLogicNot;
