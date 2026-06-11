import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacLibra = (props: SvgProps) => (
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
    <Path d="M5 20l14 0" />
    <Path d="M5 17h5v-.3a7 7 0 1 1 4 0v.3h5" />
  </Svg>
);
export default SvgZodiacLibra;
