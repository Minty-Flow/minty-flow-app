import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLollipopOff = (props: SvgProps) => (
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
    <Path d="M7.462 7.493a7 7 0 0 0 9.06 9.039m2.416 -1.57a7 7 0 1 0 -9.884 -9.915" />
    <Path d="M21 10a3.5 3.5 0 0 0 -7 0" />
    <Path d="M12.71 12.715a3.5 3.5 0 0 1 -5.71 -2.715" />
    <Path d="M14 17c.838 0 1.607 -.294 2.209 -.785m1.291 -2.715a3.5 3.5 0 0 0 -3.5 -3.5" />
    <Path d="M14 3a3.5 3.5 0 0 0 -3.5 3.5" />
    <Path d="M3 21l6 -6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgLollipopOff;
