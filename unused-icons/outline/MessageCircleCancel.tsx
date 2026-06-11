import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMessageCircleCancel = (props: SvgProps) => (
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
    <Path d="M12.015 19.98a9.87 9.87 0 0 1 -4.315 -.98l-4.7 1l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c1.927 1.644 2.867 3.887 2.761 6.114" />
    <Path d="M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M17 21l4 -4" />
  </Svg>
);
export default SvgMessageCircleCancel;
