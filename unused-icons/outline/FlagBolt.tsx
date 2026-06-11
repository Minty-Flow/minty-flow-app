import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlagBolt = (props: SvgProps) => (
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
    <Path d="M14.673 15.36a4.978 4.978 0 0 1 -2.673 -1.36a5 5 0 0 0 -7 0v-9a5 5 0 0 1 7 0a5 5 0 0 0 7 0v7" />
    <Path d="M5 21v-7" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgFlagBolt;
