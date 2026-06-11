import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCoreos = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M12 3c-3.263 3.212 -3 7.654 -3 12c4.59 .244 8.814 -.282 12 -3" />
    <Path d="M9.5 9a4.494 4.494 0 0 1 5.5 5.5" />
  </Svg>
);
export default SvgBrandCoreos;
