import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCirclesRelation = (props: SvgProps) => (
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
    <Path d="M9.183 6.117a6 6 0 1 0 4.511 3.986" />
    <Path d="M14.813 17.883a6 6 0 1 0 -4.496 -3.954" />
  </Svg>
);
export default SvgCirclesRelation;
