import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgInfoTriangle = (props: SvgProps) => (
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
    <Path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
    <Path d="M12 9h.01" />
    <Path d="M11 12h1v4h1" />
  </Svg>
);
export default SvgInfoTriangle;
