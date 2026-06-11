import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgXd = (props: SvgProps) => (
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
    <Path d="M6 8l4 8" />
    <Path d="M6 16l4 -8" />
    <Path d="M14 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2" />
  </Svg>
);
export default SvgXd;
