import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDiamond = (props: SvgProps) => (
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
    <Path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
    <Path d="M10 12l-2 -2.2l.6 -1" />
  </Svg>
);
export default SvgDiamond;
