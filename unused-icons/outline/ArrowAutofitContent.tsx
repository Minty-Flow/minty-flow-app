import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowAutofitContent = (props: SvgProps) => (
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
    <Path d="M6 4l-3 3l3 3" />
    <Path d="M18 4l3 3l-3 3" />
    <Path d="M4 16a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -2" />
    <Path d="M10 7h-7" />
    <Path d="M21 7h-7" />
  </Svg>
);
export default SvgArrowAutofitContent;
