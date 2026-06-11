import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGradienter = (props: SvgProps) => (
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
    <Path d="M3.227 14c.917 4 4.497 7 8.773 7c4.277 0 7.858 -3 8.773 -7" />
    <Path d="M20.78 10a9 9 0 0 0 -8.78 -7a8.985 8.985 0 0 0 -8.782 7" />
    <Path d="M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgGradienter;
