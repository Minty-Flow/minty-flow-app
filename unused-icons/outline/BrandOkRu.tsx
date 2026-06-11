import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandOkRu = (props: SvgProps) => (
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
    <Path d="M10 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M20 12c0 8 0 8 -8 8s-8 0 -8 -8s0 -8 8 -8s8 0 8 8" />
    <Path d="M9.5 13c1.333 .667 3.667 .667 5 0" />
    <Path d="M9.5 17l2.5 -3l2.5 3" />
    <Path d="M12 13.5v.5" />
  </Svg>
);
export default SvgBrandOkRu;
