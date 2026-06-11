import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlignRight2 = (props: SvgProps) => (
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
    <Path d="M20 4v16" />
    <Path d="M4 6h12" />
    <Path d="M10 12h6" />
    <Path d="M6 18h10" />
  </Svg>
);
export default SvgAlignRight2;
