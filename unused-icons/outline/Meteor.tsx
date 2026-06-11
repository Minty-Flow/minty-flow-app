import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMeteor = (props: SvgProps) => (
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
    <Path d="M21 3l-5 9h5l-6.891 7.086a6.5 6.5 0 1 1 -8.855 -9.506l7.746 -6.58l-1 5l9 -5" />
    <Path d="M7 14.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
  </Svg>
);
export default SvgMeteor;
