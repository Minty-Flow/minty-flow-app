import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWorldX = (props: SvgProps) => (
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
    <Path d="M20.929 13.131a9 9 0 1 0 -8.931 7.869" />
    <Path d="M3.6 9h16.8" />
    <Path d="M3.6 15h9.9" />
    <Path d="M11.5 3a17 17 0 0 0 0 18" />
    <Path d="M12.5 3a16.992 16.992 0 0 1 2.505 10.573" />
    <Path d="M22 22l-5 -5" />
    <Path d="M17 22l5 -5" />
  </Svg>
);
export default SvgWorldX;
