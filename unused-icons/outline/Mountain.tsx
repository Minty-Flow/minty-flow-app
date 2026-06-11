import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMountain = (props: SvgProps) => (
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
    <Path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612" />
    <Path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" />
  </Svg>
);
export default SvgMountain;
