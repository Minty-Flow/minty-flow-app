import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGuardian = (props: SvgProps) => (
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
    <Path d="M14 13h6" />
    <Path d="M4 12c0 -9.296 9.5 -9 9.5 -9c-2.808 0 -4.5 4.373 -4.5 9s1.763 8.976 4.572 8.976c0 .023 -9.572 1.092 -9.572 -8.976" />
    <Path d="M14.5 3c1.416 0 3.853 1.16 4.5 2v3.5" />
    <Path d="M15 13v8s2.77 -.37 4 -2v-6" />
    <Path d="M13.5 21h1.5" />
    <Path d="M13.5 3h1" />
  </Svg>
);
export default SvgBrandGuardian;
