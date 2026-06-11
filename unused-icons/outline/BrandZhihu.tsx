import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandZhihu = (props: SvgProps) => (
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
    <Path d="M14 6h6v12h-2l-2 2l-1 -2h-1l0 -12" />
    <Path d="M4 12h6.5" />
    <Path d="M10.5 6h-5" />
    <Path d="M6 4c-.5 2.5 -1.5 3.5 -2.5 4.5" />
    <Path d="M8 6v7c0 4.5 -2 5.5 -4 7" />
    <Path d="M11 18l-3 -5" />
  </Svg>
);
export default SvgBrandZhihu;
