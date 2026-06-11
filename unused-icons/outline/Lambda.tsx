import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLambda = (props: SvgProps) => (
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
    <Path d="M6 20l6.5 -9" />
    <Path d="M19 20c-6 0 -6 -16 -12 -16" />
  </Svg>
);
export default SvgLambda;
