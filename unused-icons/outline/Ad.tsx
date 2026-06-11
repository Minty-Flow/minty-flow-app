import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAd = (props: SvgProps) => (
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
    <Path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <Path d="M7 15v-4a2 2 0 0 1 4 0v4" />
    <Path d="M7 13l4 0" />
    <Path d="M17 9v6h-1.5a1.5 1.5 0 1 1 1.5 -1.5" />
  </Svg>
);
export default SvgAd;
