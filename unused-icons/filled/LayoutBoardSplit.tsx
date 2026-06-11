import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLayoutBoardSplit = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M5 3h5a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-5a2 2 0 0 1 2 -2" />
    <Path d="M14 3h5a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
    <Path d="M13 11a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
    <Path d="M14 16h6a1 1 0 0 1 1 1v2a2 2 0 0 1 -2 2h-5a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
    <Path d="M4 13h6a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-5a2 2 0 0 1 -2 -2v-5a1 1 0 0 1 1 -1" />
  </Svg>
);
export default SvgLayoutBoardSplit;
