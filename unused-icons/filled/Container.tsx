import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgContainer = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M20 3a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M20 19a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M20 15a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M20 11a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M20 7a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M15 3a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2z" />
    <Path d="M4 3a1 1 0 0 1 1 1v.01a1 1 0 1 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M4 19a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M4 15a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M4 11a1 1 0 0 1 1 1v.01a1 1 0 0 1 -2 0v-.01a1 1 0 0 1 1 -1" />
    <Path d="M4 7a1 1 0 0 1 1 1v.01a1 1 0 1 1 -2 0v-.01a1 1 0 0 1 1 -1" />
  </Svg>
);
export default SvgContainer;
