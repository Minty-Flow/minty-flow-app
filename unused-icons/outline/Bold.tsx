import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBold = (props: SvgProps) => (
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
    <Path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6l0 -7" />
    <Path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
  </Svg>
);
export default SvgBold;
