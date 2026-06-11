import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSmokingNo = (props: SvgProps) => (
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
    <Path d="M8 13l0 4" />
    <Path d="M16 5v.5a2 2 0 0 0 2 2a2 2 0 0 1 2 2v.5" />
    <Path d="M3 3l18 18" />
    <Path d="M17 13h3a1 1 0 0 1 1 1v2c0 .28 -.115 .533 -.3 .714m-3.7 .286h-13a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h9" />
  </Svg>
);
export default SvgSmokingNo;
