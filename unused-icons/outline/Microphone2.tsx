import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMicrophone2 = (props: SvgProps) => (
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
    <Path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
    <Path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515" />
  </Svg>
);
export default SvgMicrophone2;
