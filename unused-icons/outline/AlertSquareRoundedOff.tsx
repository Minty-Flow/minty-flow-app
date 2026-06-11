import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlertSquareRoundedOff = (props: SvgProps) => (
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
    <Path d="M19.201 19.199c-1.35 1.35 -3.6 1.801 -7.201 1.801c-7.2 0 -9 -1.8 -9 -9c0 -3.598 .45 -5.847 1.797 -7.197m2.626 -1.376c1.204 -.307 2.709 -.427 4.577 -.427c7.2 0 9 1.8 9 9c0 1.865 -.12 3.367 -.425 4.57" />
    <Path d="M12 7v1" />
    <Path d="M12 16h.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAlertSquareRoundedOff;
