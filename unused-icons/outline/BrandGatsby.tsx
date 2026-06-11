import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGatsby = (props: SvgProps) => (
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
    <Path d="M3.296 14.297l6.407 6.407a9.018 9.018 0 0 1 -6.325 -6.116l-.082 -.291" />
    <Path d="M16 13h5c-.41 3.603 -3.007 6.59 -6.386 7.614l-11.228 -11.229a9 9 0 0 1 15.66 -2.985" />
  </Svg>
);
export default SvgBrandGatsby;
