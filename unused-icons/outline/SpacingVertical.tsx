import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSpacingVertical = (props: SvgProps) => (
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
    <Path d="M4 20v-2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2" />
    <Path d="M4 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
    <Path d="M16 12h-8" />
  </Svg>
);
export default SvgSpacingVertical;
