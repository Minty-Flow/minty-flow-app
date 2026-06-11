import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBookOff = (props: SvgProps) => (
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
    <Path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 5.899 -1.096" />
    <Path d="M3 6a9 9 0 0 1 2.114 -.884m3.8 -.21c1.07 .17 2.116 .534 3.086 1.094a9 9 0 0 1 9 0" />
    <Path d="M3 6v13" />
    <Path d="M12 6v2m0 4v7" />
    <Path d="M21 6v11" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBookOff;
