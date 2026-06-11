import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgServicemark = (props: SvgProps) => (
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
    <Path d="M9 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
    <Path d="M13 15v-6l3 4l3 -4v6" />
  </Svg>
);
export default SvgServicemark;
