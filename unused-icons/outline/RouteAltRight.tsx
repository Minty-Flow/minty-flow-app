import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRouteAltRight = (props: SvgProps) => (
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
    <Path d="M16 3h5v5" />
    <Path d="M8 3h-5v5" />
    <Path d="M21 3l-7.536 7.536a5 5 0 0 0 -1.464 3.534v6.93" />
    <Path d="M6 6.01v-.01" />
    <Path d="M8 8.02v-.01" />
    <Path d="M10 10v.01" />
  </Svg>
);
export default SvgRouteAltRight;
