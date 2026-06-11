import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogicNand = (props: SvgProps) => (
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
    <Path d="M7 5c6 0 8 3.5 8 7s-2 7 -8 7h-2v-14h2" />
    <Path d="M15 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgLogicNand;
