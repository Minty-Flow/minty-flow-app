import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandRevolut = (props: SvgProps) => (
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
    <Path d="M5 10h3v10h-3l0 -10" />
    <Path d="M14.5 4h-9.5v3h9.4a1.5 1.5 0 0 1 0 3h-3.4v4l4 6h4l-5 -7h.5a4.5 4.5 0 1 0 0 -9" />
  </Svg>
);
export default SvgBrandRevolut;
