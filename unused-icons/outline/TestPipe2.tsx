import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTestPipe2 = (props: SvgProps) => (
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
    <Path d="M15 3v15a3 3 0 0 1 -6 0v-15" />
    <Path d="M9 12h6" />
    <Path d="M8 3h8" />
  </Svg>
);
export default SvgTestPipe2;
