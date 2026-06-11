import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPrismLight = (props: SvgProps) => (
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
    <Path d="M4.731 19h11.539a1 1 0 0 0 .866 -1.5l-5.769 -10a1 1 0 0 0 -1.732 0l-5.769 10a1 1 0 0 0 .865 1.5" />
    <Path d="M2 13h4.45" />
    <Path d="M18 5l-4.5 6" />
    <Path d="M22 9l-7.75 3.25" />
    <Path d="M22 15l-7 -1.5" />
  </Svg>
);
export default SvgPrismLight;
