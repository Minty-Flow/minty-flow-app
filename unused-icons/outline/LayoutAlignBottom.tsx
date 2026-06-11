import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLayoutAlignBottom = (props: SvgProps) => (
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
    <Path d="M4 20l16 0" />
    <Path d="M9 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -8" />
  </Svg>
);
export default SvgLayoutAlignBottom;
