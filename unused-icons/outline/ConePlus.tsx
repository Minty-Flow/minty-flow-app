import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgConePlus = (props: SvgProps) => (
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
    <Path d="M18.03 12.022l-5.16 -9.515a1 1 0 0 0 -1.74 0l-8.13 14.99v.5c0 1.66 4.03 3.003 9 3.003c.17 0 .34 -.002 .508 -.005" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgConePlus;
