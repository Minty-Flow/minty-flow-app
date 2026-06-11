import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandXbox = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M6.5 5c7.72 2.266 10.037 7.597 12.5 12.5" />
    <Path d="M17.5 5c-7.72 2.266 -10.037 7.597 -12.5 12.5" />
  </Svg>
);
export default SvgBrandXbox;
