import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReload = (props: SvgProps) => (
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
    <Path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
    <Path d="M20 4v5h-5" />
  </Svg>
);
export default SvgReload;
