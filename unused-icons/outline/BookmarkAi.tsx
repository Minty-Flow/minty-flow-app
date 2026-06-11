import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBookmarkAi = (props: SvgProps) => (
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
    <Path d="M10.02 18.32l-4.02 2.68v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v4.5" />
    <Path d="M14 21v-4a2 2 0 1 1 4 0v4" />
    <Path d="M14 19h4" />
    <Path d="M21 15v6" />
  </Svg>
);
export default SvgBookmarkAi;
