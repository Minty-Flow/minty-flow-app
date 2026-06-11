import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHexagons = (props: SvgProps) => (
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
    <Path d="M4 18v-5l4 -2l4 2v5l-4 2l-4 -2" />
    <Path d="M8 11v-5l4 -2l4 2v5" />
    <Path d="M12 13l4 -2l4 2v5l-4 2l-4 -2" />
  </Svg>
);
export default SvgHexagons;
