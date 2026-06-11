import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBoxAlignTop = (props: SvgProps) => (
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
    <Path d="M4 10.005h16v-5a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1v5" />
    <Path d="M4 15.005v-.01" />
    <Path d="M4 20.005v-.01" />
    <Path d="M9 20.005v-.01" />
    <Path d="M15 20.005v-.01" />
    <Path d="M20 20.005v-.01" />
    <Path d="M20 15.005v-.01" />
  </Svg>
);
export default SvgBoxAlignTop;
