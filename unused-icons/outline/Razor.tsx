import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRazor = (props: SvgProps) => (
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
    <Path d="M7 3h10v4h-10l0 -4" />
    <Path d="M12 7v4" />
    <Path d="M12 11a2 2 0 0 1 2 2v6a2 2 0 1 1 -4 0v-6a2 2 0 0 1 2 -2" />
  </Svg>
);
export default SvgRazor;
