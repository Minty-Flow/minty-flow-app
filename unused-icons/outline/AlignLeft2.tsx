import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlignLeft2 = (props: SvgProps) => (
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
    <Path d="M4 4v16" />
    <Path d="M8 6h12" />
    <Path d="M8 12h6" />
    <Path d="M8 18h10" />
  </Svg>
);
export default SvgAlignLeft2;
