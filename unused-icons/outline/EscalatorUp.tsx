import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEscalatorUp = (props: SvgProps) => (
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
    <Path d="M19.5 7h-2.672a2 2 0 0 0 -1.414 .586l-8.414 8.414h-2.5a2.5 2.5 0 1 0 0 5h3.672a2 2 0 0 0 1.414 -.586l8.414 -8.414h1.5a2.5 2.5 0 1 0 0 -5" />
    <Path d="M6 10v-7" />
    <Path d="M3 6l3 -3l3 3" />
  </Svg>
);
export default SvgEscalatorUp;
