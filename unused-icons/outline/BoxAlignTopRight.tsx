import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBoxAlignTopRight = (props: SvgProps) => (
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
    <Path d="M19 11.01h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1" />
    <Path d="M20 15.01v-.01" />
    <Path d="M20 20.01v-.01" />
    <Path d="M15 20.01v-.01" />
    <Path d="M9 20.01v-.01" />
    <Path d="M9 4.01v-.01" />
    <Path d="M4 20.01v-.01" />
    <Path d="M4 15.01v-.01" />
    <Path d="M4 9.01v-.01" />
    <Path d="M4 4.01v-.01" />
  </Svg>
);
export default SvgBoxAlignTopRight;
