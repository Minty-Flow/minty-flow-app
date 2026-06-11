import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandStackshare = (props: SvgProps) => (
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
    <Path d="M17 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 12h3l3.5 6h3.5" />
    <Path d="M17 6h-3.5l-3.5 6" />
  </Svg>
);
export default SvgBrandStackshare;
