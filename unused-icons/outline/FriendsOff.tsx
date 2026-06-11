import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFriendsOff = (props: SvgProps) => (
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
    <Path d="M5 5a2 2 0 0 0 2 2m2 -2a2 2 0 0 0 -2 -2" />
    <Path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5" />
    <Path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 22v-4h-2l1.254 -3.763m1.036 -2.942a1 1 0 0 1 .71 -.295h2a1 1 0 0 1 1 1l1.503 4.508m-1.503 2.492v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFriendsOff;
